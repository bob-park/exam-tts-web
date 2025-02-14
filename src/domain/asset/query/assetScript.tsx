import { getAssetScriptTTS } from '@/domain/asset/api/assetScript';

import { useMutation } from '@tanstack/react-query';

export function useAssetScriptTTS(onSuccess?: (data: AssetScript[]) => void) {
  const { mutate, isPending } = useMutation({
    mutationKey: ['assets', 'scripts', 'tts'],
    mutationFn: (query: string) => getAssetScriptTTS(query),
    onSuccess: (data: AssetScript[]) => {
      onSuccess && onSuccess(data);
    },
  });

  return { textToSql: mutate, isLoading: isPending };
}
