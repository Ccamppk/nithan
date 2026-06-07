#!/usr/bin/env node
/**
 * Generate DALL-E 3 cover images for stories that don't have one.
 * Updates both Thai (stories/) and English (stories-en/) frontmatter.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-covers.mjs
 *   OPENAI_API_KEY=sk-... node scripts/generate-covers.mjs lion-and-mouse
 */

import OpenAI from "openai";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌  Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STORIES_TH  = "src/content/stories";
const STORIES_EN  = "src/content/stories-en";
const IMAGES_DIR  = "public/images";

// Optional: pass a slug filter as CLI arg (e.g. "lion-and-mouse")
const filterSlug = process.argv[2] ?? null;

// ── helpers ──────────────────────────────────────────────────────────────────


function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("Cannot parse frontmatter");
  return { front: m[1], body: m[2] };
}

function getField(front, key) {
  const m = front.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, "m"));
  return m ? m[1].trim() : "";
}

function addCoverToFrontmatter(filePath, imageName) {
  const raw = readFileSync(filePath, "utf-8");
  const { front, body } = parseFrontmatter(raw);
  if (front.includes("cover:")) return; // already set
  const newFront = front.trimEnd() + `\ncover: "/images/${imageName}"`;
  writeFileSync(filePath, `---\n${newFront}\n---\n${body}`);
}

async function generateAndSaveImage(title, excerpt, category, dest) {
  const prompt =
    `Children's book illustration: a scene from a story called "${title}". ` +
    `${excerpt} ` +
    `Style: soft watercolor, warm pastel colors, whimsical and friendly, ` +
    `suitable for young children, no text or letters in the image.`;

  const res = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1536x1024",
    quality: "medium",
  });

  const b64 = res.data[0].b64_json;
  writeFileSync(dest, Buffer.from(b64, "base64"));
}

// ── main ─────────────────────────────────────────────────────────────────────

mkdirSync(IMAGES_DIR, { recursive: true });

const files = readdirSync(STORIES_TH)
  .filter(f => f.endsWith(".md"))
  .filter(f => !filterSlug || f.startsWith(filterSlug));

if (files.length === 0) {
  console.log("No matching story files found.");
  process.exit(0);
}

for (const file of files) {
  const slug = file.replace(".md", "");
  const thPath = join(STORIES_TH, file);
  const enPath = join(STORIES_EN, file);
  const imageName = `${slug}.jpg`;
  const imageDest = join(IMAGES_DIR, imageName);

  const { front } = parseFrontmatter(readFileSync(thPath, "utf-8"));

  if (front.includes("cover:")) {
    console.log(`⏭️  ${slug} — already has cover, skipping`);
    continue;
  }

  const title    = getField(front, "title");
  const excerpt  = getField(front, "excerpt");
  const category = getField(front, "category");

  console.log(`\n🎨 ${slug}`);
  console.log(`   title: ${title}`);

  try {
    await generateAndSaveImage(title, excerpt, category, imageDest);
    console.log(`   ✓ image saved → ${imageDest}`);

    addCoverToFrontmatter(thPath, imageName);
    console.log(`   ✓ updated → ${thPath}`);

    if (readdirSync(STORIES_EN).includes(file)) {
      addCoverToFrontmatter(enPath, imageName);
      console.log(`   ✓ updated → ${enPath}`);
    }
  } catch (err) {
    console.error(`   ✗ failed: ${err.message}`);
  }

  // Rate-limit: 1 image per ~5s (DALL-E 3 allows ~12 rpm on standard tier)
  if (files.indexOf(file) < files.length - 1) {
    await new Promise(r => setTimeout(r, 5000));
  }
}

console.log("\n✨ Done!");
