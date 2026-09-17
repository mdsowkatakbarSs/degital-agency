/**
 * Site audit — runs the same checks a human reviewer would:
 * every page × four viewports, the checkout flow, and infra endpoints.
 *
 * Usage:
 *   node scripts/site-audit.mjs                       # audits http://localhost:3000
 *   AUDIT_BASE_URL=https://example.com node scripts/site-audit.mjs
 *
 * Exit code: 0 = all checks pass, 1 = at least one failure.
 */
import process from "node:process";

const BASE = (process.env.AUDIT_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const WIDTHS = [320, 390, 768, 1440];
const HEIGHTS = { 320: 700, 390: 844, 768: 1024, 1440: 900 };
const FALLBACK_SLUGS = ["Youtube-Monetization-Support", "youtube-views", "youtube-500-subscribe"];

const results = [];
let jsErrors = [];

function record(name, ok, note = "") {
  results.push({ name, ok, note });
  console.log(` [${ok ? "PASS" : "FAIL"}] ${name}${note ? " " + note : ""}`);
}

async function withPage(browser, width, fn) {
  const page = await browser.newPage({ viewport: { width, height: HEIGHTS[width] } });
  jsErrors = [];
  page.on("pageerror", (e) => jsErrors.push(String(e)));
  try {
    await fn(page);
  } finally {
    await page.close();
  }
}

async function goto(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1200);
}

/** Shared per-page assertions. */
async function auditPage(page, name, width) {
  // Wait (capped) for in-flight images so loading images aren't counted as broken.
  await page.evaluate(() => {
    const pending = [...document.images].filter((i) => !i.complete);
    return Promise.race([
      Promise.all(pending.map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 8000)),
    ]);
  });
  const ov = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((i) => i.naturalWidth === 0 && i.offsetParent !== null)
      .map((i) => i.src.slice(0, 70))
  );
  const h1Ok = await page.evaluate(() => {
    const e = document.querySelector("h1");
    if (!e) return "n/a";
    const r = e.getBoundingClientRect();
    return r.left >= -1 && r.right <= window.innerWidth + 1;
  });
  const notes = [];
  if (ov.sw > ov.cw) notes.push("H-OVERFLOW");
  if (broken.length) notes.push(`broken=${JSON.stringify(broken)}`);
  if (h1Ok !== true && h1Ok !== "n/a") notes.push("H1-CLIPPED");
  if (jsErrors.length) notes.push(`jsErrs=${jsErrors.length}`);
  record(`${name}@${width}`, notes.length === 0, notes.join(" "));
}

async function fetchGigSlugs() {
  try {
    const res = await fetch(`${BASE}/api/gigs?platform=all`, { signal: AbortSignal.timeout(15000) });
    const j = await res.json();
    const list = Array.isArray(j) ? j : Array.isArray(j?.gigs) ? j.gigs : [];
    const slugs = list.map((g) => g?.slug).filter(Boolean);
    if (slugs.length) return slugs;
  } catch {
    /* fall through to static list */
  }
  console.log(" [info] could not discover gigs from API, using fallback slug list");
  return FALLBACK_SLUGS;
}

const { chromium } = await import("playwright");

/** Launch headless Chromium; fall back to the full build if only it is installed. */
async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    console.log(" [info] headless shell not found, using full Chromium build");
    return await chromium.launch({ channel: "chromium" });
  }
}
const browser = await launchBrowser();
console.log(`Auditing ${BASE} at widths: ${WIDTHS.join(", ")}`);

const gigSlugs = await fetchGigSlugs();
const isProd = BASE.includes("https://");

for (const width of WIDTHS) {
  // --- Homepage ---
  try {
    await withPage(browser, width, async (page) => {
      await goto(page, "/");
      await auditPage(page, "home", width);
      if (width === 390) {
        const vp = await page.evaluate(() => {
          const m = document.querySelector('meta[name="viewport"]');
          return !!m && (m.getAttribute("content") || "").includes("device-width");
        });
        record(`viewport-meta@390`, vp);
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(700);
        const collapsed = await page.evaluate(() => {
          const el = document.querySelector("div.z-50 > div");
          return el ? Math.round(el.getBoundingClientRect().height) : -1;
        });
        record(`banner-collapse@390`, collapsed === 0, `(h=${collapsed}px)`);
      }
    });
  } catch (e) {
    record(`home@${width}`, false, `EXC ${String(e).slice(0, 60)}`);
  }

  // --- Gig detail pages ---
  for (const slug of gigSlugs) {
    try {
      await withPage(browser, width, async (page) => {
        await goto(page, `/gigs/${encodeURIComponent(slug)}`);
        if (page.url().includes("/gigs/")) {
          await auditPage(page, `gig:${slug.slice(0, 20)}`, width);
          if (width === 390) {
            const bar = await page.evaluate(() => {
              const el = document.querySelector(".fixed.bottom-0");
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { h: Math.round(r.height), on: r.top < window.innerHeight };
            });
            const ok = bar === null || (bar.on && bar.h <= 140);
            record(`stickybar:${slug.slice(0, 20)}@390`, ok, bar ? `(h=${bar.h})` : "(none)");
          }
        } else {
          record(`gig:${slug.slice(0, 20)}@${width}`, false, "(not a gig page — bad slug?)");
        }
      });
    } catch (e) {
      record(`gig:${slug.slice(0, 20)}@${width}`, false, `EXC ${String(e).slice(0, 60)}`);
    }
  }

  // --- Checkout flow (never submits a real order) ---
  if ([320, 390, 1440].includes(width)) {
    try {
      await withPage(browser, width, async (page) => {
        await goto(page, "/");
        const card = page.locator("a[href*='/gigs/']").first();
        await card.click();
        await page.waitForTimeout(1800);
        const cont = page.locator("button:has-text('Continue'):visible");
        if (!(await cont.count())) {
          record(`checkout:step1@${width}`, false, "(no visible Continue button)");
          return;
        }
        await cont.first().click();
        await page.waitForTimeout(1600);
        await auditPage(page, "checkout:step1", width);
        const confirm = page.locator("button:has-text('Confirm Purchase'):visible");
        if (await confirm.count()) {
          await confirm.first().click(); // advances to payment step only — no order created
          await page.waitForTimeout(1600);
          await auditPage(page, "checkout:step2", width);
        } else {
          record(`checkout:step2@${width}`, true, "(no confirm button — single-step flow)");
        }
      });
    } catch (e) {
      record(`checkout@${width}`, false, `EXC ${String(e).slice(0, 60)}`);
    }
  }

  // --- Login ---
  try {
    await withPage(browser, width, async (page) => {
      await goto(page, "/login");
      await auditPage(page, "login", width);
    });
  } catch (e) {
    record(`login@${width}`, false, `EXC ${String(e).slice(0, 60)}`);
  }
}

await browser.close();

// --- Infra: admin guard must redirect, robots/sitemap must serve ---
async function statusNoRedirect(url) {
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000) });
  return res.status;
}
try {
  const code = await statusNoRedirect(`${BASE}/admin`);
  record("admin-guard", [301, 302, 303, 307, 308].includes(code), `(${code})`);
} catch (e) {
  record("admin-guard", false, String(e).slice(0, 50));
}
for (const path of ["/robots.txt", "/sitemap-0.xml"]) {
  try {
    const code = await statusNoRedirect(`${BASE}${path}`);
    record(path, code === 200, `(${code})`);
  } catch (e) {
    record(path, false, String(e).slice(0, 50));
  }
}

const fails = results.filter((r) => !r.ok);
console.log(`\nTOTAL: ${results.length} | PASS: ${results.length - fails.length} | FAIL: ${fails.length}`);
process.exit(fails.length ? 1 : 0);
