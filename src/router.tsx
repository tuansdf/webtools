import { Navigate, Router as ARouter } from "@solidjs/router";
import { lazy } from "solid-js";

const routes = [
  {
    path: "/",
    component: lazy(() => import("@/pages/index.page.tsx")),
  },
  {
    path: "/base64-encoder",
    component: lazy(() => import("@/pages/base64-encoder.page.tsx")),
  },
  {
    path: "/base64-decoder",
    component: lazy(() => import("@/pages/base64-decoder.page.tsx")),
  },
  {
    path: "/hex-to-utf8",
    component: lazy(() => import("@/pages/hex-to-utf8.page.tsx")),
  },
  {
    path: "/image-compressor",
    component: lazy(() => import("@/pages/image-compressor.page.tsx")),
  },
  {
    path: "/mock-data",
    component: lazy(() => import("@/pages/mock-data.page.tsx")),
  },
  {
    path: "/lorem",
    component: lazy(() => import("@/pages/lorem.page.tsx")),
  },
  {
    path: "/qr-code-generator",
    component: lazy(() => import("@/pages/qr-code-generator.page.tsx")),
  },
  {
    path: "/uuid-generator",
    component: lazy(() => import("@/pages/uuid-generator.page.tsx")),
  },
  {
    path: "/password-generator",
    component: lazy(() => import("@/pages/password-generator.page.tsx")),
  },
  {
    path: "/username-generator",
    component: lazy(() => import("@/pages/username-generator.page.tsx")),
  },
  {
    path: "/bulk-url-opener",
    component: lazy(() => import("@/pages/bulk-url-opener.page.tsx")),
  },
  {
    path: "/*",
    component: () => <Navigate href="/" />,
  },
];

export const Router = () => {
  return <ARouter>{routes}</ARouter>;
};
