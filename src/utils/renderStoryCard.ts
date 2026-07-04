interface StoryCardData {
  id: string;
  data: {
    title: string;
    category: string;
    cover: string | null;
    readingTime: number;
    excerpt: string;
    ageRange: string;
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Client-side equivalent of StoryCard.astro, for cards injected after fetching /stories-data.json. */
export function renderStoryCardHtml(
  story: StoryCardData,
  opts: { hrefPrefix: string; readingTimeLabel: string; iconMap: Record<string, string> }
): string {
  const { id, data } = story;
  const title = escapeHtml(data.title);
  const cover = data.cover
    ? `<img src="${escapeHtml(data.cover)}" alt="${title}" class="story-cover-img" decoding="async" loading="lazy">`
    : `<span class="material-symbols-outlined">${opts.iconMap[data.category] ?? 'auto_stories'}</span>`;

  return `<a href="${opts.hrefPrefix}${escapeHtml(id)}" class="story-card">
    <div class="story-cover">${cover}</div>
    <div class="story-body">
      <div class="story-meta">
        <span class="cat-badge">${escapeHtml(data.category)}</span>
        <span class="read-time"><span class="material-symbols-outlined">schedule</span> ${data.readingTime} ${escapeHtml(opts.readingTimeLabel)}</span>
      </div>
      <h3 class="story-title">${title}</h3>
      <p class="story-excerpt">${escapeHtml(data.excerpt)}</p>
      <p class="story-age"><span class="material-symbols-outlined">child_care</span> ${escapeHtml(data.ageRange)}</p>
    </div>
  </a>`;
}
