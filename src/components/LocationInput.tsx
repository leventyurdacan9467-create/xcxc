import React, { useState } from 'react';

export default function LocationInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Overpass API ile dünya çapındaki zirveleri ve dağları arama fonksiyonu
  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    // OpenStreetMap üzerinden dünya çapında dağ ve zirve (peak) araması yapan Overpass sorgusu
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["natural"="peak"]["name"~"${value}", i];
        way["natural"="peak"]["name"~"${value}", i];
      );
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
      });

      const data = await response.json();
      
      // Gelen sonuçları kullanıcıya gösterilecek formata dönüştürelim
      if (data && data.elements) {
        const peaks = data.elements
          .filter((el: any) => el.tags && el.tags.name)
          .map((el: any) => ({
            name: el.tags.name,
            elevation: el.tags.ele ? `${el.tags.ele}m` : 'Yükseklik bilgisi yok',
            lat: el.lat || (el.geometry && el.geometry[0]?.lat),
            lon: el.lon || (el.geometry && el.geometry[0]?.lon),
          }));

        setSuggestions(peaks);
      }
    } catch (error) {
      console.error("Dağ arama hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Dünya çapında dağ veya zirve ara (Örn: Ağrı, K2, Mont Blanc)..."
        className="w-full px-4 py-2 border rounded-lg bg-transparent text-white"
      />
      
      {loading && (
        <div className="absolute right-3 top-3 text-xs text-gray-400">Aranıyor...</div>
      )}
      
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((item: any, index: number) => (
            <li
              key={index}
              onClick={() => {
                setQuery(`${item.name} (${item.elevation})`);
                setSuggestions([]);
              }}
              className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-gray-200 border-b border-zinc-800 last:border-none flex justify-between items-center"
            >
              <span className="font-medium text-white">{item.name}</span>
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-emerald-400">{item.elevation}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
