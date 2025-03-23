import { Box, Container, Switch, Typography } from '@mui/material';
import { Feature } from '../api/services/features.service';
import { useFeatureStore } from '../store/featureStore';
import { useToggleFeature } from '../api/hooks/useFeatures';

export const FeaturesPage = () => {
  const { features } = useFeatureStore();

  const { mutateAsync: toggleFeature } = useToggleFeature();

  const handleFeatureToggle = async (feature: Feature) => {
    await toggleFeature({
      featureId: feature.featureId,
      isEnabled: !feature.isEnabled,
    });
  };

  return (
    <Container>
      <Typography variant="h4" align="center">
        List of Features
      </Typography>
      {features.map((feature) => (
        <Box
          key={feature.featureId}
          sx={{
            display: 'grid',
            gridTemplateColumns: '175px 1fr',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: {
              lg: '900px',
              md: '100%',
              sm: '100%',
            },
          }}
        >
          <Typography variant="body1">{feature.featureName}</Typography>
          <Switch
            checked={feature.isEnabled}
            onClick={() => handleFeatureToggle(feature)}
          />
        </Box>
      ))}
    </Container>
  );
};
