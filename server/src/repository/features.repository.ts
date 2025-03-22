import { QueryResult } from 'pg';
import pool from '../db';

type FeatureModel = {
  feature_id: number;
  feature_name: string;
  feature_key: string;
  feature_description?: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export const findAll = async (): Promise<QueryResult<FeatureModel[]>> => {
  return pool.query('SELECT * FROM features');
};

export const findById = async (
  id: string
): Promise<QueryResult<FeatureModel>> => {
  return pool.query('SELECT * FROM features WHERE feature_id = $1', [id]);
};

type FeatureCreateBody = {
  featureName: string;
  featureKey: string;
  featureDescription?: string;
  isEnabled: boolean;
};

export const create = async ({
  featureName,
  featureKey,
  featureDescription,
  isEnabled,
}: FeatureCreateBody) => {
  return pool.query(
    `INSERT INTO features (
      feature_name,
      feature_key,
      feature_description,
      is_enabled
    ) VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [featureName, featureKey, featureDescription, isEnabled]
  );
};

export const update = async (
  featureId: string | number,
  { featureName, featureKey, featureDescription, isEnabled }: FeatureCreateBody
) => {
  return pool.query(
    `UPDATE features
    SET feature_name = $1,
        feature_key = $2,
        feature_description = $3,
        is_enabled = $4
    WHERE feature_id = $5
    RETURNING *`,
    [featureName, featureKey, featureDescription, isEnabled, featureId]
  );
};

export const patch = async (
  featureId: string | number,
  {
    featureName,
    featureKey,
    featureDescription,
    isEnabled,
  }: Partial<FeatureCreateBody>
) => {
  const fieldsToUpdate = [];
  const values = [];
  let query = 'UPDATE features SET ';

  if (featureName !== undefined) {
    fieldsToUpdate.push('feature_name = $' + (fieldsToUpdate.length + 1));
    values.push(featureName);
  }

  if (featureKey !== undefined) {
    fieldsToUpdate.push('feature_key = $' + (fieldsToUpdate.length + 1));
    values.push(featureKey);
  }

  if (featureDescription !== undefined) {
    fieldsToUpdate.push(
      'feature_description = $' + (fieldsToUpdate.length + 1)
    );
    values.push(featureDescription);
  }

  if (isEnabled !== undefined) {
    fieldsToUpdate.push('is_enabled = $' + (fieldsToUpdate.length + 1));
    values.push(isEnabled);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error('No fields to update');
  }

  query +=
    fieldsToUpdate.join(', ') +
    ' WHERE feature_id = $' +
    (fieldsToUpdate.length + 1) +
    ' RETURNING *';
  values.push(featureId);

  return pool.query(query, values);
};
