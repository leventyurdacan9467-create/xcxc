import {
  Mountain,
  Tent,
  Backpack,
  Thermometer,
  Wind,
  CloudRain,
  Sun,
  CloudSun,
  Snowflake,
  Flame,
  Utensils,
  Camera,
  Droplets,
  Shield,
  Flashlight,
  BatteryCharging,
  Footprints,
  Anchor,
  Pickaxe,
  Glasses,
  HeartPulse,
  HardHat,
  Watch,
  Scissors,
  Map,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import type {
  EquipmentItem,
  WeatherAnalysis,
  Category,
} from './types';

export const CATEGORY_META: Record<
  Category,
  { icon: LucideIcon; image: string }
> = {
  mountaineering: {
    icon: Mountain,
    image:
      'https://images.pexels.com/photos/9683997/pexels-photo-9683997.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  camping: {
    icon: Tent,
    image:
      'https://images.pexels.com/photos/34584519/pexels-photo-34584519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
};

export const WEATHER_ANALYSES: Record<Category, WeatherAnalysis> = {
  mountaineering: {
    condition: 'high-altitude',
    temperature: '-18°C / -2°C',
    summary: {
      tr: 'Sert rüzgarlı ve eksi dereceler bekleniyor',
      en: 'Strong winds and sub-zero temperatures expected',
      fr: 'Vents forts et températures négatives attendues',
      es: 'Vientos fuertes y temperaturas bajo cero esperadas',
    },
    details: {
      tr: [
        'Bu tarihte ortalama -12°C bekleniyor',
        'Zirve bölgesinde 60-80 km/sa rüzgar olasılığı %78',
        'Beklenen kar yağışı: orta yoğunluk',
        'Görüş mesafesi: 200-500m arası, sis riski yüksek',
      ],
      en: [
        'Average -12°C expected on this date',
        '78% probability of 60-80 km/h winds at summit',
        'Expected snowfall: moderate intensity',
        'Visibility: 200-500m, high fog risk',
      ],
      fr: [
        'Moyenne de -12°C à cette date',
        '78% de probabilité de vents de 60-80 km/h au sommet',
        'Précipitations de neige attendues: intensité modérée',
        'Visibilité: 200-500m, risque de brouillard élevé',
      ],
      es: [
        'Promedio de -12°C en esta fecha',
        '78% de probabilidad de vientos de 60-80 km/h en la cima',
        'Nieve esperada: intensidad moderada',
        'Visibilidad: 200-500m, alto riesgo de niebla',
      ],
    },
    recommendation: {
      tr: '4 mevsim ekipman, rüzgar koruması ve yüksek irtifa çadırı zorunlu.',
      en: '4-season gear, wind protection, and high-altitude tent are mandatory.',
      fr: 'Équipement 4 saisons, protection contre le vent et tente haute altitude obligatoires.',
      es: 'Equipo de 4 estaciones, protección contra el viento y tienda de alta altitude son obligatorios.',
    },
    icon: Snowflake,
  },
  camping: {
    condition: 'mild',
    temperature: '8°C / 22°C',
    summary: {
      tr: 'Genel olarak ılıman, geceleri serin',
      en: 'Generally mild, cool at night',
      fr: 'Globalement doux, frais la nuit',
      es: 'Generalmente templado, fresco por la noche',
    },
    details: {
      tr: [
        'Bu tarihte ortalama 15°C bekleniyor',
        'Rüzgar hızı: 10-20 km/sa, hafif',
        'Beklenen yağış: düşük (%20 ihtimal)',
        'Gece sıcaklığı: 6-10°C arası',
      ],
      en: [
        'Average 15°C expected on this date',
        'Wind speed: 10-20 km/h, light',
        'Expected precipitation: low (20% chance)',
        'Night temperature: 6-10°C range',
      ],
      fr: [
        'Moyenne de 15°C à cette date',
        'Vitesse du vent: 10-20 km/h, léger',
        'Précipitations attendues: faibles (20% de chance)',
        'Température nocturne: 6-10°C',
      ],
      es: [
        'Promedio de 15°C en esta fecha',
        'Velocidad del viento: 10-20 km/h, ligero',
        'Precipitación esperada: baja (20% de probabilidad)',
        'Temperatura nocturna: 6-10°C',
      ],
    },
    recommendation: {
      tr: 'Standart 3 mevsim ekipman yeterli, gece için sıcak uyku tulumu öner.',
      en: 'Standard 3-season gear is sufficient; a warm sleeping bag is recommended for the night.',
      fr: 'Équipement standard 3 saisons suffisant; sac de couchage chaud recommandé pour la nuit.',
      es: 'Equipo estándar de 3 estaciones suficiente; saco de dormir cálido recomendado para la noche.',
    },
    icon: CloudSun,
  },
};

// Kamp items (3 Mevsim)
const CAMPING_ITEMS: EquipmentItem[] = [
  {
    id: 'camp-tent-3season',
    group: 'shelter',
    icon: Tent,
    image:
      'https://images.pexels.com/photos/4268094/pexels-photo-4268094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'rain'],
    searchName: '3 season lightweight camping tent',
    name: {
      tr: '3 Mevsim Hafif Çadır',
      en: '3-Season Lightweight Tent',
      fr: 'Tente Légère 3 Saisons',
      es: 'Tienda Ligera de 3 Estaciones',
    },
    description: {
      tr: 'Hafif, hızlı kurulumlu 3 mevsim çadır',
      en: 'Lightweight, quick-pitch 3-season tent',
      fr: 'Tente légère 3 saisons, montage rapide',
      es: 'Tienda ligera de 3 estaciones, montaje rápido',
    },
  },
  {
    id: 'camp-sleeping-bag',
    group: 'shelter',
    icon: Thermometer,
    image:
      'https://images.pexels.com/photos/821750/pexels-photo-821750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold'],
    searchName: 'down sleeping bag 0 degree',
    name: {
      tr: 'Kaz Tüyü Uyku Tulumu (0°C)',
      en: 'Down Sleeping Bag (0°C)',
      fr: 'Sac de Couchage en Plume (0°C)',
      es: 'Saco de Dormir de Pluma (0°C)',
    },
    description: {
      tr: '0°C konfor, hafif kaz tüyü dolgulu uyku tulumu',
      en: '0°C comfort, lightweight down-filled sleeping bag',
      fr: '0°C confort, sac de couchage léger en plume',
      es: '0°C confort, saco de dormir ligero de pluma',
    },
  },
  {
    id: 'camp-sleeping-pad',
    group: 'shelter',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/31443013/pexels-photo-31443013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold'],
    searchName: 'inflatable camping sleeping pad',
    name: {
      tr: 'Şişme Mat',
      en: 'Inflatable Sleeping Pad',
      fr: 'Matelas Gonflable',
      es: 'Colchoneta Inflable',
    },
    description: {
      tr: 'Hafif, kompakt şişme yatak matı',
      en: 'Lightweight, compact inflatable sleeping pad',
      fr: 'Matelas gonflable léger et compact',
      es: 'Colchoneta inflable ligera y compacta',
    },
  },
  {
    id: 'camp-merino-base',
    group: 'clothing',
    icon: Thermometer,
    image:
      'https://images.pexels.com/photos/18708302/pexels-photo-18708302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold'],
    searchName: 'merino wool thermal base layer',
    name: {
      tr: 'Merinos Yün İçlik',
      en: 'Merino Wool Base Layer',
      fr: 'Sous-vêtement en Laine Mérinos',
      es: 'Ropa Interior de Lana Merino',
    },
    description: {
      tr: 'Termal regülasyonlu, kokmaz merinos yün içlik',
      en: 'Thermal-regulating, odor-resistant merino wool base layer',
      fr: 'Sous-vêtement mérinos thermorégulateur, anti-odeur',
      es: 'Ropa interior de merino termorreguladora, anti-olor',
    },
  },
  {
    id: 'camp-light-down-jacket',
    group: 'clothing',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/8830576/pexels-photo-8830576.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold'],
    searchName: 'lightweight down jacket packable',
    name: {
      tr: 'Hafif Kaz Tüyü Mont',
      en: 'Lightweight Down Jacket',
      fr: 'Veste en Plume Légère',
      es: 'Chaqueta de Pluma Ligera',
    },
    description: {
      tr: 'Sıkıştırılabilir, hafif kaz tüyü dolgulu mont',
      en: 'Packable, lightweight down-filled jacket',
      fr: 'Veste légère en plume, compressible',
      es: 'Chaqueta ligera de pluma, comprimible',
    },
  },
  {
    id: 'camp-rain-jacket',
    group: 'clothing',
    icon: CloudRain,
    image:
      'https://images.pexels.com/photos/12505397/pexels-photo-12505397.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['rain', 'mild'],
    searchName: 'waterproof breathable rain jacket',
    name: {
      tr: 'Su Geçirmez Yağmurluk',
      en: 'Waterproof Rain Jacket',
      fr: 'Veste Imperméable',
      es: 'Chaqueta Impermeable',
    },
    description: {
      tr: 'Su geçirmez, nefes alabilir yağmurluk ceket',
      en: 'Waterproof, breathable rain jacket',
      fr: 'Veste imperméable et respirante',
      es: 'Chaqueta impermeable y transpirable',
    },
  },
  {
    id: 'camp-trekking-pants',
    group: 'clothing',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/12983267/pexels-photo-12983267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'rain', 'hot'],
    searchName: 'quick dry trekking pants outdoor',
    name: {
      tr: 'Trekking Pantolonu',
      en: 'Trekking Pants',
      fr: 'Pantalon de Randonnée',
      es: 'Pantalón de Trekking',
    },
    description: {
      tr: 'Hızlı kuruyan, esnek trekking pantolonu',
      en: 'Quick-drying, stretchy trekking pants',
      fr: 'Pantalon de randonnée séchage rapide, extensible',
      es: 'Pantalón de trekking secado rápido, elástico',
    },
  },
  {
    id: 'camp-neck-gaiter',
    group: 'clothing',
    icon: Wind,
    image:
      'https://images.pexels.com/photos/29773370/pexels-photo-29773370.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold', 'wind', 'hot'],
    searchName: 'multi use neck gaiter outdoor',
    name: {
      tr: 'Boyunluk / Maske',
      en: 'Neck Gaiter / Mask',
      fr: 'Buff / Cache-cou',
      es: 'Braga de Cuello / Mascara',
    },
    description: {
      tr: 'Çok amaçlı boyunluk, maske, bant',
      en: 'Multi-purpose neck gaiter, mask, headband',
      fr: 'Cache-cou multi-usage, masque, bandeau',
      es: 'Braga de cuello multiusos, máscara, cinta',
    },
  },
  {
    id: 'camp-trekking-poles',
    group: 'clothing',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/12983267/pexels-photo-12983267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold', 'rain'],
    searchName: 'lightweight trekking poles pair',
    name: {
      tr: 'Trekking Bastonları',
      en: 'Trekking Poles',
      fr: 'Bâtons de Randonnée',
      es: 'Bastones de Trekking',
    },
    description: {
      tr: 'Diz yükünü azaltan, hafif karbon bastonlar',
      en: 'Carbon poles that reduce knee load',
      fr: 'Bâtons carbone réduisant la charge sur les genoux',
      es: 'Bastones de carbono que reducen la carga en las rodillas',
    },
  },
  {
    id: 'camp-titanium-pot',
    group: 'kitchen',
    icon: Utensils,
    image:
      'https://images.pexels.com/photos/6271469/pexels-photo-6271469.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold'],
    searchName: 'titanium cookware set camping',
    name: {
      tr: 'Titanyum Tencere Seti',
      en: 'Titanium Pot Set',
      fr: 'Set de Casseroles en Titane',
      es: 'Set de Ollas de Titanio',
    },
    description: {
      tr: 'İç içe geçen, hafif titanyum tencere seti',
      en: 'Nesting, lightweight titanium pot set',
      fr: 'Set de casseroles en titane emboîtables, léger',
      es: 'Set de ollas de titanio apilables, ligero',
    },
  },
  {
    id: 'camp-micro-stove',
    group: 'kitchen',
    icon: Flame,
    image:
      'https://images.pexels.com/photos/13772355/pexels-photo-13772355.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold', 'wind'],
    searchName: 'micro gas camping stove lightweight',
    name: {
      tr: 'Mikro Gaz Ocağı',
      en: 'Micro Gas Stove',
      fr: 'Réchaud à Gaz Micro',
      es: 'Fogata de Gas Micro',
    },
    description: {
      tr: 'Cep boyutu, hızlı kaynama mikro gaz ocağı',
      en: 'Pocket-sized, fast-boil micro gas stove',
      fr: 'Réchaud à gaz micro, format de poche',
      es: 'Fogata de gas micro, tamaño de bolsillo',
    },
  },
  {
    id: 'camp-titanium-spork',
    group: 'kitchen',
    icon: Utensils,
    image:
      'https://images.pexels.com/photos/6271472/pexels-photo-6271472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold'],
    searchName: 'titanium spork utensil',
    name: {
      tr: 'Titanyum Spork',
      en: 'Titanium Spork',
      fr: 'Cuillère-fourchette en Titane',
      es: 'Cuchara-tenedor de Titanio',
    },
    description: {
      tr: 'Kaşık-çatal birleşik titanyum spork',
      en: 'Spoon-fork combo titanium spork',
      fr: 'Cuillère-fourchette combinée en titane',
      es: 'Cuchara-tenedor combinada de titanio',
    },
  },
  {
    id: 'camp-foldable-bottle',
    group: 'kitchen',
    icon: Droplets,
    image:
      'https://images.pexels.com/photos/9159906/pexels-photo-9159906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'hot', 'rain'],
    searchName: 'foldable water bottle collapsible',
    name: {
      tr: 'Katlanır Matara',
      en: 'Foldable Water Bottle',
      fr: 'Gourde Pliable',
      es: 'Botella de Agua Plegable',
    },
    description: {
      tr: 'Boşaltınca katlanan, hafif su matarası',
      en: 'Collapsible, lightweight water bottle',
      fr: 'Gourde légère et pliable',
      es: 'Botella de agua ligera y plegable',
    },
  },
  {
    id: 'camp-water-filter',
    group: 'kitchen',
    icon: Droplets,
    image:
      'https://images.pexels.com/photos/11763619/pexels-photo-11763619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'hot', 'rain'],
    searchName: 'portable water filter purifier',
    name: {
      tr: 'Su Filtresi',
      en: 'Water Filter',
      fr: 'Filtre à Eau',
      es: 'Filtro de Agua',
    },
    description: {
      tr: 'Bakteri ve parazit filtreli taşınabilir su arıtıcı',
      en: 'Portable water purifier with bacteria and parasite filter',
      fr: 'Purificateur d\'eau portable avec filtre bactéries et parasites',
      es: 'Purificador de agua portátil con filtro de bacterias y parásitos',
    },
  },
  {
    id: 'camp-headlamp',
    group: 'other',
    icon: Flashlight,
    image:
      'https://images.pexels.com/photos/15977285/pexels-photo-15977285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold', 'rain'],
    searchName: 'adjustable headlamp camping',
    name: {
      tr: 'Kafa Lambası',
      en: 'Headlamp',
      fr: 'Lampe Frontale',
      es: 'Lámpara Frontal',
    },
    description: {
      tr: 'Hafif, ayarlanabilir ışık kafa lambası',
      en: 'Lightweight, adjustable beam headlamp',
      fr: 'Lampe frontale légère, faisceau réglable',
      es: 'Lámpara frontal ligera, haz ajustable',
    },
  },
  {
    id: 'camp-powerbank',
    group: 'other',
    icon: BatteryCharging,
    image:
      'https://images.pexels.com/photos/4387779/pexels-photo-4387779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold'],
    searchName: '10000mAh portable powerbank fast charge',
    name: {
      tr: 'Powerbank',
      en: 'Power Bank',
      fr: 'Batterie Externe',
      es: 'Batería Externa',
    },
    description: {
      tr: '10000mAh, hızlı şarj taşınabilir powerbank',
      en: '10000mAh, fast-charging portable power bank',
      fr: 'Batterie externe 10000mAh, charge rapide',
      es: 'Batería externa 10000mAh, carga rápida',
    },
  },
  {
    id: 'camp-first-aid',
    group: 'other',
    icon: HeartPulse,
    image:
      'https://images.pexels.com/photos/5673523/pexels-photo-5673523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold', 'rain', 'hot'],
    searchName: 'compact first aid kit camping',
    name: {
      tr: 'Kompakt İlk Yardım Kiti',
      en: 'Compact First Aid Kit',
      fr: 'Trousse de Secours Compacte',
      es: 'Botiquín Compacto de Primeros Auxilios',
    },
    description: {
      tr: 'Kamp için kompakt ilk yardım çantası',
      en: 'Compact first aid kit for camping',
      fr: 'Trousse de secours compacte pour le camping',
      es: 'Botiquín compacto para camping',
    },
  },
  {
    id: 'camp-multi-tool',
    group: 'other',
    icon: Scissors,
    image:
      'https://images.pexels.com/photos/7911475/pexels-photo-7911475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'cold', 'rain', 'hot'],
    searchName: 'multi tool pocket knife outdoor',
    name: {
      tr: 'Çok Amaçlı Mini Çakı',
      en: 'Multi-Tool Pocket Knife',
      fr: 'Outil Multi-fonctions',
      es: 'Navaja Multiusos',
    },
    description: {
      tr: 'Bıçak, makas, açaca çok amaçlı alet',
      en: 'Knife, scissors, opener multi-tool',
      fr: 'Outil multi-fonctions: couteau, ciseaux, ouvre-boîte',
      es: 'Herramienta multiusos: cuchillo, tijeras, abridor',
    },
  },
  {
    id: 'camp-map-compass',
    group: 'other',
    icon: Compass,
    image:
      'https://images.pexels.com/photos/4992707/pexels-photo-4992707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold', 'rain'],
    searchName: 'topographic map compass hiking',
    name: {
      tr: 'Bölge Haritası ve Pusula',
      en: 'Trail Map & Compass',
      fr: 'Carte et Boussole',
      es: 'Mapa y Brújula',
    },
    description: {
      tr: 'Su geçirmez topografik bölge haritası ve pusula',
      en: 'Waterproof topographic trail map and compass',
      fr: 'Carte topographique imperméable et boussole',
      es: 'Mapa topográfico impermeable y brújula',
    },
  },
  {
    id: 'camp-sunscreen',
    group: 'other',
    icon: Sun,
    image:
      'https://images.pexels.com/photos/30929490/pexels-photo-30929490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'hot'],
    searchName: 'SPF 50 sunscreen outdoor sport',
    name: {
      tr: 'SPF 50 Güneş Kremi',
      en: 'SPF 50 Sunscreen',
      fr: 'Crème Solaire SPF 50',
      es: 'Protector Solar SPF 50',
    },
    description: {
      tr: 'Yüksek koruma faktörü, spor tipi güneş kremi',
      en: 'High protection factor, sport-type sunscreen',
      fr: 'Crème solaire sport, facteur de protection élevé',
      es: 'Protector solar deportivo, factor de protección alto',
    },
  },
  {
    id: 'camp-insect-repellent',
    group: 'other',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/5673523/pexels-photo-5673523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['mild', 'hot', 'rain'],
    searchName: 'insect repellent spray outdoor',
    name: {
      tr: 'Sinek Kovucu',
      en: 'Insect Repellent',
      fr: 'Répulsif à Insectes',
      es: 'Repelente de Insectos',
    },
    description: {
      tr: 'Uzun süre etkili, doğa için uygun sinek kovucu',
      en: 'Long-lasting, outdoor-grade insect repellent',
      fr: 'Répulsif longue durée, adapté au plein air',
      es: 'Repelente de larga duración, apto para exteriores',
    },
  },
  {
    id: 'camp-trash-bag',
    group: 'other',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/4268094/pexels-photo-4268094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['mild', 'cold', 'rain', 'hot'],
    searchName: 'dry bag waste pack out camping',
    name: {
      tr: 'Çanta Atık Torbası',
      en: 'Pack-out Waste Bag',
      fr: 'Sac Poubelle',
      es: 'Bolsa de Residuos',
    },
    description: {
      tr: 'Doğada iz bırakmamak için atık taşıma torbası',
      en: 'Waste carry bag for leave-no-trace camping',
      fr: 'Sac pour transporter les déchets, sans laisser de trace',
      es: 'Bolsa para residuos, sin dejar rastro',
    },
  },
];

// Dağcılık items (Yüksek İrtifa & Ekspedisyon)
const MOUNTAINEERING_ITEMS: EquipmentItem[] = [
  {
    id: 'mtn-4season-tent',
    group: 'shelter_pack',
    icon: Tent,
    image:
      'https://images.pexels.com/photos/4014879/pexels-photo-4014879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: '4 season expedition tent high altitude',
    name: {
      tr: '4 Mevsim Ekspedisyon Çadırı',
      en: '4-Season Expedition Tent',
      fr: 'Tente d\'Expédition 4 Saisons',
      es: 'Tienda de Expedición 4 Estaciones',
    },
    description: {
      tr: 'Fırtına dayanımlı, yüksek irtifa 4 mevsim çadır',
      en: 'Storm-rated, high-altitude 4-season tent',
      fr: 'Tente 4 saisons haute altitude, résistante aux tempêtes',
      es: 'Tienda 4 estaciones de alta altitude, resistente a tormentas',
    },
  },
  {
    id: 'mtn-expedition-suit',
    group: 'shelter_pack',
    icon: Thermometer,
    image:
      'https://images.pexels.com/photos/6299741/pexels-photo-6299741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'expedition sleeping bag -15 degree',
    name: {
      tr: 'Yüksek İrtifa Tulumu (-15°C)',
      en: 'High-Altitude Sleeping Bag (-15°C)',
      fr: 'Sac de Couchage Haute Altitude (-15°C)',
      es: 'Saco de Dormir de Alta Altitud (-15°C)',
    },
    description: {
      tr: '-15°C konfor, ekspedisyon sınıfı uyku tulumu',
      en: '-15°C comfort, expedition-grade sleeping bag',
      fr: 'Sac de couchage expédition, confort -15°C',
      es: 'Saco de dormir expedición, confort -15°C',
    },
  },
  {
    id: 'mtn-sleeping-pad-combo',
    group: 'shelter_pack',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/31443014/pexels-photo-31443014.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'closed cell foam inflatable sleeping pad combo',
    name: {
      tr: 'Kapalı Hücreli + Şişme Mat',
      en: 'Closed-Cell + Inflatable Pad Combo',
      fr: 'Matelas Mousse + Gonflable',
      es: 'Colchoneta Espuma + Inflable',
    },
    description: {
      tr: 'Çift katman: kapalı hücre + şişme mat kombinasyonu',
      en: 'Dual layer: closed-cell foam + inflatable pad combo',
      fr: 'Double couche: mousse à cellules fermées + matelas gonflable',
      es: 'Doble capa: espuma de celdas cerradas + colchoneta inflable',
    },
  },
  {
    id: 'mtn-expedition-pack',
    group: 'shelter_pack',
    icon: Backpack,
    image:
      'https://images.pexels.com/photos/19102197/pexels-photo-19102197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: '65L expedition backpack heavy load',
    name: {
      tr: '50-65L Ekspedisyon Çantası',
      en: '50-65L Expedition Backpack',
      fr: 'Sac à Dos d\'Expédition 50-65L',
      es: 'Mochila de Expedición 50-65L',
    },
    description: {
      tr: 'Ağır yük taşıyıcı, ergonomik 50-65L sırt çantası',
      en: 'Heavy-load hauler, ergonomic 50-65L backpack',
      fr: 'Sac à dos ergonomique 50-65L pour charges lourdes',
      es: 'Mochila ergonómica 50-65L para cargas pesadas',
    },
  },
  {
    id: 'mtn-ice-axe',
    group: 'technical',
    icon: Pickaxe,
    image:
      'https://images.pexels.com/photos/20752211/pexels-photo-20752211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'technical ice axe mountaineering',
    name: {
      tr: 'Kazma',
      en: 'Ice Axe',
      fr: 'Piolet',
      es: 'Piolet',
    },
    description: {
      tr: 'Kazma ve buz tırmanışı için teknik ice axe',
      en: 'Technical ice axe for snow and ice climbing',
      fr: 'Piolet technique pour l\'alpinisme sur glace',
      es: 'Piolet técnico para alpinismo en hielo',
    },
  },
  {
    id: 'mtn-crampons',
    group: 'technical',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/26769831/pexels-photo-26769831.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'steel crampons mountaineering',
    name: {
      tr: 'Krampon',
      en: 'Crampons',
      fr: 'Crampons',
      es: 'Crampones',
    },
    description: {
      tr: 'Buz ve kar için çelik krampon',
      en: 'Steel crampons for ice and snow',
      fr: 'Crampons en acier pour glace et neige',
      es: 'Crampones de acero para hielo y nieve',
    },
  },
  {
    id: 'mtn-climbing-helmet',
    group: 'technical',
    icon: HardHat,
    image:
      'https://images.pexels.com/photos/34087791/pexels-photo-34087791.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'climbing helmet certified',
    name: {
      tr: 'Tırmanış Kaskı',
      en: 'Climbing Helmet',
      fr: 'Casque d\'Escalade',
      es: 'Casco de Escalada',
    },
    description: {
      tr: 'Düşme ve taş koruması için sertifikalı kask',
      en: 'Certified helmet for fall and rock protection',
      fr: 'Casque certifié contre chutes et chutes de pierres',
      es: 'Casco certificado contra caídas y desprendimientos',
    },
  },
  {
    id: 'mtn-harness',
    group: 'technical',
    icon: Anchor,
    image:
      'https://images.pexels.com/photos/8728539/pexels-photo-8728539.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'climbing harness adjustable',
    name: {
      tr: 'Emniyet Kemeri',
      en: 'Climbing Harness',
      fr: 'Harnais d\'Escalade',
      es: 'Arnés de Escalada',
    },
    description: {
      tr: 'Rahat, ayarlanabilir tırmanış emniyet kemeri',
      en: 'Comfortable, adjustable climbing harness',
      fr: 'Harnais d\'escalade confortable et réglable',
      es: 'Arnés de escalada cómodo y ajustable',
    },
  },
  {
    id: 'mtn-carabiner-prusik',
    group: 'technical',
    icon: Anchor,
    image:
      'https://images.pexels.com/photos/8728550/pexels-photo-8728550.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'HMS carabiner prusik cord climbing set',
    name: {
      tr: 'HMS Karabina ve Prusik',
      en: 'HMS Carabiner & Prusik',
      fr: 'Mousqueton HMS et Prusik',
      es: 'Mosquetón HMS y Prusik',
    },
    description: {
      tr: 'HMS karabina + prusik ipleri, emniyet seti',
      en: 'HMS carabiner + prusik cords, belay set',
      fr: 'Mousqueton HMS + cordes prusik, kit d\'assurage',
      es: 'Mosquetón HMS + cuerdas prusik, kit de aseguramiento',
    },
  },
  {
    id: 'mtn-mountaineering-boots',
    group: 'technical',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/11440320/pexels-photo-11440320.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'insulated mountaineering boots crampon compatible',
    name: {
      tr: 'Dağcılık Botu',
      en: 'Mountaineering Boots',
      fr: 'Bottes d\'Alpinisme',
      es: 'Botas de Alpinismo',
    },
    description: {
      tr: 'Krampon uyumlu, yalıtımlı dağcılık botu',
      en: 'Crampon-compatible, insulated mountaineering boots',
      fr: 'Bottes d\'alpinisme isolées, compatibles crampons',
      es: 'Botas de alpinismo aisladas, compatibles con crampones',
    },
  },
  {
    id: 'mtn-climbing-rope',
    group: 'technical',
    icon: Anchor,
    image:
      'https://images.pexels.com/photos/11372640/pexels-photo-11372640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'dynamic climbing rope 60m',
    name: {
      tr: 'Tırmanış İpi (60m)',
      en: 'Climbing Rope (60m)',
      fr: 'Corde d\'Escalade (60m)',
      es: 'Cuerda de Escalada (60m)',
    },
    description: {
      tr: 'Dinamik, tekil 60m tırmanış ipi',
      en: 'Dynamic, single 60m climbing rope',
      fr: 'Corde dynamique simple de 60m',
      es: 'Cuerda dinámica simple de 60m',
    },
  },
  {
    id: 'mtn-hardshell-jacket',
    group: 'clothing',
    icon: CloudRain,
    image:
      'https://images.pexels.com/photos/28194266/pexels-photo-28194266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'hardshell jacket waterproof windproof',
    name: {
      tr: 'Hardshell Ceket',
      en: 'Hardshell Jacket',
      fr: 'Veste Hardshell',
      es: 'Chaqueta Hardshell',
    },
    description: {
      tr: 'Rüzgar/su geçirmez, dayanıklı hardshell ceket',
      en: 'Windproof/waterproof, durable hardshell jacket',
      fr: 'Veste hardshell coupe-vent et imperméable',
      es: 'Chaqueta hardshell cortaviento e impermeable',
    },
  },
  {
    id: 'mtn-hardshell-pants',
    group: 'clothing',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/31348069/pexels-photo-31348069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'hardshell pants waterproof mountaineering',
    name: {
      tr: 'Hardshell Pantolon',
      en: 'Hardshell Pants',
      fr: 'Pantalon Hardshell',
      es: 'Pantalón Hardshell',
    },
    description: {
      tr: 'Rüzgar/su geçirmez hardshell pantolon',
      en: 'Windproof/waterproof hardshell pants',
      fr: 'Pantalon hardshell coupe-vent et imperméable',
      es: 'Pantalón hardshell cortaviento e impermeable',
    },
  },
  {
    id: 'mtn-expedition-parka',
    group: 'clothing',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/8830576/pexels-photo-8830576.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'expedition down parka extreme cold',
    name: {
      tr: 'Ekspedisyon Parka',
      en: 'Expedition Parka',
      fr: 'Parka d\'Expédition',
      es: 'Parka de Expedición',
    },
    description: {
      tr: 'Ağır şartlar için ekspedisyon sınıfı parka',
      en: 'Expedition-grade parka for extreme conditions',
      fr: 'Parka d\'expédition pour conditions extrêmes',
      es: 'Parka de expedición para condiciones extremas',
    },
  },
  {
    id: 'mtn-glacier-glasses',
    group: 'clothing',
    icon: Glasses,
    image:
      'https://images.pexels.com/photos/36498521/pexels-photo-36498521.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'category 4 glacier sunglasses',
    name: {
      tr: 'Buzul Gözlüğü (Kategori 4)',
      en: 'Glacier Glasses (Category 4)',
      fr: 'Lunettes Glaciaires (Catégorie 4)',
      es: 'Gafas de Glaciar (Categoría 4)',
    },
    description: {
      tr: 'Kar körlüğüne karşı kategori 4 buzul gözlüğü',
      en: 'Category 4 glacier glasses against snow blindness',
      fr: 'Lunettes glaciaires catégorie 4 contre la cécité des neiges',
      es: 'Gafas de glaciar categoría 4 contra la ceguera de la nieve',
    },
  },
  {
    id: 'mtn-gaiters',
    group: 'clothing',
    icon: Footprints,
    image:
      'https://images.pexels.com/photos/31348061/pexels-photo-31348061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'gaiters snow mountaineering',
    name: {
      tr: 'Tozluk',
      en: 'Gaiters',
      fr: 'Guêtres',
      es: 'Polainas',
    },
    description: {
      tr: 'Kar ve taş girişini engelleyen tozluk',
      en: 'Gaiters preventing snow and debris entry',
      fr: 'Guêtres empêchant l\'entrée de neige et de débris',
      es: 'Polainas que evitan la entrada de nieve y escombros',
    },
  },
  {
    id: 'mtn-insulated-gloves',
    group: 'clothing',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/28194266/pexels-photo-28194266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'insulated mountaineering gloves waterproof',
    name: {
      tr: 'Yalıtımlı Eldiven',
      en: 'Insulated Gloves',
      fr: 'Gants Isolés',
      es: 'Guantes Aislados',
    },
    description: {
      tr: 'Su geçirmez, yüksek yalıtımlı dağcılık eldiveni',
      en: 'Waterproof, high-insulation mountaineering gloves',
      fr: 'Gants d\'alpinisme imperméables et très isolés',
      es: 'Guantes de alpinismo impermeables y muy aislados',
    },
  },
  {
    id: 'mtn-balaclava',
    group: 'clothing',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/28194266/pexels-photo-28194266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'fleece balaclava wind protection cold',
    name: {
      tr: 'Balaclava / Yüz Maskesi',
      en: 'Balaclava / Face Mask',
      fr: 'Balaclava / Masque',
      es: 'Balaclava / Pasamontañas',
    },
    description: {
      tr: 'Yüzü rüzgardan ve soğuktan koruyan balaclava',
      en: 'Balaclava protecting face from wind and cold',
      fr: 'Balaclava protégeant le visage du vent et du froid',
      es: 'Balaclava que protege la cara del viento y el frío',
    },
  },
  {
    id: 'mtn-solar-panel',
    group: 'electronics',
    icon: Sun,
    image:
      'https://images.pexels.com/photos/30765899/pexels-photo-30765899.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold'],
    searchName: 'foldable portable solar panel camping',
    name: {
      tr: 'Taşınabilir Güneş Paneli',
      en: 'Portable Solar Panel',
      fr: 'Panneau Solaire Portatif',
      es: 'Panel Solar Portátil',
    },
    description: {
      tr: 'Katlanır, hafif taşınabilir güneş enerjisi paneli',
      en: 'Foldable, lightweight portable solar panel',
      fr: 'Panneau solaire portatif pliable, léger',
      es: 'Panel solar portátil plegable, ligero',
    },
  },
  {
    id: 'mtn-action-camera',
    group: 'electronics',
    icon: Camera,
    image:
      'https://images.pexels.com/photos/5531437/pexels-photo-5531437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'action camera 4K chest mount harness',
    name: {
      tr: 'Aksiyon Kamera + Göğüs Askısı',
      en: 'Action Camera + Chest Mount',
      fr: 'Caméra Sport + Harnais',
      es: 'Cámara de Acción + Arnés',
    },
    description: {
      tr: '4K kamera ve göğüs askısı ile eller serbest çekim',
      en: '4K camera with chest mount for hands-free filming',
      fr: 'Caméra 4K avec harnais torse, filming mains libres',
      es: 'Cámara 4K con arnés de pecho, grabación manos libres',
    },
  },
  {
    id: 'mtn-gps-watch',
    group: 'electronics',
    icon: Watch,
    image:
      'https://images.pexels.com/photos/10807595/pexels-photo-10807595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'GPS watch altimeter barometer outdoor',
    name: {
      tr: 'GPS Saat',
      en: 'GPS Watch',
      fr: 'Montre GPS',
      es: 'Reloj GPS',
    },
    description: {
      tr: 'Yüksek irtifa GPS, barometre ve navigasyon saati',
      en: 'High-altitude GPS, barometer and navigation watch',
      fr: 'Montre GPS haute altitude, baromètre et navigation',
      es: 'Reloj GPS de alta altitud, barómetro y navegación',
    },
  },
  {
    id: 'mtn-headlamp',
    group: 'electronics',
    icon: Flashlight,
    image:
      'https://images.pexels.com/photos/15977285/pexels-photo-15977285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: '1000 lumen cold resistant headlamp',
    name: {
      tr: 'Kafa Lambası',
      en: 'Headlamp',
      fr: 'Lampe Frontale',
      es: 'Lámpara Frontal',
    },
    description: {
      tr: '1000 lümen, soğuğa dayanıklı, uzun ömürlü baş lambası',
      en: '1000 lumen, cold-resistant, long-life headlamp',
      fr: 'Lampe frontale 1000 lumens, résistante au froid',
      es: 'Lámpara frontal 1000 lúmenes, resistente al frío',
    },
  },
  {
    id: 'mtn-powerbank',
    group: 'electronics',
    icon: BatteryCharging,
    image:
      'https://images.pexels.com/photos/4387779/pexels-photo-4387779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold'],
    searchName: '20000mAh cold resistant powerbank',
    name: {
      tr: 'Powerbank (20000mAh)',
      en: 'Power Bank (20000mAh)',
      fr: 'Batterie Externe (20000mAh)',
      es: 'Batería Externa (20000mAh)',
    },
    description: {
      tr: 'Soğuğa dayanıklı, yüksek kapasiteli powerbank',
      en: 'Cold-resistant, high-capacity power bank',
      fr: 'Batterie exterante résistante au froid, haute capacité',
      es: 'Batería externa resistente al frío, alta capacidad',
    },
  },
  {
    id: 'mtn-thermos',
    group: 'nutrition',
    icon: Droplets,
    image:
      'https://images.pexels.com/photos/12115339/pexels-photo-12115339.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold'],
    searchName: 'vacuum insulated thermos 1L steel',
    name: {
      tr: 'Termos',
      en: 'Thermos',
      fr: 'Thermos',
      es: 'Termo',
    },
    description: {
      tr: 'Sıcak içecek için çelik vakumlu termos',
      en: 'Steel vacuum thermos for hot drinks',
      fr: 'Thermos en acier sous vide pour boissons chaudes',
      es: 'Termo de acero al vacío para bebidas calientes',
    },
  },
  {
    id: 'mtn-dehydrated-food',
    group: 'nutrition',
    icon: Utensils,
    image:
      'https://images.pexels.com/photos/6831220/pexels-photo-6831220.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'freeze dried meal camping',
    name: {
      tr: 'Dehidre Yemekler',
      en: 'Dehydrated Meals',
      fr: 'Repas Déshydratés',
      es: 'Comidas Deshidratadas',
    },
    description: {
      tr: 'Sıcak suyla hazırlanan dehidre kamp yemekleri',
      en: 'Dehydrated camp meals prepared with hot water',
      fr: 'Repas de camp déshydratés, préparation à l\'eau chaude',
      es: 'Comidas de campamento deshidratadas, preparación con agua caliente',
    },
  },
  {
    id: 'mtn-energy-gels',
    group: 'nutrition',
    icon: BatteryCharging,
    image:
      'https://images.pexels.com/photos/13111782/pexels-photo-13111782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'hot', 'mild'],
    searchName: 'energy gel high calorie bar',
    name: {
      tr: 'Yüksek Kalorili Jeller',
      en: 'High-Calorie Energy Gels',
      fr: 'Gels Énergétiques Haute Calorie',
      es: 'Geles Energéticas Alta Caloría',
    },
    description: {
      tr: 'Hızlı enerji için yüksek kalorili jel ve barlar',
      en: 'High-calorie gels and bars for quick energy',
      fr: 'Gels et barres haute calorie pour énergie rapide',
      es: 'Geles y barras alta caloría para energía rápida',
    },
  },
  {
    id: 'mtn-bivy',
    group: 'nutrition',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/2412023/pexels-photo-2412023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind'],
    searchName: 'emergency bivy shelter reflective',
    name: {
      tr: 'Acil Durum Bivy',
      en: 'Emergency Bivy',
      fr: 'Bivy d\'Urgence',
      es: 'Bivy de Emergencia',
    },
    description: {
      tr: 'Acil durum için hafif, yansıtıcı bivy çadır',
      en: 'Lightweight, reflective emergency bivy shelter',
      fr: 'Bivy d\'urgence léger et réfléchissant',
      es: 'Bivy de emergencia ligero y reflectante',
    },
  },
  {
    id: 'mtn-first-aid',
    group: 'safety',
    icon: HeartPulse,
    image:
      'https://images.pexels.com/photos/5673523/pexels-photo-5673523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind', 'rain', 'hot', 'mild'],
    searchName: 'mountaineering first aid kit comprehensive',
    name: {
      tr: 'Dağcılık İlk Yardım Kiti',
      en: 'Mountaineering First Aid Kit',
      fr: 'Trousse de Secours Alpinisme',
      es: 'Botiquín de Montañismo',
    },
    description: {
      tr: 'Dağcılık için kapsamlı ilk yardım çantası',
      en: 'Comprehensive first aid kit for mountaineering',
      fr: 'Trousse de secours complète pour l\'alpinisme',
      es: 'Botiquín completo para montañismo',
    },
  },
  {
    id: 'mtn-compass-gps',
    group: 'safety',
    icon: Compass,
    image:
      'https://images.pexels.com/photos/4992707/pexels-photo-4992707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: true,
    conditions: ['high-altitude', 'cold', 'wind', 'rain', 'mild'],
    searchName: 'handheld GPS device compass mountain',
    name: {
      tr: 'Pusula & El GPS',
      en: 'Compass & Handheld GPS',
      fr: 'Boussole & GPS Portatif',
      es: 'Brújula & GPS Portátil',
    },
    description: {
      tr: 'Yedek pusula ve el GPS cihazı',
      en: 'Backup compass and handheld GPS device',
      fr: 'Boussole de secours et GPS portatif',
      es: 'Brújula de respaldo y GPS portátil',
    },
  },
  {
    id: 'mtn-whistle',
    group: 'safety',
    icon: Shield,
    image:
      'https://images.pexels.com/photos/4992707/pexels-photo-4992707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    essential: false,
    conditions: ['high-altitude', 'cold', 'wind', 'rain', 'hot', 'mild'],
    searchName: 'emergency whistle signaling outdoor',
    name: {
      tr: 'Acil Durum Düdüğü',
      en: 'Emergency Whistle',
      fr: 'Sifflet d\'Urgence',
      es: 'Silbato de Emergencia',
    },
    description: {
      tr: 'Sinyal verme ve yardım çağırma için düdük',
      en: 'Whistle for signaling and calling for help',
      fr: 'Sifflet pour signaler et appeler à l\'aide',
      es: 'Silbato para señalizar y pedir ayuda',
    },
  },
];

export const EQUIPMENT_BY_CATEGORY: Record<Category, EquipmentItem[]> = {
  camping: CAMPING_ITEMS,
  mountaineering: MOUNTAINEERING_ITEMS,
};

export function getEquipmentForCategory(category: Category): EquipmentItem[] {
  return EQUIPMENT_BY_CATEGORY[category];
}

export function buildAffiliateLink(
  searchName: string,
  platform: 'hepsiburada' | 'amazon'
): string {
  const tag = 'my-affiliate-id';
  if (platform === 'hepsiburada') {
    return `https://www.hepsiburada.com/ara?q=${encodeURIComponent(searchName)}&tag=${tag}`;
  }
  return `https://www.amazon.com.tr/s?k=${encodeURIComponent(searchName)}&tag=${tag}`;
}
