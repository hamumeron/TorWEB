import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";

const app = express();
app.use(cors());

const torAgent = new SocksProxyAgent("socks5h://tor-exit-node:9050"); 

app.get("/", (req, res) => {
  res.send("✅ Kor Tor Proxy is running.");
});

app.get("/proxy", async (req, res) => {
  const target = decodeURIComponent(req.query.url || "");
  if (!/^https?:\/\//.test(target)) {
    return res.status(400).send("❌ URLが不正です");
  }

  try {
    const response = await fetch(target, { agent: torAgent });
    const contentType = response.headers.get("content-type") || "text/plain";
    res.set("content-type", contentType);

    if (contentType.includes("text/html")) {
      const html = await response.text();
      res.send(html);
    } else {
      const buffer = await response.buffer();
      res.send(buffer);
    }
  } catch (err) {
    res.status(500).send("❌ 通信エラー: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
