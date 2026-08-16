import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'tr' | 'en' | 'fr' | 'es';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: 'TR' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'es', label: 'Español', flag: 'ES' },
];

export interface Strings {
  appTitle: string;
  appSubtitle: string;
  categoryQuestion: string;
  categoryQuestionAccent: string;
  mountaineering: string;
  camping: string;
  mtnTagline: string;
  campTagline: string;
  step2: string;
  locationQuestion: string;
  locationQuestionAccent: string;
  locationLabel: string;
  locationPlaceholder: string;
  dateLabel: string;
  analysisInfo: string;
  analyzeBtn: string;
  analysisOf: string;
  steps: string[];
  weatherAnalysis: string;
  weatherLabel: string;
  prepStatus: string;
  essential: string;
  yourBag: string;
  bagReady: string;
  bagMissing: string;
  readyCount: string;
  missingCount: string;
  readyItems: string;
  missingItems: string;
  emptyReady: string;
  emptyMissing: string;
  ready: string;
  viewDetails: string;
  undo: string;
  markReady: string;
  obtain: string;
  recommendedGear: string;
  obtainSubtext: string;
  recommendedSubtext: string;
  devModeOn: string;
  devModeOff: string;
  footer: string;
  popularLocations: string[];
}

const TRANSLATIONS: Record<Lang, Strings> = {
  tr: {
    appTitle: 'Ekspedisyon Planlayıcı',
    appSubtitle: 'Hava durumu analizi ve kişiselleştirilmiş ekipman önerileri',
    categoryQuestion: 'Hangi maceraya',
    categoryQuestionAccent: 'atılıyorsun?',
    mountaineering: 'Dağcılık',
    camping: 'Kamp',
    mtnTagline: 'Zirveye tırman, sınırları aş',
    campTagline: 'Doğanın kalbinde huzur',
    step2: 'Adım 2',
    locationQuestion: 'Nereye,',
    locationQuestionAccent: 'ne zaman?',
    locationLabel: 'Lokasyon',
    locationPlaceholder: 'Örn: Aladağlar, Niğde',
    dateLabel: 'Tarih',
    analysisInfo:
      'Seçtiğin lokasyonun Open-Meteo canlı hava durumu verileri analiz edilecek ve ekipman önerilerin buna göre şekillenecek.',
    analyzeBtn: 'Analiz Et',
    analysisOf: 'analizi',
    steps: [
      'Sıcaklık verileri taranıyor',
      'Rüzgar desenleri analiz ediliyor',
      'Yağış verileri inceleniyor',
      'Hava koşulları değerlendiriliyor',
      'Ekipman önerileri hazırlanıyor',
    ],
    weatherAnalysis: 'Hava Durumu Analizi',
    weatherLabel: 'Canlı Veri',
    prepStatus: 'Hazırlık durumu',
    essential: 'Zorunlu',
    yourBag: 'Çantan',
    bagReady: 'Hazır Olanlar',
    bagMissing: 'Eksikler — Satın Alınacak',
    readyCount: 'hazır',
    missingCount: 'eksik',
    readyItems: 'Hazır Olanlar',
    missingItems: 'Eksikler — Satın Alınacak',
    emptyReady: 'Henüz hiçbir ekipman hazır değil. Kartlara tek tıkla işaretle.',
    emptyMissing: 'Eksik ekipman yok. Her şey hazır!',
    ready: 'Hazır',
    viewDetails: 'Detayları gör',
    undo: 'Geri al',
    markReady: 'Hazır olarak işaretle',
    obtain: 'Temin Et',
    recommendedGear: 'Önerilen Ekipmanlar',
    obtainSubtext: 'Güvenilir satıcılardan derlenmiş alternatifleri inceleyin.',
    recommendedSubtext: 'Kullanıcı yorumları ve puanlarıyla en iyi modelleri keşfedin.',
    devModeOn: 'Geliştirici Modu: Mağaza Linkleri Açık',
    devModeOff: 'Geliştirici Modu: Mağaza Linkleri Kapalı',
    footer: 'Hava durumu analizi ve kişiselleştirilmiş ekipman önerileri',
    popularLocations: [
      'Aladağlar, Niğde',
      'Kaçkar Dağları, Rize',
      'Erciyes, Kayseri',
      'Olimpos, Antalya',
      'Uludağ, Bursa',
      'Cilo Dağları, Hakkari',
    ],
  },
  en: {
    appTitle: 'Expedition Planner',
    appSubtitle: 'Weather analysis and personalized gear recommendations',
    categoryQuestion: 'What adventure',
    categoryQuestionAccent: 'are you embarking on?',
    mountaineering: 'Mountaineering',
    camping: 'Camping',
    mtnTagline: 'Climb the summit, push your limits',
    campTagline: 'Peace in the heart of nature',
    step2: 'Step 2',
    locationQuestion: 'Where,',
    locationQuestionAccent: 'when?',
    locationLabel: 'Location',
    locationPlaceholder: 'E.g: Aladağlar, Niğde',
    dateLabel: 'Date',
    analysisInfo:
      'Live Open-Meteo weather data for your selected location will be analyzed, and gear recommendations will be shaped accordingly.',
    analyzeBtn: 'Analyze',
    analysisOf: 'analysis',
    steps: [
      'Scanning temperature data',
      'Analyzing wind patterns',
      'Reviewing precipitation data',
      'Evaluating weather conditions',
      'Preparing gear recommendations',
    ],
    weatherAnalysis: 'Weather Analysis',
    weatherLabel: 'Live Data',
    prepStatus: 'Preparation status',
    essential: 'Essential',
    yourBag: 'Your Bag',
    bagReady: 'Ready Items',
    bagMissing: 'Missing — To Buy',
    readyCount: 'ready',
    missingCount: 'missing',
    readyItems: 'Ready Items',
    missingItems: 'Missing — To Buy',
    emptyReady: 'No gear is ready yet. Tap a card once to mark it.',
    emptyMissing: 'No missing gear. Everything is ready!',
    ready: 'Ready',
    viewDetails: 'View details',
    undo: 'Undo',
    markReady: 'Mark as ready',
    obtain: 'Obtain',
    recommendedGear: 'Recommended Gear',
    obtainSubtext: 'Browse alternatives from trusted sellers.',
    recommendedSubtext: 'Discover the best models with user reviews and ratings.',
    devModeOn: 'Developer Mode: Store Links On',
    devModeOff: 'Developer Mode: Store Links Off',
    footer: 'Weather analysis and personalized gear recommendations',
    popularLocations: [
      'Aladağlar, Niğde',
      'Kaçkar Mountains, Rize',
      'Erciyes, Kayseri',
      'Olympos, Antalya',
      'Uludağ, Bursa',
      'Cilo Mountains, Hakkari',
    ],
  },
  fr: {
    appTitle: 'Planificateur d\'Expédition',
    appSubtitle: 'Analyse météo et recommandations d\'équipement personnalisées',
    categoryQuestion: 'Quelle aventure',
    categoryQuestionAccent: 'vous attend-elle ?',
    mountaineering: 'Alpinisme',
    camping: 'Camping',
    mtnTagline: 'Atteindre le sommet, repousser les limites',
    campTagline: 'La paix au cœur de la nature',
    step2: 'Étape 2',
    locationQuestion: 'Où,',
    locationQuestionAccent: 'quand ?',
    locationLabel: 'Lieu',
    locationPlaceholder: 'Ex: Aladağlar, Niğde',
    dateLabel: 'Date',
    analysisInfo:
      'Les données météo en direct Open-Meteo pour le lieu sélectionné seront analysées, et les recommandations d\'équipement seront adaptées en conséquence.',
    analyzeBtn: 'Analyser',
    analysisOf: 'analyse',
    steps: [
      'Analyse des données de température',
      'Analyse des modèles de vent',
      'Examen des précipitations',
      'Évaluation des conditions météo',
      'Préparation des recommandations d\'équipement',
    ],
    weatherAnalysis: 'Analyse Météo',
    weatherLabel: 'Données en Direct',
    prepStatus: 'Statut de préparation',
    essential: 'Essentiel',
    yourBag: 'Votre Sac',
    bagReady: 'Prêts',
    bagMissing: 'Manquants — À Acheter',
    readyCount: 'prêts',
    missingCount: 'manquants',
    readyItems: 'Prêts',
    missingItems: 'Manquants — À Acheter',
    emptyReady: 'Aucun équipement prêt. Touchez une carte pour la marquer.',
    emptyMissing: 'Aucun équipement manquant. Tout est prêt !',
    ready: 'Prêt',
    viewDetails: 'Voir les détails',
    undo: 'Annuler',
    markReady: 'Marquer comme prêt',
    obtain: 'Se procurer',
    recommendedGear: 'Équipement recommandé',
    obtainSubtext: 'Parcourez les alternatives de vendeurs de confiance.',
    recommendedSubtext: 'Découvrez les meilleurs modèles avec avis et notes.',
    devModeOn: 'Mode Développeur: Liens Boutique Activés',
    devModeOff: 'Mode Développeur: Liens Boutique Désactivés',
    footer: 'Analyse météo et recommandations d\'équipement personnalisées',
    popularLocations: [
      'Aladağlar, Niğde',
      'Monts Kaçkar, Rize',
      'Erciyes, Kayseri',
      'Olympos, Antalya',
      'Uludağ, Bursa',
      'Monts Cilo, Hakkari',
    ],
  },
  es: {
    appTitle: 'Planificador de Expedición',
    appSubtitle: 'Análisis meteorológico y recomendaciones de equipo personalizadas',
    categoryQuestion: 'Qué aventura',
    categoryQuestionAccent: 'te espera?',
    mountaineering: 'Alpinismo',
    camping: 'Camping',
    mtnTagline: 'Alcanza la cima, supera tus límites',
    campTagline: 'Paz en el corazón de la naturaleza',
    step2: 'Paso 2',
    locationQuestion: 'Dónde,',
    locationQuestionAccent: 'cuándo?',
    locationLabel: 'Ubicación',
    locationPlaceholder: 'Ej: Aladağlar, Niğde',
    dateLabel: 'Fecha',
    analysisInfo:
      'Se analizarán los datos meteorológicos en vivo de Open-Meteo para la ubicación seleccionada, y las recomendaciones de equipo se adaptarán en consecuencia.',
    analyzeBtn: 'Analizar',
    analysisOf: 'análisis',
    steps: [
      'Analizando datos de temperatura',
      'Analizando patrones de viento',
      'Revisando datos de precipitación',
      'Evaluando condiciones meteorológicas',
      'Preparando recomendaciones de equipo',
    ],
    weatherAnalysis: 'Análisis Meteorológico',
    weatherLabel: 'Datos en Vivo',
    prepStatus: 'Estado de preparación',
    essential: 'Esencial',
    yourBag: 'Tu Mochila',
    bagReady: 'Listos',
    bagMissing: 'Faltantes — Para Comprar',
    readyCount: 'listos',
    missingCount: 'faltantes',
    readyItems: 'Listos',
    missingItems: 'Faltantes — Para Comprar',
    emptyReady: 'Ningún equipo listo. Toca una tarjeta para marcarla.',
    emptyMissing: 'Ningún equipo faltante. ¡Todo listo!',
    ready: 'Listo',
    viewDetails: 'Ver detalles',
    undo: 'Deshacer',
    markReady: 'Marcar como listo',
    obtain: 'Adquirir',
    recommendedGear: 'Equipo recomendado',
    obtainSubtext: 'Explora alternativas de vendedores de confianza.',
    recommendedSubtext: 'Descubre los mejores modelos con reseñas y calificaciones.',
    devModeOn: 'Modo Desarrollador: Enlaces de Tienda Activados',
    devModeOff: 'Modo Desarrollador: Enlaces de Tienda Desactivados',
    footer: 'Análisis meteorológico y recomendaciones de equipo personalizadas',
    popularLocations: [
      'Aladağlar, Niğde',
      'Montañas Kaçkar, Rize',
      'Erciyes, Kayseri',
      'Olimpos, Antalya',
      'Uludağ, Bursa',
      'Montañas Cilo, Hakkari',
    ],
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('tr');
  const value: LangContextValue = {
    lang,
    setLang,
    t: TRANSLATIONS[lang],
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
