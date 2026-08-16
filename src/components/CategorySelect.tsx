import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/types';
import { CATEGORY_META } from '@/data';
import { useLang } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface CategorySelectProps {
  onSelect: (category: Category) => void;
  onDevTap: () => void;
}

export function CategorySelect({ onSelect, onDevTap }: CategorySelectProps) {
  const { t } = useLang();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = Object.entries(CATEGORY_META) as Array<
    [Category, (typeof CATEGORY_META)[Category]]
  >;

  const categoryLabels: Record<Category, string> = {
    mountaineering: t.mountaineering,
    camping: t.camping,
  };

  const categoryTaglines: Record<Category, string> = {
    mountaineering: t.mtnTagline,
    camping: t.campTagline,
  };

  const handleTitleTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 800);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      onDevTap();
    }
  };

  return (
    <motion.div
      key="category"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-between px-6 pt-20 pb-10"
    >
      <div className="absolute top-6 right-5">
        <LanguageSwitcher />
      </div>

      <div className="text-center space-y-3">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ember-500 text-sm font-medium tracking-widest uppercase"
        >
          {t.appTitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleTitleTap}
          className="text-3xl font-bold text-white leading-tight cursor-pointer select-none"
        >
          {t.categoryQuestion}
          <br />
          <span className="text-gradient-ember">{t.categoryQuestionAccent}</span>
        </motion.h1>
      </div>

      <div className="space-y-4 py-10">
        {categories.map(([key, meta], index) => {
          const Icon = meta.icon;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 100 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(key)}
              className="group relative w-full overflow-hidden rounded-3xl text-left"
            >
              <div className="absolute inset-0">
                <img
                  src={meta.image}
                  alt={categoryLabels[key]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/20" />
              </div>

              <div className="relative flex items-center justify-between p-6 min-h-[140px]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ember-500/20 backdrop-blur-sm border border-ember-500/30">
                    <Icon className="h-7 w-7 text-ember-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{categoryLabels[key]}</h2>
                    <p className="text-sm text-rock-300">{categoryTaglines[key]}</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-white/50 group-hover:text-ember-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-rock-400">{t.footer}</p>
      </div>
    </motion.div>
  );
}
