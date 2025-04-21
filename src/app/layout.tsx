import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { QueryProvider } from "./components/query-provider";

export const DMSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const PoppinsFont = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: {
    template: "%s | Market Place",
    default: "Market Place",
  },
  icons: "/favicon.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${DMSans.variable} ${PoppinsFont.variable} flex antialiased bg-background m-0 p-0 box-content w-screen h-screen`}>
        <Toaster richColors />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
