import { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Category, WeatherAnalysis } from '@/types';
import { CategorySelect } from '@/components/CategorySelect';
import { LocationInput } from '@/components/LocationInput';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { EquipmentScreen } from '@/components/EquipmentScreen';
import { BagScreen } from '@/components/BagScreen';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { Toast, type ToastData } from '@/components/Toast';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { generateEquipment, Language } from '@/utils/expeditionLogic';
import { useLang } from '@/i18n';

type Stage = 'category' | 'location' | 'analysis' | 'equipment';
type ItemStatus = 'pending' | 'ready' | 'missing';

function App() {
  const { showStoreLinks, toggleShowStoreLinks } = useRemoteConfig();
  const { t, lang } = useLang();
  const currentLang = (lang as Language) || 'tr';

  const [stage, setStage] = useState<Stage>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [analysis, setAnalysis] = useState<WeatherAnalysis | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastId = useRef(0);

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
    setLocation(loc);
    setDate(d);
    setCoords(c);
    setStage('analysis');
  };

  // Verilen tarih ve kategoriye göre gün sayısını ve zirve durumunu hesapla
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

    // Dinamik ekipman listesini üret, tüm item'ları 'pending' olarak başlat
    const params = getTripParams();
    const groups = generateEquipment(params, currentLang) || {};
    const allItems = Object.values(groups).flat();

    const initialStatuses: Record<string, ItemStatus> = {};
    allItems.forEach((item) => {
      initialStatuses[item.id] = 'pending';
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

  const handleBack = () => {
    setStage('location');
  };

  // Seçili item'ın tam bilgisini (isim, not, grup) dinamik listeden bul
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

      <AnimatePresence mode="wait">
        {stage === 'category' && (
          <CategorySelect
            key="cat"
            onSelect={handleCategorySelect}
            onDevTap={handleDevTap}
          />
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
          onBack={handleBack}
        />
      )}

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
