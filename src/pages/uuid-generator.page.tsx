import { Header } from "@/components/layout/header.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CopyableInput } from "@/components/ui/copyable-input.js";
import { Select } from "@/components/ui/select.tsx";
import { createSignal } from "solid-js";
import * as uuid from "uuid";

const VERSION_TO_FN: Readonly<Record<number, () => string>> = {
  1: uuid.v1,
  4: uuid.v4,
  6: uuid.v6,
  7: uuid.v7,
};

export default function UUIDGeneratorPage() {
  const [version, setVersion] = createSignal<number>(1);
  const [result, setResult] = createSignal<string>("");

  const handleSubmit = () => {
    const fn = VERSION_TO_FN[version()] || uuid.v4;
    setResult(fn());
  };

  handleSubmit();

  return (
    <>
      <Header title="UUID Generator" />

      <div class="container-xxl p-3">
        <form class="d-flex flex-column gap-3">
          <Select containerClass="col-md" label="Version" onInput={(e) => setVersion(Number(e.currentTarget.value))}>
            <option value="1">UUID v1</option>
            <option value="4">UUID v4</option>
            <option value="6">UUID v6</option>
            <option value="7">UUID v7</option>
          </Select>
          <CopyableInput label="Result" value={result()} readOnly />
          <div>
            <Button type="button" onClick={handleSubmit}>
              Generate
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
