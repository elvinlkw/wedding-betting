import { Feature } from '../api/services/features.service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FeatureStore = {
  features: Feature[];
  featuresMap: Map<string, Feature>;
  setFeatures: (features: Feature[]) => void;
};

export const useFeatureStore = create<FeatureStore>()(
  devtools(
    (set) => ({
      features: [],
      featuresMap: new Map(),
      setFeatures: (features: Feature[]) =>
        set(() => {
          const featuresMap = new Map(
            features.map((feature) => [feature.featureKey, feature])
          );
          return {
            features,
            featuresMap,
          };
        }),
    }),
    {
      serialize: {
        options: true, // Enable serialization for devtools
        replacer: (_key: string, value: unknown) => {
          if (value instanceof Map) {
            return Object.fromEntries(value); // Convert Map to a plain object
          }
          return value;
        },
        reviver: (_key: string, value: unknown) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return new Map(Object.entries(value)); // Convert plain object back to Map
          }
          return value;
        },
      },
      name: 'FeatureStore',
    }
  )
);
