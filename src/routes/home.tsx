import { Card, Container, Group, Text } from "@mantine/core";
import {
  IconBinary,
  IconBinaryOff,
  IconColorSwatch,
  IconCursorText,
  IconFileZip,
  IconKey,
  IconLink,
  IconNotes,
  IconQrcode,
  IconUser,
  IconId,
} from "@tabler/icons-react";
import { Link } from "react-router";

import classes from "./home.module.css";

const tools = [
  { href: "/base64-encoder", text: "Base64 Encoder", icon: IconBinary },
  { href: "/base64-decoder", text: "Base64 Decoder", icon: IconBinaryOff },
  { href: "/hex-to-utf8", text: "Hex To UTF8 Converter", icon: IconColorSwatch },
  { href: "/image-compressor", text: "Image Compressor", icon: IconFileZip },
  { href: "/lorem", text: "Lorem Generator", icon: IconNotes },
  { href: "/mock-data", text: "Mock Data Generator", icon: IconCursorText },
  { href: "/qr-code-generator", text: "QR Code Generator", icon: IconQrcode },
  { href: "/uuid-generator", text: "UUID Generator", icon: IconId },
  { href: "/password-generator", text: "Password Generator", icon: IconKey },
  { href: "/username-generator", text: "Username Generator", icon: IconUser },
  { href: "/bulk-url-opener", text: "Bulk URL Opener", icon: IconLink },
];

export default function Home() {
  return (
    <Container size="xl" p="md">
      <div className={classes.grid}>
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href} className={classes.cardLink}>
            <Card p="md" className={classes.card}>
              <Group gap="sm" wrap="nowrap">
                <tool.icon size={22} className={classes.cardIcon} />
                <Text fw={600} size="sm">
                  {tool.text}
                </Text>
              </Group>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
