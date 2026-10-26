import { Forbidden, getPayload, Payload } from "payload";
import { describe, it, beforeAll, afterAll, expect } from "vitest";

import config from "#/payload.config";

let payload: Payload;

const slug = "int-test-locale-publishing";

describe("API", () => {
  beforeAll(async () => {
    const payloadConfig = await config;
    payload = await getPayload({ config: payloadConfig });
    await payload.delete({
      collection: "pages",
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
  });

  afterAll(async () => {
    await payload.delete({
      collection: "pages",
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
  });

  it("fetches users", async () => {
    const users = await payload.find({
      collection: "users",
      overrideAccess: true,
    });
    expect(users).toBeDefined();
  });

  it("does not expose users to anonymous requests", async () => {
    await expect(payload.find({ collection: "users", overrideAccess: false })).rejects.toThrow(
      Forbidden,
    );
  });

  it("hides drafts from anonymous requests", async () => {
    const page = await payload.create({
      collection: "pages",
      data: { _status: "draft", layout: [], slug, title: "Draft page" },
      draft: true,
      locale: "nb",
      overrideAccess: true,
    });

    const { totalDocs } = await payload.find({
      collection: "pages",
      locale: "nb",
      overrideAccess: false,
      where: { id: { equals: page.id } },
    });

    expect(totalDocs).toBe(0);
    await payload.delete({ collection: "pages", id: page.id, overrideAccess: true });
  });

  it("publishes per locale", async () => {
    const page = await payload.create({
      collection: "pages",
      data: {
        _status: "published",
        hero: { type: "none" },
        layout: [{ blockType: "content", columns: [] }],
        slug,
        title: "Publisert side",
      },
      locale: "nb",
      overrideAccess: true,
    });

    const findIn = (locale: "en" | "nb") =>
      payload.find({
        collection: "pages",
        locale,
        overrideAccess: false,
        where: { id: { equals: page.id } },
      });

    expect((await findIn("nb")).totalDocs).toBe(1);
    expect((await findIn("en")).totalDocs).toBe(0);

    await payload.update({
      collection: "pages",
      id: page.id,
      data: { _status: "published", title: "Published page" },
      locale: "en",
      overrideAccess: true,
    });

    const [english] = (await findIn("en")).docs;
    expect(english?.title).toBe("Published page");
  });
});
