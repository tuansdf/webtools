import { useState } from "react";
import { TextInput } from "@mantine/core";

export function CopyableInput({ label, value }: { label: string; value: string }) {
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
