// src/utils/admob.ts
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

export const initializeAdMob = async () => {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
    });
  } catch (e) {
    console.log('AdMob web ortamında simüle ediliyor.');
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      // Google AdMob Test Ödüllü Reklam ID'si
      await AdMob.prepareRewardVideoAd({
        adId: 'ca-app-pub-3940256099942544/5224354917',
      });

      const rewardListener = AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          rewardListener.remove();
          resolve(true);
        }
      );

      await AdMob.showRewardVideoAd();
    } catch (error) {
      console.log('AdMob yerel modda simüle ediliyor.');
      setTimeout(() => resolve(true), 1200);
    }
  });
};
