// src/components/PastExpeditionsModal.tsx
import React from 'react';
import { Compass, Trash2, X, Calendar, MapPin } from 'lucide-react';
import type { Expedition } from '../hooks/useExpeditionArchive';

interface Props {
  isOpen: boolean;
  expeditions: Expedition[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PastExpeditionsModal: React.FC<Props> = ({
  isOpen,
  expeditions,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 text-slate-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="text-emerald-400" size={20} />
            <h3 className="font-bold text-lg text-white">Geçmiş Ekspedisyonlarım</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {expeditions.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">Henüz kaydedilmiş bir ekspedisyonunuz yok.</p>
          ) : (
            expeditions.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-800/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-white flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-400" /> {exp.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar size={12} /> {exp.days} Günlük Plan
                  </p>
                </div>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
