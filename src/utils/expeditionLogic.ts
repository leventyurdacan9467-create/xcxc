// src/utils/expeditionLogic.ts

import {
  HeartPulse,
  Droplet,
  Tent,
  Moon,
  HardHat,
  Pickaxe,
  BatteryCharging,
  Sun,
} from 'lucide-react';

export type Language = 'tr' | 'en' | 'fr' | 'es';

export interface TripParams {
  days: number;
  isSummit: boolean;
  isWinter?: boolean;
}

interface TranslatableText {
  tr: string;
  en: string;
  fr: string;
  es: string;
}

export interface EquipmentItem {
  id: string;
  category: TranslatableText;
  name: TranslatableText;
  note?: TranslatableText;
  icon: any;
  weightGrams: number;
  condition: (params: TripParams) => boolean;
}

const CATEGORIES = {
  CORE: { tr: 'Temel İhtiyaçlar', en: 'Core Essentials', fr: 'Essentiels de Base', es: 'Esenciales Básicos' },
  SAFETY: { tr: 'Güvenlik & Navigasyon', en: 'Safety & Navigation', fr: 'Sécurité et Navigation', es: 'Seguridad y Navegación' },
  CAMP: { tr: 'Kamp & Konaklama', en: 'Camp & Shelter', fr: 'Camp et Abri', es: 'Campamento y Refugio' },
  ELEC: { tr: 'Elektronik & Güç', en: 'Electronics & Power', fr: 'Électronique et Énergie', es: 'Electrónica y Energía' },
  TECH: { tr: 'Teknik Donanım', en: 'Technical Gear', fr: 'Matériel Technique', es: 'Equipo Técnico' }
};

const MASTER_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'core-1',
    category: CATEGORIES.CORE,
    name: { tr: 'İlk Yardım Kiti', en: 'First Aid Kit', fr: 'Trousse de Premiers Secours', es: 'Botiquín de Primeros Auxilios' },
    icon: HeartPulse,
    weightGrams: 350,
    condition: () => true
  },
  {
    id: 'core-2',
    category: CATEGORIES.CORE,
    name: { tr: 'Su Filtresi / Arıtma Tableti', en: 'Water Filter / Tablets', fr: 'Filtre à Eau', es: 'Filtro de Agua' },
    note: { tr: 'Doğal kaynaklar için hayati', en: 'Crucial for natural sources', fr: 'Crucial pour les sources naturelles', es: 'Crucial para fuentes naturales' },
    icon: Droplet,
    weightGrams: 150,
    condition: (p) => p.days > 1
  },
  {
    id: 'camp-1',
    category: CATEGORIES.CAMP,
    name: { tr: '4 Mevsim Çadır', en: '4-Season Tent', fr: 'Tente 4 Saisons', es: 'Tienda de 4 Estaciones' },
    icon: Tent,
    weightGrams: 2200,
    condition: (p) => p.days > 1
  },
  {
    id: 'camp-2',
    category: CATEGORIES.CAMP,
    name: { tr: 'Uyku Tulumu & İzolasyonlu Mat', en: 'Sleeping Bag & Insulated Mat', fr: 'Sac de Couchage et Tapis', es: 'Saco de Dormir y Colchoneta' },
    icon: Moon,
    weightGrams: 1800,
    condition: (p) => p.days > 1
  },
  {
    id: 'tech-1',
    category: CATEGORIES.TECH,
    name: { tr: 'Dağcılık Kaskı', en: 'Climbing Helmet', fr: 'Casque d\'Alpinisme', es: 'Casco de Escalada' },
    icon: HardHat,
    weightGrams: 400,
    condition: (p) => p.isSummit
  },
  {
    id: 'tech-2',
    category: CATEGORIES.TECH,
    name: { tr: 'Kazma ve Krampon', en: 'Ice Axe & Crampons', fr: 'Piolet et Crampons', es: 'Piolet y Crampones' },
    note: { tr: 'Buzul ve sert kar geçişleri için', en: 'For glacier and hard snow', fr: 'Pour glacier et neige dure', es: 'Para glaciar y nieve dura' },
    icon: Pickaxe,
    weightGrams: 1200,
    condition: (p) => p.isSummit || p.isWinter === true
  },
  {
    id: 'elec-1',
    category: CATEGORIES.ELEC,
    name: { tr: '10.000 mAh Powerbank', en: '10.000 mAh Powerbank', fr: 'Batterie Externe 10.000 mAh', es: 'Batería Externa 10.000 mAh' },
    icon: BatteryCharging,
    weightGrams: 220,
    condition: (p) => p.days <= 2
  },
  {
    id: 'elec-2',
    category: CATEGORIES.ELEC,
    name: { tr: '20.000 mAh Powerbank + Solar Panel', en: '20.000 mAh Powerbank + Solar Panel', fr: 'Batterie 20.000 mAh + Panneau Solaire', es: 'Batería 20.000 mAh + Panel Solar' },
    note: { tr: 'Uzun ekspedisyon güç kaynağı', en: 'Long expedition power source', fr: 'Source d\'énergie pour longue expédition', es: 'Fuente de energía para expedición larga' },
    icon: Sun,
    weightGrams: 480,
    condition: (p) => p.days > 2
  }
];

export function generateEquipment(params: TripParams, lang: Language = 'tr') {
  const filtered = MASTER_EQUIPMENT.filter(item => item.condition(params));

  const grouped = filtered.reduce((acc, item) => {
    const catName = item.category[lang];
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push({
      id: item.id,
      name: item.name[lang],
      note: item.note ? item.note[lang] : undefined,
      icon: item.icon,
      weightGrams: item.weightGrams,
    });
    return acc;
  }, {} as Record<string, { id: string, name: string, note?: string, icon: any, weightGrams: number }[]>);

  return grouped;
}

export function generateDailyPlan(days: number, isSummit: boolean, lang: Language = 'tr') {
  const plan: { day: number; title: string; desc: string }[] = [];

  const dict = {
    tr: {
      d1_title: 'Yaklaşım ve Kamp Kurulumu', d1_desc: 'Rotaya giriş, tempo ayarı ve baz kampın kurulması. Su kaynaklarının tespiti.',
      dmid_title: 'Aklimatizasyon / Rota Yürüyüşü', dmid_desc: 'Yüksekliğe uyum sağlama veya rotada ana ilerleme günü.',
      summit_title: 'Zirve Günü!', summit_desc: 'Gece yarısı kalkış (Alpin start). Hafif çanta, yüksek enerji, zirve denemesi ve kampa dönüş.',
      dlast_title: 'Dönüş ve Çöp Yönetimi', dlast_desc: 'Kampın toplanması, doğada iz bırakmadan (Leave No Trace) dönüş yolculuğu.'
    },
    en: {
      d1_title: 'Approach & Camp Setup', d1_desc: 'Entering the route, pacing, and setting up base camp. Identifying water sources.',
      dmid_title: 'Acclimatization / Trek', dmid_desc: 'Altitude adjustment or main progression on the route.',
      summit_title: 'Summit Push!', summit_desc: 'Alpine start (midnight). Light pack, high energy, summit attempt and return to camp.',
      dlast_title: 'Descent & Leave No Trace', dlast_desc: 'Breaking down camp, descending while leaving no trace.'
    }
  };

  const t = dict[lang as keyof typeof dict] || dict['en'];

  if (days === 1) {
    plan.push({ day: 1, title: isSummit ? t.summit_title : t.dmid_title, desc: isSummit ? t.summit_desc : t.dmid_desc });
    return plan;
  }

  for (let i = 1; i <= days; i++) {
    if (i === 1) {
      plan.push({ day: i, title: t.d1_title, desc: t.d1_desc });
    } else if (i === days) {
      plan.push({ day: i, title: t.dlast_title, desc: t.dlast_desc });
    } else {
      const isSummitDay = isSummit && i === days - 1;
      plan.push({
        day: i,
        title: isSummitDay ? t.summit_title : t.dmid_title,
        desc: isSummitDay ? t.summit_desc : t.dmid_desc
      });
    }
  }

  return plan;
}
