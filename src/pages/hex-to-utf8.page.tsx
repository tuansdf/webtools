import { Header } from "@/components/layout/header.tsx";
import { CopyableInput } from "@/components/ui/copyable-input.js";
import { Textarea } from "@/components/ui/textarea.tsx";
import { debounce } from "@/utils/common.util.ts";
import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils";
import { createSignal, onMount } from "solid-js";

export default function HexToUtf8Page() {
  const [input, setInput] = createSignal<string>("");
  const [output, setOutput] = createSignal<string>("");

  const handleSubmit = () => {
    try {
      if (!input()) return setOutput("");
      setOutput(bytesToUtf8(hexToBytes(input())));
    } catch {}
  };

  const handleSubmitDebounced = debounce(handleSubmit);

  const shareableURL = () => {
    return `${window.location.origin}${location.pathname}#${input()}`;
  };

  onMount(() => {
    setInput((window.location.hash.substring(1) as string) || "");
    handleSubmit();
  });

  return (
    <>
      <Header title="Hex To UTF8 Converter" />

      <div class="container-xxl p-3">
        <form class="d-flex flex-column gap-3">
          <Textarea
            label="Input"
            value={input()}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              handleSubmitDebounced();
            }}
            rows={10}
            letterCount={input().length}
          />
          <Textarea label="Output" value={output()} readOnly rows={10} letterCount={output().length} />
          <CopyableInput label="Share" readOnly value={shareableURL()} />
        </form>
      </div>
    </>
  );
}
