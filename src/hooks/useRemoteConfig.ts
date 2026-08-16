import { useState, useEffect, useCallback } from 'react';

export interface RemoteConfig {
  showStoreLinks: boolean;
  loading: boolean;
  toggleShowStoreLinks: () => void;
  setShowStoreLinks: (value: boolean) => void;
}

const CONFIG_URL = 'https://config.example.com/remote-config.json';

const DEFAULT_CONFIG = {
  showStoreLinks: false,
};

export function useRemoteConfig(): RemoteConfig {
  const [showStoreLinks, setShowStoreLinks] = useState(
    DEFAULT_CONFIG.showStoreLinks
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(CONFIG_URL)
      .then((res) => {
        if (!res.ok) throw new Error('config fetch failed');
        return res.json();
      })
      .then((data: { showStoreLinks?: boolean }) => {
        if (cancelled) return;
        if (typeof data.showStoreLinks === 'boolean') {
          setShowStoreLinks(data.showStoreLinks);
        }
      })
      .catch(() => {
        // network not available in sandbox; keep default
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleShowStoreLinks = useCallback(() => {
    setShowStoreLinks((prev) => !prev);
  }, []);

  return {
    showStoreLinks,
    loading,
    toggleShowStoreLinks,
    setShowStoreLinks,
  };
}
