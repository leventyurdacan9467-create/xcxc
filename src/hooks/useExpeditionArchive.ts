import { useState, useEffect } from 'react';

export interface Expedition {
  id: string;
  name: string;
  days: number;
  isSummit: boolean;
  createdAt: string;
  items: any[];
}

export const useExpeditionArchive = (isPremium: boolean = false) => {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [bonusSlots, setBonusSlots] = useState<number>(0);

  // Sayfa yüklendiğinde kayıtlı ekspedisyonları ve kazanılan ekstra hakları çek
  useEffect(() => {
    const savedExpeditions = localStorage.getItem('expedition_archive');
    const savedSlots = localStorage.getItem('bonus_expedition_slots');

    if (savedExpeditions) setExpeditions(JSON.parse(savedExpeditions));
    if (savedSlots) setBonusSlots(Number(savedSlots));
  }, []);

  // Toplam İzin Verilen Ekspedisyon Sayısı
  const maxAllowed = isPremium ? Infinity : 1 + bonusSlots;
  const canCreateNew = isPremium || expeditions.length < maxAllowed;

  // Yeni Ekspedisyon Kaydet
  const saveExpedition = (newExp: Omit<Expedition, 'id' | 'createdAt'>) => {
    if (!canCreateNew) {
      return { success: false, reason: 'LIMIT_REACHED' };
    }

    const created: Expedition = {
      ...newExp,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [created, ...expeditions];
    setExpeditions(updated);
    localStorage.setItem('expedition_archive', JSON.stringify(updated));

    return { success: true, expedition: created };
  };

  // Reklam İzleyerek +1 Hak Kazanma
  const grantBonusSlotByAd = () => {
    const updatedSlots = bonusSlots + 1;
    setBonusSlots(updatedSlots);
    localStorage.setItem('bonus_expedition_slots', updatedSlots.toString());
  };

  // Ekspedisyon Silme
  const deleteExpedition = (id: string) => {
    const updated = expeditions.filter((exp) => exp.id !== id);
    setExpeditions(updated);
    localStorage.setItem('expedition_archive', JSON.stringify(updated));
  };

  return {
    expeditions,
    canCreateNew,
    maxAllowed,
    currentCount: expeditions.length,
    saveExpedition,
    deleteExpedition,
    grantBonusSlotByAd,
  };
};
