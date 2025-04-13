import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Get the base URL from environment variable or use a default
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://timer-stopwatch.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
