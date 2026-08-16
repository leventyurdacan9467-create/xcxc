import { useState, useCallback, useRef } from 'react';

export interface PlaceResult {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  url?: string;
  website?: string;
  formattedPhoneNumber?: string;
  openingHours?: string;
  photos: string[];
}

// apiKey artık kullanılmıyor ama diğer dosyalar bozulmasın diye parametre olarak duruyor
export function useGooglePlacesAutocomplete(apiKey?: string) {
  const [loaded] = useState(true); // Nominatim'de yükleme yok, direkt hazır
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, any>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string): Promise<PlaceResult[]> => {
    return new Promise((resolve) => {
      if (query.trim().length < 2) {
        resolve([]);
        return;
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=tr&q=${encodeURIComponent(query)}`
          );
          const data = await response.json();

          const results: PlaceResult[] = (data || []).map((item: any) => {
            cacheRef.current.set(String(item.place_id), item);
            const parts = item.display_name.split(',');
            return {
              description: item.display_name,
              placeId: String(item.place_id),
              mainText: parts[0]?.trim() || item.display_name,
              secondaryText: parts.slice(1).join(',').trim(),
            };
          });

          setError(null);
          resolve(results);
        } catch (err) {
          console.error('Nominatim arama hatası:', err);
          setError('Arama başarısız oldu');
          resolve([]);
        }
      }, 400);
    });
  }, []);

  const getDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    const item = cacheRef.current.get(placeId);
    if (!item) return null;

    return {
      placeId,
      name: item.display_name.split(',')[0]?.trim() || '',
      formattedAddress: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      types: item.type ? [item.type] : [],
      rating: undefined,
      userRatingsTotal: undefined,
      url: undefined,
      website: undefined,
      formattedPhoneNumber: undefined,
      openingHours: undefined,
      photos: [],
    };
  }, []);

  return { loaded, error, search, getDetails };
}
