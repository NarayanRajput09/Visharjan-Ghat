import { describe, it, expect } from 'vitest';
import en from '../src/i18n/en.json';
import hi from '../src/i18n/hi.json';

function getLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getLeafKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('i18n consistency', () => {
  it('en.json and hi.json have identical key sets', () => {
    const enKeys = getLeafKeys(en as Record<string, unknown>);
    const hiKeys = getLeafKeys(hi as Record<string, unknown>);

    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));
    const extraInHi = hiKeys.filter((k) => !enKeys.includes(k));

    expect(missingInHi).toEqual([]);
    expect(extraInHi).toEqual([]);
    expect(enKeys).toEqual(hiKeys);
  });

  it('contains no health claim keywords in strings', () => {
    const bannedEnglishWords = ['toxic', 'poisonous', 'deadly', 'illness', 'cancer', 'disease', 'safe water', 'unsafe water'];
    const allEnValues = JSON.stringify(en).toLowerCase();

    for (const banned of bannedEnglishWords) {
      expect(allEnValues.includes(banned)).toBe(false);
    }
  });
});
