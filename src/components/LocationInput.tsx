import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  onComplete: (location: string, date: string, coords?: { lat: number; lng: number }) => void;
}

export function LocationInput({ onComplete }: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Overpass yerine Nominatim kullanarak dünyadaki tüm dağ, zirve ve kamp yerlerini anında ve kesintisiz çeken fonksiyon
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
        // Dağcılık odaklı terimleri de destekleyen dünya çapında arama
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'ZirveTakipApp/1.0'
            }
          }
        );

        if (!response.ok) throw new Error(`Arama hatası: ${response.status}`);
        const data = await response.json();

        const results = (data || []).map((item: any) => ({
          display_name: item.display_name,
          typeLabel: item.type ? `Tür: ${item.type}` : 'Konum',
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));

        setSuggestions(results);
      } catch (error) {
        console.error('Lokasyon arama hatası:', error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
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
            placeholder="Dağ, zirve veya lokasyon ara (Örn: Ağrı Dağı, K2)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-rock-400 focus:outline-none focus:border-ember-500/50"
          />
          {searching && (
            <p className="text-xs text-rock-400 mt-1 pl-1">Aranıyor...</p>
          )}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-zinc-950 border border-white/10 rounded-2xl max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((item: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-gray-200 border-b border-white/5 last:border-none"
                >
                  <span>{item.display_name}</span>
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
              onChange={(e) => setEndDate(e.target.value)}
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
