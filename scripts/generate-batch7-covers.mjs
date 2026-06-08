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
    slug: "village-no-sorry",
    prompt: "Children's book illustration: a young Thai boy standing in the center of a confused village square, everyone looking at him expectantly as he struggles to say something, old Thai wooden houses in the background, golden afternoon light. Soft watercolor, warm earthy tones, gentle and emotional, suitable for young children, no text.",
  },
  {
    slug: "shadow-boy",
    prompt: "Children's book illustration: a young Thai boy looking at his shadow on a bright sunlit wall, the shadow showing the boy doing kind helpful deeds while the real boy looks surprised and thoughtful, warm afternoon golden light. Soft watercolor, warm golden and soft blue shadow tones, introspective and gentle, suitable for young children, no text.",
  },
  {
    slug: "courage-lantern",
    prompt: "Children's book illustration: a young Thai girl in a dark forest holding a small glowing lantern, the light revealing a friendly path ahead with fireflies dancing around, trees gently framing the scene, her face calm and determined. Soft watercolor, deep forest greens with warm lantern glow, magical and brave, suitable for young children, no text.",
  },
  {
    slug: "pigeon-letter",
    prompt: "Children's book illustration: a young Thai boy releasing a white pigeon with a tiny letter tied to its leg into a bright blue sky, the pigeon flying toward a distant village on the horizon, the boy smiling and waving. Soft watercolor, sky blues and warm greens, hopeful and sweet, suitable for young children, no text.",
  },
  // แฟนตาซี
  {
    slug: "star-kingdom",
    prompt: "Children's book illustration: a young Thai boy floating on a cloud approaching a magical kingdom made entirely of stars and moonlight, towers of crystalline starlight rising into a purple night sky, tiny star-beings welcoming him at the gate. Soft watercolor, deep purple and silver star tones, magical and dreamlike, suitable for young children, no text.",
  },
  {
    slug: "dream-keeper",
    prompt: "Children's book illustration: a wise elderly woman in flowing silver robes sitting in a magical library of glowing glass jars, each jar containing a swirling colorful dream, a young Thai girl watching in wonder nearby. Soft watercolor, warm silver and golden magical tones, enchanting and serene, suitable for young children, no text.",
  },
  {
    slug: "frozen-garden",
    prompt: "Children's book illustration: a young Thai girl inside a beautiful old garden where everything is frozen mid-motion — butterflies suspended in air, water droplets hanging from a fountain, flowers half-bloomed — the girl reaching toward a broken sundial at the center. Soft watercolor, ethereal blues and soft greens, magical and mysterious, suitable for young children, no text.",
  },
  {
    slug: "cloud-ocean",
    prompt: "Children's book illustration: a young Thai boy sitting on a white cloud above the clouds, watching a giant gentle whale with golden eyes swimming gracefully through a vast ocean of cloud and light high in the sky, sunrise colors all around. Soft watercolor, soft cloud whites, sky blues, and warm gold, magical and awe-inspiring, suitable for young children, no text.",
  },
  // ผจญภัย
  {
    slug: "afraid-of-heights",
    prompt: "Children's book illustration: a young Thai boy carefully climbing down a rocky crevice, holding a small girl's hand to help her up, his face showing focused determination over fear, sunlight streaming down from above. Soft watercolor, warm stone browns and golden light from above, brave and emotional, suitable for young children, no text.",
  },
  {
    slug: "endless-road",
    prompt: "Children's book illustration: a young Thai girl standing at a fork in a long winding road, noticing a small hidden path through the bushes on the side, late afternoon golden light painting the scene, birds flying overhead. Soft watercolor, warm golden greens and earthy path tones, adventurous and thoughtful, suitable for young children, no text.",
  },
  {
    slug: "self-drawing-map",
    prompt: "Children's book illustration: a young Thai boy holding an unrolling scroll that draws lines by itself as he walks, the lines forming a glowing map trail behind him, he looks back at it in wonder, surrounding landscape of hills and forests. Soft watercolor, warm parchment and ink tones with glowing golden map lines, magical and adventurous, suitable for young children, no text.",
  },
  {
    slug: "singing-valley",
    prompt: "Children's book illustration: a young Thai girl standing alone in a lush green valley surrounded by tall stone cliffs, singing out loud with her eyes closed, sound waves visually echoing back from the cliffs in golden ripples all around her. Soft watercolor, deep greens and warm golden sound waves, joyful and free, suitable for young children, no text.",
  },
  // นานาชาติ
  {
    slug: "chinese-new-year",
    prompt: "Children's book illustration: a young Chinese girl and her grandfather sitting together in a warmly lit Chinese home, red paper lanterns and decorations visible, grandfather gesturing storytelling with a dragon creature glowing above them in the air. Soft watercolor, festive reds and warm golden Chinese New Year tones, cozy and cultural, suitable for young children, no text.",
  },
  {
    slug: "kenya-safari",
    prompt: "Children's book illustration: a young Kenyan boy and a young Japanese girl sitting quietly under an acacia tree on golden African savanna, a gentle herd of elephants with a baby elephant walking past nearby, both children watching in silent wonder. Soft watercolor, warm savanna golds and earthy African tones, peaceful and awe-inspiring, suitable for young children, no text.",
  },
  {
    slug: "maori-storyteller",
    prompt: "Children's book illustration: a young Maori boy standing before a gathered crowd outdoors in New Zealand, glowing traditional Maori patterns swirling around him in the air as he tells a story, mountains and ferns visible behind him. Soft watercolor, rich earthy greens and warm golden Maori cultural tones, proud and storytelling, suitable for young children, no text.",
  },
  {
    slug: "india-holi",
    prompt: "Children's book illustration: two Indian boys throwing colorful powder at each other on a sunny street during Holi festival, laughing joyfully, the air full of pink, yellow, blue and green colors swirling around them, flowers petals in the air too. Soft watercolor, vibrant Holi festival colors on a bright warm day, joyful and celebratory, suitable for young children, no text.",
  },
  // ก่อนนอน
  {
    slug: "warm-blanket",
    prompt: "Children's book illustration: a young Thai girl tucked snugly in bed under a beautiful golden-threaded blanket, eyes closing peacefully, the blanket glowing softly with golden light as dreamy images of meadows and butterflies float gently above her. Soft watercolor, warm golden bedroom glow and soft dream tones, cozy and peaceful, suitable for young children, no text.",
  },
  {
    slug: "rain-lullaby",
    prompt: "Children's book illustration: a young Thai boy lying in bed listening to rain outside, the window showing raindrops running down the glass against a dark night sky, a warm lamp glowing beside him, his eyes growing heavy and dreamy. Soft watercolor, warm amber bedroom tones contrasting with cool rainy night outside, cozy and soothing, suitable for young children, no text.",
  },
  {
    slug: "white-bear-snow",
    prompt: "Children's book illustration: a fluffy young polar bear cub lying on its back in fresh white snow looking up at a soft grey sky, big round eyes full of wonder, snowflakes gently falling around it, its mother looking on warmly nearby. Soft watercolor, pure whites and soft greys with warm brown bear tones, gentle and wonder-filled, suitable for young children, no text.",
  },
  {
    slug: "shooting-stars-meadow",
    prompt: "Children's book illustration: a young Thai girl lying on soft green grass at night, a tiny glowing round star resting beside her, both looking up at a sky full of stars together, the tiny star telling stories as faint images of planets and nebulae drift above them both. Soft watercolor, deep night blues and silver star glow with warm grass greens, magical and peaceful, suitable for young children, no text.",
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
