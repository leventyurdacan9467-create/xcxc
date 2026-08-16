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

export interface HistoricalAverage {
  avgTempMax: number;
  avgTempMin: number;
  avgPrecipitation: number;
  mostCommonWeatherCode: number;
  yearsUsed: number[];
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
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const c = data.current;
      if (!c) throw new Error('No current weather data');

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
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Geçmiş yılların aynı tarih aralığı için ortalama hava durumu (arşiv verisi)
  const fetchHistoricalAverage = useCallback(
    async (
      lat: number,
      lng: number,
      startDate: string, // "YYYY-MM-DD"
      endDate: string,   // "YYYY-MM-DD"
      yearsBack = 5
    ): Promise<HistoricalAverage | null> => {
      setLoading(true);
      setError(null);
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const thisYear = new Date().getFullYear();

        const requests: Promise<any>[] = [];
        const yearsUsed: number[] = [];

        for (let i = 1; i <= yearsBack; i++) {
          const year = thisYear - i;
          yearsUsed.push(year);

          const s = new Date(start);
          s.setFullYear(year);
          const e = new Date(end);
          e.setFullYear(year);

          const fmt = (d: Date) => d.toISOString().split('T')[0];

          const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fmt(s)}&end_date=${fmt(e)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;

          requests.push(
            fetch(url)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          );
        }

        const results = await Promise.all(requests);

        let tempMaxSum = 0;
        let tempMinSum = 0;
        let precipSum = 0;
        let count = 0;
        const codeCounts: Record<number, number> = {};

        for (const data of results) {
          if (!data?.daily?.temperature_2m_max) continue;
          const daily = data.daily;
          for (let i = 0; i < daily.time.length; i++) {
            if (daily.temperature_2m_max[i] == null) continue;
            tempMaxSum += daily.temperature_2m_max[i];
            tempMinSum += daily.temperature_2m_min[i];
            precipSum += daily.precipitation_sum[i] || 0;
            const code = daily.weathercode[i];
            codeCounts[code] = (codeCounts[code] || 0) + 1;
            count++;
          }
        }

        if (count === 0) throw new Error('Geçmiş veri bulunamadı');

        let mostCommonWeatherCode = 0;
        let maxCount = 0;
        for (const [code, c] of Object.entries(codeCounts)) {
          if (c > maxCount) {
            maxCount = c;
            mostCommonWeatherCode = Number(code);
          }
        }

        return {
          avgTempMax: tempMaxSum / count,
          avgTempMin: tempMinSum / count,
          avgPrecipitation: precipSum / count,
          mostCommonWeatherCode,
          yearsUsed,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Geçmiş hava verisi alınamadı';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, fetchWeather, fetchHistoricalAverage };
}
