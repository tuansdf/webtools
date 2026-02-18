import { useEffect, useState } from "react";
import { Button, Checkbox, Container, NumberInput, Stack, TextInput } from "@mantine/core";
import { customAlphabet } from "nanoid";

import { clamp } from "@/utils/common.util.ts";

const MIN_LENGTH = 1;
const MAX_LENGTH = 1_000;
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:',.<>/?";

const generate = (alphabet: string, length: number) => {
  if (!alphabet.length || length <= 0) return "";
  return customAlphabet(alphabet, length)();
};

const generateByFeatures = (
  features: { uppercase?: boolean; lowercase?: boolean; numbers?: boolean; symbols?: boolean },
  length: number,
) => {
  const alphabets = [];
  if (features.uppercase) alphabets.push(UPPERCASE);
  if (features.lowercase) alphabets.push(LOWERCASE);
  if (features.numbers) alphabets.push(NUMBERS);
  if (features.symbols) alphabets.push(SYMBOLS);
  return generate(alphabets.join(""), length);
};

export default function PasswordGeneratorPage() {
  const [output, setOutput] = useState("");
  const [length, setLength] = useState(8);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    try {
      setOutput(generateByFeatures({ uppercase, lowercase, numbers, symbols }, length));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Container size="xl" p="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Stack gap="md">
          <NumberInput
            label="Password length"
            value={length}
            onChange={(val) => setLength(Number(val))}
            onBlur={() => {
              setLength((prev) => clamp(prev, MIN_LENGTH, MAX_LENGTH));
              handleSubmit();
            }}
            min={MIN_LENGTH}
            max={MAX_LENGTH}
          />
          <Checkbox
            label="Uppercase"
            checked={uppercase}
            onChange={(e) => {
              setUppercase(e.currentTarget.checked);
              handleSubmit();
            }}
          />
          <Checkbox
            label="Lowercase"
            checked={lowercase}
            onChange={(e) => {
              setLowercase(e.currentTarget.checked);
              handleSubmit();
            }}
          />
          <Checkbox
            label="Numbers"
            checked={numbers}
            onChange={(e) => {
              setNumbers(e.currentTarget.checked);
              handleSubmit();
            }}
          />
          <Checkbox
            label="Symbols"
            checked={symbols}
            onChange={(e) => {
              setSymbols(e.currentTarget.checked);
              handleSubmit();
            }}
          />
          <div>
            <Button type="submit">Generate</Button>
          </div>
          <TextInput
            label={`Output${copied ? " (copied)" : " (click to copy)"}`}
            value={output}
            readOnly
            onClick={handleCopy}
            styles={{
              input: { cursor: "pointer", fontFamily: "var(--mantine-font-family-monospace)" },
            }}
          />
        </Stack>
      </form>
    </Container>
  );
}
