import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  onComplete: (location: string, date: string, coords?: { lat: number; lng: number }) => void;
}

const TYPE_LABELS: Record<string, string> = {
  peak: 'Zirve',
  volcano: 'Yanardağ',
  saddle: 'Geçit/Sırt',
  ridge: 'Sırt Hattı',
  camp_site: 'Kamp Alanı',
  picnic_site: 'Piknik Alanı',
  alpine_hut: 'Dağ Evi',
  wilderness_hut: 'Barınak',
  wood: 'Orman',
  forest: 'Orman',
  nature_reserve: 'Doğa Koruma Alanı',
  national_park: 'Milli Park',
  hiking: 'Yürüyüş Rotası',
};

export function LocationInput({ onComplete }: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildOverpassQuery = (name: string) => {
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `
[out:json][timeout:25];
(
  node["natural"="peak"]["name"~"${safe}",i];
  node["natural"="volcano"]["name"~"${safe}",i];
  node["natural"="saddle"]["name"~"${safe}",i];
  node["natural"="ridge"]["name"~"${safe}",i];
  node["tourism"="camp_site"]["name"~"${safe}",i];
  way["tourism"="camp_site"]["name"~"${safe}",i];
  node["tourism"="picnic_site"]["name"~"${safe}",i];
  node["tourism"="alpine_hut"]["name"~"${safe}",i];
  node["tourism"="wilderness_hut"]["name"~"${safe}",i];
  way["natural"="wood"]["name"~"${safe}",i];
  way["landuse"="forest"]["name"~"${safe}",i];
  way["leisure"="nature_reserve"]["name"~"${safe}",i];
  relation["leisure"="nature_reserve"]["name"~"${safe}",i];
  way["boundary"="national_park"]["name"~"${safe}",i];
  relation["boundary"="national_park"]["name"~"${safe}",i];
  relation["route"="hiking"]["name"~"${safe}",i];
  way["route"="hiking"]["name"~"${safe}",i];
);
out center 25;
`.trim();
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedCoords(undefined);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const overpassQuery = buildOverpassQuery(value.trim());
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
        const data = await response.json();

        const seen = new Set<string>();
        const results = (data.elements || [])
          .map((el: any) => {
            const lat = el.lat ?? el.center?.lat;
            const lon = el.lon ?? el.center?.lon;
            const name = el.tags?.name || 'İsimsiz';
            const typeKey =
              el.tags?.natural ||
              el.tags?.tourism ||
              el.tags?.leisure ||
              el.tags?.boundary ||
              el.tags?.landuse ||
              el.tags?.route ||
              '';
            const typeLabel = TYPE_LABELS[typeKey] || typeKey;
            const elevation = el.tags?.ele ? ` · ${el.tags.ele}m` : '';

            return {
              display_name: name,
              typeLabel: `${typeLabel}${elevation}`,
              lat,
              lon,
              dedupeKey: `${name}-${typeKey}`,
            };
          })
          .filter((r: any) => r.lat && r.lon)
          .filter((r: any) => {
            if (seen.has(r.dedupeKey)) return false;
            seen.add(r.dedupeKey);
            return true;
          });

        setSuggestions(results);
      } catch (error) {
        console.error('Overpass arama hatası:', error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const handleSelectSuggestion = (item: any) => {
    setQuery(item.display_name);
    setSelectedCoords({ lat: item.lat, lng: item.lon });
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (!query || !startDate || !endDate) return;
    const dateRange = `${startDate} - ${endDate}`;
    onComplete(query, dateRange, selectedCoords);
  };

  const isValid = query && startDate && endDate;

  return (
    <motion.div
      key="location"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-center px-6"
    >
      <div className="text-center space-y-3 mb-10">
        <p className="text-ember-500 text-sm font-medium tracking-widest uppercase">
          Nereye gidiyorsun?
        </p>
        <h1 className="text-3xl font-bold text-white leading-tight">
          Konum ve tarihini
          <br />
          <span className="text-gradient-ember">belirle</span>
        </h1>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
        <div className="relative w-full">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rock-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Lokasyon ara (Örn: Aladağlar, Everest)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-rock-400 focus:outline-none focus:border-ember-500/50"
          />
          {searching && (
            <p className="text-xs text-rock-400 mt-1 pl-1">Aranıyor...</p>
          )}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-forest-950 border border-white/10 rounded-2xl max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((item: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-rock-200 border-b border-white/5 last:border-none"
                >
                  <span>{item.display_name}</span>
                  <span className="text-xs text-ember-500 block">{item.typeLabel}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-rock-400 mb-1 block pl-1">Başlangıç</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-ember-500/50"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-rock-400 mb-1 block pl-1">Bitiş</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-ember-500/50"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full mt-4 px-4 py-3 rounded-2xl bg-ember-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          Devam Et
        </motion.button>
      </div>
    </motion.div>
  );
}
