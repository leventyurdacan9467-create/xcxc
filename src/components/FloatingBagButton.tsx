import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useLang } from '@/i18n';

interface FloatingBagButtonProps {
  count: number;
  onClick: () => void;
}

export function FloatingBagButton({ count, onClick }: FloatingBagButtonProps) {
  const { t } = useLang();

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center gap-3 rounded-full bg-ember-500 px-6 py-4 shadow-2xl shadow-ember-500/30"
      >
        <ShoppingBag className="h-6 w-6 text-white" />
        <span className="text-white font-semibold">{t.yourBag}</span>

        <AnimatePresence>
          {count > 0 && (
            <motion.div
              key={count}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute -top-2 -right-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-success-500 text-white text-xs font-bold border-2 border-forest-950 px-1.5"
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
