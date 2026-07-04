interface StoryLike {
  id: string;
  data: { category: string };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Same category first, random fill from the rest, excludes the current story.
 * Takes currentId/currentCategory (not the whole current story) so it works
 * identically server-side (against CollectionEntry, at build time) and
 * client-side (against plain JSON fetched from /stories-data.json, per pageview).
 */
export function getRecommendedStories<T extends StoryLike>(
  allStories: T[],
  currentId: string,
  currentCategory: string,
  count = 4
): T[] {
  const others = allStories.filter(s => s.id !== currentId);
  const sameCategory = others.filter(s => s.data.category === currentCategory);
  const rest = others.filter(s => s.data.category !== currentCategory);

  const picked = shuffle(sameCategory).slice(0, count);
  if (picked.length < count) {
    picked.push(...shuffle(rest).slice(0, count - picked.length));
  }
  return picked;
}
