import { Header } from "@/components/layout/header.tsx";
import { Alert } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { CopyableInput } from "@/components/ui/copyable-input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { decodeBase64 } from "@/features/base64/base64.util.ts";
import { debounce } from "@/utils/common.util.ts";
import { useLocation, useSearchParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";

export default function Base64DecoderPage() {
  const [input, setInput] = createSignal<string>("");
  const [output, setOutput] = createSignal<string>("");
  const [withCompression, setWithCompression] = createSignal<boolean>(false);
  const [isUrlSafe, setIsUrlSafe] = createSignal<boolean>(false);
  const [errorMessage, setErrorMessage] = createSignal<string>("");
  const [processingTime, setProcessingTime] = createSignal<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const handleSubmit = () => {
    try {
      setErrorMessage("");
      if (!input()) return setOutput("");
      const start = performance.now();
      setOutput(decodeBase64(input(), { url: isUrlSafe(), compression: withCompression() }));
      setProcessingTime(performance.now() - start);
    } catch {
      setErrorMessage("Invalid data");
    }
  };

  const handleSubmitDebounced = debounce(handleSubmit);

  const shareableURL = () => {
    return `${window.location.origin}${window.location.pathname}?url=${isUrlSafe()}&zlib=${withCompression()}#${input()}`;
  };

  onMount(() => {
    setInput((location.hash.substring(1) as string) || "");
    setIsUrlSafe(searchParams.url === "true");
    setWithCompression(searchParams.zlib === "true");
    handleSubmit();
  });

  return (
    <>
      <Header title="Base64 Decoder" />

      <div class="container-xxl p-3">
        <Show when={errorMessage()}>
          <Alert variant="danger" class="mb-3">
            {errorMessage()}
          </Alert>
        </Show>
        <form class="d-flex flex-column gap-3">
          <Textarea
            label="Input"
            value={input()}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              handleSubmitDebounced();
            }}
            rows={12}
            letterCount={input().length}
          />
          <div class="d-flex flex-column gap-3 align-items-start">
            <Checkbox
              label="URL-safe"
              checked={isUrlSafe()}
              onInput={(e) => {
                const checked = e.currentTarget.checked;
                setIsUrlSafe(checked);
                setSearchParams({ url: checked }, { replace: true });
                handleSubmitDebounced();
              }}
            />
            <Checkbox
              label="Decompress with zlib after decoding"
              checked={withCompression()}
              onInput={(e) => {
                const checked = e.currentTarget.checked;
                setWithCompression(checked);
                setSearchParams({ zlib: checked }, { replace: true });
                handleSubmitDebounced();
              }}
            />
          </div>
          <Textarea label="Output" value={output()} readOnly rows={12} letterCount={output().length} />
          <CopyableInput label="Shareable URL" readOnly value={shareableURL()} />
          <Show when={processingTime() === 0 || processingTime()}>
            <div class="text-end font-monospace">done in {processingTime()}ms</div>
          </Show>
        </form>
      </div>
    </>
  );
}
