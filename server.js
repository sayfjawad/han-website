// Zero-dependency static file server for the han-website container.
// Serves this directory on 0.0.0.0:3000 so it shows up at https://han.sdai.nl.
//
// The HTTP Range support below is not optional: without it a browser cannot
// seek inside assets/feedback.mp4 and Safari/iOS may refuse to play it at all.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".vtt": "text/vtt; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body === undefined) return res.end();
  res.end(body);
}

function notFound(res) {
  return send(res, 404, { "Content-Type": "text/html; charset=utf-8" }, "<h1>404 - Not Found</h1>");
}

// "bytes=0-99" -> {start: 0, end: 99}; "bytes=100-" -> open end;
// "bytes=-500" -> last 500 bytes; null -> unusable (416).
function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!match) return null;
  const hasStart = match[1] !== "";
  const hasEnd = match[2] !== "";
  if (!hasStart && !hasEnd) return null;

  let start;
  let end;

  if (!hasStart) {
    const suffix = Number(match[2]);
    if (suffix === 0) return null;
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = hasEnd ? Math.min(Number(match[2]), size - 1) : size - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start > end || start >= size) return null;
  return { start: start, end: end };
}

http
  .createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return send(res, 405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" }, "Method Not Allowed");
    }

    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel === "/") rel = "/index.html";
    if (rel.charAt(rel.length - 1) === "/") rel += "index.html";

    const file = path.join(ROOT, path.normalize(rel));
    if (file !== ROOT && file.indexOf(ROOT + path.sep) !== 0) {
      return send(res, 403, { "Content-Type": "text/plain; charset=utf-8" }, "Forbidden");
    }

    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) return notFound(res);

      const size = stat.size;
      const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
      const headers = {
        "Content-Type": type,
        "Accept-Ranges": "bytes",
        "Last-Modified": stat.mtime.toUTCString(),
        "Cache-Control": /^(video|image|font)\//.test(type) ? "public, max-age=86400" : "public, max-age=300",
      };

      let status = 200;
      let start = 0;
      let end = size - 1;

      if (req.headers.range) {
        const range = parseRange(req.headers.range, size);
        if (!range) {
          headers["Content-Range"] = "bytes */" + size;
          headers["Content-Length"] = "0";
          return send(res, 416, headers);
        }
        start = range.start;
        end = range.end;
        status = 206;
        headers["Content-Range"] = "bytes " + start + "-" + end + "/" + size;
      }

      headers["Content-Length"] = String(end - start + 1);

      if (req.method === "HEAD" || size === 0) {
        return send(res, status, headers);
      }

      res.writeHead(status, headers);
      const stream = fs.createReadStream(file, { start: start, end: end });
      stream.on("error", () => res.destroy());
      stream.pipe(res);
    });
  })
  .listen(PORT, "0.0.0.0", () => console.log("han-website serving " + ROOT + " on http://0.0.0.0:" + PORT));
