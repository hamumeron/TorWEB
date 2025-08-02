import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";

const app = express();
app.use(cors());

const agent = new SocksProxyAgent("socks5h://127.0.0.1:9050");

app.get("/proxy", async (req, res) => {
  const url = decodeURIComponent(req.query.url || "");
  if (!/^https?:\/\//.test(url)) return res.status(400).send("Invalid URL");

  try {
    const response = await fetch(url, { agent });
    const text = await response.text();
    res.set("content-type", "text/html");
    res.send(text);
  } catch (e) {
    res.status(500).send("Tor Proxy Error: " + e.message);
  }
});

app.listen(8080, () => console.log("✅ Tor proxy listening on 8080"));
