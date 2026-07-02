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
    slug: "magic-mirror",
    prompt: "Children's book illustration: a young girl looking into a golden-framed magic mirror that shows her friends smiling around her. Soft watercolor, warm pastel colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "house-on-cloud",
    prompt: "Children's book illustration: a boy climbing a white spiral staircase up into fluffy pink and orange clouds toward a cozy glowing cottage. Soft watercolor, warm pastel colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "cave-of-echoes",
    prompt: "Children's book illustration: two children with a torch exploring a magical cave full of glowing stalactites shaped like animals and castles. Soft watercolor, warm colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "friend-from-japan",
    prompt: "Children's book illustration: two little girls from different countries sharing food at a school lunch table, one with Thai food and one with Japanese rice balls, both laughing. Soft watercolor, warm pastel colors, whimsical, suitable for young children, no text.",
  },
  {
    slug: "sleepy-river",
    prompt: "Children's book illustration: a child floating peacefully on a soft glowing river under a starry night sky, with a fluffy cloud elephant and a white rabbit nearby. Soft watercolor, dreamy deep-blue and purple night colors, suitable for young children, no text.",
  },
];

for (const { slug, prompt } of stories) {
  const dest = join(IMAGES_DIR, `${slug}.png`);
  console.log(`\n Generating ${slug}...`);
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

  if (stories.indexOf({ slug, prompt }) < stories.length - 1) {
    await new Promise(r => setTimeout(r, 3000));
  }
}

console.log("\nDone!");
