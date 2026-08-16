import { useEffect, useState, useCallback, useRef } from 'react';

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (scriptLoadingPromise) return scriptLoadingPromise;
  if ((window as any).google?.maps?.places) return Promise.resolve();

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadingPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

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

export function useGooglePlacesAutocomplete(apiKey: string | undefined) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  useEffect(() => {
    if (!apiKey) {
      setError('No API key');
      return;
    }
    loadGoogleMapsScript(apiKey)
      .then(() => {
        setLoaded(true);
        const google = (window as any).google;
        autocompleteRef.current = new google.maps.places.AutocompleteService();
        placesServiceRef.current = new google.maps.places.PlacesService(
          document.createElement('div')
        );
      })
      .catch((err) => setError(err.message));
  }, [apiKey]);

  const search = useCallback(
    async (query: string): Promise<PlaceResult[]> => {
      if (!loaded || !autocompleteRef.current || query.trim().length < 2) {
        return [];
      }
      return new Promise<PlaceResult[]>((resolve) => {
        autocompleteRef.current.getPlacePredictions(
          {
            input: query,
            types: ['geocode'],
          },
          (predictions: any[], status: string) => {
            if (status !== 'OK' || !predictions) {
              resolve([]);
              return;
            }
            resolve(
              predictions.map((p) => ({
                description: p.description,
                placeId: p.place_id,
                mainText: p.structured_formatting?.main_text || p.description,
                secondaryText: p.structured_formatting?.secondary_text || '',
              }))
            );
          }
        );
      });
    },
    [loaded]
  );

  const getDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      if (!loaded || !placesServiceRef.current) return null;
      return new Promise<PlaceDetails | null>((resolve) => {
        placesServiceRef.current.getDetails(
          {
            placeId,
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'types',
              'rating',
              'user_ratings_total',
              'url',
              'website',
              'formatted_phone_number',
              'opening_hours',
              'photos',
            ],
          },
          (place: any, status: string) => {
            console.log('[Google Places] getDetails status:', status);
            if (status !== 'OK' || !place) {
              console.warn('[Google Places] getDetails failed or no place:', status);
              resolve(null);
              return;
            }
            console.log('[Google Places] Raw place object:', place);
            console.log('[Google Places] geometry:', place.geometry);
            console.log('[Google Places] lat:', place.geometry?.location?.lat(), 'lng:', place.geometry?.location?.lng());
            const photos: string[] = [];
            if (place.photos) {
              for (const photo of place.photos.slice(0, 3)) {
                photos.push(photo.getUrl({ maxWidth: 800, maxHeight: 400 }));
              }
            }
            const result = {
              placeId,
              name: place.name || '',
              formattedAddress: place.formatted_address || '',
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
              types: place.types || [],
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              url: place.url,
              website: place.website,
              formattedPhoneNumber: place.formatted_phone_number,
              openingHours: place.opening_hours?.weekday_text?.join(', '),
              photos,
            };
            console.log('[Google Places] Parsed PlaceDetails:', result);
            resolve(result);
          }
        );
      });
    },
    [loaded]
  );

  return { loaded, error, search, getDetails };
}
