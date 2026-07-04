import type { CollectionEntry } from 'astro:content';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Same category first, random fill from the rest, excludes the current story. */
export function getRecommendedStories<C extends 'stories' | 'storiesEn'>(
  allStories: CollectionEntry<C>[],
  current: CollectionEntry<C>,
  count = 3
): CollectionEntry<C>[] {
  const others = allStories.filter(s => s.id !== current.id);
  const sameCategory = others.filter(s => s.data.category === current.data.category);
  const rest = others.filter(s => s.data.category !== current.data.category);

  const picked = shuffle(sameCategory).slice(0, count);
  if (picked.length < count) {
    picked.push(...shuffle(rest).slice(0, count - picked.length));
  }
  return picked;
}
