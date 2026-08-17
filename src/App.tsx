import { LimitPaywallModal } from './components/LimitPaywallModal';
import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, Compass } from 'lucide-react';
import type { Category, WeatherAnalysis } from '@/types';
import { CategorySelect } from '@/components/CategorySelect';
import { LocationInput } from '@/components/LocationInput';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { EquipmentScreen } from '@/components/EquipmentScreen';
import { BagScreen } from '@/components/BagScreen';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { Toast, type ToastData } from '@/components/Toast';
import { LimitPaywallModal } from '@/components/LimitPaywallModal';
import { PastExpeditionsModal } from '@/components/PastExpeditionsModal';
import { useExpeditionArchive } from '@/hooks/useExpeditionArchive';
import { initializeAdMob } from '@/utils/admob';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { generateEquipment, Language } from '@/utils/expeditionLogic';
import { useLang } from '@/i18n';

type Stage = 'category' | 'location' | 'analysis' | 'equipment';
type ItemStatus = 'pending' | 'ready' | 'missing';

function App() {
  const { showStoreLinks, toggleShowStoreLinks } = useRemoteConfig();
  const { t, lang } = useLang();
  const currentLang = (lang as Language) || 'tr';

  const {
    expeditions,
    canCreateNew,
    maxAllowed,
    saveExpedition,
    deleteExpedition,
    grantBonusSlotByAd,
  } = useExpeditionArchive(false);

  const [stage, setStage] = useState<Stage>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [analysis, setAnalysis] = useState<WeatherAnalysis | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const [toast, setToast] = useState<ToastData | null>(null);
  const toastId = useRef(0);

  useEffect(() => {
    initializeAdMob();
  }, []);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDevTap = useCallback(() => {
    toggleShowStoreLinks();
    showToast(showStoreLinks ? t.devModeOff : t.devModeOn);
  }, [showStoreLinks, toggleShowStoreLinks, showToast, t.devModeOff, t.devModeOn]);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStage('location');
  };

  const handleLocationComplete = (loc: string, d: string, c?: { lat: number; lng: number }) => {
    // Limit kontrolü yap: Eğer limit dolduysa ilerletme, modal aç!
    if (!canCreateNew) {
      setShowLimitModal(true);
      return;
    }

    setLocation(loc);
    setDate(d);
    setCoords(c);
    setStage('analysis');
  };

  const getTripParams = useCallback(() => {
    let tripDays = 1;
    try {
      if (date && date.includes(' - ')) {
        const [startStr, endStr] = date.split(' - ');
        const start = new Date(startStr);
        const end = new Date(endStr);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      }
    } catch (e) {
      tripDays = 1;
    }
    const isSummit = category === 'mountaineering';
    return { days: tripDays, isSummit };
  }, [date, category]);

  const handleAnalysisComplete = (result: WeatherAnalysis) => {
    setAnalysis(result);

    const params = getTripParams();
    const groups = generateEquipment(params, currentLang) || {};
    const allItems = Object.values(groups).flat();

    const initialStatuses: Record<string, ItemStatus> = {};
    allItems.forEach((item) => {
      initialStatuses[item.id] = 'pending';
    });

    // Otomatik Ekspedisyon Kaydı yapılıyor
    saveExpedition({
      name: location || 'Yeni Ekspedisyon',
      days: params.days,
      isSummit: params.isSummit,
      items: allItems,
    });

    setStatuses(initialStatuses);
    setStage('equipment');
  };

  const handleSingleClick = useCallback((id: string) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'ready' ? 'pending' : 'ready',
    }));
  }, []);

  const handleDoubleClick = useCallback((id: string) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'missing' ? 'pending' : 'missing',
    }));
  }, []);

  const handleToggleStatus = useCallback((id: string, status: ItemStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const handleItemClick = useCallback((id: string) => {
    setSelectedItemId(id);
  }, []);

  // Nazik ve Belirgin Geri Dönüş Fonksiyonları
  const handleBackToCategory = () => setStage('category');
  const handleBackToLocation = () => setStage('location');

  const selectedItem = (() => {
    if (!selectedItemId || !category) return null;
    const params = getTripParams();
    const groups = generateEquipment(params, currentLang) || {};
    for (const [groupName, items] of Object.entries(groups)) {
      const found = items.find((i) => i.id === selectedItemId);
      if (found) {
        return { ...found, group: groupName, status: statuses[selectedItemId] || 'pending' };
      }
    }
    return null;
  })();

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-forest-950">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Belirgin & Nazik Geri Dönüş Butonu (Lokasyon ve Ekipman Aşamasında) */}
      {stage === 'location' && (
        <button
          onClick={handleBackToCategory}
          className="absolute top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-md transition-all active:scale-95"
        >
          <ChevronLeft size={16} /> Geri Dön
        </button>
      )}

      <AnimatePresence mode="wait">
        {stage === 'category' && (
          <div className="flex flex-col min-h-screen">
            <CategorySelect
              key="cat"
              onSelect={handleCategorySelect}
              onDevTap={handleDevTap}
            />
            {/* Şık "Geçmiş Ekspedisyonlarım" Butonu */}
            <div className="p-4 bg-forest-950/80 border-t border-slate-900">
              <button
                onClick={() => setShowArchiveModal(true)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Compass size={16} className="text-emerald-400" />
                Geçmiş Ekspedisyonlarım ({expeditions.length})
              </button>
            </div>
          </div>
        )}

        {stage === 'location' && (
          <LocationInput key="loc" onComplete={handleLocationComplete} />
        )}

        {stage === 'analysis' && category && (
          <AnalysisLoading
            key="ana"
            category={category}
            location={location}
            date={date}
            coords={coords}
            onComplete={handleAnalysisComplete}
          />
        )}
      </AnimatePresence>

      {stage === 'equipment' && category && analysis && (
        <EquipmentScreen
          category={category}
          location={location}
          date={date}
          analysis={analysis}
          statuses={statuses}
          onSingleClick={handleSingleClick}
          onDoubleClick={handleDoubleClick}
          onOpenBag={() => setBagOpen(true)}
          onBack={handleBackToLocation}
        />
      )}

      {/* Modallar */}
      <LimitPaywallModal
        isOpen={showLimitModal}
        maxAllowed={maxAllowed}
        onClose={() => setShowLimitModal(false)}
        onAdWatched={grantBonusSlotByAd}
      />

      <PastExpeditionsModal
        isOpen={showArchiveModal}
        expeditions={expeditions}
        onClose={() => setShowArchiveModal(false)}
        onDelete={deleteExpedition}
      />

      <AnimatePresence>
        {bagOpen && category && (
          <BagScreen
            category={category}
            date={date}
            statuses={statuses}
            onClose={() => setBagOpen(false)}
            onToggleStatus={handleToggleStatus}
            onItemClick={handleItemClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <ItemDetailSheet
            item={selectedItem}
            showStoreLinks={showStoreLinks}
            onClose={() => setSelectedItemId(null)}
            onMarkReady={() => {
              if (selectedItemId) {
                setStatuses((prev) => ({
                  ...prev,
                  [selectedItemId]: 'ready',
                }));
              }
              setSelectedItemId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
