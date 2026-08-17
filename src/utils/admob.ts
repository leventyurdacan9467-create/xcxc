// src/utils/admob.ts

export const initializeAdMob = async () => {
  try {
    const admobPackage = '@capacitor-community/admob';
    const { AdMob } = await import(/* @vite-ignore */ admobPackage);
    await AdMob.initialize({ requestTrackingAuthorization: true });
  } catch (e) {
    console.log('Web/Vercel ortamında AdMob simülasyon modunda.');
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  try {
    const admobPackage = '@capacitor-community/admob';
    const { AdMob, RewardAdPluginEvents } = await import(/* @vite-ignore */ admobPackage);

    return new Promise(async (resolve) => {
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
    return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
  }
};
