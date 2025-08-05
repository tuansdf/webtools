import viteLegacyPlugin from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [solid(), tsconfigPaths(), viteLegacyPlugin()],
  worker: {
    plugins: () => [tsconfigPaths()],
  },
});
