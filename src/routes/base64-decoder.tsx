import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  Checkbox,
  Container,
  CopyButton,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { bytesToUtf8 } from "@noble/ciphers/utils.js";
import { base64, base64urlnopad } from "@scure/base";
import { useLocation, useSearchParams } from "react-router";
import Pako from "pako";

import { debounce } from "@/utils/common.util.ts";

const MAX_LENGTH = 1000000;

export const decode = (
  input: string,
  options: { url?: boolean; compression?: boolean } = {},
): string => {
  const decodeFn = options.url ? base64urlnopad.decode : base64.decode;
  return options.compression
    ? Pako.inflate(decodeFn(input), { to: "string" })
    : bytesToUtf8(decodeFn(input));
};

export default function Base64DecoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isUrl = searchParams.get("url") === "true";
  const isCompression = searchParams.get("compression") === "true";

  const handleSubmit = useCallback(() => {
    try {
      setErrorMessage("");
      if (!input) {
        setOutput("");
        return;
      }
      const start = performance.now();
      setOutput(decode(input, { url: isUrl, compression: isCompression }));
      setProcessingTime(performance.now() - start);
    } catch {
      setErrorMessage("Invalid data");
    }
  }, [input, isUrl, isCompression]);

  const handleSubmitDebounced = useMemo(() => debounce(handleSubmit), [handleSubmit]);

  const decoderUrl = `${window.location.origin}/base64-decoder${location.search}#${encodeURIComponent(input)}`;
  const encoderUrl = `${window.location.origin}/base64-encoder${location.search}#${encodeURIComponent(output)}`;

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
          label="Decompress with zlib after decoding"
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
        <CopyableInput label="Decoder URL" value={decoderUrl} />
        <CopyableInput label="Encoder URL" value={encoderUrl} />
        {errorMessage && (
          <Alert color="red" title="Error">
            {errorMessage}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}

function CopyableInput({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <TextInput
      label={`${label}${copied ? " (copied)" : " (click to copy)"}`}
      value={value}
      readOnly
      onClick={handleCopy}
      styles={{ input: { cursor: "pointer" } }}
    />
  );
}
