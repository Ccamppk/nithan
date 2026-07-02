#!/usr/bin/env node
import OpenAI from "openai";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IMAGES_DIR = "public/images";
mkdirSync(IMAGES_DIR, { recursive: true });

const stories = [
  {
    slug: "prince-no-thanks",
    prompt: "Children's book illustration: a young prince in golden robes standing alone in a grand empty palace hall, looking sad and surprised, with no servants around, sunlight streaming through tall windows onto a deserted throne room. Soft watercolor, warm pastel colors, whimsical and gentle, suitable for young children, no text.",
  },
  {
    slug: "truth-tree",
    prompt: "Children's book illustration: a young Thai girl sitting thoughtfully at the base of a large magical glowing tree in a forest, the tree's leaves shimmering with a soft golden light, a peaceful expression on her face as if listening. Soft watercolor, warm greens and golds, magical and serene, suitable for young children, no text.",
  },
  {
    slug: "cloud-dragon",
    prompt: "Children's book illustration: a small light-blue dragon with transparent wings sitting on a mountain peak, breathing out soft white fluffy clouds instead of fire, with a cheerful surprised expression, mountains and blue sky behind. Soft watercolor, soft blues and whites, whimsical and cute, suitable for young children, no text.",
  },
  {
    slug: "colorless-forest",
    prompt: "Children's book illustration: a young Thai girl in a grey monochrome forest using a small paintbrush to paint colors back onto flowers and trees, vibrant colors spreading from where she touches, half the forest colorful and half still grey. Soft watercolor, contrast between grey and vivid colors, magical, suitable for young children, no text.",
  },
  {
    slug: "wind-mountain",
    prompt: "Children's book illustration: a determined young Thai boy climbing a steep windy mountain, holding onto rocks, hair and clothes blown by strong wind, a glowing golden flower visible near the misty summit above. Soft watercolor, cool blues and warm gold accents, adventurous and hopeful, suitable for young children, no text.",
  },
  {
    slug: "broken-bridge",
    prompt: "Children's book illustration: a brave young Thai girl using a rope to cross a wide river where a wooden bridge has fallen, two stone pillars still standing in the river, holding a bag carefully, focused and determined. Soft watercolor, warm earth tones with blue river, adventurous, suitable for young children, no text.",
  },
  {
    slug: "kyoto-sakura",
    prompt: "Children's book illustration: two little girls — one Thai and one Japanese — sitting together under a large cherry blossom tree in a Japanese garden, pink petals falling around them, smiling and exchanging a small paper crane and a red bracelet. Soft watercolor, delicate pinks and soft greens, peaceful and warm, suitable for young children, no text.",
  },
  {
    slug: "netherlands-tulip",
    prompt: "Children's book illustration: a Thai boy riding on the back of a Dutch boy's bicycle through rows of colorful tulip fields in the Netherlands, both laughing happily, windmills visible in the distance, tulips in red yellow pink purple all around. Soft watercolor, vibrant spring colors, cheerful and adventurous, suitable for young children, no text.",
  },
  {
    slug: "moon-dreamer",
    prompt: "Children's book illustration: a young Thai girl lying in her bed looking out the window at a large full moon with a gentle smiling face, soft moonbeams streaming in, the girl's eyes half-closed in peaceful drowsiness, stars scattered around the moon. Soft watercolor, deep blue night with warm golden moonlight, dreamy and cozy, suitable for young children, no text.",
  },
  {
    slug: "dream-mist-city",
    prompt: "Children's book illustration: a young Thai boy floating gently up toward a magical glowing city built on soft clouds in the night sky, the city made of mist and starlight with tiny twinkling lights, a peaceful smile on the boy's face as he drifts upward. Soft watercolor, deep indigo night sky with warm glowing city, dreamy and magical, suitable for young children, no text.",
  },
];

for (let i = 0; i < stories.length; i++) {
  const { slug, prompt } = stories[i];
  const dest = join(IMAGES_DIR, `${slug}.png`);
  console.log(`\n[${i + 1}/${stories.length}] Generating ${slug}...`);
  try {
    const res = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "medium",
    });
    writeFileSync(dest, Buffer.from(res.data[0].b64_json, "base64"));
    console.log(`   saved -> ${dest}`);
  } catch (err) {
    console.error(`   failed: ${err.message}`);
  }

  if (i < stories.length - 1) {
    await new Promise(r => setTimeout(r, 3000));
  }
}

console.log("\nDone!");
