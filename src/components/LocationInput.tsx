import { useState, useRef } from 'react';

interface LocationInputProps {
  onComplete: (location: string, date: string, coords?: { lat: number; lng: number }) => void;
}

export function LocationInput({ onComplete }: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedCoords(undefined);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=tr`
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error('Arama hatası:', error);
        setSuggestions([]);
      }
    }, 400);
  };

  const handleSelectSuggestion = (item: any) => {
    setQuery(item.display_name);
    setSelectedCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (!query || !date) return;
    onComplete(query, date, selectedCoords);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Lokasyon ara (Örn: Aladağlar, Kaçkar)..."
          className="w-full px-4 py-2 border rounded-lg bg-transparent text-white"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
            {suggestions.map((item: any, index: number) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(item)}
                className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-gray-200 border-b border-zinc-800 last:border-none"
