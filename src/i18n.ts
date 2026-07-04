export type Lang = 'th' | 'en';

export const ui = {
  th: {
    siteTagline: 'ทุกหน้า คือการผจญภัย',
    allStories: 'นิทานทั้งหมด',
    readingTime: 'นาที',
    ageRange: 'ช่วงอายุ',
    source: 'ที่มา',
    backHome: 'กลับหน้าหลัก',
    fontSize: 'ขนาดตัวอักษร',
    readMore: 'ดูนิทานทั้งหมด',
    noStories: 'ยังไม่มีนิทานในหมวดนี้',
    noStoriesDesc: 'กำลังรวบรวมนิทานอยู่นะครับ รอติดตามได้เลย',
    seeAll: 'ดูนิทานทั้งหมด',
    privacy: 'นโยบายความเป็นส่วนตัว',
    terms: 'ข้อกำหนดการใช้งาน',
    contact: 'ติดต่อเรา',
    copyright: '© 2026 Nithaan. สงวนลิขสิทธิ์ทุกประการ',
    readOther: 'อ่านนิทานเรื่องอื่น',
    stories: 'เรื่อง',
    recommended: 'นิทานแนะนำ',
  },
  en: {
    siteTagline: 'Every page is an adventure',
    allStories: 'All Stories',
    readingTime: 'min read',
    ageRange: 'Age',
    source: 'Source',
    backHome: 'Back to Home',
    fontSize: 'Font size',
    readMore: 'See all stories',
    noStories: 'No stories in this category yet',
    noStoriesDesc: 'We\'re working on it. Stay tuned!',
    seeAll: 'See all stories',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    contact: 'Contact Us',
    copyright: '© 2026 Nithaan. All rights reserved.',
    readOther: 'Read another story',
    stories: 'stories',
    recommended: 'You might also like',
  },
} as const;

export const categoryNames: Record<Lang, Record<string, string>> = {
  th: {
    'สอนใจ': 'สอนใจ',
    'แฟนตาซี': 'แฟนตาซี',
    'ผจญภัย': 'ผจญภัย',
    'นานาชาติ': 'นานาชาติ',
    'ก่อนนอน': 'ก่อนนอน',
  },
  en: {
    'Moral': 'Moral',
    'Fantasy': 'Fantasy',
    'Adventure': 'Adventure',
    'International': 'International',
    'Bedtime': 'Bedtime',
  },
};

export const ALL_CATEGORIES_EN = ['Moral', 'Fantasy', 'Adventure', 'International', 'Bedtime'];

export const iconMap: Record<string, string> = {
  'สอนใจ': 'lightbulb',
  'แฟนตาซี': 'auto_fix_high',
  'ผจญภัย': 'travel_explore',
  'นานาชาติ': 'public',
  'ก่อนนอน': 'bedtime',
  'Moral': 'lightbulb',
  'Fantasy': 'auto_fix_high',
  'Adventure': 'travel_explore',
  'International': 'public',
  'Bedtime': 'bedtime',
};

export function getLangFromUrl(url: URL): Lang {
  if (url.pathname.startsWith('/en')) return 'en';
  return 'th';
}

export function getOppositeLangPath(url: URL): string {
  if (url.pathname.startsWith('/en')) {
    return url.pathname.replace(/^\/en/, '') || '/';
  }
  return '/en' + url.pathname;
}
