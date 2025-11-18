import type { Metadata } from "next";
import "./globals.css";
import { Box } from "@/components/atoms/box/box";
import { Sidebar } from "@/components/organisms/sidebar/sidebar";
import { Header } from "@/components/organisms/header/header";

export const metadata: Metadata = {
  title: "업무 관리 시스템",
  description: "Business workspace dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Box className="flex min-h-screen bg-neutral-50">
          <Sidebar />
          <Box className="flex flex-1 flex-col">
            <Header />
            <Box className="flex-1 p-6">{children}</Box>
          </Box>
        </Box>
      </body>
    </html>
  );
}
