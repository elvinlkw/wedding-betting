import { useFeatureStore } from '../store/featureStore';

export const useFeatureFlag = (featureFlag: string) => {
  const { featuresMap } = useFeatureStore();

  return featuresMap.get(featureFlag)?.isEnabled || false;
};
