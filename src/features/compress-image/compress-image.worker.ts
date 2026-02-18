import type { CompressImageWorkerParams } from "@/features/compress-image/compress-image.type.ts";
import { compressImages } from "@/features/compress-image/compress-image.util.ts";

self.onmessage = async function (e) {
  try {
    const options = e.data as CompressImageWorkerParams;
    postMessage(await compressImages(options.files, options.options));
  } catch {
    postMessage(e.data);
  }
};
