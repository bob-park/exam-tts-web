import api from '@/shared/api';

export async function getAsset(assetId: number) {
  return api.get(`/api/assets/${assetId}`).json<Asset>();
}
