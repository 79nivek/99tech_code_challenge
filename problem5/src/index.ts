import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import express from "express";

import APP_CONFIG from "./config";
import v1Router from "./router/v1";
import { logger, transformResponse } from "./middleware";

const prisma = new PrismaClient().$extends(withAccelerate());

const app = express();

// Middleware
app.use(logger);
app.use(transformResponse);
app.use(express.json());

app.use("/api/v1", v1Router);

const server = app.listen(APP_CONFIG.PORT, APP_CONFIG.HOST, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(
    `🚀 Server ready at: http://${APP_CONFIG.HOST}:${APP_CONFIG.PORT}`
  );
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
