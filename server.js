"use strict";
/*
  VIP Software Developers & Co. - backend (no npm packages needed)
  Run:   node server.js
  Env:   PORT (default 3000), ADMIN_TOKEN (required to view enquiries),
  TRUSTED_PROXY (optional IP allowed to supply X-Forwarded-For)
         NOTIFY_WEBHOOK (optional URL; each enquiry is POSTed there as JSON,
                         e.g. a Slack / Discord / Make / Zapier webhook)
         Email to admin (Gmail SMTP):
           SMTP_USER  your Gmail address, e.g. softwaresvip60@gmail.com
           SMTP_PASS  Gmail "App password" (16 letters, needs 2-Step Verification)
           MAIL_TO    where enquiries are delivered (default: SMTP_USER)
           SMTP_HOST / SMTP_PORT  default smtp.gmail.com / 465
*/
const http = require("http");
const fs = require("fs");
const path = require("path");
const tls = require("tls");

const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const TRUSTED_PROXY = process.env.TRUSTED_PROXY || "";
const NOTIFY_WEBHOOK = process.env.NOTIFY_WEBHOOK || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);

/* Minimal SMTP client over implicit TLS (port 465), no npm packages */
function sendMail(opt) {
  return new Promise(function (resolve, reject) {
    const sock = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST });
    let buf = "", waiter = null, finished = false;
    function fail(err) { if (finished) return; finished = true; sock.destroy(); reject(err); }
    sock.setTimeout(20000, function () { fail(new Error("SMTP timeout")); });
    sock.on("error", fail);
    sock.on("data", function (d) { buf += d.toString("utf8"); check(); });
    sock.on("close", function () { if (!finished) fail(new Error("SMTP connection closed")); });
    function check() {
      if (!waiter) return;
      const lines = buf.split("\r\n");
      const i = lines.findIndex(function (l) { return /^\d{3}( |$)/.test(l); });
      if (i < 0) return;
      buf = lines.slice(i + 1).join("\r\n");
      const w = waiter; waiter = null; w(lines[i]);
    }
    function read() { return new Promise(function (r) { waiter = r; check(); }); }
    async function cmd(line, ok) {
      if (line !== null) sock.write(line + "\r\n");
      const r = await read();
      if (ok.indexOf(r.slice(0, 3)) < 0) throw new Error("SMTP error: " + r);
    }
    const b64 = function (s) { return Buffer.from(s, "utf8").toString("base64"); };
    const oneLine = function (s) { return String(s).replace(/[\r\n]+/g, " ").trim(); };
    (async function () {
      await cmd(null, ["220"]);
      await cmd("EHLO vip-site", ["250"]);
      await cmd("AUTH LOGIN", ["334"]);
      await cmd(b64(SMTP_USER), ["334"]);
      await cmd(b64(SMTP_PASS), ["235"]);
      await cmd("MAIL FROM:<" + SMTP_USER + ">", ["250"]);
      await cmd("RCPT TO:<" + MAIL_TO + ">", ["250", "251"]);
      await cmd("DATA", ["354"]);
      const body = b64(opt.text).replace(/(.{76})/g, "$1\r\n");
      const msg = [
        "From: VIP Website <" + SMTP_USER + ">",
        "To: <" + MAIL_TO + ">",
        "Reply-To: <" + oneLine(opt.replyTo) + ">",
        "Subject: =?UTF-8?B?" + b64(oneLine(opt.subject)) + "?=",
        "Date: " + new Date(Date.now() + 19800000).toUTCString().replace("GMT", "+0530"),
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        body
      ].join("\r\n");
      await cmd(msg + "\r\n.", ["250"]);
      finished = true;
      sock.write("QUIT\r\n"); sock.end();
      resolve();
    })().catch(fail);
  });
}
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.jsonl");
const MAX_BODY = 20 * 1024;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp"
};
/* only these files are served publicly */
const PUBLIC_EXT = new Set(Object.keys(TYPES));
const BLOCKED = new Set(["server.js", "package.json", "package-lock.json", "vite.config.js"]);

fs.mkdirSync(DATA_DIR, { recursive: true });

/* simple in-memory rate limit: 5 enquiries / 10 min per IP */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}
function clientIp(req) {
  const remote = req.socket.remoteAddress || "";
  const forwarded = req.headers["x-forwarded-for"];
  if (TRUSTED_PROXY && remote === TRUSTED_PROXY && typeof forwarded === "string")
    return forwarded.split(",")[0].trim() || remote;
  return remote;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some(t => now - t < 600000)) hits.delete(k); }, 600000).unref();

function send(res, code, body, headers, head) {
  const h = Object.assign({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }, headers || {});
  res.writeHead(code, h);
  res.end(head ? undefined : body);
}
function json(res, code, obj, head) {
  send(res, code, JSON.stringify(obj), { "Content-Type": "application/json", "Cache-Control": "no-store" }, head);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > MAX_BODY) { reject(new Error("too large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function handleContact(req, res) {
  if (limited(clientIp(req))) return json(res, 429, { ok: false, error: "Too many requests. Please try again later." });
  let data;
  try { data = JSON.parse(await readBody(req)); }
  catch (e) { return json(res, 400, { ok: false, error: "Invalid request." }); }

  if (!data || typeof data !== "object" || Array.isArray(data))
    return json(res, 400, { ok: false, error: "Invalid request." });
  if (data.website) return json(res, 200, { ok: true }); /* honeypot: pretend success */

  const rec = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true }) + " IST",
    name: clean(data.name, 100), email: clean(data.email, 150),
    subject: clean(data.subject, 150), message: clean(data.message, 4000)
  };
  if (!rec.name || !rec.subject || !rec.message || !EMAIL_RE.test(rec.email))
    return json(res, 400, { ok: false, error: "Please fill in all fields with a valid email." });

  try { fs.appendFileSync(DATA_FILE, JSON.stringify(rec) + "\n"); }
  catch (e) { console.error("save failed", e); return json(res, 500, { ok: false, error: "Could not save your enquiry." }); }

  if (SMTP_USER && SMTP_PASS) {
    sendMail({
      replyTo: rec.email,
      subject: "New website enquiry: " + rec.subject,
      text: "Name: " + rec.name + "\nEmail: " + rec.email + "\nSubject: " + rec.subject +
            "\nTime: " + rec.time + "\n\n" + rec.message + "\n"
    }).then(function () { console.log("enquiry email sent", rec.id); })
      .catch(function (e) { console.error("enquiry email FAILED:", e.message); });
  } else {
    console.warn("SMTP_USER / SMTP_PASS not set: enquiry saved but no email sent");
  }

  if (NOTIFY_WEBHOOK && typeof fetch === "function") {
    const text = "New enquiry from " + rec.name + " <" + rec.email + ">\n" + rec.subject + "\n\n" + rec.message;
    fetch(NOTIFY_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, content: text, enquiry: rec }) }).catch(e => console.error("webhook failed", e.message));
  }
  json(res, 200, { ok: true });
}

function handleAdmin(req, res) {
  const auth = req.headers.authorization || "";
  const tok = auth.match(/^Bearer\s+(.+)$/i);
  if (!ADMIN_TOKEN || !tok || tok[1] !== ADMIN_TOKEN) return json(res, 401, { ok: false, error: "Unauthorized" });
  let contents;
  try { contents = fs.readFileSync(DATA_FILE, "utf8"); }
  catch (e) {
    if (e.code !== "ENOENT") {
      console.error("enquiries read failed", e);
      return json(res, 500, { ok: false, error: "Could not read enquiries." });
    }
    contents = "";
  }
  let rows;
  try { rows = contents.split("\n").filter(Boolean).map(l => JSON.parse(l)).reverse(); }
  catch (e) {
    console.error("enquiries parse failed", e);
    return json(res, 500, { ok: false, error: "Enquiry data is invalid." });
  }
  json(res, 200, { ok: true, count: rows.length, enquiries: rows });
}

function serveStatic(req, res, url) {
  let p;
  try { p = decodeURIComponent(url.pathname); }
  catch (e) { return send(res, 400, "Bad request", { "Content-Type": "text/plain" }, req.method === "HEAD"); }
  if (p === "/") p = "/index.html";
  const file = path.normalize(path.join(ROOT, p));
  const rel = path.relative(ROOT, file);
  const ext = path.extname(file).toLowerCase();
  if (rel.startsWith("..") || path.isAbsolute(rel) || rel.split(path.sep).some(s => s.startsWith("."))
      || rel.startsWith("data") || BLOCKED.has(rel) || !PUBLIC_EXT.has(ext))
    return send(res, 404, "Not found", { "Content-Type": "text/plain" });
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Not found", { "Content-Type": "text/plain" }, req.method === "HEAD");
    send(res, 200, buf, {
      "Content-Type": TYPES[ext],
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
      "Content-Length": buf.length
    }, req.method === "HEAD");
  });
}

http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, "http://localhost"); }
  catch (e) { return send(res, 400, "Bad request", { "Content-Type": "text/plain" }, req.method === "HEAD"); }
  if (url.pathname === "/api/contact") {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" }, req.method === "HEAD");
    return handleContact(req, res).catch(e => { console.error(e); json(res, 500, { ok: false, error: "Server error" }); });
  }
  if (url.pathname === "/api/enquiries" && req.method === "GET") return handleAdmin(req, res);
  if (url.pathname === "/api/health") {
    if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { ok: false, error: "Method not allowed" });
    return json(res, 200, { ok: true }, req.method === "HEAD");
  }
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed", { "Content-Type": "text/plain" }, req.method === "HEAD");
  serveStatic(req, res, url);
}).listen(PORT, () => console.log("VIP server running on http://localhost:" + PORT));