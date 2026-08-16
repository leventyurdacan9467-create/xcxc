import { useState, useCallback } from 'react';

export interface CurrentWeather {
  temperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}

export interface WeatherData {
  current: CurrentWeather;
  fetchedAt: number;
}

const WEATHER_CODE_MAP: Record<number, { tr: string; en: string; fr: string; es: string; icon: string }> = {
  0: { tr: 'Açık', en: 'Clear sky', fr: 'Ciel dégagé', es: 'Cielo despejado', icon: 'sun' },
  1: { tr: 'Az bulutlu', en: 'Mainly clear', fr: 'Peu nuageux', es: 'Poco nublado', icon: 'cloud-sun' },
  2: { tr: 'Parçalı bulutlu', en: 'Partly cloudy', fr: 'Partiellement nuageux', es: 'Parcialmente nublado', icon: 'cloud-sun' },
  3: { tr: 'Kapalı', en: 'Overcast', fr: 'Couvert', es: 'Cubierto', icon: 'cloud' },
  45: { tr: 'Sisli', en: 'Foggy', fr: 'Brouillard', es: 'Niebla', icon: 'cloud-fog' },
  48: { tr: 'Kırağılı sis', en: 'Rime fog', fr: 'Brouillard givrant', es: 'Niebla escarchada', icon: 'cloud-fog' },
  51: { tr: 'Hafif çisenti', en: 'Light drizzle', fr: 'Bruine légère', es: 'Llovizna ligera', icon: 'cloud-drizzle' },
  53: { tr: 'Çisenti', en: 'Drizzle', fr: 'Bruine', es: 'Llovizna', icon: 'cloud-drizzle' },
  55: { tr: 'Yoğun çisenti', en: 'Dense drizzle', fr: 'Bruine dense', es: 'Llovizna densa', icon: 'cloud-drizzle' },
  61: { tr: 'Hafif yağmur', en: 'Slight rain', fr: 'Pluie légère', es: 'Lluvia ligera', icon: 'cloud-rain' },
  63: { tr: 'Yağmur', en: 'Rain', fr: 'Pluie', es: 'Lluvia', icon: 'cloud-rain' },
  65: { tr: 'Şiddetli yağmur', en: 'Heavy rain', fr: 'Forte pluie', es: 'Lluvia fuerte', icon: 'cloud-rain' },
  71: { tr: 'Hafif kar', en: 'Slight snow', fr: 'Neige légère', es: 'Nieve ligera', icon: 'cloud-snow' },
  73: { tr: 'Kar', en: 'Snow', fr: 'Neige', es: 'Nieve', icon: 'cloud-snow' },
  75: { tr: 'Yoğun kar', en: 'Heavy snow', fr: 'Forte neige', es: 'Nieve fuerte', icon: 'cloud-snow' },
  77: { tr: 'Kar taneleri', en: 'Snow grains', fr: 'Grains de neige', es: 'Granos de nieve', icon: 'cloud-snow' },
  80: { tr: 'Hafif sağanak', en: 'Slight showers', fr: 'Averses légères', es: 'Chubascos ligeros', icon: 'cloud-rain' },
  81: { tr: 'Sağanak', en: 'Showers', fr: 'Averses', es: 'Chubascos', icon: 'cloud-rain' },
  82: { tr: 'Şiddetli sağanak', en: 'Violent showers', fr: 'Averses violentes', es: 'Chubascos violentos', icon: 'cloud-rain' },
  85: { tr: 'Hafif kar yağışlı', en: 'Slight snow showers', fr: 'Averses de neige légères', es: 'Chubascos de nieve ligeros', icon: 'cloud-snow' },
  86: { tr: 'Yoğun kar yağışlı', en: 'Heavy snow showers', fr: 'Averses de neige fortes', es: 'Chubascos de nieve fuertes', icon: 'cloud-snow' },
  95: { tr: 'Gök gürültülü fırtına', en: 'Thunderstorm', fr: 'Orage', es: 'Tormenta', icon: 'cloud-lightning' },
  96: { tr: 'Dolulu fırtına', en: 'Thunderstorm with hail', fr: 'Orage avec grêle', es: 'Tormenta con granizo', icon: 'cloud-lightning' },
  99: { tr: 'Şiddetli dolulu fırtına', en: 'Severe thunderstorm with hail', fr: 'Orage sévère avec grêle', es: 'Tormenta severa con granizo', icon: 'cloud-lightning' },
};

export function getWeatherDescription(code: number, lang: 'tr' | 'en' | 'fr' | 'es'): string {
  const entry = WEATHER_CODE_MAP[code];
  if (!entry) return lang === 'tr' ? 'Bilinmiyor' : 'Unknown';
  return entry[lang];
}

export function useOpenMeteo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lng: number): Promise<WeatherData | null> => {
    console.log('[Open-Meteo] Starting fetch for lat:', lat, 'lng:', lng);
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m`;
      console.log('[Open-Meteo] Request URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      console.log('[Open-Meteo] Response status:', res.status, res.ok);

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      console.log('[Open-Meteo] Raw response data:', data);

      const c = data.current;
      if (!c) {
        console.error('[Open-Meteo] No "current" field in response. Full response:', data);
        throw new Error('No current weather data');
      }
      console.log('[Open-Meteo] Current weather:', {
        temperature: c.temperature_2m,
        precipitation: c.precipitation,
        weatherCode: c.weather_code,
        windSpeed: c.wind_speed_10m,
        windDirection: c.wind_direction_10m,
      });

      return {
        current: {
          temperature: c.temperature_2m,
          precipitation: c.precipitation,
          weatherCode: c.weather_code,
          windSpeed: c.wind_speed_10m,
          windDirection: c.wind_direction_10m,
        },
        fetchedAt: Date.now(),
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('[Open-Meteo] Fetch FAILED:', msg, err);
      console.error('[Open-Meteo] You can test this URL directly in your browser:');
      console.error(`[Open-Meteo] https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m`);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchWeather };
}
