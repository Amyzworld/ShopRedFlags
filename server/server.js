const express = require("express");
const app = express();
const PORT = 3001;

const SHOPIFY_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = "2024-10";

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/products", async (_req, res) => {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    return res.json({
      products: [],
      shopDomain: SHOPIFY_DOMAIN || "",
      error: "Shopify credentials not configured. Add them in the Secrets page.",
    });
  }
  try {
    const url = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json?limit=50`;
    const resp = await fetch(url, {
      headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN },
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Shopify API ${resp.status}: ${text}`);
    }
    const data = await resp.json();
    const products = data.products.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      price: p.variants?.[0]?.price ?? null,
      variantId: p.variants?.[0]?.id ?? null,
      image: p.image?.src ?? null,
      available: p.variants?.[0]?.available ?? false,
      inventory: p.variants?.[0]?.inventory_quantity ?? null,
    }));
    res.json({ products, shopDomain: SHOPIFY_DOMAIN });
  } catch (err) {
    res.json({
      products: [],
      shopDomain: SHOPIFY_DOMAIN || "",
      error: err.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`API running on port ${PORT}`));
