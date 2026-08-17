import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import type { Category } from '@/types';
import { useLang } from '@/i18n';
import { generateEquipment } from '../utils/expeditionLogic';

interface BagScreenProps {
  category: Category;
  date?: string;
  statuses: Record<string, string>;
  onClose: () => void;
  onToggleStatus: (id: string, status: any) => void;
  onItemClick: (id: string) => void;
}

export function BagScreen({
  category,
  date = '',
  statuses = {},
  onClose,
  onToggleStatus,
  onItemClick,
}: BagScreenProps) {
  const { lang } = useLang();
  const currentLang = lang || 'tr';

  let tripDays = 1;
  try {
    if (date && date.includes(' - ')) {
      const parts = date.split(' - ');
      const start = new Date(parts[0]);
      const end = new Date(parts[1]);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
  } catch (e) {
    tripDays = 1;
  }

  const isSummit = category === 'mountaineering';

  let dynamicGroups: Record<string, { id: string; name: string; note?: string }[]> = {};
  try {
    dynamicGroups = generateEquipment({ days: tripDays, isSummit }, currentLang as any) || {};
  } catch (e) {
    dynamicGroups = {};
  }

  const allItems = Object.entries(dynamicGroups).flatMap(([group, items]) => 
    (items || []).map(item => ({ ...item, group }))
  );

  const safeStatuses = statuses || {};
  const readyItems = allItems.filter(item => safeStatuses[item.id] === 'ready');
  const missingItems = allItems.filter(item => safeStatuses[item.id] !== 'ready');
  const totalWeightGrams = readyItems.reduce((sum, item) => sum + (item.weightGrams || 0), 0);
  const totalWeightKg = (totalWeightGrams / 1000).toFixed(1);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col bg-forest-950 text-white"
    >
      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-forest-950/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/20 text-ember-500">
            <ShoppingBag className="h-5 w-5" />
          </div>
         <div>
            <h2 className="text-lg font-bold">{currentLang === 'tr' ? 'Çantan' : 'Your Bag'}</h2>
            <p className="text-xs text-rock-400">
              {readyItems.length} {currentLang === 'tr' ? 'hazır' : 'ready'} · {missingItems.length} {currentLang === 'tr' ? 'eksik' : 'missing'}
              {readyItems.length > 0 && ` · ~${totalWeightKg} kg`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl glass-dark text-rock-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-20">
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-success-500">
              <CheckCircle2 className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {currentLang === 'tr' ? 'Hazır Olanlar' : 'Ready'}
              </h3>
            </div>
            <span className="text-xs font-bold bg-success-500/20 text-success-400 px-2 py-1 rounded-full">
              {readyItems.length}
            </span>
          </div>
          
          {readyItems.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-center">
              <p className="text-sm text-rock-500">
                {currentLang === 'tr' ? 'Henüz hiçbir ekipman hazır değil.' : 'No items ready yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {readyItems.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center p-3 rounded-xl bg-success-500/10 border border-success-500/20"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => onToggleStatus(item.id, 'pending')}>
                    <p className="text-[10px] text-success-400/80 mb-0.5 uppercase tracking-wider">{item.group}</p>
                    <p className="text-sm font-medium text-success-400 line-through">{item.name}</p>
                  </div>
                  <button onClick={() => onItemClick(item.id)} className="p-2 text-success-400 hover:text-success-300 ml-2">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-ember-500">
              <AlertCircle className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {currentLang === 'tr' ? 'Eksikler' : 'Missing'}
              </h3>
            </div>
            <span className="text-xs font-bold bg-ember-500/20 text-ember-400 px-2 py-1 rounded-full">
              {missingItems.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {missingItems.map(item => (
              <div 
                key={item.id} 
                className="flex items-center p-3 rounded-xl bg-forest-900/30 border border-white/5 hover:bg-forest-900/50"
              >
                <div className="flex-1 cursor-pointer" onClick={() => onToggleStatus(item.id, 'ready')}>
                  <p className="text-[10px] text-rock-500 mb-0.5 uppercase tracking-wider">{item.group}</p>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  {item.note && <p className="text-[10px] text-ember-400/80 mt-1">{item.note}</p>}
                </div>
                <button onClick={() => onItemClick(item.id)} className="p-2 text-rock-400 hover:text-white ml-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-rock-500">
                    {currentLang === 'tr' ? 'Detay' : 'Detail'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
