import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import GlobalSnackbar from "@/components/GlobalSnackbar"; // ✅ Import Global Alert Component
import "./global.css";

export const metadata = {
  title: "AI-Powered Tile Design & 3D Visualization",
  description: "AI-driven tile design, visualization, and management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#03C9D7" />
        <Providers>
          <MyApp>{children}</MyApp>
          <GlobalSnackbar /> {/* ✅ Added Global Snackbar for Alert Management */}
        </Providers>
      </body>
    </html>
  );
}
