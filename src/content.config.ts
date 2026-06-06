import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const storySchema = z.object({
  title: z.string(),
  category: z.string(),
  source: z.string(),
  author: z.string().optional(),
  adapter: z.string().optional(),
  ageRange: z.string(),
  readingTime: z.number(),
  cover: z.string().optional(),
  publishedAt: z.date(),
  excerpt: z.string(),
});

const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: storySchema,
});

const storiesEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories-en" }),
  schema: storySchema,
});

export const collections = { stories, storiesEn };
