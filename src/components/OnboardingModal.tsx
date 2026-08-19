// src/components/OnboardingModal.tsx

import React, { useState } from 'react';
import { Compass, Backpack, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    icon: Compass,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Rota Hazır, Macera Başlıyor! 🏔️',
    description:
      'Pathly; faaliyet sürene, kış şartlarına ve zirve hedefine göre sana özel akıllı ekipman ve günlük rota planı hazırlar.',
  },
  {
    icon: Backpack,
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Tahmini Çanta & Yük Analizi 🎒',
    description:
      'Listeyi kontrol ettikçe tahmini çanta ağırlığın canlı hesaplanır. Unutma; gramajlar standart ortalamalara dayalı tahmini (estimated) değerlerdir!',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    title: 'Sahada Sıfır Eksik 📋',
    description:
      'Listeni dilediğin gibi özelleştir, çantana attıkça işaretle. Yüksek irtifada sürpriz yaşamamak için tüm kontrol sende!',
  },
];

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const isLastSlide = currentSlide === SLIDES.length - 1;
  const SlideIcon = SLIDES[currentSlide].icon;

  const handleNext = () => {
    if (isLastSlide) {
      onClose();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
        
        {/* Atla Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip and go summit 🏔️
        </button>

        {/* Dinamik İkon */}
        <div className="pt-4">
          <div className={`p-4 border rounded-3xl w-fit mx-auto transition-all duration-300 ${SLIDES[currentSlide].iconColor}`}>
            <SlideIcon size={32} />
          </div>
        </div>

        {/* Metin Alanı */}
        <div className="space-y-2 min-h-[110px] flex flex-col justify-center">
          <h3 className="text-lg font-extrabold text-white">
            {SLIDES[currentSlide].title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed px-1">
            {SLIDES[currentSlide].description}
          </p>
        </div>

        {/* Sayfa Noktaları (Dots) */}
        <div className="flex justify-center gap-1.5">
          {SLIDES.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Aksiyon Butonu */}
        <button
          onClick={handleNext}
          className={`w-full py-3.5 px-4 font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${
            isLastSlide
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
          }`}
        >
          {isLastSlide ? (
            <>
              <Sparkles size={18} className="fill-slate-950" />
              Ready for Adventure!
            </>
          ) : (
            <>
              İlerle
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
Entegrasyon: src/App.tsx İçinde Çağırma
Rehberin sadece ilk açılışta otomatik görünmesi için src/App.tsx içerisine localStorage kontrolüyle ekleyebilirsin:

TypeScript
// src/App.tsx

import React, { useState, useEffect } from 'react';
import { OnboardingModal } from './components/OnboardingModal';

export const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Kullanıcı rehberi daha önce görmediyse göster
    const hasSeen = localStorage.getItem('pathly_has_seen_onboarding');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('pathly_has_seen_onboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Uygulama İçeriği */}

      {/* Onboarding Kartı */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
};
