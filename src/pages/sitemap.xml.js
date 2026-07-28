import { blogTopics, keywordPages, localAreas } from "../data/seoContent.generated.js";
import { keywordRouteSlug, localRouteSlug, siteUrl } from "../data/seoHelpers.js";

const staticPages = [
  "",
  "about",
  "admissions",
  "age-groups",
  "book-a-tour",
  "book-a-visit",
  "contact-us",
  "environment",
  "location",
  "parent-info",
  "services",
  "team",
  "young-innovators-camp-uae",
  "branches/khalidiya",
  "branches/al-reem",
  "branches/mirdif",
  "html-sitemap"
];

const urls = [
  ...staticPages.map((slug) => `${siteUrl}/${slug ? `${slug}/` : ""}`),
  ...localAreas.map((area) => `${siteUrl}/nursery-in-${localRouteSlug(area)}/`),
  ...keywordPages.map((page) => `${siteUrl}/${keywordRouteSlug(page, localAreas, keywordPages)}/`),
  ...blogTopics.map((topic) => `${siteUrl}/blog/${topic.slug}/`)
];

export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>${url.includes("/blog/") ? "monthly" : "weekly"}</changefreq>
    <priority>${url === `${siteUrl}/` ? "1.0" : "0.8"}</priority>
  </url>`
      )
      .join("\n")}\n</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml"
      }
    }
  );
}
