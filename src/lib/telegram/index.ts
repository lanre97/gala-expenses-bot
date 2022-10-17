import { Telegraf } from "telegraf";

import { BotContext } from "./context";
import telegramEventHandler from "./handlers";
import getSession from "./sessions";

export default function telegramBot() {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

  if (!TELEGRAM_TOKEN) {
    throw new Error("TELEGRAM_TOKEN is not defined");
  }

  const bot = new Telegraf(TELEGRAM_TOKEN);
  const session = getSession();
  bot.use(session.middleware());
  telegramEventHandler(bot as unknown as Telegraf<BotContext>);
  bot.launch().then(() => console.log("Bot started"));
  return bot;
}
