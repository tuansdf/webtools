import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionIcon, Container, CopyButton, Stack, Textarea, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { useLocation } from "react-router";

import { CopyableInput } from "@/components/copyable-input.tsx";
import { debounce } from "@/utils/common.util.ts";

export default function HexToUtf8Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const location = useLocation();

  const handleSubmit = useCallback(() => {
    try {
      if (!input) {
        setOutput("");
        return;
      }
      setOutput(bytesToUtf8(hexToBytes(input)));
    } catch {}
  }, [input]);

  const handleSubmitDebounced = useMemo(() => debounce(handleSubmit), [handleSubmit]);

  const shareableURL = `${window.location.origin}${location.pathname}#${input}`;

  useEffect(() => {
    setInput(window.location.hash.substring(1) || "");
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
          description={`${input.length}`}
        />
        <Textarea
          label="Output"
          value={output}
          readOnly
          rows={10}
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
        <CopyableInput label="Share" value={shareableURL} />
      </Stack>
    </Container>
  );
}
