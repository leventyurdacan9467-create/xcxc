import type { LucideIcon } from 'lucide-react';
import type { Lang } from './i18n';

export type Category = 'mountaineering' | 'camping';

export type ItemStatus = 'pending' | 'ready' | 'missing';

export type WeatherCondition =
  | 'high-altitude'
  | 'cold'
  | 'wind'
  | 'rain'
  | 'hot'
  | 'mild';

export type LocalizedString = Record<Lang, string>;
export type LocalizedStringArray = Record<Lang, string[]>;

export interface EquipmentItem {
  id: string;
  name: LocalizedString;
  group: string;
  icon: LucideIcon;
  image: string;
  description: LocalizedString;
  essential: boolean;
  conditions: WeatherCondition[];
  searchName: string;
}

export interface WeatherAnalysis {
  condition: WeatherCondition;
  temperature: string;
  summary: LocalizedString;
  details: LocalizedStringArray;
  recommendation: LocalizedString;
  icon: LucideIcon;
  currentWeather?: {
    temperature: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
  };
}

export interface BagItem extends EquipmentItem {
  status: ItemStatus;
}

export interface AffiliateLinks {
  hepsiburada: string;
  amazon: string;
}
