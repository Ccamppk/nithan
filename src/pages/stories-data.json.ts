import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const stories = await getCollection('stories');
  const data = stories.map(s => ({
    id: s.id,
    data: {
      title: s.data.title,
      category: s.data.category,
      cover: s.data.cover ?? null,
      readingTime: s.data.readingTime,
      excerpt: s.data.excerpt,
      ageRange: s.data.ageRange,
    },
  }));

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
