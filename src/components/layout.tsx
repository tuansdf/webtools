import { ActionIcon, Container, Group, Title } from "@mantine/core";
import { IconArrowLeft, IconTools } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router";

import classes from "./layout.module.css";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <header className={classes.header}>
        <Container size="xl" py={0} className={classes.headerInner}>
          <Group gap="xs">
            {!isHome && (
              <ActionIcon component={Link} to="/" variant="subtle" size="sm">
                <IconArrowLeft size={16} />
              </ActionIcon>
            )}
            <Group gap={6}>
              <IconTools size={20} style={{ color: "var(--mantine-primary-color-filled)" }} />
              <Title order={1} size="h5" fw={700}>
                <Link to="/" className={classes.logoLink}>
                  WebTools
                </Link>
              </Title>
            </Group>
          </Group>
        </Container>
      </header>
      <Outlet />
    </>
  );
}
