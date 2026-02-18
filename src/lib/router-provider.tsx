import { lazy } from "react";
import { Navigate, RouterProvider as ARouterProvider, createBrowserRouter } from "react-router";

import Layout from "@/components/layout";

const Home = lazy(() => import("@/routes/home"));
const Base64Encoder = lazy(() => import("@/routes/base64-encoder"));
const Base64Decoder = lazy(() => import("@/routes/base64-decoder"));
const HexToUtf8 = lazy(() => import("@/routes/hex-to-utf8"));
const ImageCompressor = lazy(() => import("@/routes/image-compressor"));
const Lorem = lazy(() => import("@/routes/lorem"));
const MockData = lazy(() => import("@/routes/mock-data"));
const QrCodeGenerator = lazy(() => import("@/routes/qr-code-generator"));
const UuidGenerator = lazy(() => import("@/routes/uuid-generator"));
const PasswordGenerator = lazy(() => import("@/routes/password-generator"));
const UsernameGenerator = lazy(() => import("@/routes/username-generator"));
const BulkUrlOpener = lazy(() => import("@/routes/bulk-url-opener"));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "base64-encoder", Component: Base64Encoder },
      { path: "base64-decoder", Component: Base64Decoder },
      { path: "hex-to-utf8", Component: HexToUtf8 },
      { path: "image-compressor", Component: ImageCompressor },
      { path: "lorem", Component: Lorem },
      { path: "mock-data", Component: MockData },
      { path: "qr-code-generator", Component: QrCodeGenerator },
      { path: "uuid-generator", Component: UuidGenerator },
      { path: "password-generator", Component: PasswordGenerator },
      { path: "username-generator", Component: UsernameGenerator },
      { path: "bulk-url-opener", Component: BulkUrlOpener },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function RouterProvider() {
  return <ARouterProvider router={router} />;
}
