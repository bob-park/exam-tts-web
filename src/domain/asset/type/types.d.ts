type FileType = 'HI_RES' | 'LOW_RES'

interface AssetScript {
  id: number;
  assetId: number;
  contents: string;
  description?: string;
  inPoint: number;
  outPoint: number;
}

interface AssetFile {
  id: number;
  fileType: FileType;
  filePath: string;
  fileSize: number;
}

interface Asset {
  id: number;
  title: string;
  videoFps?: number;
  videoDuration?: number;
  files?: AssetFile[]
}
