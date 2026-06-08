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
  // สอนใจ
  {
    slug: "magic-mirror-girl",
    prompt: "Children's book illustration: a young Thai girl holding a small ornate wooden-framed mirror, looking into it with wide eyes as the reflection shows glowing images of her kind deeds — helping carry bags, smiling at a sibling, running to help a friend. Soft watercolor, warm golden tones, gentle and heartwarming, suitable for young children, no text.",
  },
  {
    slug: "stubborn-tree",
    prompt: "Children's book illustration: a tiny green sapling straining and stretching upward impatiently beside a grand old oak tree, roots barely in the ground, while the wise oak tree looks on calmly, sunlight filtering through leaves above. Soft watercolor, earthy greens and golden sunlight, gentle and symbolic, suitable for young children, no text.",
  },
  {
    slug: "painter-lost-colors",
    prompt: "Children's book illustration: a young Thai boy artist sitting before an empty open paint box, looking at a blank canvas, sunlight casting a warm golden stripe across the floor, a vase of flowers casting a beautiful shadow behind him. Soft watercolor, muted palette with one warm shaft of golden light, thoughtful and atmospheric, suitable for young children, no text.",
  },
  {
    slug: "friend-rainy-day",
    prompt: "Children's book illustration: a young Thai boy in a yellow raincoat and boots walking through heavy rain holding an umbrella, smiling with determination, puddles splashing around his feet, a warm glowing window of a house visible ahead in the rain. Soft watercolor, cool rainy blues contrasting with warm golden window glow, brave and heartwarming, suitable for young children, no text.",
  },
  // แฟนตาซี
  {
    slug: "floating-city",
    prompt: "Children's book illustration: a young Thai girl climbing a staircase made of white cloud reaching up to a magnificent glowing city floating above the clouds, golden towers and rooftops visible above, sunset colors painting the sky. Soft watercolor, sky blues and warm golden city glow, magical and uplifting, suitable for young children, no text.",
  },
  {
    slug: "feeling-forest",
    prompt: "Children's book illustration: a young Thai boy standing alone in a magical forest where the trees glow softly grey-blue around him, his expression thoughtful and slightly sad, gentle light filtering from above, peaceful and introspective. Soft watercolor, soft grey-blue and silver forest tones with gentle light, emotional and dreamy, suitable for young children, no text.",
  },
  {
    slug: "little-door",
    prompt: "Children's book illustration: a young Thai girl kneeling in front of a tiny wooden door in a stone wall, a small golden key in her hand, the door glowing with warm light from beneath it, hinting at a magical world beyond. Soft watercolor, cool stone wall tones contrasting with warm golden door glow, magical and curious, suitable for young children, no text.",
  },
  {
    slug: "goldfish-timekeeper",
    prompt: "Children's book illustration: a single beautiful golden fish swimming alone in a clear palace garden pond, glowing softly, while a court official watches in awe as the clock tower behind him chimes perfectly in sync with the fish's circuit. Soft watercolor, deep teal water with warm golden fish glow, magical and serene, suitable for young children, no text.",
  },
  // ผจญภัย
  {
    slug: "unmapped-island",
    prompt: "Children's book illustration: two young Thai boys working together on a small beach — one studying the stars in the night sky with hand raised, the other repairing a small wooden boat with reeds, a mysterious lush island surrounding them. Soft watercolor, warm tropical island greens and night sky blues, adventurous and teamwork-focused, suitable for young children, no text.",
  },
  {
    slug: "cave-of-secrets",
    prompt: "Children's book illustration: a brave young Thai girl holding a lantern inside a magnificent cave, discovering ancient wall paintings glowing in the lamplight — images of people hunting, harvesting crops, and families gathered around fires. Soft watercolor, deep cave shadows with warm amber lantern light illuminating the paintings, awe-inspiring and historical, suitable for young children, no text.",
  },
  {
    slug: "paper-boat-storm",
    prompt: "Children's book illustration: a small paper boat sailing alone on a moonlit ocean, braving gentle waves, distant stars reflected in the water, the paper glowing slightly as if carrying invisible words. Soft watercolor, deep indigo night sea with silver moonlight, small and brave, adventurous and poetic, suitable for young children, no text.",
  },
  {
    slug: "boy-and-eagle",
    prompt: "Children's book illustration: a young Thai boy standing on a hilltop with arms open wide, watching a magnificent eagle soar upward into a bright blue sky, the boy's expression showing both joy and gentle sadness, wind in his hair. Soft watercolor, golden hilltop and vivid blue sky, emotional and free-spirited, suitable for young children, no text.",
  },
  // นานาชาติ
  {
    slug: "taiwan-lantern",
    prompt: "Children's book illustration: a young Taiwanese girl releasing a glowing orange paper lantern into a night sky already filled with hundreds of lanterns rising above a riverside town, her grandmother holding her hand beside her, both smiling. Soft watercolor, warm orange lantern glow against deep blue night sky, festive and tender, suitable for young children, no text.",
  },
  {
    slug: "peru-llama",
    prompt: "Children's book illustration: a young Peruvian girl in traditional colorful clothing on a high Andean mountain path, hugging the neck of a gentle fluffy brown llama with large amber eyes, misty mountains in the background. Soft watercolor, rich Andean earth tones and mountain mist, warm and affectionate, suitable for young children, no text.",
  },
  {
    slug: "viking-son",
    prompt: "Children's book illustration: a young Viking boy sitting under a tall pine tree on a Norwegian fjord shore, carefully carving a tiny detailed Viking ship from wood, a proud warrior father standing behind him looking at the work with quiet admiration. Soft watercolor, cool Nordic blues and greens with warm wooden craft tones, proud and heartwarming, suitable for young children, no text.",
  },
  {
    slug: "nile-girl",
    prompt: "Children's book illustration: a young Egyptian girl sitting beside an elderly fisherman grandfather on the bank of the Nile at sunset, dipping her hand gently in the flowing water, golden reflections shimmering, palm trees and ancient scenery visible. Soft watercolor, warm Egyptian golden sunset tones and Nile blues, peaceful and wise, suitable for young children, no text.",
  },
  // ก่อนนอน
  {
    slug: "moonlight-lullaby",
    prompt: "Children's book illustration: a young Thai girl lying in bed in a softly lit room, moonlight streaming through the window casting a silver stripe across her bed, her eyes half-closed peacefully, tiny stars visible outside the window. Soft watercolor, soft silver moonlight and warm bedroom tones, peaceful and soothing, suitable for young children, no text.",
  },
  {
    slug: "soft-cloud-bed",
    prompt: "Children's book illustration: a young Thai boy lying peacefully on a large fluffy white cloud high in a starry night sky, city lights twinkling far below like stars, the boy's eyes closed contentedly, wrapped in the softest cloud. Soft watercolor, deep night sky blues and pure white cloud, dreamy and peaceful, suitable for young children, no text.",
  },
  {
    slug: "sleepy-cat",
    prompt: "Children's book illustration: a small orange tabby cat curled up perfectly asleep on a sunny windowsill, and a young Thai girl sitting beside it with eyes growing heavy, both bathed in warm afternoon sunlight, a cozy bedroom behind them. Soft watercolor, warm amber sunlight and soft home tones, cozy and drowsy, suitable for young children, no text.",
  },
  {
    slug: "mothers-lullaby",
    prompt: "Children's book illustration: a gentle Thai mother sitting beside a child's bed in soft lamplight, singing quietly with eyes closed, one hand resting on the child's shoulder, the sleeping child smiling peacefully under a soft blanket. Soft watercolor, warm amber lamplight and gentle blues, tender and deeply loving, suitable for young children, no text.",
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
  if (i < stories.length - 1) await new Promise(r => setTimeout(r, 3000));
}

console.log("\nDone!");
