import { useState } from "react";
import {
  Container,
  Grid,
  Group,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";

import {
  DEFAULT_FILE_TYPE,
  DEFAULT_MAX_SIZE,
  DEFAULT_MAX_WIDTH_OR_HEIGHT,
  DEFAULT_QUALITY,
  MAX_MAX_SIZE,
  MAX_MAX_WIDTH_OR_HEIGHT,
  MAX_QUALITY,
  MIN_MAX_SIZE,
  MIN_MAX_WIDTH_OR_HEIGHT,
  MIN_QUALITY,
} from "@/features/compress-image/compress-image.constant.ts";
import CompressImageWorker from "@/features/compress-image/compress-image.worker.ts?worker";
import { useWorker } from "@/hooks/use-worker.ts";
import { downloadFile } from "@/utils/file.util.ts";

import type {
  CompressImageOptions,
  CompressImageWorkerParams,
} from "@/features/compress-image/compress-image.type.ts";

export default function ImageCompressorPage() {
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(DEFAULT_MAX_WIDTH_OR_HEIGHT);
  const [maxSize, setMaxSize] = useState(DEFAULT_MAX_SIZE);
  const [fileType, setFileType] = useState(DEFAULT_FILE_TYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const worker = useWorker<CompressImageWorkerParams, File[]>(() => new CompressImageWorker());

  const handleCompressImages = async (files: File[]) => {
    try {
      if (!files?.length) return;
      setIsLoading(true);
      const start = performance.now();
      const compressOptions: CompressImageOptions = {
        quality,
        maxWidthOrHeight,
        fileType,
        maxSize,
      };
      const compressedFiles = await worker.postMessage({ files, options: compressOptions });
      compressedFiles.forEach((file) => {
        downloadFile(file);
      });
      setProcessingTime(performance.now() - start);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xl" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Stack gap="md">
        <Dropzone onDrop={handleCompressImages} accept={IMAGE_MIME_TYPE} multiple>
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <IconUpload size={52} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={52} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={52} stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size="lg" inline>
                Drag your file(s) or click here
              </Text>
            </div>
          </Group>
        </Dropzone>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NativeSelect
              label="File type"
              value={fileType}
              onChange={(e) => setFileType(e.currentTarget.value)}
              data={[
                { value: "image/jpeg", label: "jpeg" },
                { value: "image/webp", label: "webp" },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Quality"
              value={quality}
              onChange={(val) => setQuality(Number(val))}
              min={MIN_QUALITY}
              max={MAX_QUALITY}
              step={0.05}
              decimalScale={2}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Max width or height"
              value={maxWidthOrHeight}
              onChange={(val) => setMaxWidthOrHeight(Number(val))}
              min={MIN_MAX_WIDTH_OR_HEIGHT}
              max={MAX_MAX_WIDTH_OR_HEIGHT}
              step={100}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Max size (MB)"
              value={maxSize}
              onChange={(val) => setMaxSize(Number(val))}
              min={MIN_MAX_SIZE}
              max={MAX_MAX_SIZE}
              step={0.5}
              decimalScale={2}
            />
          </Grid.Col>
        </Grid>

        {processingTime != null && (
          <Text ta="right" ff="monospace" size="sm">
            done in {processingTime}ms
          </Text>
        )}
      </Stack>
    </Container>
  );
}
