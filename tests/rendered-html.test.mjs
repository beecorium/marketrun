import assert from "node:assert/strict";
import test from "node:test";
import { unstable_dev } from "wrangler";

const rootTitle = /<title>마켓런-보령편 \| 왕을 구한 보부상<\/title>/i;
const rootDescription =
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']QR을 따라 보령 전통시장을 누비며 쌍목화솜을 완성하는 30분 모바일 미션투어["'])[^>]*>/i;

test("renders the built root page metadata in the Workers runtime", async () => {
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
    const response = await worker.fetch("http://localhost/", {
      headers: { accept: "text/html" },
    });

    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
    );
    const html = await response.text();
    assert.match(html, rootTitle);
    assert.match(html, rootDescription);
  } finally {
    await worker.stop();
  }
});
