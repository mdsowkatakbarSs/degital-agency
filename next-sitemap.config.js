/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://viralscale.vercel.app",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" },
      { userAgent: "*", disallow: "/login" },
    ],
  },
};
