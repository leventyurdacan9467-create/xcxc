import React, { useState } from 'react';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  onLocationSelect?: (location: { name: string; lat: string; lon: string }) => void;
}

export default function LocationInput({ onLocationSelect }: LocationInputProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);

  // Kullanıcı yazdıkça Nominatim'den sonuç çeken fonksiyon
  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=tr`,
        {
          headers: {
            'User-Agent': 'ZirveTakipApp/1.0'
          }
        }
      );
      const data: LocationResult[] = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Arama hatası:", error);
    }
  };

  // Bir konum seçildiğinde
  const handleSelect = (item: LocationResult) => {
    setQuery(item.display_name);
    setSuggestions([]);
    if (onLocationSelect) {
      onLocationSelect({
        name: item.display_name,
        lat: item.lat,
        lon: item.lon
      });
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Lokasyon ara (Örn: Aladağlar, Kaçkar)..."
        className="w-full px-4 py-2 border rounded-lg bg-transparent text-white"
      />
      
      {/* Öneriler Listesi */}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-gray-200 border-b border-zinc-800 last:border-none"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
