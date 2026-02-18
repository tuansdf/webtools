import { useEffect, useId, useRef, useState } from "react";
import { Button, Container, Stack, TextInput } from "@mantine/core";
import QRCode from "qrcode";

import { debounce } from "@/utils/common.util.ts";

const setContentDebounced = debounce((fn: (v: string) => void, value: string) => fn(value), 200);

export default function QrCodeGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!content) return;
    QRCode.toCanvas(document.getElementById(id), content, {
      width: 320,
      errorCorrectionLevel: "H",
      margin: 2,
    });
  }, [content, id]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qrcode-${new Date().getTime()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="md">
        <TextInput
          placeholder="Enter your content"
          value={content}
          onChange={(e) => setContentDebounced(setContent, e.currentTarget.value)}
        />
        {content && (
          <>
            <canvas id={id} ref={canvasRef} style={{ display: "block" }} />
            <div>
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </>
        )}
      </Stack>
    </Container>
  );
}
