import { Header } from "@/components/layout/header.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { clamp } from "@/utils/common.util.ts";
import { customAlphabet } from "nanoid";
import { createSignal } from "solid-js";

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
  let alphabets = [];
  if (features.uppercase) {
    alphabets.push(UPPERCASE);
  }
  if (features.lowercase) {
    alphabets.push(LOWERCASE);
  }
  if (features.numbers) {
    alphabets.push(NUMBERS);
  }
  if (features.symbols) {
    alphabets.push(SYMBOLS);
  }
  return generate(alphabets.join(""), length);
};

export default function PasswordGeneratorPage() {
  const [copied, setCopied] = createSignal<boolean>(false);
  const [output, setOutput] = createSignal<string>("");
  const [length, setLength] = createSignal<string>("8");
  const [uppercase, setUppercase] = createSignal<boolean>(true);
  const [lowercase, setLowercase] = createSignal<boolean>(true);
  const [numbers, setNumbers] = createSignal<boolean>(true);
  const [symbols, setSymbols] = createSignal<boolean>(true);
  let copiedDeb: ReturnType<typeof setTimeout> | null = null;

  const handleSubmit = () => {
    try {
      setOutput(
        generateByFeatures(
          { uppercase: uppercase(), lowercase: lowercase(), numbers: numbers(), symbols: symbols() },
          Number(length() || "0"),
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  handleSubmit();

  return (
    <>
      <Header title="Password Generator" />

      <div class="container-xxl p-3">
        <form
          class="d-flex flex-column gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            label="Password length"
            type="number"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={length()}
            onInput={(e) => setLength(e.currentTarget.value)}
            onBlur={() => {
              setLength((prev) => String(clamp(Number(prev), MIN_LENGTH, MAX_LENGTH)));
              handleSubmit();
            }}
          />
          <div class="d-flex flex-column gap-3 align-items-start">
            <Checkbox
              label="Uppercase"
              checked={uppercase()}
              onInput={(e) => {
                setUppercase(e.currentTarget.checked);
                handleSubmit();
              }}
            />
            <Checkbox
              label="Lowercase"
              checked={lowercase()}
              onInput={(e) => {
                setLowercase(e.currentTarget.checked);
                handleSubmit();
              }}
            />
            <Checkbox
              label="Numbers"
              checked={numbers()}
              onInput={(e) => {
                setNumbers(e.currentTarget.checked);
                handleSubmit();
              }}
            />
            <Checkbox
              label="Symbols"
              checked={symbols()}
              onInput={(e) => {
                setSymbols(e.currentTarget.checked);
                handleSubmit();
              }}
            />
          </div>
          <div>
            <Button type="submit">Generate</Button>
          </div>
          <Input
            label={`Output${copied() ? " (copied)" : " (click to copy)"}`}
            value={output()}
            readOnly
            onClick={async () => {
              if (!output().length) return;
              await navigator.clipboard.writeText(output());
              if (copiedDeb) {
                clearTimeout(copiedDeb);
              }
              setCopied(true);
              copiedDeb = setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
          />
        </form>
      </div>
    </>
  );
}
