import { useState } from "react";
import { Container, LoadingOverlay, Stack, Textarea } from "@mantine/core";

import MockDataWorker from "@/features/mock-data/mock-data.worker.ts?worker";
import { useWorker } from "@/hooks/use-worker.ts";
import { debounce } from "@/utils/common.util.ts";

import type { MockDataRequest } from "@/features/mock-data/mock-data.type.ts";

const handleSubmitDebounced = debounce((_submit: () => void) => _submit(), 300);

export default function MockDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const worker = useWorker<MockDataRequest, string>(() => new MockDataWorker());

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!input) return;
      const req = JSON.parse(input);
      const data = await worker.postMessage(req);
      setOutput(data);
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
        <Textarea
          label="Input"
          value={input}
          onChange={(e) => {
            setInput(e.currentTarget.value);
            handleSubmitDebounced(handleSubmit);
          }}
          rows={12}
        />
        <Textarea label="Output" value={output} readOnly rows={12} />
      </Stack>
    </Container>
  );
}
