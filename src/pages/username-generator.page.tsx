import { Header } from "@/components/layout/header.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";
import {
  DEFAULT_OPTIONS,
  generateUsernames,
  type SeparatorStyle,
  type UsernameOptions,
} from "@/features/username/username.ts";
import { clamp } from "@/utils/common.util.ts";
import { createSignal, For } from "solid-js";

const MIN_SYLLABLES = 2;
const MAX_SYLLABLES = 6;
const MIN_COUNT = 1;
const MAX_COUNT = 50;

export default function UsernameGeneratorPage() {
  const [options, setOptions] = createSignal<UsernameOptions>({ ...DEFAULT_OPTIONS });
  const [count, setCount] = createSignal<string>("8");
  const [results, setResults] = createSignal<string[]>([]);
  const [copiedIndex, setCopiedIndex] = createSignal<number>(-1);

  let copiedTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleGenerate = () => {
    setResults(generateUsernames(options(), clamp(Number(count() || "8"), MIN_COUNT, MAX_COUNT)));
  };

  const handleCopy = async (value: string, index: number) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedIndex(index);
    copiedTimeout = setTimeout(() => setCopiedIndex(-1), 1000);
  };

  const updateOption = <K extends keyof UsernameOptions>(key: K, value: UsernameOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  handleGenerate();

  return (
    <>
      <Header title="Username Generator" />

      <div class="container-xxl p-3">
        <form
          class="d-flex flex-column gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
        >
          <div class="row g-3">
            <div class="col-md-6">
              <Input
                label="Syllable count"
                type="number"
                min={MIN_SYLLABLES}
                max={MAX_SYLLABLES}
                value={String(options().syllableCount)}
                onInput={(e) => updateOption("syllableCount", Number(e.currentTarget.value))}
                onBlur={() => {
                  updateOption("syllableCount", clamp(options().syllableCount, MIN_SYLLABLES, MAX_SYLLABLES));
                  handleGenerate();
                }}
              />
            </div>
            <div class="col-md-6">
              <Input
                label="Quantity"
                type="number"
                min={MIN_COUNT}
                max={MAX_COUNT}
                value={count()}
                onInput={(e) => setCount(e.currentTarget.value)}
                onBlur={() => {
                  setCount((prev) => String(clamp(Number(prev), MIN_COUNT, MAX_COUNT)));
                  handleGenerate();
                }}
              />
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <Select
                label="Separator"
                value={options().separator}
                onInput={(e) => {
                  updateOption("separator", e.currentTarget.value as SeparatorStyle);
                  handleGenerate();
                }}
              >
                <option value="none">None</option>
                <option value="underscore">Underscore (_)</option>
                <option value="hyphen">Hyphen (-)</option>
                <option value="dot">Dot (.)</option>
              </Select>
            </div>
          </div>

          <div class="d-flex flex-column gap-3 align-items-start">
            <Checkbox
              label="Include numbers"
              checked={options().includeNumbers}
              onInput={(e) => {
                updateOption("includeNumbers", e.currentTarget.checked);
                handleGenerate();
              }}
            />
            <Checkbox
              label="Capitalize"
              checked={options().capitalize}
              onInput={(e) => {
                updateOption("capitalize", e.currentTarget.checked);
                handleGenerate();
              }}
            />
          </div>

          <div>
            <Button type="submit">Generate</Button>
          </div>

          <div>
            <label class="form-label">Results (click to copy)</label>
            <div class="d-flex flex-column gap-1">
              <For each={results()}>
                {(username, i) => (
                  <div
                    class="form-control bg-dark text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(username, i())}
                  >
                    {username}
                    {copiedIndex() === i() && (
                      <span class="text-success ms-2" style={{ "font-size": "0.85em" }}>
                        ✓ copied
                      </span>
                    )}
                  </div>
                )}
              </For>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
