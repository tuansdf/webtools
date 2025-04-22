export type CompressImageOptions = {
  fileType?: string;
  quality?: number;
  maxWidthOrHeight?: number;
  maxSize?: number;
};
export type CompressImageWorkerParams = {
  files: File[];
  options: CompressImageOptions;
};
