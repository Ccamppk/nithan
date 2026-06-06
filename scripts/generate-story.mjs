#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { writeFileSync, mkdirSync, createWriteStream } from "fs";
import https from "https";
import http from "http";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TODAY = new Date().toISOString().split("T")[0];

const CATEGORIES = [
  { th: "สอนใจ",    en: "Moral",         slug: "moral"         },
  { th: "แฟนตาซี",  en: "Fantasy",       slug: "fantasy"       },
  { th: "ผจญภัย",   en: "Adventure",     slug: "adventure"     },
  { th: "นานาชาติ", en: "International", slug: "international" },
  { th: "ก่อนนอน",  en: "Bedtime",       slug: "bedtime"       },
];

function parseJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

function escapeYaml(str) {
  return String(str).replace(/"/g, "'").replace(/\n/g, " ").trim();
}

async function generateThaiStory(categoryTh) {
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `สร้างนิทานภาษาไทยหมวด "${categoryTh}" ที่ยังไม่เคยมีมาก่อน โดย:
- ความยาว 800-1200 คำ (อ่านได้ใน 8-10 นาที)
- เหมาะสำหรับเด็กและครอบครัว ทุกวัย
- มีตัวละครที่น่ารักและเนื้อเรื่องสนุก
- มี **คติสอนใจ:** ตอนท้าย
- ห้ามซ้ำกับนิทานที่มีชื่อเสียงอยู่แล้ว

ตอบเป็น JSON เท่านั้น ไม่มีข้อความนอก JSON:
{
  "title": "ชื่อนิทาน",
  "excerpt": "เนื้อย่อ 1-2 ประโยคชวนอ่าน ไม่มีเครื่องหมาย quote",
  "ageRange": "เช่น 4-10 ปี",
  "readingTime": 8,
  "author": "Nithaan.",
  "imagePrompt": "DALL-E prompt in English: colorful children's book illustration, [describe key scene with characters], soft watercolor style, warm colors, no text",
  "content": "เนื้อเรื่องฉบับเต็ม ใส่ **คติสอนใจ:** ตอนท้าย"
}`,
    }],
  });
  return parseJSON(msg.content[0].text);
}

async function translateToEnglish(thStory, categoryEn) {
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `Translate this Thai children's story to natural, engaging English for children. Adapt names if needed.

Title: ${thStory.title}
Story: ${thStory.content}

Respond in JSON only, no text outside JSON:
{
  "title": "English title",
  "excerpt": "1-2 sentence excerpt, no quote marks",
  "ageRange": "${thStory.ageRange.replace("ปี", "years")}",
  "readingTime": ${thStory.readingTime},
  "author": "${thStory.author}",
  "content": "Full English story in markdown, with **Moral:** at the end"
}`,
    }],
  });
  return parseJSON(msg.content[0].text);
}

async function generateImage(prompt) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Children's book illustration: ${prompt}`,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });
  return response.data[0].url;
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(dest); });
      file.on("error", reject);
    }).on("error", (err) => { file.destroy(); reject(err); });
  });
}

function buildFrontmatter(data, category, imageName) {
  return `---
title: "${escapeYaml(data.title)}"
category: "${category}"
source: "Nithan Original"
author: "${escapeYaml(data.author)}"
adapter: "Nithan."
ageRange: "${escapeYaml(data.ageRange)}"
readingTime: ${data.readingTime}
cover: "/images/${imageName}"
publishedAt: ${TODAY}
excerpt: "${escapeYaml(data.excerpt)}"
---

${data.content}`;
}

async function processCategory(cat) {
  console.log(`\n📖 Generating: ${cat.th} (${cat.en})`);

  const storyId = `${TODAY}-${cat.slug}`;
  const imageName = `${storyId}.jpg`;

  const thStory = await generateThaiStory(cat.th);
  console.log(`  ✓ Thai: ${thStory.title}`);

  const enStory = await translateToEnglish(thStory, cat.en);
  console.log(`  ✓ English: ${enStory.title}`);

  const imageUrl = await generateImage(thStory.imagePrompt);
  mkdirSync("public/images", { recursive: true });
  await downloadImage(imageUrl, `public/images/${imageName}`);
  console.log(`  ✓ Image: public/images/${imageName}`);

  mkdirSync("src/content/stories", { recursive: true });
  writeFileSync(
    `src/content/stories/${storyId}.md`,
    buildFrontmatter(thStory, cat.th, imageName)
  );

  mkdirSync("src/content/stories-en", { recursive: true });
  writeFileSync(
    `src/content/stories-en/${storyId}.md`,
    buildFrontmatter(enStory, cat.en, imageName)
  );

  console.log(`  ✅ Saved: ${storyId}`);
}

// Main
console.log(`🚀 Nithan Daily Story Generator — ${TODAY}`);
for (const cat of CATEGORIES) {
  await processCategory(cat);
  await new Promise((r) => setTimeout(r, 3000));
}
console.log("\n✨ All 5 stories generated successfully!");
