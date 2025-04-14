import "@/app/globals.css";
import { languageCodes } from "@/lib/languages";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export async function generateStaticParams() {
  return languageCodes.map((lang) => ({ lang }));
}
