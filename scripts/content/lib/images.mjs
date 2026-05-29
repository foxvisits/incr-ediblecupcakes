import fs from 'fs';
import path from 'path';

const KIE_CREATE = 'https://api.kie.ai/api/v1/jobs/createTask';
const KIE_STATUS = 'https://api.kie.ai/api/v1/jobs/recordInfo';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateImageKie({ prompt, model, outputPath }) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('Set KIE_API_KEY in .env');

  const createRes = await fetch(KIE_CREATE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: {
        prompt,
        aspect_ratio: '1:1',
        resolution: '2K',
        output_format: 'jpg',
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Kie createTask failed: ${createRes.status} ${await createRes.text()}`);
  }

  const createData = await createRes.json();
  const taskId = createData.data?.taskId || createData.taskId || createData.data?.task_id;
  if (!taskId) throw new Error('Kie: no taskId in response: ' + JSON.stringify(createData));

  for (let i = 0; i < 90; i++) {
    await sleep(3000);
    const statusRes = await fetch(`${KIE_STATUS}?taskId=${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();
    const state = statusData.data?.status || statusData.status;
    if (state === 'FAILED' || state === 'failed') {
      throw new Error('Kie image task failed: ' + JSON.stringify(statusData));
    }

    const resultJson = statusData.data?.resultJson || statusData.resultJson;
    if (state === 'SUCCESS' || state === 'success' || resultJson) {
      let imageUrl = null;
      if (typeof resultJson === 'string') {
        try {
          const parsed = JSON.parse(resultJson);
          imageUrl = parsed.resultUrls?.[0] || parsed.images?.[0]?.url || parsed.url;
        } catch {
          imageUrl = resultJson;
        }
      } else if (resultJson) {
        imageUrl = resultJson.resultUrls?.[0] || resultJson.images?.[0]?.url;
      }
      imageUrl = imageUrl || statusData.data?.output?.image_url || statusData.data?.response?.resultUrls?.[0];

      if (imageUrl) {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) throw new Error('Failed to download Kie image');
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, buf);
        return outputPath;
      }
    }
  }

  throw new Error('Kie image generation timed out');
}

export async function generateImageFal({ prompt, model, outputPath }) {
  const { fal } = await import('@fal-ai/client');
  const FAL_KEY = process.env.FAL_KEY || process.env.FAL_AI_KEY;
  if (!FAL_KEY) throw new Error('Set FAL_KEY for fal image fallback');

  fal.config({ credentials: FAL_KEY });

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      aspect_ratio: '1:1',
      num_images: 1,
      resolution: '1K',
      output_format: 'jpeg',
    },
  });

  let imageUrl =
    result?.images?.[0]?.url ||
    result?.data?.images?.[0]?.url ||
    result?.url;

  if (!imageUrl) throw new Error('Fal: no image URL');

  const imgRes = await fetch(imageUrl);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buf);
  return outputPath;
}

export async function generateImage({ prompt, config, outputPath }) {
  const gen = config.generation;
  if (gen.imageProvider === 'kie') {
    try {
      return await generateImageKie({ prompt, model: gen.kieImageModel, outputPath });
    } catch (e) {
      const FAL_KEY = process.env.FAL_KEY || process.env.FAL_AI_KEY;
      if (!FAL_KEY) throw e;
      console.warn('⚠️  Kie failed, trying fal:', e.message);
      return generateImageFal({ prompt, model: gen.falImageModel, outputPath });
    }
  }
  return generateImageFal({ prompt, model: gen.falImageModel, outputPath });
}
