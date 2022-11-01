import dotenv, { config } from "dotenv";

import telegramBot from "./lib/telegram";

dotenv.config();

config();

const bot = telegramBot();

process.on("error", (error) => {
  console.error(error);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
