import featuresService, { Feature } from '../services/features';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFeatureStore } from '../../store/featureStore';

export const useFeatures = () => {
  return useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: featuresService.getFeatures,
  });
};

export const useToggleFeature = () => {
  const queryClient = useQueryClient();
  const { setFeatures } = useFeatureStore();

  return useMutation({
    mutationFn: ({
      featureId,
      isEnabled,
    }: {
      featureId: number;
      isEnabled: boolean;
    }) => {
      return featuresService.toggleFeature(featureId, isEnabled);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Feature[]>(['features'], (oldData) => {
        const newData = oldData?.map((feature) => {
          if (feature.featureId === data.featureId) {
            return data;
          }

          return feature;
        });

        setFeatures(newData || []);

        return newData;
      });
    },
  });
};
