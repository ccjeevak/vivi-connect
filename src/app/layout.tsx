import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import ClientProvider from "./ClientProvider";
import '@stream-io/video-react-sdk/dist/css/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "vivi-connect",
  description: "Connect limitlessly with vivi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientProvider>
            <NavBar />
            <main className="mx-auto max-w-5xl p-3">{children}</main>
          </ClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
