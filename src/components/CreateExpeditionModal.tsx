// src/components/CreateExpeditionModal.tsx
import React, { useState } from 'react';
import { useExpeditionArchive } from '../hooks/useExpeditionArchive';
import { Video, Lock, Sparkles, Plus } from 'lucide-react';

export const CreateExpeditionModal = () => {
  const isPremium = false;
  const { 
    canCreateNew, 
    saveExpedition, 
    grantBonusSlotByAd,
    currentCount,
    maxAllowed 
  } = useExpeditionArchive(isPremium);

  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleCreate = () => {
    if (!canCreateNew) {
      setShowLimitModal(true);
      return;
    }

    saveExpedition({
      name: `Yeni Ekspedisyon #${currentCount + 1}`,
      days: 3,
      isSummit: false,
      items: [],
    });
  };

  const handleWatchAd = () => {
    // Reklam simülasyonu
    setTimeout(() => {
      grantBonusSlotByAd();
      setShowLimitModal(false);
      alert('Tebrikler! +1 Yeni Ekspedisyon hakkı kazandınız.');
    }, 1000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl text-xs text-slate-300">
        <span>Kayıtlı Ekspedisyonlar: {currentCount} / {maxAllowed === Infinity ? '∞' : maxAllowed}</span>
      </div>

      <button
        onClick={handleCreate}
        className="w-full py-3 bg-emerald-500 font-bold rounded-xl text-slate-950 flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Yeni Ekspedisyon Kaydet
      </button>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full w-fit mx-auto">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Ekspedisyon Limiti Doldu</h3>
            <p className="text-xs text-slate-400">
              Ücretsiz sürümde aynı anda en fazla {maxAllowed} ekspedisyon saklayabilirsiniz.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleWatchAd}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl text-sm border border-emerald-500/30 flex items-center justify-center gap-2"
              >
                <Video size={16} /> 1 Reklam İzle (+1 Hak Kazan)
              </button>

              <button
                onClick={() => alert('Sınırsız paket alma ekranı')}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Sınırsız Arşiv (Add-On Al)
              </button>
            </div>

            <button
              onClick={() => setShowLimitModal(false)}
              className="text-xs text-slate-500 underline"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
