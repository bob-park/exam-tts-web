import { getAsset } from '@/domain/asset/api/asset';

import { useQuery } from '@tanstack/react-query';

export function useAsset(assetId?: number) {
  const { data, isLoading } = useQuery<Asset>({
    queryKey: ['assets', assetId],
    queryFn: () => getAsset(assetId || 0),
    enabled: !!assetId,
  });

  return { asset: data, isLoading };
}
