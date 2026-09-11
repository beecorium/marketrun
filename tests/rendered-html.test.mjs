import assert from "node:assert/strict";
import test from "node:test";
import { unstable_dev } from "wrangler";

const goldenTitle = /<title>황금 패랭이를 찾아라 \| 보령 꿀잼야행<\/title>/i;
const goldenDescription =
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']밤길에 숨은 세 개의 징표를 찾아 황금 패랭이를 완성하는 보령 전통시장 모바일 미션["'])[^>]*>/i;

test("renders the built golden page metadata in the Workers runtime", async () => {
  // The built worker imports the `cloudflare:workers` runtime module, which
  // Node's ESM loader cannot resolve. Exercise it in the local Workers runtime.
  const worker = await unstable_dev("./dist/server/index.js", {
    config: "./dist/server/wrangler.json",
    bundle: false,
    local: true,
    compatibilityDate: "2026-05-22",
    logLevel: "none",
    experimental: { disableDevRegistry: true },
  });

  try {
    const response = await fetch(`http://${worker.address}:${worker.port}/golden`, {
      headers: { accept: "text/html" },
    });

    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
    );
    const html = await response.text();
    assert.match(html, goldenTitle);
    assert.match(html, goldenDescription);
  } finally {
    await worker.stop();
  }
});
