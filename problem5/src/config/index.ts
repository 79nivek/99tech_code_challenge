import dotenv from "dotenv";
import { isPort, isURL } from "validator";

dotenv.config();

const APP_CONFIG = {
  PORT: Number(process.env.PORT || 3000),
  ENV: process.env.ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  HOST: process.env.HOST || "localhost",
};

function validate() {
  if (isPort(APP_CONFIG.PORT.toString())) {
    throw new Error("PORT must be a valid port number (1-65535)");
  }
  if (APP_CONFIG.ENV !== "development" && APP_CONFIG.ENV !== "production") {
    throw new Error("ENV must be either development or production");
  }
  if (!APP_CONFIG.DATABASE_URL || !isURL(APP_CONFIG.DATABASE_URL)) {
    throw new Error("DATABASE_URL is required");
  }

  console.log("Config is valid");
}

export default APP_CONFIG;
