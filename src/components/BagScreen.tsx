import { motion } from 'framer-motion';
import { ShoppingBag, Check, AlertCircle, X, ChevronRight } from 'lucide-react';
import type { BagItem } from '@/types';
import { useLang, type Lang } from '@/i18n';

interface BagScreenProps {
  items: BagItem[];
  onClose: () => void;
  onToggleReady: (id: string) => void;
  onToggleMissing: (id: string) => void;
  onItemClick: (item: BagItem) => void;
}

const GROUP_LABELS: Record<string, Record<Lang, string>> = {
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

export function BagScreen({
  items,
  onClose,
  onToggleReady,
  onItemClick,
}: BagScreenProps) {
  const { t, lang } = useLang();
  const readyItems = items.filter((i) => i.status === 'ready');
  const missingItems = items.filter((i) => i.status !== 'ready');

  return (
    <motion.div
      key="bag"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col bg-forest-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-forest-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/20">
            <ShoppingBag className="h-5 w-5 text-ember-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.yourBag}</h2>
            <p className="text-xs text-rock-400">
              {readyItems.length} {t.readyCount} · {missingItems.length} {t.missingCount}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800 text-rock-300 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Ready section */}
        <Section
          title={t.readyItems}
          icon={Check}
          iconColor="text-success-400"
          count={readyItems.length}
        >
          {readyItems.length === 0 ? (
            <EmptyState text={t.emptyReady} />
          ) : (
            <div className="space-y-3">
              {readyItems.map((item) => (
                <BagRow
                  key={item.id}
                  item={item}
                  lang={lang}
                  groupLabel={GROUP_LABELS[item.group]?.[lang] || item.group}
                  onToggleReady={() => onToggleReady(item.id)}
                  onItemClick={() => onItemClick(item)}
                  readyLabel={t.ready}
                  undoLabel={t.undo}
                  viewDetailsLabel={t.viewDetails}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Missing section */}
        <Section
          title={t.missingItems}
          icon={AlertCircle}
          iconColor="text-ember-400"
          count={missingItems.length}
        >
          {missingItems.length === 0 ? (
            <EmptyState text={t.emptyMissing} />
          ) : (
            <div className="space-y-3">
              {missingItems.map((item) => (
                <BagRow
                  key={item.id}
                  item={item}
                  lang={lang}
                  groupLabel={GROUP_LABELS[item.group]?.[lang] || item.group}
                  onToggleReady={() => onToggleReady(item.id)}
                  onItemClick={() => onItemClick(item)}
                  readyLabel={t.ready}
                  undoLabel={t.undo}
                  viewDetailsLabel={t.viewDetails}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  icon: Icon,
  iconColor,
  count,
  children,
}: {
  title: string;
  icon: typeof Check;
  iconColor: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-forest-800 text-rock-300">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest-700 p-6 text-center">
      <p className="text-sm text-rock-400">{text}</p>
    </div>
  );
}

function BagRow({
  item,
  lang,
  groupLabel,
  onToggleReady,
  onItemClick,
  readyLabel,
  viewDetailsLabel,
}: {
  item: BagItem;
  lang: Lang;
  groupLabel: string;
  onToggleReady: () => void;
  onItemClick: () => void;
  readyLabel: string;
  undoLabel: string;
  viewDetailsLabel: string;
}) {
  const Icon = item.icon;
  const isReady = item.status === 'ready';

  return (
    <motion.div
      layout
      className="flex gap-3 rounded-2xl bg-forest-900/60 border border-forest-800 p-3"
    >
      <button
        onClick={onItemClick}
        className="flex flex-1 gap-3 text-left min-w-0"
      >
        <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden">
          <img src={item.image} alt={item.name[lang]} className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Icon className="h-3.5 w-3.5 text-ember-400 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider text-rock-400">
              {groupLabel}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white truncate">{item.name[lang]}</h4>

          {isReady ? (
            <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-success-400">
              <Check className="h-3 w-3" />
              {readyLabel}
            </span>
          ) : (
            <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-ember-400">
              {viewDetailsLabel}
              <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </button>

      {!isReady && (
        <button
          onClick={onToggleReady}
          className="self-start flex h-8 w-8 items-center justify-center rounded-lg bg-success-500/20 text-success-400 hover:bg-success-500 hover:text-white transition-colors"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}
