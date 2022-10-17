import { config } from "dotenv";

import telegramBot from "./lib/telegram";

config();

telegramBot().then(() => {
  console.log("Bot started");
});

process.on("error", (error) => {
  console.error(error);
});
