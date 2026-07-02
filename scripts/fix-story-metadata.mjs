#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const STORIES_DIR = 'src/content/stories';
const files = readdirSync(STORIES_DIR).filter(f => f.endsWith('.md'));

function getContentChars(raw) {
  const parts = raw.split('---');
  if (parts.length < 3) return raw.length;
  return parts.slice(2).join('---').trim().length;
}

function calcReadingTime(chars, category) {
  const cpm = category === 'ก่อนนอน' ? 160 : 200;
  return Math.max(3, Math.round(chars / cpm));
}

function calcAgeRange(chars, category) {
  if (category === 'ก่อนนอน') {
    return chars < 1400 ? '3-7 ปี' : '4-8 ปี';
  }
  if (category === 'นานาชาติ') {
    return chars < 1800 ? '5-10 ปี' : '6-12 ปี';
  }
  // สอนใจ, แฟนตาซี, ผจญภัย
  if (chars < 1200) return '3-7 ปี';
  if (chars < 1600) return '4-9 ปี';
  if (chars < 2200) return '5-10 ปี';
  return '6-12 ปี';
}

let updated = 0;
for (const file of files) {
  const path = join(STORIES_DIR, file);
  const raw = readFileSync(path, 'utf8');
  const chars = getContentChars(raw);

  const catMatch = raw.match(/^category:\s*"(.+)"/m);
  const category = catMatch ? catMatch[1] : '';

  const oldRt = (raw.match(/^readingTime:\s*(\d+)/m) || [])[1];
  const oldAge = (raw.match(/^ageRange:\s*"(.+)"/m) || [])[1];

  const newRt = calcReadingTime(chars, category);
  const newAge = calcAgeRange(chars, category);

  const newContent = raw
    .replace(/^readingTime:\s*\d+/m, `readingTime: ${newRt}`)
    .replace(/^ageRange:\s*".+"/m, `ageRange: "${newAge}"`);

  writeFileSync(path, newContent);
  console.log(`${file.padEnd(42)} ${chars} chars | ${String(oldRt).padStart(2)}→${String(newRt).padStart(2)} min | "${oldAge}" → "${newAge}"`);
  updated++;
}

console.log(`\nUpdated ${updated} files.`);
