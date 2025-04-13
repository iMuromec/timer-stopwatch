import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { getDictionary } from "@/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const dictionary = getDictionary(lang);

  return {
    title: dictionary.title,
    description: dictionary.description,
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = params;
  const dictionary = getDictionary(lang);
  const isRtl = ["ar", "fa"].includes(lang);

  return (
    <html lang={lang} dir={isRtl ? "rtl" : "ltr"}>
      <body className={`${inter.variable} font-inter`}>
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher currentLang={lang} />
        </div>
        {children}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [
    { lang: "ru" },
    { lang: "en" },
    { lang: "de" },
    { lang: "fr" },
    { lang: "ja" },
    { lang: "zh" },
    { lang: "ar" },
    { lang: "tr" },
    { lang: "fa" },
  ];
}
