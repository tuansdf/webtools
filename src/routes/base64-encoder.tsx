import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Checkbox,
  Container,
  CopyButton,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { utf8ToBytes } from "@noble/ciphers/utils.js";
import { base64, base64urlnopad } from "@scure/base";
import { useLocation, useSearchParams } from "react-router";
import Pako from "pako";

import { CopyableInput } from "@/components/copyable-input.tsx";
import { debounce } from "@/utils/common.util.ts";

const MAX_LENGTH = 1000000;

export const encode = (
  input: string,
  options: { url?: boolean; compression?: boolean } = {},
): string => {
  const encodeFn = options.url ? base64urlnopad.encode : base64.encode;
  if (options.compression) {
    return encodeFn(Pako.deflate(input));
  }
  return encodeFn(utf8ToBytes(input));
};

export default function Base64EncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isUrl = searchParams.get("url") === "true";
  const isCompression = searchParams.get("compression") === "true";

  const handleSubmit = useCallback(() => {
    try {
      if (!input) {
        setOutput("");
        return;
      }
      const start = performance.now();
      setOutput(encode(input, { url: isUrl, compression: isCompression }));
      setProcessingTime(performance.now() - start);
    } catch {}
  }, [input, isUrl, isCompression]);

  const handleSubmitDebounced = useMemo(() => debounce(handleSubmit), [handleSubmit]);

  const encoderUrl = `${window.location.origin}/base64-encoder${location.search}#${encodeURIComponent(input)}`;
  const decoderUrl = `${window.location.origin}/base64-decoder${location.search}#${encodeURIComponent(output)}`;

  useEffect(() => {
    setInput(decodeURIComponent(window.location.hash.substring(1) || ""));
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <Container size="xl" p="md">
      <Stack gap="md">
        <Textarea
          label="Input"
          value={input}
          onChange={(e) => {
            setInput(e.currentTarget.value);
            handleSubmitDebounced();
          }}
          rows={10}
          maxLength={MAX_LENGTH}
          styles={{ input: { fontFamily: "var(--mantine-font-family-monospace)" } }}
          description={`${input.length}${MAX_LENGTH ? `/${MAX_LENGTH}` : ""}`}
        />
        <Checkbox
          label="URL-safe"
          checked={isUrl}
          onChange={(e) => {
            setSearchParams(
              (prev) => {
                prev.set("url", String(e.currentTarget.checked));
                return prev;
              },
              { replace: true },
            );
          }}
        />
        <Checkbox
          label="Compress with zlib before encoding"
          checked={isCompression}
          onChange={(e) => {
            setSearchParams(
              (prev) => {
                prev.set("compression", String(e.currentTarget.checked));
                return prev;
              },
              { replace: true },
            );
          }}
        />
        <Textarea
          label="Output"
          value={output}
          readOnly
          rows={10}
          styles={{ input: { fontFamily: "var(--mantine-font-family-monospace)" } }}
          description={`${output.length}`}
          rightSection={
            <CopyButton value={output}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"}>
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          }
        />
        {processingTime != null && (
          <Text ta="right" ff="monospace" size="sm">
            done in {processingTime}ms
          </Text>
        )}
        <CopyableInput label="Encoder URL" value={encoderUrl} />
        <CopyableInput label="Decoder URL" value={decoderUrl} />
      </Stack>
    </Container>
  );
}
