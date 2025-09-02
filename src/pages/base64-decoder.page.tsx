import { Header } from "@/components/layout/header.tsx";
import { Alert } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { CopyableInput } from "@/components/ui/copyable-input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { debounce } from "@/utils/common.util.ts";
import { bytesToUtf8 } from "@noble/ciphers/utils";
import { base64, base64urlnopad } from "@scure/base";
import { useLocation, useSearchParams } from "@solidjs/router";
import Pako from "pako";
import { createSignal, onMount, Show } from "solid-js";

const MAX_LENGTH = 1000000;

export default function Base64DecoderPage() {
  const [input, setInput] = createSignal<string>("");
  const [output, setOutput] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string>("");
  const [processingTime, setProcessingTime] = createSignal<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams<{ url?: string; compression?: string }>();
  const location = useLocation();

  const handleSubmit = () => {
    try {
      setErrorMessage("");
      if (!input()) {
        return setOutput("");
      }
      const start = performance.now();
      setOutput(
        decode(input(), { url: searchParams.url === "true", compression: searchParams.compression === "true" }),
      );
      setProcessingTime(performance.now() - start);
    } catch {
      setErrorMessage("Invalid data");
    }
  };

  const handleSubmitDebounced = debounce(handleSubmit);

  const decoderUrl = () => {
    return `${window.location.origin}/base64-decoder${location.search}#${encodeURIComponent(input())}`;
  };
  const encoderUrl = () => {
    return `${window.location.origin}/base64-encoder${location.search}#${encodeURIComponent(output())}`;
  };

  onMount(() => {
    setInput(decodeURIComponent(location.hash.substring(1) || ""));
    setSearchParams({ url: searchParams.url === "true", compression: searchParams.compression === "true" });
    handleSubmit();
  });

  return (
    <>
      <Header title="Base64 Decoder" />

      <div class="container-xxl p-3">
        <form class="d-flex flex-column gap-3">
          <Textarea
            class="font-monospace"
            label="Input"
            value={input()}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              handleSubmitDebounced();
            }}
            rows={10}
            letterCount={input().length}
            maxLength={MAX_LENGTH}
          />
          <div class="d-flex flex-column gap-3 align-items-start">
            <Checkbox
              label="URL-safe"
              checked={searchParams.url === "true"}
              onInput={(e) => {
                setSearchParams({ url: e.currentTarget.checked }, { replace: true });
                handleSubmitDebounced();
              }}
            />
            <Checkbox
              label="Decompress with zlib after decoding"
              checked={searchParams.compression === "true"}
              onInput={(e) => {
                setSearchParams({ compression: e.currentTarget.checked }, { replace: true });
                handleSubmitDebounced();
              }}
            />
          </div>
          <Textarea
            class="font-monospace"
            label="Output"
            value={output()}
            readOnly
            rows={10}
            letterCount={output().length}
            copyable
          />
          <Show when={processingTime() === 0 || processingTime()}>
            <div class="text-end font-monospace">done in {processingTime()}ms</div>
          </Show>
          <CopyableInput label="Decoder URL" readOnly value={decoderUrl()} />
          <CopyableInput label="Encoder URL" readOnly value={encoderUrl()} />
          <Show when={errorMessage()}>
            <Alert variant="danger" class="mt-3">
              {errorMessage()}
            </Alert>
          </Show>
        </form>
      </div>
    </>
  );
}

export const decode = (input: string, options: { url?: boolean; compression?: boolean } = {}): string => {
  const decodeFn = options.url ? base64urlnopad.decode : base64.decode;
  return options.compression ? Pako.inflate(decodeFn(input), { to: "string" }) : bytesToUtf8(decodeFn(input));
};
