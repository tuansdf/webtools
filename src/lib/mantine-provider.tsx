import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import {
  ActionIcon,
  Button,
  Card,
  MantineProvider as AMantineProvider,
  TextInput,
  Textarea,
  createTheme,
} from "@mantine/core";

import type { PropsWithChildren } from "react";
import type { MantineColorsTuple } from "@mantine/core";

const accent: MantineColorsTuple = [
  "#e0fffe",
  "#b3f5f1",
  "#84ebe5",
  "#54e2d8",
  "#2ad9cd",
  "#1ac0b4",
  "#0d968c",
  "#026c64",
  "#00423d",
  "#001816",
];

const theme = createTheme({
  primaryColor: "accent",
  primaryShade: { light: 6, dark: 5 },
  colors: {
    accent,
  },
  autoContrast: true,
  fontFamily:
    "'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono Variable', 'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  defaultRadius: "md",
  headings: {
    fontWeight: "700",
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: "md",
        shadow: "sm",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: "md",
      },
    }),
  },
});

export function MantineProvider(props: PropsWithChildren) {
  return (
    <AMantineProvider theme={theme} defaultColorScheme="dark">
      {props.children}
    </AMantineProvider>
  );
}
