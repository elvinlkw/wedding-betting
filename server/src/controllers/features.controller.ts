import { Request, Response } from 'express';
import pool from '../db';
import { ErrorType } from '../types';
import { featuresRepository } from '../repository';
import camelcaseKeys from 'camelcase-keys';

type FeatureResponse = {
  featureId: number;
  featureName: string;
  featureKey: string;
  featureDescription?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export const getFeatures = async (
  req: Request,
  res: Response<FeatureResponse[] | ErrorType>
) => {
  try {
    const features = await featuresRepository.findAll();
    res.json(
      features.rows.map(
        (feature) =>
          camelcaseKeys(feature, { deep: true }) as unknown as FeatureResponse
      )
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getFeature = async (
  req: Request<{ id: string }>,
  res: Response<FeatureResponse | ErrorType>
) => {
  try {
    const features = await featuresRepository.findById(req.params.id);

    if (features.rowCount === 0) {
      res.status(404).json({
        message: `Feature flag with id '${req.params.id}' not found.`,
      });
      return;
    }

    res.json(
      camelcaseKeys(features.rows[0], { deep: true }) as FeatureResponse
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

type FeaturesRequestBody = {
  featureName: string;
  featureKey: string;
  featureDescription?: string;
  isEnabled: boolean;
};

export const createFeature = async (
  req: Request<{}, {}, FeaturesRequestBody>,
  res: Response<FeatureResponse | ErrorType>
) => {
  try {
    const { featureName, featureKey, featureDescription, isEnabled } = req.body;

    const newFeature = await featuresRepository.create({
      featureName,
      featureKey,
      featureDescription,
      isEnabled,
    });

    res.json(camelcaseKeys(newFeature.rows[0], { deep: true }));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const updateFeature = async (
  req: Request<{ id: string }, {}, FeaturesRequestBody>,
  res: Response<FeatureResponse | ErrorType>
) => {
  try {
    const featureId = req.params.id;
    const newFeature = await featuresRepository.update(featureId, req.body);

    res.json(camelcaseKeys(newFeature.rows[0], { deep: true }));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const patchFeature = async (
  req: Request<{ id: string }, {}, FeaturesRequestBody>,
  res: Response<FeatureResponse | ErrorType>
) => {
  try {
    const featureId = req.params.id;
    const feature = await featuresRepository.findById(featureId);

    if (!feature.rowCount) {
      res.status(404).json({
        message: `Feature flag with id '${featureId}' not found.`,
      });
      return;
    }

    const { featureName, featureKey, featureDescription, isEnabled } = req.body;

    const updatedFeature = await featuresRepository.patch(featureId, {
      featureName,
      featureKey,
      featureDescription,
      isEnabled,
    });

    res.json(camelcaseKeys(updatedFeature.rows[0], { deep: true }));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
};
