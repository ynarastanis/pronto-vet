import type { Metadata } from "next";
import { Literata, Onest } from "next/font/google";
import { Tema } from "@/components/tema";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pronto Vet",
  description: "Templates de descrições cirúrgicas e anestésicas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${onest.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Tema>
          {children}
          <Toaster />
        </Tema>
      </body>
    </html>
  );
}
