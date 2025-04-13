import { MetadataRoute } from "next";

// Define all supported languages from the dictionaries folder
const languages = ["ru", "en", "de", "fr", "ja", "zh", "ar", "tr", "fa"];

export default function sitemap(): MetadataRoute.Sitemap {
  // Get the base URL from environment variable or use a default
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://timer-stopwatch.com";

  // Create the root URL entry
  const rootUrl = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  };

  // Create entries for each language route
  const langRoutes = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Combine root URL with language routes
  return [rootUrl, ...langRoutes];
}
