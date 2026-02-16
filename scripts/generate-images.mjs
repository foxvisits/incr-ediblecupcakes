import { fal } from '@fal-ai/client';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = dirname(__dirname);
const publicDir = join(root, 'public');

// Set up fal.ai client
const FAL_KEY = process.env.FAL_KEY || process.env.FAL_AI_KEY;
if (!FAL_KEY) {
  throw new Error('Set FAL_KEY or FAL_AI_KEY environment variable');
}
fal.config({
  credentials: FAL_KEY,
});

/**
 * Generate image using fal.ai nano-banana-pro model
 */
async function generateImage(prompt, outputPath, aspectRatio = '1:1', resolution = '1K') {
  try {
    console.log(`\nGenerating image: ${outputPath}`);
    console.log(`Prompt: ${prompt}`);

    const result = await fal.subscribe('fal-ai/nano-banana-pro', {
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        num_images: 1,
        resolution: resolution,
        output_format: 'jpeg',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log(`Generation in progress...`);
        }
      },
    });

    // Check different possible result structures
    let imageUrl = null;
    if (result && result.images && result.images.length > 0) {
      imageUrl = result.images[0].url;
    } else if (result && result.data && result.data.images && result.data.images.length > 0) {
      imageUrl = result.data.images[0].url;
    } else if (result && result.url) {
      imageUrl = result.url;
    }

    if (imageUrl) {
      console.log(`Image generated: ${imageUrl}`);

      // Download and save the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const fullPath = join(publicDir, outputPath);
      writeFileSync(fullPath, Buffer.from(buffer));
      console.log(`✅ Image saved to: ${fullPath}`);
      return fullPath;
    } else {
      console.error('Result:', result);
      throw new Error('No images returned from API. Result structure: ' + JSON.stringify(result));
    }
  } catch (error) {
    console.error(`❌ Error generating image ${outputPath}:`, error);
    throw error;
  }
}

/**
 * Generate all images for the new keto recipes
 */
async function generateAllImages() {
  console.log('Starting image generation for keto recipes...\n');

  // Keto Lemon Ricotta Cupcakes - Featured Image
  await generateImage(
    'Professional food photography of keto lemon ricotta cupcakes on a white plate, soft natural lighting, elegant presentation, lemon zest garnish, creamy ricotta frosting, high quality, appetizing, bakery style',
    'keto-lemon-ricotta-cupcakes.jpg',
    '1:1',
    '2K'
  );

  // Keto Lemon Ricotta Cupcakes - In-content Image
  await generateImage(
    'Close-up cross-section view of keto lemon ricotta cupcake cut in half, showing moist almond flour crumb, creamy ricotta filling, lemon zest visible, natural lighting, food photography style, appetizing',
    'keto-lemon-ricotta-cupcakes-cross-section.jpg',
    '4:3',
    '1K'
  );

  // Keto Chocolate Truffle Cupcakes - Featured Image
  await generateImage(
    'Luxurious professional food photography of keto chocolate truffle cupcakes, rich dark chocolate ganache frosting, elegant presentation, gold accents, sophisticated dessert, high quality, appetizing, bakery style',
    'keto-chocolate-truffle-cupcakes.jpg',
    '1:1',
    '2K'
  );

  // Keto Chocolate Truffle Cupcakes - In-content Image
  await generateImage(
    'Close-up detail shot of keto chocolate truffle cupcake showing rich chocolate ganache texture, smooth frosting swirl, chocolate shavings, luxurious dessert, natural lighting, food photography, appetizing',
    'keto-chocolate-truffle-cupcakes-detail.jpg',
    '4:3',
    '1K'
  );

  // --- Guide featured images ---
  await generateImage(
    'Professional food photography of cupcakes, one with a sunken sunk center next to perfect ones, neutral background, soft lighting, baking troubleshooting theme, appetizing',
    'guide-why-cupcakes-sink.jpg',
    '1:1',
    '2K'
  );
  await generateImage(
    'Close-up of moist tender cupcake cut in half showing soft crumb, professional food photography, soft natural lighting, appetizing, bakery style',
    'guide-moist-cupcakes.jpg',
    '1:1',
    '2K'
  );
  await generateImage(
    'Side by side comparison: one frosted cupcake and one plain muffin on a plate, elegant food photography, neutral background, soft lighting, appetizing',
    'guide-cupcake-vs-muffin.jpg',
    '1:1',
    '2K'
  );

  console.log('\n✅ All images generated successfully!');
}

// Run the generation
generateAllImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
