import Cookies from 'js-cookie';
import apiClient from '../interceptors';

export type Feature = {
  featureId: number;
  featureName: string;
  featureKey: string;
  featureDescription: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type ReqBody = {
  featureName: string;
  featureKey: string;
  featureDescription?: string;
  isEnabled: boolean;
};

class features {
  async getFeatures() {
    const response = await apiClient.get('/api/features');
    return response.data;
  }

  async getFeature(id: number) {
    const response = await apiClient.get(`/api/features/${id}`);
    return response.data;
  }

  async createFeature(reqBody: ReqBody) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await apiClient.post('/api/features', reqBody, config);
    return response.data;
  }

  async updateFeature(id: number, reqBody: ReqBody) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await apiClient.put(
      `/api/features/${id}`,
      reqBody,
      config
    );
    return response.data;
  }

  async toggleFeature(id: number, isEnabled: boolean) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await apiClient.patch(
      `/api/features/${id}`,
      { isEnabled },
      config
    );
    return response.data;
  }
}

export default new features();
