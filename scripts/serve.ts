import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const host = "127.0.0.1";
const port = 4178;
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
};

function respond(
  response: ServerResponse,
  status: number,
  message: string,
  extra: Record<string, string> = {},
): void {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    ...extra,
  });
  response.end(message);
}

let canonicalRoot: string;
try {
  canonicalRoot = await realpath(root);
} catch {
  console.error("No build found. Run npm run build before npm run dev.");
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method ?? "")) {
    respond(response, 405, "Method not allowed", { Allow: "GET, HEAD" });
    return;
  }
  let pathname: string;
  try {
    pathname = decodeURIComponent(
      new URL(request.url ?? "/", `http://${host}:${port}`).pathname,
    );
  } catch {
    respond(response, 400, "Invalid path");
    return;
  }
  if (
    pathname.includes("\0") ||
    pathname.includes("\\") ||
    pathname.split("/").includes("..")
  ) {
    respond(response, 400, "Invalid path");
    return;
  }
  if (pathname === "/") {
    response.writeHead(302, {
      Location: "/max-muerte/",
      "Cache-Control": "no-store",
    });
    response.end();
    return;
  }

  try {
    let candidate = path.resolve(canonicalRoot, `.${pathname}`);
    if (
      candidate !== canonicalRoot &&
      !candidate.startsWith(`${canonicalRoot}${path.sep}`)
    ) {
      respond(response, 403, "Forbidden");
      return;
    }
    let info = await stat(candidate);
    if (info.isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }
    const actual = await realpath(candidate);
    if (!actual.startsWith(`${canonicalRoot}${path.sep}`)) {
      respond(response, 403, "Forbidden");
      return;
    }
    info = await stat(actual);
    if (!info.isFile()) {
      respond(response, 404, "Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type":
        types[path.extname(actual).toLowerCase()] ?? "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const stream = createReadStream(actual);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    const forbidden =
      error instanceof Error && "code" in error && error.code === "EACCES";
    respond(response, forbidden ? 403 : 404, "Not found");
  }
});

server.on("error", (error) => {
  console.error(`Preview failed: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`Local: http://${host}:${port}/max-muerte/`);
});
process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
