import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["ru", "en", "de", "fr", "ja", "zh", "ar", "tr", "fa"];

// Define a default locale
const defaultLocale = "en";

// Get the preferred locale, similar to the example in the docs
function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get the best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Fallback to accept-language header if no languages
  if (!languages.length) {
    const acceptLanguage = request.headers.get("accept-language");
    languages = acceptLanguage ? [acceptLanguage] : [];
  }

  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|sitemap.xml|robots.txt|favicon.ico).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
