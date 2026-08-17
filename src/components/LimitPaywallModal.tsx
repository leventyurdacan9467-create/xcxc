// src/components/LimitPaywallModal.tsx
import React, { useState } from 'react';
import { Video, Lock, Sparkles, X } from 'lucide-react';
import { showRewardedAd } from '../utils/admob';
import { purchaseAnnualPlan } from '../utils/revenuecat';

interface Props {
  isOpen: boolean;
  maxAllowed: number;
  onClose: () => void;
  onAdWatched: () => void;
}

export const LimitPaywallModal: React.FC<Props> = ({
  isOpen,
  maxAllowed,
  onClose,
  onAdWatched,
}) => {
  const [loadingAd, setLoadingAd] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);

  if (!isOpen) return null;

  // 1. Reklam İzleme Fonksiyonu
  const handleWatchAd = async () => {
    setLoadingAd(true);
    const success = await showRewardedAd();
    setLoadingAd(false);
    if (success) {
      onAdWatched();
      onClose();
    }
  };

  // 2. Google Play Satın Alma Fonksiyonu (Resmi Ödeme Penceresini Açar)
  const handlePurchase = async () => {
    setLoadingPay(true);
    const success = await purchaseAnnualPlan();
    setLoadingPay(false);
    
    if (success) {
      alert('Tebrikler! Sınırsız Ekspedisyon paketiniz aktif edildi.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl w-fit mx-auto">
          <Lock size={28} />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Ekspedisyon Limiti Doldu</h3>
          <p className="text-xs text-slate-400 leading-relaxed px-2">
            Ücretsiz sürümde aynı anda en fazla <span className="text-amber-400 font-semibold">{maxAllowed}</span> aktif ekspedisyon saklayabilirsiniz.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {/* Reklam İzle Butonu */}
          <button
            onClick={handleWatchAd}
            disabled={loadingAd}
            className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-750 active:scale-[0.98] text-emerald-400 font-bold rounded-2xl text-sm border border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <Video size={18} />
            {loadingAd ? 'Reklam Yükleniyor...' : '1 Reklam İzle (+1 Hak Kazan)'}
          </button>

          {/* Google Play Ödemesini Tetikleyen Buton */}
          <button
            onClick={handlePurchase}
            disabled={loadingPay}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 active:scale-[0.98] text-slate-950 font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Sparkles size={18} className="fill-slate-950" />
            {loadingPay ? 'Google Play Açılıyor...' : "Yıllık ₺50'ye Sınırsız Ekspedisyon"}
          </button>
        </div>

        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-400 underline pt-1">
          Vazgeç
        </button>
      </div>
    </div>
  );
};
