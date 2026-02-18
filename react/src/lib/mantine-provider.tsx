import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider as AMantineProvider, createTheme } from "@mantine/core";
import type { PropsWithChildren } from "react";

const theme = createTheme({});

export function MantineProvider(props: PropsWithChildren) {
  return <AMantineProvider theme={theme}>{props.children}</AMantineProvider>;
}
