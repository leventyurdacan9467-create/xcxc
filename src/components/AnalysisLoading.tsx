import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { Category, WeatherAnalysis } from '@/types';
import { WEATHER_ANALYSES } from '@/data';
import { useLang } from '@/i18n';
import { useOpenMeteo, getWeatherDescription } from '@/hooks/useOpenMeteo';

interface AnalysisLoadingProps {
  category: Category;
  location: string;
  date: string;
  coords?: { lat: number; lng: number };
  onComplete: (analysis: WeatherAnalysis) => void;
}

export function AnalysisLoading({
  category,
  location,
  date,
  coords,
  onComplete,
}: AnalysisLoadingProps) {
  const { t, lang } = useLang();
  const [currentStep, setCurrentStep] = useState(0);
  const { fetchWeather } = useOpenMeteo();
  const completedRef = useRef(false);

  const stepIcons = [Thermometer, Wind, Droplets, Eye, CheckCircle2];

  useEffect(() => {
    let cancelled = false;
    const stepDuration = 700;

    const run = async () => {
      let weatherData: Awaited<ReturnType<typeof fetchWeather>> = null;

      if (coords) {
        console.log('[AnalysisLoading] Coords received:', coords, '— fetching weather...');
        weatherData = await fetchWeather(coords.lat, coords.lng);
        console.log('[AnalysisLoading] Weather fetch result:', weatherData);
      } else {
        console.warn('[AnalysisLoading] No coords provided — using fallback static data');
      }

      if (cancelled) return;

      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= t.steps.length - 1) {
            clearInterval(interval);
            if (!completedRef.current && !cancelled) {
              completedRef.current = true;
              console.log('[AnalysisLoading] Steps complete — building analysis...');
              const baseAnalysis = WEATHER_ANALYSES[category];

              if (weatherData) {
                console.log('[AnalysisLoading] Using real weather data');
                const w = weatherData.current;
                const weatherDesc = getWeatherDescription(w.weatherCode, lang);
                const tempStr = `${w.temperature.toFixed(1)}°C`;
                const windStr = `${w.windSpeed.toFixed(1)} km/s`;
                const precipStr = `${w.precipitation.toFixed(1)} mm`;

                const details: Record<string, string[]> = {
                  tr: [
                    `Anlık sıcaklık: ${tempStr}`,
                    `Rüzgar hızı: ${windStr} (${w.windDirection}°)`,
                    `Yağış: ${precipStr}`,
                    `Durum: ${weatherDesc}`,
                  ],
                  en: [
                    `Current temperature: ${tempStr}`,
                    `Wind speed: ${windStr} (${w.windDirection}°)`,
                    `Precipitation: ${precipStr}`,
                    `Condition: ${weatherDesc}`,
                  ],
                  fr: [
                    `Température actuelle: ${tempStr}`,
                    `Vitesse du vent: ${windStr} (${w.windDirection}°)`,
                    `Précipitations: ${precipStr}`,
                    `Condition: ${weatherDesc}`,
                  ],
                  es: [
                    `Temperatura actual: ${tempStr}`,
                    `Velocidad del viento: ${windStr} (${w.windDirection}°)`,
                    `Precipitación: ${precipStr}`,
                    `Condición: ${weatherDesc}`,
                  ],
                };

                const isCold = w.temperature < 0;
                const isWindy = w.windSpeed > 40;
                const isWet = w.precipitation > 0.5;

                let condition = baseAnalysis.condition;
                if (isCold) condition = 'high-altitude';
                else if (isWet) condition = 'rain';
                else condition = 'mild';

                const summary: Record<string, string> = {
                  tr: isCold
                    ? 'Eksi dereceler ve zorlu koşullar bekleniyor'
                    : isWet
                      ? 'Yağışlı koşullar bekleniyor'
                      : 'Genel olarak ılıman koşullar',
                  en: isCold
                    ? 'Sub-zero temperatures and harsh conditions expected'
                    : isWet
                      ? 'Wet conditions expected'
                      : 'Generally mild conditions',
                  fr: isCold
                    ? 'Températures négatives et conditions difficiles attendues'
                    : isWet
                      ? 'Conditions humides attendues'
                      : 'Conditions généralement douces',
                  es: isCold
                    ? 'Temperaturas bajo cero y condiciones difíciles esperadas'
                    : isWet
                      ? 'Condiciones húmedas esperadas'
                      : 'Condiciones generalmente templadas',
                };

                const recommendation: Record<string, string> = {
                  tr: isCold
                    ? '4 mevsim ekipman, rüzgar koruması ve yüksek irtifa çadırı zorunlu.'
                    : isWet
                      ? 'Su geçirmez ekipman ve yağmurluk zorunlu.'
                      : 'Standart 3 mevsim ekipman yeterli, gece için sıcak uyku tulumu öner.',
                  en: isCold
                    ? '4-season gear, wind protection, and high-altitude tent are mandatory.'
                    : isWet
                      ? 'Waterproof gear and rain jacket are mandatory.'
                      : 'Standard 3-season gear is sufficient; a warm sleeping bag is recommended for the night.',
                  fr: isCold
                    ? 'Équipement 4 saisons, protection contre le vent et tente haute altitude obligatoires.'
                    : isWet
                      ? 'Équipement imperméable et veste imperméable obligatoires.'
                      : 'Équipement standard 3 saisons suffisant; sac de couchage chaud recommandé pour la nuit.',
                  es: isCold
                    ? 'Equipo de 4 estaciones, protección contra el viento y tienda de alta altitude son obligatorios.'
                    : isWet
                      ? 'Equipo impermeable y chaqueta impermeable son obligatorios.'
                      : 'Equipo estándar de 3 estaciones suficiente; saco de dormir cálido recomendado para la noche.',
                };

                const icon = isCold ? Thermometer : isWet ? Droplets : Eye;

                const analysis: WeatherAnalysis = {
                  condition,
                  temperature: tempStr,
                  summary: summary as any,
                  details: details as any,
                  recommendation: recommendation as any,
                  icon,
                  currentWeather: w,
                };

                setTimeout(() => onComplete(analysis), 600);
              } else {
                console.log('[AnalysisLoading] No weather data — using fallback static analysis');
                setTimeout(() => onComplete(baseAnalysis), 600);
              }
            }
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);
    };

    run();

    // Safety timeout: if something hangs, force completion after 15s
    const safety = setTimeout(() => {
      if (!completedRef.current && !cancelled) {
        console.error('[AnalysisLoading] SAFETY TIMEOUT — forcing fallback completion');
        completedRef.current = true;
        onComplete(WEATHER_ANALYSES[category]);
      }
    }, 15000);

    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
  }, [category, coords, fetchWeather, onComplete, t.steps.length, lang]);

  const analysis = WEATHER_ANALYSES[category];
  const WeatherIcon = analysis.icon;

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-ember-500/20 animate-pulse-ring" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-forest-800 border-2 border-ember-500/40">
          <WeatherIcon className="h-10 w-10 text-ember-500" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-white text-center mb-1"
      >
        {location} {t.analysisOf}
      </motion.h2>
      <p className="text-sm text-rock-400 mb-10">{date}</p>

      <div className="w-full max-w-sm space-y-3">
        {t.steps.map((label, index) => {
          const StepIcon = stepIcons[index] || Thermometer;
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                isActive
                  ? 'border-ember-500/50 bg-ember-500/10'
                  : isDone
                    ? 'border-forest-700 bg-forest-900/40'
                    : 'border-forest-800/50 bg-transparent'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  isDone
                    ? 'bg-success-500/20 text-success-400'
                    : isActive
                      ? 'bg-ember-500/20 text-ember-400'
                      : 'bg-forest-800 text-rock-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-sm ${
                  isActive || isDone ? 'text-rock-100' : 'text-rock-500'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-ember-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
