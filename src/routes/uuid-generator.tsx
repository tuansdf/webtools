import { useEffect, useState } from "react";
import { Button, Container, NativeSelect, Stack, TextInput } from "@mantine/core";
import * as uuid from "uuid";

const VERSION_TO_FN: Readonly<Record<number, () => string>> = {
  1: uuid.v1,
  4: uuid.v4,
  6: uuid.v6,
  7: uuid.v7,
};

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState(1);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    const fn = VERSION_TO_FN[version] || uuid.v4;
    setResult(fn());
  };

  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="md">
        <NativeSelect
          label="Version"
          value={String(version)}
          onChange={(e) => setVersion(Number(e.currentTarget.value))}
          data={[
            { value: "1", label: "UUID v1" },
            { value: "4", label: "UUID v4" },
            { value: "6", label: "UUID v6" },
            { value: "7", label: "UUID v7" },
          ]}
        />
        <TextInput
          label={`Result${copied ? " (copied)" : " (click to copy)"}`}
          value={result}
          readOnly
          onClick={handleCopy}
          styles={{ input: { cursor: "pointer" } }}
        />
        <div>
          <Button onClick={handleSubmit}>Generate</Button>
        </div>
      </Stack>
    </Container>
  );
}
