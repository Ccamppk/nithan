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
    slug: "boy-and-lantern",
    prompt: "Children's book illustration: a young boy in a forest holding a glowing golden lantern, with a kind elderly woman made of golden light appearing from the smoke. Soft watercolor, warm golden tones, magical and whimsical, no text.",
  },
  {
    slug: "sleeping-stars-forest",
    prompt: "Children's book illustration: a small girl singing in a magical silver forest at night, with tiny glowing stars waking up from the roots of an enormous tree and floating upward into the dark sky. Soft watercolor, deep blue and silver tones, no text.",
  },
  {
    slug: "paper-boat-ocean",
    prompt: "Children's book illustration: two children sailing on large white paper boats across a sparkling ocean, with dolphins leaping beside them and a mysterious island in the distance. Soft watercolor, bright ocean blues and whites, adventurous, no text.",
  },
  {
    slug: "aryan-diwali",
    prompt: "Children's book illustration: a young Indian boy lighting small clay oil lamps (diyas) outside a neighbor's doorstep during Diwali night, with a street full of glowing lights and colorful rangoli patterns. Soft watercolor, warm golden and orange tones, festive, no text.",
  },
  {
    slug: "moon-storyteller",
    prompt: "Children's book illustration: a child lying in bed looking out the window at a large glowing moon, with soft dream-like visions of children from different countries floating gently around the moonlight. Soft watercolor, deep blue night tones with warm golden moonlight, dreamy and peaceful, no text.",
  },
];

for (const { slug, prompt } of stories) {
  const dest = join(IMAGES_DIR, `${slug}.png`);
  console.log(`\nGenerating ${slug}...`);
  try {
    const res = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "medium",
    });
    writeFileSync(dest, Buffer.from(res.data[0].b64_json, "base64"));
    console.log(`  saved -> ${dest}`);
  } catch (err) {
    console.error(`  failed: ${err.message}`);
  }
  await new Promise(r => setTimeout(r, 2000));
}

console.log("\nDone!");
