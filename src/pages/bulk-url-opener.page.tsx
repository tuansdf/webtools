import { Header } from "@/components/layout/header.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { validateUrl } from "@/utils/common.util.ts";
import { createSignal } from "solid-js";

export default function BulkUrlOpenerPage() {
  const [urls, setUrls] = createSignal<string>("");

  const handleSubmit = () => {
    if (!urls()) return;
    urls()
      .split("\n")
      .forEach((url) => {
        url = url.trim();
        if (!url) return;
        if (validateUrl(url)) {
          window.open(url);
        }
      });
  };

  return (
    <>
      <Header title="Bulk URL Opener" />

      <div class="container-xxl p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Textarea label="URLs" rows={20} value={urls()} onInput={(e) => setUrls(e.currentTarget.value)} />
          <Button class="mt-3">Submit</Button>
        </form>
      </div>
    </>
  );
}
