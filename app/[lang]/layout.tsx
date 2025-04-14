import type React from "react";
import { getDictionary } from "@/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { rtlLanguages } from "@/lib/languages";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return {
    title: dictionary.title,
    description: dictionary.description,
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  const isRtl = rtlLanguages.includes(lang);

  return (
    <html lang={lang} dir={isRtl ? "rtl" : "ltr"}>
      <link rel="icon" href="/favicon.svg" sizes="any" />
      <body className={`${inter.variable} font-inter`}>
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher currentLang={lang} />
        </div>
        {children}
      </body>
    </html>
  );
}
