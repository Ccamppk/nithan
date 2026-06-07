import OpenAI from "openai";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const stories = [
  {
    slug: "anger-shadow",
    prompt:
      "Children's storybook illustration, soft watercolor style. A young girl stands in warm sunlight, but her shadow on the ground is dark and large, shaped differently from her. Her expression shows regret. Gentle, emotional, no text.",
  },
  {
    slug: "flower-seller-coin",
    prompt:
      "Children's storybook illustration, soft watercolor style. A young girl at a colorful morning market holds out a shining gold coin to an older woman whose face shows relief and gratitude. Baskets of flowers surround them. Warm morning light, no text.",
  },
  {
    slug: "underground-city",
    prompt:
      "Children's storybook illustration, soft watercolor style. A small girl peeks through a hole in the earth into a magical underground cavern glowing with green bioluminescent light. Tiny mushroom-cap houses line root-lined streets, and small round pale creatures with large dark eyes look up at her with curiosity. Whimsical, enchanting, no text.",
  },
  {
    slug: "last-phoenix",
    prompt:
      "Children's storybook illustration, soft watercolor style. A young boy holds a small glowing bird with brilliant orange and gold feathers in his cupped hands. The bird radiates warm golden light that illuminates the boy's amazed face. A cozy bedroom at night. Magical, tender, no text.",
  },
  {
    slug: "little-mountaineer",
    prompt:
      "Children's storybook illustration, soft watercolor style. A determined young girl climbs a misty mountain trail, carefully gripping a rocky ledge. Below in the distance, a small village is visible. The mood is brave and adventurous but safe. Cool mist, warm sunlight breaking through, no text.",
  },
  {
    slug: "star-map",
    prompt:
      "Children's storybook illustration, soft watercolor style. Two children stand in a dark pine forest, both looking up at a brilliant starry sky above. One child points to a bright star. The scene is quiet and magical, stars reflecting softly on their upturned faces. No text.",
  },
  {
    slug: "mexico-day-of-dead",
    prompt:
      "Children's storybook illustration, soft watercolor style. A young Mexican girl carefully arranges marigold flowers and lit candles on a colorful ofrenda altar with a photo at the center. Orange marigold petals are scattered on the floor. The mood is warm, loving, and celebratory. No text.",
  },
  {
    slug: "seoul-chuseok",
    prompt:
      "Children's storybook illustration, soft watercolor style. A Korean grandmother in a green hanbok and a small boy sit together at a low table making songpyeon rice cakes. Golden rice paddies are visible through the window behind them. Warm autumn light, cozy kitchen atmosphere, no text.",
  },
  {
    slug: "kind-giant-dreams",
    prompt:
      "Children's storybook illustration, soft watercolor style. A very large gentle giant with white fluffy hair crouches beside a small cottage at night, carefully peeking through a window. His enormous hand holds a small pouch of golden sparkling dust. Stars fill the night sky. Magical, warm, no text.",
  },
  {
    slug: "breathing-forest",
    prompt:
      "Children's storybook illustration, soft watercolor style. A small girl sleeps peacefully on a soft mossy forest floor. Silver starlight filters through a canopy of glowing leaves. A tiny star sits beside her on a rock, glowing warmly. The forest is serene, magical, safe. Bedtime mood, no text.",
  },
];

async function generate(slug, prompt) {
  console.log(`Generating cover for: ${slug}`);
  const res = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1536x1024",
    quality: "medium",
  });
  const dest = join(__dirname, `../public/images/${slug}.png`);
  writeFileSync(dest, Buffer.from(res.data[0].b64_json, "base64"));
  console.log(`  Saved: ${dest}`);
}

for (const { slug, prompt } of stories) {
  await generate(slug, prompt);
}

console.log("All batch 3 covers generated.");
