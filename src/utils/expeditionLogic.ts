import {
  HeartPulse,
  Droplet,
  Tent,
  Moon,
  HardHat,
  Pickaxe,
  BatteryCharging,
  Sun,
  ShieldAlert,
  Flame,
  Shirt,
  Compass,
  Footprints,
  Eye,
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
  CORE: { tr: 'Temel İhtiyaçlar & Sağlık', en: 'Core & Health', fr: 'Essentiels & Santé', es: 'Esenciales & Salud' },
  SAFETY: { tr: 'Güvenlik & Navigasyon', en: 'Safety & Navigation', fr: 'Sécurité et Navigation', es: 'Seguridad y Navegación' },
  CAMP: { tr: 'Kamp & Konaklama', en: 'Camp & Shelter', fr: 'Camp et Abri', es: 'Campamento y Refugio' },
  CLOTHING: { tr: 'Giyim & Katmanlama', en: 'Apparel & Layers', fr: 'Vêtements et Couches', es: 'Ropa y Capas' },
  ELEC: { tr: 'Elektronik & Güç', en: 'Electronics & Power', fr: 'Électronique et Énergie', es: 'Electrónica y Energía' },
  TECH: { tr: 'Teknik Donanım', en: 'Technical Gear', fr: 'Matériel Technique', es: 'Equipo Técnico' }
};

const MASTER_EQUIPMENT: EquipmentItem[] = [
  // --- TEMEL İHTİYAÇLAR & SAĞLIK ---
  {
    id: 'core-1',
    category: CATEGORIES.CORE,
    name: { tr: 'İlk Yardım Kiti & Termal Battaniye', en: 'First Aid Kit & Thermal Blanket', fr: 'Trousse de Secours & Couverture', es: 'Botiquín & Manta Térmica' },
    icon: HeartPulse,
    weightGrams: 350,
    condition: () => true
  },
  {
    id: 'core-2',
    category: CATEGORIES.CORE,
    name: { tr: 'Su Filtresi / Arıtma Tableti', en: 'Water Filter / Tablets', fr: 'Filtre à Eau / Pastilles', es: 'Filtro de Agua / Pastillas' },
    note: { tr: 'Doğal kaynaklar için hayati', en: 'Crucial for natural sources', fr: 'Crucial pour les sources naturelles', es: 'Crucial para fuentes naturales' },
    icon: Droplet,
    weightGrams: 150,
    condition: (p) => p.days > 1
  },
  {
    id: 'core-3',
    category: CATEGORIES.CORE,
    name: { tr: 'Güneş Kremi & Dudak Koruyucu (SPF50+)', en: 'Sunscreen & Lip Balm', fr: 'Crème Solaire & Baume', es: 'Protector Solar y Labial' },
    icon: Eye,
    weightGrams: 100,
    condition: () => true
  },

  // --- KAMP & KONAKLAMA ---
  {
    id: 'camp-1',
    category: CATEGORIES.CAMP,
    name: { tr: '4 Mevsim / Teknik Çadır', en: '4-Season / Technical Tent', fr: 'Tente 4 Saisons / Technique', es: 'Tienda 4 Estaciones' },
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
    id: 'camp-3',
    category: CATEGORIES.CAMP,
    name: { tr: 'Portatif Kamp Ocağı & Gaz Kartuşu', en: 'Camp Stove & Gas Canister', fr: 'Réchaud de Campement & Gaz', es: 'Hornillo de Campamento & Gas' },
    icon: Flame,
    weightGrams: 450,
    condition: (p) => p.days > 1
  },

  // --- GİYİM & KATMANLAMA ---
  {
    id: 'cloth-1',
    category: CATEGORIES.CLOTHING,
    name: { tr: 'Termal İçlik Alt/Üst Set', en: 'Thermal Base Layer Set', fr: 'Sous-vêtements Thermiques', es: 'Conjunto Térmico Base' },
    icon: Shirt,
    weightGrams: 380,
    condition: (p) => p.days > 1 || p.isWinter === true
  },
  {
    id: 'cloth-2',
    category: CATEGORIES.CLOTHING,
    name: { tr: 'Su & Rüzgar Geçirmez Ceket (Gore-Tex)', en: 'Waterproof Hard Shell Jacket', fr: 'Veste Imperméable Hard Shell', es: 'Chaqueta Impermeable Cortavientos' },
    icon: Shirt,
    weightGrams: 520,
    condition: () => true
  },
  {
    id: 'cloth-3',
    category: CATEGORIES.CLOTHING,
    name: { tr: 'Kar Tozlukları (Gaiters)', en: 'Gaiters', fr: 'Guêtres de Randonnée', es: 'Polainas de Montaña' },
    icon: Footprints,
    weightGrams: 250,
    condition: (p) => p.isWinter === true || p.isSummit
  },

  // --- GÜVENLİK & NAVİGASYON ---
  {
    id: 'safe-1',
    category: CATEGORIES.SAFETY,
    name: { tr: 'GPS Cihazı / Harita & Pusula', en: 'GPS Device / Map & Compass', fr: 'GPS / Carte & Boussole', es: 'Dispositivo GPS / Mapa y Brújula' },
    icon: Compass,
    weightGrams: 200,
    condition: () => true
  },
  {
    id: 'safe-2',
    category: CATEGORIES.SAFETY,
    name: { tr: 'UV Korumalı Dağcılık Gözlüğü / Kar Gözlüğü', en: 'Glacier / Snow Goggles', fr: 'Lunettes de Glacier', es: 'Gafas de Glaciar / Nieve' },
    icon: ShieldAlert,
    weightGrams: 140,
    condition: (p) => p.isSummit || p.isWinter === true
  },

  // --- TEKNİK DONANIM ---
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

  // --- ELEKTRONİK & GÜÇ ---
  {
    id: 'elec-1',
    category: CATEGORIES.ELEC,
    name: { tr: '10.000 mAh Powerbank & Şarj Kablosu', en: '10.000 mAh Powerbank & Cable', fr: 'Batterie Externe 10.000 mAh', es: 'Batería Externa 10.000 mAh' },
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
    const catName = item.category[lang] || item.category['tr'];
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push({
      id: item.id,
      name: item.name[lang] || item.name['tr'],
      note: item.note ? (item.note[lang] || item.note['tr']) : undefined,
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

// --- TAHMİNİ AĞIRLIK HESAPLAMA YARDIMCILARI ---

export function calculateTotalWeightGrams(items: { weightGrams?: number }[]): number {
  return items.reduce((total, item) => total + (item.weightGrams || 0), 0);
}

export function formatWeightKg(grams: number): string {
  return (grams / 1000).toFixed(1);
}

export function getWeightStatus(totalGrams: number) {
  if (totalGrams > 15000) {
    return {
      label: 'Ağır Yük (~15kg+)',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      desc: 'Yüksek irtifada bel ve diz yükünü azaltmak için yedek malzemeleri gözden geçirebilirsiniz.'
    };
  }
  if (totalGrams > 9000) {
    return {
      label: 'Standart / Dengeli Yük',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Kamp ve dağcılık faaliyetleri için ortalama ve sürdürülebilir bir tahmini ağırlık.'
    };
  }
  return {
    label: 'Hafif Yük (Ultra-Light)',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    desc: 'Tahmini çanta yükünüz oldukça ideal, hızlı ve konforlu bir yürüyüş temposu sağlar.'
  };
}
