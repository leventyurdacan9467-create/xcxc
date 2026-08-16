import React, { useState } from 'react';

export default function LocationInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

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
        placeholder="Lokasyon ara (Örn: Aladağlar, Kaçkar)..."
        className="w-full px-4 py-2 border rounded-lg bg-transparent text-white"
      />
      
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((item: any, index: number) => (
            <li
              key={index}
              onClick={() => {
                setQuery(item.display_name);
                setSuggestions([]);
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
