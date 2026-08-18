import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://crm.avexainsurance.ca/", {
      headers: {
        accept: "text/html",
        host: "crm.avexainsurance.ca",
        "x-forwarded-host": "crm.avexainsurance.ca",
        "x-forwarded-proto": "https",
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the canonical Avexa identity", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Avexa Insurance CRM<\/title>/i);
  assert.match(html, />Avexa</);
  assert.doesNotMatch(html, /Harbor Insurance CRM/i);
  assert.match(html, /https:\/\/crm\.avexainsurance\.ca\/og\.png/i);
});
