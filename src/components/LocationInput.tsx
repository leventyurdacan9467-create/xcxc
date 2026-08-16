import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ChevronRight, Mountain, Search, Loader2, X, Star, Globe, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useLang } from '@/i18n';
import { useGooglePlacesAutocomplete, type PlaceResult, type PlaceDetails } from '@/hooks/useGooglePlacesAutocomplete';

interface LocationInputProps {
  onComplete: (location: string, date: string, coords?: { lat: number; lng: number }) => void;
}

export function LocationInput({ onComplete }: LocationInputProps) {
  const { t } = useLang();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { loaded, search, getDetails } = useGooglePlacesAutocomplete(apiKey);

  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const canSubmit = location.trim().length > 0 && date.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setLocation(value);
      setPlaceDetails(null);
      if (!loaded || value.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearching(true);
      debounceRef.current = setTimeout(async () => {
        const predictions = await search(value);
        setResults(predictions);
        setShowResults(true);
        setSearching(false);
      }, 300);
    },
    [loaded, search]
  );

  const handleSelectResult = async (result: PlaceResult) => {
    console.log('[LocationInput] Selected result:', result);
    setLocation(result.description);
    setShowResults(false);
    setResults([]);
    if (!getDetails) {
      console.warn('[LocationInput] getDetails not available — no coords will be passed');
      return;
    }
    setLoadingDetails(true);
    const details = await getDetails(result.placeId);
    console.log('[LocationInput] PlaceDetails fetched:', details);
    if (details) {
      console.log('[LocationInput] Coords to pass on submit:', { lat: details.lat, lng: details.lng });
    } else {
      console.warn('[LocationInput] No details returned — coords will be undefined');
    }
    setPlaceDetails(details);
    setLoadingDetails(false);
  };

  const formatType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const relevantTypes = placeDetails?.types
    ? placeDetails.types
        .filter((t) => !['establishment', 'point_of_interest'].includes(t))
        .slice(0, 3)
        .map(formatType)
    : [];

  return (
    <motion.div
      key="location"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col px-6 pt-20 pb-10"
    >
      <div className="space-y-2 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-ember-500 text-sm font-medium tracking-widest uppercase"
        >
          {t.step2}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white leading-tight"
        >
          {t.locationQuestion}
          <br />
          <span className="text-gradient-ember">{t.locationQuestionAccent}</span>
        </motion.h1>
      </div>

      <div className="space-y-5 flex-1">
        <div className="space-y-2">
          <label className="text-sm text-rock-300 font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ember-500" />
            {t.locationLabel}
          </label>
          <div ref={containerRef} className="relative">
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder={t.locationPlaceholder}
                className="w-full rounded-2xl bg-forest-900/60 border border-forest-700 px-4 py-4 pr-11 text-white placeholder-rock-500 focus:outline-none focus:border-ember-500 transition-colors"
              />
              {(searching || loadingDetails || location) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {(searching || loadingDetails) && (
                    <Loader2 className="h-4 w-4 text-rock-400 animate-spin" />
                  )}
                  {location && !searching && !loadingDetails && (
                    <button
                      onClick={() => {
                        setLocation('');
                        setResults([]);
                        setShowResults(false);
                        setPlaceDetails(null);
                      }}
                      className="text-rock-500 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {showResults && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-1.5 w-full rounded-2xl glass-dark border border-forest-700 overflow-hidden shadow-2xl max-h-64 overflow-y-auto no-scrollbar"
              >
                {results.map((result) => (
                  <button
                    key={result.placeId}
                    onClick={() => handleSelectResult(result)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-forest-800/60 transition-colors border-b border-forest-800/50 last:border-0"
                  >
                    <Search className="h-4 w-4 text-rock-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {result.mainText}
                      </p>
                      {result.secondaryText && (
                        <p className="text-xs text-rock-400 truncate">
                          {result.secondaryText}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Popular locations fallback (shown when no API key or as quick picks) */}
          {!apiKey && (
            <div className="flex flex-wrap gap-2 pt-1">
              {t.popularLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="text-xs px-3 py-1.5 rounded-full bg-forest-800/60 border border-forest-700 text-rock-300 hover:border-ember-500/50 hover:text-ember-400 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Place details card */}
        <AnimatePresence mode="wait">
          {placeDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl glass-dark border border-forest-700 overflow-hidden shadow-2xl">
                {/* Photo */}
                {placeDetails.photos.length > 0 && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={placeDetails.photos[0]}
                      alt={placeDetails.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {placeDetails.name}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                  {!placeDetails.photos.length && (
                    <h3 className="text-xl font-bold text-white">
                      {placeDetails.name}
                    </h3>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-ember-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rock-300 leading-relaxed">
                      {placeDetails.formattedAddress}
                    </p>
                  </div>

                  {/* Coordinates */}
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-ember-500 shrink-0" />
                    <p className="text-xs text-rock-400 font-mono">
                      {placeDetails.lat.toFixed(4)}°, {placeDetails.lng.toFixed(4)}°
                    </p>
                  </div>

                  {/* Rating */}
                  {placeDetails.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-ember-500 fill-ember-500 shrink-0" />
                      <p className="text-sm text-white font-medium">
                        {placeDetails.rating.toFixed(1)}
                      </p>
                      {placeDetails.userRatingsTotal && (
                        <p className="text-xs text-rock-400">
                          ({placeDetails.userRatingsTotal.toLocaleString()} değerlendirme)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Types */}
                  {relevantTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {relevantTypes.map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2.5 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-rock-300"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Phone */}
                  {placeDetails.formattedPhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-ember-500 shrink-0" />
                      <p className="text-sm text-rock-300">
                        {placeDetails.formattedPhoneNumber}
                      </p>
                    </div>
                  )}

                  {/* Opening hours */}
                  {placeDetails.openingHours && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-ember-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-rock-400 leading-relaxed">
                        {placeDetails.openingHours}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 pt-1">
                    {placeDetails.url && (
                      <a
                        href={placeDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-forest-800/80 border border-forest-700 text-rock-300 hover:border-ember-500/50 hover:text-ember-400 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Google Maps
                      </a>
                    )}
                    {placeDetails.website && (
                      <a
                        href={placeDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-forest-800/80 border border-forest-700 text-rock-300 hover:border-ember-500/50 hover:text-ember-400 transition-colors"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Web Sitesi
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <label className="text-sm text-rock-300 font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ember-500" />
            {t.dateLabel}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl bg-forest-900/60 border border-forest-700 px-4 py-4 text-white focus:outline-none focus:border-ember-500 transition-colors [color-scheme:dark]"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-forest-900/40 border border-forest-800 p-4">
          <Mountain className="h-5 w-5 text-ember-500 shrink-0" />
          <p className="text-xs text-rock-300 leading-relaxed">{t.analysisInfo}</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!canSubmit}
        onClick={() => {
          const coords = placeDetails ? { lat: placeDetails.lat, lng: placeDetails.lng } : undefined;
          console.log('[LocationInput] Submit clicked — location:', location, 'date:', date, 'coords:', coords);
          onComplete(location.trim(), date, coords);
        }}
        className={`w-full rounded-2xl py-4 font-semibold text-base flex items-center justify-center gap-2 transition-all ${
          canSubmit
            ? 'bg-ember-500 text-white hover:bg-ember-600'
            : 'bg-forest-800 text-rock-500 cursor-not-allowed'
        }`}
      >
        {t.analyzeBtn}
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
}
