import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // Audio upload endpoint
  app.post("/api/upload-audio", async (req, res) => {
    try {
      const { storagePut, storageGetSignedUrl } = await import("../storage");
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const contentType = req.headers["content-type"] || "audio/webm";
          
          // Parse multipart form data manually or accept raw audio
          let audioBuffer: Buffer;
          let ext = "webm";
          
          if (contentType.includes("multipart/form-data")) {
            // Find the audio data in multipart
            const boundary = contentType.split("boundary=")[1];
            if (boundary) {
              const parts = buffer.toString("binary").split(`--${boundary}`);
              for (const part of parts) {
                if (part.includes("audio") || part.includes("recording")) {
                  const headerEnd = part.indexOf("\r\n\r\n");
                  if (headerEnd !== -1) {
                    const headers = part.slice(0, headerEnd);
                    if (headers.includes("m4a")) ext = "m4a";
                    else if (headers.includes("webm")) ext = "webm";
                    else if (headers.includes("wav")) ext = "wav";
                    const dataStr = part.slice(headerEnd + 4);
                    // Remove trailing \r\n
                    const cleanData = dataStr.endsWith("\r\n") ? dataStr.slice(0, -2) : dataStr;
                    audioBuffer = Buffer.from(cleanData, "binary");
                    break;
                  }
                }
              }
            }
            if (!audioBuffer!) {
              audioBuffer = buffer;
            }
          } else {
            audioBuffer = buffer;
          }
          
          const key = `audio/diary_${Date.now()}.${ext}`;
          const mimeType = ext === "m4a" ? "audio/mp4" : ext === "wav" ? "audio/wav" : "audio/webm";
          const { key: storedKey } = await storagePut(key, audioBuffer, mimeType);
          const audioUrl = await storageGetSignedUrl(storedKey);
          
          res.json({ audioUrl });
        } catch (err: any) {
          console.error("Upload processing error:", err);
          res.status(500).json({ error: err.message });
        }
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
