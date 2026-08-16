import React, { useState } from 'react';

interface LocationInputProps {
  onLocationSelect?: (location: { name: string; lat: string; lon: string }) => void;
}

export default function LocationInput({ onLocationSelect }: LocationInputProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      // Nominatim üzerinden dünya çapındaki dağlar, zirveler ve yerler dahil arama
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`,
        {
          headers: {
            'User-Agent': 'ZirveTakipApp/1.0'
          }
        }
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Arama hatası:", error);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Dağ, zirve veya lokasyon ara (Örn: Ağrı Dağı, K2, Kaçkar)..."
        className="w-full px-4 py-2 border rounded-lg bg-transparent text-white"
      />
      
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setQuery(item.display_name);
                setSuggestions([]);
                if (onLocationSelect) {
                  onLocationSelect({
                    name: item.display_name,
                    lat: item.lat,
                    lon: item.lon
                  });
                }
              }}
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
