import api from '@/shared/api';

import delay from '@/utils/delay';

export async function getAssetScriptTTS(query: string) {
  const result = await api.post('/api/assets/scripts/tts', { json: { query } }).json<AssetScript[]>();

  await delay(2_000);

  return result;
}
