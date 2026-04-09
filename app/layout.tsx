import type { Metadata } from "next";
import "./globals.css";
import BfcacheRefresh from "./components/BfcacheRefresh";

export const metadata: Metadata = {
  title: "OFFmine",
  description: "Minecraft сервер с контентом",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">
        <BfcacheRefresh />
        {children}
      </body>
    </html>
  );
}
