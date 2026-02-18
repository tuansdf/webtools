import { useEffect, useRef, useState } from "react";
import { Container, LoadingOverlay, Stack, Textarea } from "@mantine/core";

import {
  generateMockDataJsonString,
  initMockDataWorker,
  terminateMockDataWorker,
} from "@/features/mock-data/mock-data.util.ts";
import { debounce } from "@/utils/common.util.ts";

const handleSubmitDebounced = debounce((_submit: () => void) => _submit(), 300);

export default function MockDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initMockDataWorker();
    }
    return () => {
      terminateMockDataWorker();
    };
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      if (!input) return;
      const req = JSON.parse(input);
      const data = await generateMockDataJsonString(req);
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
