/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ytgrowthgear.shop")
    .trim()
    .replace(/\/+$/, ""),
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" },
      { userAgent: "*", disallow: "/login" },
    ],
  },
};
