import dotenv, { config } from "dotenv";
import express, { Express, Request, Response } from "express";

import telegramBot from "./lib/telegram";

config();

const bot = telegramBot();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("TELEGRAM EXPENSES BOT");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

process.on("error", (error) => {
  console.error(error);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
