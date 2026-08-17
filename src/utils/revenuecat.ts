// src/utils/revenuecat.ts

const REVENUECAT_GOOGLE_API_KEY = "goog_YOUR_PUBLIC_API_KEY";

export const initRevenueCat = async () => {
  try {
    const rcPackage = 'purchases-capacitor';
    const { Purchases } = await import(/* @vite-ignore */ rcPackage);
    await Purchases.configure({ apiKey: REVENUECAT_GOOGLE_API_KEY });
  } catch (e) {
    console.log('Web ortamında RevenueCat simülasyon modunda.');
  }
};

export const purchaseAnnualPlan = async (): Promise<boolean> => {
  try {
    const rcPackage = 'purchases-capacitor';
    const { Purchases } = await import(/* @vite-ignore */ rcPackage);
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.annual !== null) {
      await Purchases.purchasePackage({ aPackage: offerings.current.annual });
      return true;
    }
    return false;
  } catch (e) {
    // Web ve dev ortamı için simülasyon dönüşü
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
