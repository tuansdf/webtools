import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Grid,
  NativeSelect,
  NumberInput,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

import { DEFAULT_OPTIONS, generateUsernames } from "@/features/username/username.ts";
import { clamp } from "@/utils/common.util.ts";

import type { SeparatorStyle, UsernameOptions } from "@/features/username/username.ts";

const MIN_SYLLABLES = 2;
const MAX_SYLLABLES = 6;
const MIN_COUNT = 1;
const MAX_COUNT = 50;

export default function UsernameGeneratorPage() {
  const [options, setOptions] = useState<UsernameOptions>({ ...DEFAULT_OPTIONS });
  const [count, setCount] = useState(8);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const handleGenerate = () => {
    setResults(generateUsernames(options, clamp(count, MIN_COUNT, MAX_COUNT)));
  };

  const handleCopy = async (value: string, index: number) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 1000);
  };

  const updateOption = <K extends keyof UsernameOptions>(key: K, value: UsernameOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container size="xl" p="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Syllable count"
                value={options.syllableCount}
                onChange={(val) => updateOption("syllableCount", Number(val))}
                onBlur={() => {
                  updateOption(
                    "syllableCount",
                    clamp(options.syllableCount, MIN_SYLLABLES, MAX_SYLLABLES),
                  );
                  handleGenerate();
                }}
                min={MIN_SYLLABLES}
                max={MAX_SYLLABLES}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Quantity"
                value={count}
                onChange={(val) => setCount(Number(val))}
                onBlur={() => {
                  setCount((prev) => clamp(prev, MIN_COUNT, MAX_COUNT));
                  handleGenerate();
                }}
                min={MIN_COUNT}
                max={MAX_COUNT}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NativeSelect
                label="Separator"
                value={options.separator}
                onChange={(e) => {
                  updateOption("separator", e.currentTarget.value as SeparatorStyle);
                  handleGenerate();
                }}
                data={[
                  { value: "none", label: "None" },
                  { value: "underscore", label: "Underscore (_)" },
                  { value: "hyphen", label: "Hyphen (-)" },
                  { value: "dot", label: "Dot (.)" },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Checkbox
            label="Include numbers"
            checked={options.includeNumbers}
            onChange={(e) => {
              updateOption("includeNumbers", e.currentTarget.checked);
              handleGenerate();
            }}
          />
          <Checkbox
            label="Capitalize"
            checked={options.capitalize}
            onChange={(e) => {
              updateOption("capitalize", e.currentTarget.checked);
              handleGenerate();
            }}
          />

          <div>
            <Button type="submit">Generate</Button>
          </div>

          <div>
            <Text size="sm" fw={500} mb="xs">
              Results (click to copy)
            </Text>
            <Stack gap="xs">
              {results.map((username, i) => (
                <Paper
                  key={`${username}-${i}`}
                  p="xs"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCopy(username, i)}
                >
                  <Text ff="monospace">
                    {username}
                    {copiedIndex === i && (
                      <Text component="span" c="teal" size="sm" ml="sm">
                        ✓ copied
                      </Text>
                    )}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </div>
        </Stack>
      </form>
    </Container>
  );
}
