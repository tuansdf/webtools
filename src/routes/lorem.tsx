import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Container,
  CopyButton,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import { MAX_WORD_COUNT, MIN_WORD_COUNT } from "@/features/lorem/lorem.constant.ts";
import {
  generateLoremWordsWorker,
  initLoremWorker,
  terminateLoremWorker,
} from "@/features/lorem/lorem.util.ts";

export default function LoremPage() {
  const [output, setOutput] = useState("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initLoremWorker();
    }
    return () => {
      terminateLoremWorker();
    };
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    const start = performance.now();
    setOutput(await generateLoremWordsWorker(wordCount));
    setProcessingTime(performance.now() - start);
    setIsLoading(false);
  };

  return (
    <Container size="xl" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Stack gap="md">
          <NumberInput
            label="Word count"
            value={wordCount}
            onChange={(val) => setWordCount(Number(val))}
            min={MIN_WORD_COUNT}
            max={MAX_WORD_COUNT}
            maw={300}
          />

          <Textarea
            label="Output"
            value={output}
            readOnly
            rows={12}
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

          <div>
            <Button type="submit">Generate</Button>
          </div>

          {processingTime != null && (
            <Text ta="right" ff="monospace" size="sm">
              done in {processingTime}ms
            </Text>
          )}
        </Stack>
      </form>
    </Container>
  );
}
