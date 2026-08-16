import { motion } from 'framer-motion';
import { ArrowLeft, Thermometer, Wind, Eye, Droplets, CheckCircle2, Circle } from 'lucide-react';
import type { Category, WeatherAnalysis } from '@/types';
import { CATEGORY_META } from '@/data';
import { useLang } from '@/i18n';
import { FloatingBagButton } from './FloatingBagButton';
import { generateEquipment, Language } from '../utils/expeditionLogic';

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
  const currentLang = (lang as Language) || 'tr';

  const categoryLabels: Record<Category, string> = {
    mountaineering: t.mountaineering,
    camping: t.camping,
  };

  // Güvenli gün hesaplaması
  let tripDays = 1;
  try {
    if (date && date.includes(' - ')) {
      const [startStr, endStr] = date.split(' - ');
      const start = new Date(startStr);
      const end = new Date(endStr);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
  } catch (e) {
    tripDays = 1;
  }

  const isSummit = category === 'mountaineering';
  
  // Güvenli motor çağrısı
  let dynamicGroups: Record<string, { id: string; name: string; note?: string }[]> = {};
  try {
    dynamicGroups = generateEquipment({ days: tripDays, isSummit }, currentLang) || {};
  } catch (e) {
    dynamicGroups = {};
  }

  const allDynamicItems = Object.values(dynamicGroups).flat();
  const safeStatuses = statuses || {};
  const readyCount = allDynamicItems.filter((i) => safeStatuses[i.id] === 'ready').length;

  return (
    <motion.div
      key="equipment"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-28 text-white"
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
              {categoryLabels[category]} · {tripDays} {currentLang === 'tr' ? 'Gün' : 'Days'}
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

          {analysis.currentWeather && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex flex-col items-center rounded-lg bg-forest-900/50 p-2.5">
                <Thermometer className="h-4 w-4 text-ember-400 mb-1" />
                <span className="text-base font-bold text-white">
                  {analysis.currentWeather.temperature.toFixed(1)}°C
                </span>
                <span className="text-[10px] text-rock-400">
                  {currentLang === 'tr' ? 'Sıcaklık' : 'Temp'}
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
                <div key={i} className="flex items-start gap-2 rounded-lg bg-forest-900/50 p-2">
                  <DetailIcon className="h-3.5 w-3.5 text-rock-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rock-300 leading-snug">{detail}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-rock-400">{t.prepStatus}</span>
          <span className="text-xs font-bold text-white">
            {readyCount}/{allDynamicItems.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-forest-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-ember-500 to-success-500"
            animate={{ width: `${allDynamicItems.length > 0 ? (readyCount / allDynamicItems.length) * 100 : 0}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* AKILLI EKİPMAN LİSTESİ */}
      <div className="mt-8 space-y-6">
        {Object.entries(dynamicGroups).map(([groupName, groupItems]) => (
          <div key={groupName}>
            <div className="px-5 mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {groupName} <span className="text-xs text-rock-500 ml-1">({groupItems.length})</span>
              </h2>
            </div>
            
            <div className="px-5 space-y-2 pb-2">
              {groupItems.map((item) => {
                const isReady = safeStatuses[item.id] === 'ready';
                return (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => onSingleClick(item.id)}
                    onDoubleClick={() => onDoubleClick(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isReady 
                        ? 'bg-success-500/10 border-success-500/30' 
                        : 'bg-forest-900/30 border-white/5 hover:bg-forest-900/50'
                    }`}
                  >
                    <div className="flex flex-col pr-4">
                      <span className={`text-sm font-medium ${isReady ? 'text-success-400 line-through opacity-70' : 'text-rock-200'}`}>
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-[10px] text-ember-400/80 mt-1 leading-snug">{item.note}</span>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isReady ? (
                        <CheckCircle2 className="h-5 w-5 text-success-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-rock-500" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Çanta Butonu */}
      <FloatingBagButton count={readyCount} onClick={onOpenBag} />
    </motion.div>
  );
}
