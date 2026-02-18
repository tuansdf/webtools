import { ActionIcon, Container, Group, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <header style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}>
        <Container
          size="xl"
          py={0}
          style={{ height: "3rem", display: "flex", alignItems: "center" }}
        >
          <Group gap="xs">
            {!isHome && (
              <ActionIcon component={Link} to="/" variant="subtle" size="sm">
                <IconArrowLeft size={16} />
              </ActionIcon>
            )}
            <Title order={1} size="h5" fw={600}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                WebTools
              </Link>
            </Title>
          </Group>
        </Container>
      </header>
      <Outlet />
    </>
  );
}
