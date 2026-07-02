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
    slug: "honest-coin",
    prompt: "Children's book illustration: a young Thai boy holding a small brown wallet he found on the street, looking thoughtfully at it with a kind expression, a neighborhood road behind him with a small candy shop visible in the distance. Soft watercolor, warm pastel colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "gratitude-box",
    prompt: "Children's book illustration: a cheerful Thai girl sitting at her desk at night, writing a small note and folding it into a little blue paper box glowing softly, stars visible through her window. Soft watercolor, warm pastel colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "cloud-painter",
    prompt: "Children's book illustration: a young Thai girl painting fluffy colorful clouds with a large paintbrush, the painted clouds magically floating up off the canvas into a bright sky. Soft watercolor, warm pastel colors, whimsical and dreamy, suitable for young children, no text.",
  },
  {
    slug: "talking-library",
    prompt: "Children's book illustration: a curious boy sitting on a library floor surrounded by tall old wooden bookshelves, a glowing green book open in front of him with a soft golden light shining out, books floating gently around him. Soft watercolor, warm pastel colors, magical and cozy, suitable for young children, no text.",
  },
  {
    slug: "explorer-dog",
    prompt: "Children's book illustration: a small white dog with black spots standing bravely at the edge of an open gate looking out at a colorful neighborhood street, tail wagging with excitement and curiosity. Soft watercolor, warm pastel colors, whimsical and friendly, suitable for young children, no text.",
  },
  {
    slug: "map-in-bottle",
    prompt: "Children's book illustration: two Thai children crouching beside a canal holding a small glass bottle, pulling out a rolled treasure map, eyes wide with excitement, green trees and blue sky behind them. Soft watercolor, warm pastel colors, adventurous and cheerful, suitable for young children, no text.",
  },
  {
    slug: "vietnam-lantern-festival",
    prompt: "Children's book illustration: two little girls — one Thai and one Vietnamese — releasing a glowing orange paper lantern together onto a calm river at night, dozens of colorful lanterns floating around them reflecting in the water, ancient buildings in the background. Soft watercolor, warm golden and deep-blue night colors, magical and peaceful, suitable for young children, no text.",
  },
  {
    slug: "brazil-carnival",
    prompt: "Children's book illustration: a Thai boy and a Brazilian boy dancing together joyfully in a colorful carnival street parade, surrounded by people in bright feathered costumes and confetti raining down. Soft watercolor, vibrant cheerful colors, festive and warm, suitable for young children, no text.",
  },
  {
    slug: "sleeping-clock",
    prompt: "Children's book illustration: a young Thai boy lying in bed holding a small golden pocket watch, moonlight streaming through his window, his eyes gently closing as soft dream clouds float above him showing a mango tree and a kind grandfather. Soft watercolor, soft blues and warm golds, dreamy and cozy, suitable for young children, no text.",
  },
  {
    slug: "counting-stars",
    prompt: "Children's book illustration: a Thai girl lying in her bed near a slightly open curtain looking out at a dark blue night sky filled with three extra-bright glowing stars, her face peaceful and smiling, a soft warm blanket around her. Soft watercolor, deep blue night tones with warm gold star glows, dreamy and gentle, suitable for young children, no text.",
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
