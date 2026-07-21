import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mel",
  description: "Central de organização pessoal e jurídica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${questrial.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8F9FB]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
