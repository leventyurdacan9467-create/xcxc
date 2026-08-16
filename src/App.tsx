import { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Category, WeatherAnalysis, ItemStatus, BagItem } from '@/types';
import { CategorySelect } from '@/components/CategorySelect';
import { LocationInput } from '@/components/LocationInput';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { EquipmentScreen } from '@/components/EquipmentScreen';
import { BagScreen } from '@/components/BagScreen';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { Toast, type ToastData } from '@/components/Toast';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { getEquipmentForCategory } from '@/data';
import { useLang } from '@/i18n';

type Stage = 'category' | 'location' | 'analysis' | 'equipment';

function App() {
  const { showStoreLinks, toggleShowStoreLinks } = useRemoteConfig();
  const { t } = useLang();

  const [stage, setStage] = useState<Stage>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [analysis, setAnalysis] = useState<WeatherAnalysis | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BagItem | null>(null);
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

  const handleAnalysisComplete = (result: WeatherAnalysis) => {
    setAnalysis(result);
    const initialStatuses: Record<string, ItemStatus> = {};
    getEquipmentForCategory(category!).forEach((item) => {
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

  const handleItemClick = useCallback(
    (item: BagItem) => {
      setSelectedItem({ ...item, status: statuses[item.id] || 'pending' });
    },
    [statuses]
  );

  const handleBack = () => {
    setStage('location');
  };

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
            items={getEquipmentForCategory(category).map((item) => ({
              ...item,
              status: statuses[item.id] || 'pending',
            }))}
            onClose={() => setBagOpen(false)}
            onToggleReady={(id) =>
              setStatuses((prev) => ({
                ...prev,
                [id]: prev[id] === 'ready' ? 'pending' : 'ready',
              }))
            }
            onToggleMissing={(id) =>
              setStatuses((prev) => ({
                ...prev,
                [id]: prev[id] === 'missing' ? 'pending' : 'missing',
              }))
            }
            onItemClick={handleItemClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <ItemDetailSheet
            item={selectedItem}
            showStoreLinks={showStoreLinks}
            onClose={() => setSelectedItem(null)}
            onMarkReady={() => {
              setStatuses((prev) => ({
                ...prev,
                [selectedItem.id]: 'ready',
              }));
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
