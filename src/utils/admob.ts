// src/utils/admob.ts

export const initializeAdMob = async () => {
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.initialize({ requestTrackingAuthorization: true });
  } catch (e) {
    console.log('Web/Vercel ortamında AdMob simülasyon modunda.');
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  try {
    const { AdMob, RewardAdPluginEvents } = await import('@capacitor-community/admob');
    
    return new Promise(async (resolve) => {
      // Reklam Birimi Kimliği koda entegre edildi:
      await AdMob.prepareRewardVideoAd({
        adId: 'ca-app-pub-4198597673500025/5368528668',
      });

      const listener = AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          listener.remove();
          resolve(true);
        }
      );

      await AdMob.showRewardVideoAd();
    });
  } catch (e) {
    // Web ve Vercel derlemesinde hata vermemesi için simülasyon
    return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
  }
};
