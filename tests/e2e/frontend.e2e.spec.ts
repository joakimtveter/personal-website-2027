import { expect, test } from "@playwright/test";

import {
  cleanupRelatedPosts,
  relatedPostsFixture,
  seedRelatedPosts,
} from "../helpers/seedRelatedPosts";

test.describe("Frontend", () => {
  test("redirects the root to a locale and renders the home page", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page).toHaveURL(/\/(nb|en)$/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("picks the locale from Accept-Language", async ({ browser }) => {
    // The browser derives its Accept-Language header from the context locale
    const context = await browser.newContext({ locale: "nb-NO" });
    const page = await context.newPage();

    await page.goto("http://localhost:3000");

    await expect(page).toHaveURL(/\/nb$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await context.close();
  });

  test("redirects paths without a locale to the default locale", async ({ page }) => {
    await page.goto("http://localhost:3000/posts");

    await expect(page).toHaveURL(/\/nb\/posts$/);
  });

  test("switches language from the header", async ({ page }) => {
    await page.goto("http://localhost:3000/nb/posts");

    await page.locator('header a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/posts$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1").first()).toHaveText("Posts");
  });

  test("renders a 404 for unknown pages", async ({ page }) => {
    const response = await page.goto("http://localhost:3000/en/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.locator("h1").first()).toHaveText("404");
  });

  test("serves robots.txt and sitemaps", async ({ request }) => {
    const robots = await request.get("http://localhost:3000/robots.txt");
    expect(await robots.text()).toContain("Sitemap: ");

    for (const path of ["/sitemap.xml", "/pages-sitemap.xml", "/posts-sitemap.xml"]) {
      const response = await request.get(`http://localhost:3000${path}`);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("application/xml");
    }
  });

  test("refuses previews without a valid secret and session", async ({ request }) => {
    const response = await request.get(
      "http://localhost:3000/preview?path=/nb&previewSecret=nope",
      {
        maxRedirects: 0,
      },
    );

    expect(response.status()).toBe(403);
  });

  test("should not load Payload admin styles or fonts", async ({ page }) => {
    await page.goto("http://localhost:3000/nb");

    const payloadFontFamily = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--font-family-sans").trim(),
    );

    expect(payloadFontFamily).toBe("");
    await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
  });

  test("should not load Payload component styles", async ({ page }) => {
    await page.goto("http://localhost:3000/nb");

    await expect
      .poll(() =>
        page.evaluate(() =>
          getComputedStyle(document.body).getPropertyValue("--payload-ui-barrel-loaded").trim(),
        ),
      )
      .toBe("");
  });

  test.describe("post detail", () => {
    test.beforeAll(async () => {
      await seedRelatedPosts();
    });

    test.afterAll(async () => {
      await cleanupRelatedPosts();
    });

    test("should render related post cards with their image and category", async ({ page }) => {
      await page.goto(`http://localhost:3000/nb/posts/${relatedPostsFixture.postSlug}`);

      await expect(page.locator("h1")).toHaveText(relatedPostsFixture.postTitle);

      const postCards = page.locator("article article");

      const relatedCard = postCards.filter({
        has: page.getByRole("link", { name: relatedPostsFixture.relatedPostTitle }),
      });

      await expect(relatedCard).toHaveCount(1);
      await expect(relatedCard.locator("img")).toBeAttached();
      await expect(relatedCard).toContainText(relatedPostsFixture.categoryTitle);
    });

    test("hides posts that are not published in the requested locale", async ({ page }) => {
      const response = await page.goto(
        `http://localhost:3000/en/posts/${relatedPostsFixture.postSlug}`,
      );

      expect(response?.status()).toBe(404);
    });
  });
});
