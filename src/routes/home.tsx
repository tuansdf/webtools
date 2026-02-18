import { Container, Card, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

const tools = [
  { href: "/base64-encoder", text: "Base64 Encoder" },
  { href: "/base64-decoder", text: "Base64 Decoder" },
  { href: "/hex-to-utf8", text: "Hex To UTF8 Converter" },
  { href: "/image-compressor", text: "Image Compressor" },
  { href: "/lorem", text: "Lorem Generator" },
  { href: "/mock-data", text: "Mock Data Generator" },
  { href: "/qr-code-generator", text: "QR Code Generator" },
  { href: "/uuid-generator", text: "UUID Generator" },
  { href: "/password-generator", text: "Password Generator" },
  { href: "/username-generator", text: "Username Generator" },
  { href: "/bulk-url-opener", text: "Bulk URL Opener" },
];

export default function Home() {
  return (
    <Container size="xl" p="md">
      <Stack gap="xs">
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href} style={{ textDecoration: "none" }}>
            <Card
              p="sm"
              withBorder
              style={{ cursor: "pointer", transition: "opacity 100ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Text fw={600}>{tool.text}</Text>
            </Card>
          </Link>
        ))}
      </Stack>
    </Container>
  );
}
