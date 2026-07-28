import { siteUrl } from "../data/seoHelpers.js";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
