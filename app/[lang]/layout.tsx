import type React from "react";
import { getDictionary } from "@/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { rtlLanguages } from "@/lib/languages";
import { Inter } from "next/font/google";
import Analytics from "@/components/analytics";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
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
    openGraph: {
      title: dictionary.title,
      description: dictionary.description,
      images: [
        {
          url: "/logo2.png",
          width: 1200,
          height: 630,
          alt: dictionary.title,
        },
      ],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.title,
      description: dictionary.description,
      images: ["/logo2.png"],
    },
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
        <Analytics />
      </body>
    </html>
  );
}
