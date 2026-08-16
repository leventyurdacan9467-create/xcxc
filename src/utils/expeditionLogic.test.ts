import { describe, it, expect } from 'vitest';
import { generateEquipment } from './expeditionLogic';

describe('generateEquipment', () => {
  it('1 günlük kampta çadır/uyku tulumu OLMAMALI', () => {
    const result = generateEquipment({ days: 1, isSummit: false }, 'tr');
    const allItems = Object.values(result).flat();
    expect(allItems.some((i) => i.id === 'camp-1')).toBe(false);
  });

  it('5 günlük gezide çadır/uyku tulumu OLMALI', () => {
    const result = generateEquipment({ days: 5, isSummit: false }, 'tr');
    const allItems = Object.values(result).flat();
    expect(allItems.some((i) => i.id === 'camp-1')).toBe(true);
  });

  it('zirve durumunda kask ve kazma/krampon OLMALI', () => {
    const result = generateEquipment({ days: 3, isSummit: true }, 'tr');
    const allItems = Object.values(result).flat();
    expect(allItems.some((i) => i.id === 'tech-1')).toBe(true);
    expect(allItems.some((i) => i.id === 'tech-2')).toBe(true);
  });

  it('kampta (zirve değil) kask OLMAMALI', () => {
    const result = generateEquipment({ days: 3, isSummit: false }, 'tr');
    const allItems = Object.values(result).flat();
    expect(allItems.some((i) => i.id === 'tech-1')).toBe(false);
  });

  it('2 günden uzun gezide büyük powerbank, kısa gezide küçük powerbank olmalı', () => {
    const shortTrip = Object.values(generateEquipment({ days: 2, isSummit: false }, 'tr')).flat();
    const longTrip = Object.values(generateEquipment({ days: 4, isSummit: false }, 'tr')).flat();
    expect(shortTrip.some((i) => i.id === 'elec-1')).toBe(true);
    expect(longTrip.some((i) => i.id === 'elec-2')).toBe(true);
  });

  it('her koşulda ilk yardım kiti OLMALI', () => {
    const result = generateEquipment({ days: 1, isSummit: false }, 'tr');
    const allItems = Object.values(result).flat();
    expect(allItems.some((i) => i.id === 'core-1')).toBe(true);
  });
});
