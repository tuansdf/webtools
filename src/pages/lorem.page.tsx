import { Header } from "@/components/layout/header.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { MAX_WORD_COUNT, MIN_WORD_COUNT } from "@/features/lorem/lorem.constant.ts";
import { generateLoremWordsWorker, initLoremWorker, terminateLoremWorker } from "@/features/lorem/lorem.util.ts";
import { debounce } from "@/utils/common.util.ts";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

export default function LoremPage() {
  const [output, setOutput] = createSignal<string>("");
  const [wordCount, setWordCount] = createSignal<number>(0);
  const [processingTime, setProcessingTime] = createSignal<number | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    const start = performance.now();
    let count = wordCount();
    setOutput(await generateLoremWordsWorker(count));
    setProcessingTime(performance.now() - start);
    setIsLoading(false);
  };

  const handleWordCountChange = () => {
    setWordCount((prev) => {
      if (!prev || prev < MIN_WORD_COUNT) prev = MIN_WORD_COUNT;
      if (prev > MAX_WORD_COUNT) prev = MAX_WORD_COUNT;
      return prev;
    });
  };

  const handleSubmitDebounced = debounce(handleSubmit);

  onMount(() => {
    initLoremWorker();
  });
  onCleanup(() => {
    terminateLoremWorker();
  });

  return (
    <>
      <Header title="Lorem Ipsum Generator" />

      <form
        class="container-xxl p-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitDebounced();
        }}
      >
        <div class="row row-cols-sm-2 row-cols-lg-3">
          <Input
            label="Word count"
            type="number"
            min={MIN_WORD_COUNT}
            max={MAX_WORD_COUNT}
            value={wordCount()}
            onInput={(e) => setWordCount(Number(e.currentTarget.value))}
            onBlur={handleWordCountChange}
            containerClass="mb-3 col"
          />
        </div>

        <Textarea label="Output" value={output()} readOnly rows={12} letterCount={output().length} copyable />

        <Button type="submit">Generate</Button>

        <Show when={processingTime() === 0 || processingTime()}>
          <div class="text-end font-monospace mt-3">done in {processingTime()}ms</div>
        </Show>
      </form>

      <Show when={isLoading()}>
        <ScreenLoading />
      </Show>
    </>
  );
}
