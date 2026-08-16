import { AnimatePresence, motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-2xl glass-dark border border-ember-500/40 px-4 py-3 shadow-2xl shadow-ember-500/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ember-500/20">
              <Terminal className="h-4 w-4 text-ember-400" />
            </div>
            <p className="flex-1 text-sm font-medium text-white">
              {toast.message}
            </p>
            <button
              onClick={onDismiss}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-rock-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
