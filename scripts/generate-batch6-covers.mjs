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
    slug: "golden-deer-hunter",
    prompt: "Children's book illustration: a young hunter in a forest lowering his bow as a magnificent golden glowing deer with antlers turns and looks at him with calm wise golden eyes, sunlight streaming through tall trees. Soft watercolor, warm forest greens and golden tones, peaceful and magical, suitable for young children, no text.",
  },
  {
    slug: "patient-weaver",
    prompt: "Children's book illustration: a young Thai woman sitting at an old wooden loom weaving cloth, the fabric showing glowing images of her past memories, her expression thoughtful and emotional, warm candlelight around her. Soft watercolor, warm amber and indigo tones, reflective and gentle, suitable for young children, no text.",
  },
  {
    slug: "lake-hidden-city",
    prompt: "Children's book illustration: a young Thai girl swimming underwater in a clear green lake, discovering a glowing ancient city on the lake bed with stone buildings, silver-leafed trees, and translucent people looking up at her with welcoming expressions. Soft watercolor, teal and gold underwater tones, magical and serene, suitable for young children, no text.",
  },
  {
    slug: "wizard-forbidden-book",
    prompt: "Children's book illustration: a young boy in a magical library at night holding a black book with a golden chain, looking at a small mirror inside the open book that shows a glowing vision, bookshelves towering around him with glowing spell books. Soft watercolor, deep blue and golden magical tones, mysterious and thoughtful, suitable for young children, no text.",
  },
  {
    slug: "fog-ship",
    prompt: "Children's book illustration: a young Thai boy standing at the bow of a white sailing ship gliding through thick magical white fog, eyes wide with excitement and wonder, faint outline of a mysterious island emerging ahead through the mist. Soft watercolor, soft whites, grays and warm light, adventurous and dreamy, suitable for young children, no text.",
  },
  {
    slug: "whisper-cave",
    prompt: "Children's book illustration: two children — a boy and a girl — inside a glowing cave with crystal walls, the boy dazed and listening to something invisible while the girl holds a rope connected to him and calls out to him with concern, stalactites glowing softly. Soft watercolor, cool blues and warm yellows, adventurous and emotional, suitable for young children, no text.",
  },
  {
    slug: "angkor-wat",
    prompt: "Children's book illustration: a Thai boy and a Cambodian boy standing together in front of the towering stone spires of Angkor Wat reflected in a calm pool, both looking up in awe at the ancient temple at golden hour. Soft watercolor, warm golden sunset tones, awe-inspiring and friendly, suitable for young children, no text.",
  },
  {
    slug: "finland-santa",
    prompt: "Children's book illustration: a young Thai girl sitting across from a warm kindly Santa Claus in a cozy wooden cabin with a glowing fireplace, snow visible through the window, the girl looking thoughtful as Santa listens carefully. Soft watercolor, warm reds and golden firelight, cozy and heartwarming, suitable for young children, no text.",
  },
  {
    slug: "dream-fairy",
    prompt: "Children's book illustration: a tiny golden fairy with shimmering wings hovering outside a child's window at night, sprinkling golden dream dust through the glass onto a sleeping child in a cozy bed, stars visible behind the fairy. Soft watercolor, deep night blues with warm golden fairy glow, magical and gentle, suitable for young children, no text.",
  },
  {
    slug: "paper-boat-dream",
    prompt: "Children's book illustration: a young Thai boy sleeping in bed while a tiny glowing paper boat floats on a silver dream river flowing under his bed, carrying him in spirit toward a warm misty light where a gentle grandfather figure sits under a mango tree. Soft watercolor, deep indigo night and warm golden dream tones, tender and peaceful, suitable for young children, no text.",
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
