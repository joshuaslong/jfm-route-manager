'use client';

import { useState, useEffect, useCallback } from 'react';

export type SortOption = 'dispatch_time' | 'route_code';
export type LayoutOption = 'grid' | 'list';

interface ShippingPreferences {
  sortBy: SortOption;
  layout: LayoutOption;
}

const STORAGE_KEY = 'shipping-preferences';

const defaultPreferences: ShippingPreferences = {
  sortBy: 'dispatch_time',
  layout: 'grid',
};

export function useShippingPreferences() {
  const [preferences, setPreferences] = useState<ShippingPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          sortBy: parsed.sortBy || defaultPreferences.sortBy,
          layout: parsed.layout || defaultPreferences.layout,
        });
      }
    } catch (e) {
      console.error('Error loading shipping preferences:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage when they change
  const updatePreferences = useCallback((updates: Partial<ShippingPreferences>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {
        console.error('Error saving shipping preferences:', e);
      }
      return newPrefs;
    });
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    updatePreferences({ sortBy });
  }, [updatePreferences]);

  const setLayout = useCallback((layout: LayoutOption) => {
    updatePreferences({ layout });
  }, [updatePreferences]);

  return {
    sortBy: preferences.sortBy,
    layout: preferences.layout,
    setSortBy,
    setLayout,
    isLoaded,
  };
}
