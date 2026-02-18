import { MantineProvider } from "@/lib/mantine-provider";
import { RouterProvider } from "@/lib/router-provider";

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider />
    </MantineProvider>
  );
}
