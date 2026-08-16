import { motion } from 'framer-motion';
import { ArrowLeft, Thermometer, Wind, Eye, Droplets, Navigation } from 'lucide-react';
import type { Category, WeatherAnalysis } from '@/types';
import { CATEGORY_META, getEquipmentForCategory } from '@/data';
import { useLang, type Lang } from '@/i18n';
import { getWeatherDescription } from '@/hooks/useOpenMeteo';
import { EquipmentCard } from './EquipmentCard';
import { FloatingBagButton } from './FloatingBagButton';

interface EquipmentScreenProps {
  category: Category;
  location: string;
  date: string;
  analysis: WeatherAnalysis;
  statuses: Record<string, 'pending' | 'ready' | 'missing'>;
  onSingleClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
  onOpenBag: () => void;
  onBack: () => void;
}

const GROUP_LABELS: Record<string, Record<Lang, string>> = {
  shelter: { tr: 'Barınak', en: 'Shelter', fr: 'Abri', es: 'Refugio' },
  clothing: { tr: 'Giyim', en: 'Clothing', fr: 'Vêtements', es: 'Ropa' },
  kitchen: { tr: 'Mutfak', en: 'Kitchen', fr: 'Cuisine', es: 'Cocina' },
  other: { tr: 'Diğer', en: 'Other', fr: 'Autre', es: 'Otros' },
  'shelter_pack': { tr: 'Barınma & Taşıma', en: 'Shelter & Pack', fr: 'Abri & Transport', es: 'Refugio y Transporte' },
  technical: { tr: 'Teknik', en: 'Technical', fr: 'Technique', es: 'Técnico' },
  electronics: { tr: 'Elektronik & Medya', en: 'Electronics & Media', fr: 'Électronique & Médias', es: 'Electrónica y Medios' },
  nutrition: { tr: 'Beslenme', en: 'Nutrition', fr: 'Nutrition', es: 'Nutrición' },
  safety: { tr: 'Güvenlik', en: 'Safety', fr: 'Sécurité', es: 'Seguridad' },
};

export function EquipmentScreen({
  category,
  location,
  date,
  analysis,
  statuses,
  onSingleClick,
  onDoubleClick,
  onOpenBag,
  onBack,
}: EquipmentScreenProps) {
  const { t, lang } = useLang();
  const meta = CATEGORY_META[category];
  const items = getEquipmentForCategory(category);
  const readyCount = items.filter((i) => statuses[i.id] === 'ready').length;

  const categoryLabels: Record<Category, string> = {
    mountaineering: t.mountaineering,
    camping: t.camping,
  };

  const groups = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <motion.div
      key="equipment"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-28"
    >
      {/* Hero header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={meta.image}
          alt={categoryLabels[category]}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/30" />

        <button
          onClick={onBack}
          className="absolute top-6 left-5 flex h-10 w-10 items-center justify-center rounded-xl glass-dark text-white z-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            <meta.icon className="h-4 w-4 text-ember-400" />
            <span className="text-xs uppercase tracking-wider text-rock-200 font-medium">
              {categoryLabels[category]}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{location}</h1>
          <p className="text-sm text-rock-300">{date}</p>
        </div>
      </div>

      {/* Weather analysis card */}
      <div className="px-5 -mt-6 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-dark border border-forest-700 p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <analysis.icon className="h-6 w-6 text-ember-500" />
            <div>
              <p className="text-xs text-rock-400 uppercase tracking-wider">
                {t.weatherAnalysis} · {t.weatherLabel}
              </p>
              <p className="text-sm font-bold text-white">{analysis.summary[lang]}</p>
            </div>
            <span className="ml-auto text-lg font-bold text-ember-400">
              {analysis.temperature}
            </span>
          </div>

          {/* Real-time weather metrics */}
          {analysis.currentWeather && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex flex-col items-center rounded-lg bg-forest-900/50 p-2.5">
                <Thermometer className="h-4 w-4 text-ember-400 mb-1" />
                <span className="text-base font-bold text-white">
                  {analysis.currentWeather.temperature.toFixed(1)}°C
                </span>
                <span className="text-[10px] text-rock-400">
                  {lang === 'tr' ? 'Sıcaklık' : lang === 'en' ? 'Temp' : lang === 'fr' ? 'Temp' : 'Temp'}
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-forest-900/50 p-2.5">
                <Wind className="h-4 w-4 text-ember-400 mb-1" />
                <span className="text-base font-bold text-white">
                  {analysis.currentWeather.windSpeed.toFixed(1)}
                </span>
                <span className="text-[10px] text-rock-400">km/s</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-forest-900/50 p-2.5">
                <Droplets className="h-4 w-4 text-ember-400 mb-1" />
                <span className="text-base font-bold text-white">
                  {analysis.currentWeather.precipitation.toFixed(1)}
                </span>
                <span className="text-[10px] text-rock-400">mm</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {analysis.details[lang].map((detail, i) => {
              const icons = [Thermometer, Wind, Droplets, Eye];
              const DetailIcon = icons[i] || Thermometer;
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-forest-900/50 p-2"
                >
                  <DetailIcon className="h-3.5 w-3.5 text-rock-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rock-300 leading-snug">{detail}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-ember-500/10 border border-ember-500/20 p-2.5">
            <p className="text-[11px] text-ember-300 leading-snug">
              {analysis.recommendation[lang]}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-rock-400">{t.prepStatus}</span>
          <span className="text-xs font-bold text-white">
            {readyCount}/{items.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-forest-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-ember-500 to-success-500"
            animate={{ width: `${(readyCount / items.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Equipment groups */}
      <div className="mt-6 space-y-6">
        {Object.entries(groups).map(([groupName, groupItems]) => {
          const groupLabel = GROUP_LABELS[groupName]?.[lang] || groupName;
          return (
            <div key={groupName}>
              <div className="px-5 mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {groupLabel}
                </h2>
                <span className="text-xs text-rock-500">({groupItems.length})</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
                {groupItems.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    status={statuses[item.id] || 'pending'}
                    onSingleClick={() => onSingleClick(item.id)}
                    onDoubleClick={() => onDoubleClick(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <FloatingBagButton count={readyCount} onClick={onOpenBag} />
    </motion.div>
  );
}
