import { useState } from "react";
import { Button, Container, Stack, Textarea } from "@mantine/core";

import { validateUrl } from "@/utils/common.util.ts";

export default function BulkUrlOpenerPage() {
  const [urls, setUrls] = useState("");

  const handleSubmit = () => {
    if (!urls) return;
    urls.split("\n").forEach((url) => {
      url = url.trim();
      if (!url) return;
      if (validateUrl(url)) {
        window.open(url);
      }
    });
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
          <Textarea
            label="URLs"
            rows={20}
            value={urls}
            onChange={(e) => setUrls(e.currentTarget.value)}
          />
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </Stack>
      </form>
    </Container>
  );
}
