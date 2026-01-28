import { fal } from '@fal-ai/client';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = dirname(__dirname);
const publicDir = join(root, 'public');

fal.config({
  credentials: '64ebd893-a72a-4654-b096-4f5ccb84875f:ada89019bfe35e5fafef23fc30115d00',
});

async function run() {
  const result = await fal.subscribe('fal-ai/nano-banana-pro', {
    input: {
      prompt: 'Side by side comparison: one frosted cupcake and one plain muffin on a plate, elegant food photography, neutral background, soft lighting, appetizing',
      aspect_ratio: '1:1',
      num_images: 1,
      resolution: '2K',
      output_format: 'jpeg',
    },
  });
  let imageUrl = result?.images?.[0]?.url ?? result?.data?.images?.[0]?.url ?? result?.url;
  if (!imageUrl) throw new Error('No image URL');
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const path = join(publicDir, 'guide-cupcake-vs-muffin.jpg');
  writeFileSync(path, buffer);
  console.log('Saved:', path);
}
run().catch((e) => { console.error(e); process.exit(1); });
