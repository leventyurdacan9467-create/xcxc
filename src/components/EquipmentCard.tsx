import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';
import type { EquipmentItem, ItemStatus } from '@/types';
import { useLang } from '@/i18n';

interface EquipmentCardProps {
  item: EquipmentItem;
  status: ItemStatus;
  onSingleClick: () => void;
  onDoubleClick: () => void;
}

const GROUP_LABELS: Record<string, Record<string, string>> = {
  shelter: { tr: 'Barınak', en: 'Shelter', fr: 'Abri', es: 'Refugio' },
  clothing: { tr: 'Giyim', en: 'Clothing', fr: 'Vêtements', es: 'Ropa' },
  kitchen: { tr: 'Mutfak', en: 'Kitchen', fr: 'Cuisine', es: 'Cocina' },
  other: { tr: 'Diğer', en: 'Other', fr: 'Autre', es: 'Otros' },
  'shelter_pack': { tr: 'Barınma & Taşıma', en: 'Shelter & Pack', fr: 'Abri & Transport', es: 'Refugio y Transporte' },
  technical: { tr: 'Teknik', en: 'Technical', fr: 'Technique', es: 'Técnico' },
  electronics: { tr: 'Elektronik', en: 'Electronics', fr: 'Électronique', es: 'Electrónica' },
  nutrition: { tr: 'Beslenme', en: 'Nutrition', fr: 'Nutrition', es: 'Nutrición' },
  safety: { tr: 'Güvenlik', en: 'Safety', fr: 'Sécurité', es: 'Seguridad' },
};

export function EquipmentCard({
  item,
  status,
  onSingleClick,
  onDoubleClick,
}: EquipmentCardProps) {
  const { t, lang } = useLang();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onDoubleClick();
      return;
    }
    clickTimer.current = setTimeout(() => {
      onSingleClick();
      clickTimer.current = null;
    }, 250);
  };

  const Icon = item.icon;
  const isReady = status === 'ready';
  const isMissing = status === 'missing';
  const groupLabel = GROUP_LABELS[item.group]?.[lang] || item.group;

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative shrink-0 w-44 h-64 rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-300 ${
        isReady
          ? 'ring-2 ring-success-500'
          : isMissing
            ? 'ring-2 ring-ember-500/60'
            : 'ring-1 ring-forest-700'
      }`}
    >
      <img
        src={item.image}
        alt={item.name[lang]}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />

      {/* Status badge */}
      <motion.div
        initial={false}
        animate={{ scale: isReady || isMissing ? 1 : 0 }}
        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full ${
          isReady ? 'bg-success-500' : 'bg-ember-500'
        }`}
      >
        {isReady ? (
          <Check className="h-5 w-5 text-white" strokeWidth={3} />
        ) : (
          <ShoppingBag className="h-4 w-4 text-white" />
        )}
      </motion.div>

      {item.essential && !isReady && !isMissing && (
        <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-ember-500/90 text-white">
          {t.essential}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-ember-400 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-rock-300 font-medium">
            {groupLabel}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white leading-tight mb-1">
          {item.name[lang]}
        </h3>
        <p className="text-[11px] text-rock-300 leading-snug line-clamp-2">
          {item.description[lang]}
        </p>
      </div>
    </motion.div>
  );
}
