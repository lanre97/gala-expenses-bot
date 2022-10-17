import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Telegraf } from "telegraf";

import { actions } from "../../utils/constants";
import { BotContext } from "./context";
import getAmount from "./expenses/getAmount";
import getDescription from "./expenses/getDescription";

const prisma = new PrismaClient();

export default function telegramEventHandler(bot: Telegraf<BotContext>) {
  bot.use(async (ctx, next) => {
    ctx.state.client = prisma;
    const userId = ctx.from?.username;
    const user = await prisma.user.findFirst({
      where: {
        telegram_username: userId,
      },
    });
    if (!user) {
      ctx.reply("No tienes permiso para usar este bot");
      return;
    }
    ctx.state.user = user;
    await next();
  });

  bot.command("start", (ctx) => {
    const user = ctx.from;
    const welcomeMessage = `Hola, ${user?.first_name}. Bienvenido  al bot GALA GASTOS!`;
    ctx.reply(welcomeMessage);
  });

  bot.on("sticker", (ctx) => {
    ctx.reply("¡Buen sticker! ¿Te importa si me lo robo?");
    ctx.replyWithSticker(ctx.message?.sticker?.file_id);
  });

  bot.command(["new", "New", "NEW", "n", "N"], (ctx) => {
    ctx.deleteMessage();
    ctx.session = {
      action: actions.add_expenses.get_description,
      data: {},
    };
    ctx.reply("¿Qué gasto quieres agregar?");
  });

  bot.command(["list", "List", "LIST", "l", "L"], async (ctx) => {
    ctx.deleteMessage();
    const variableExpends = await prisma.variableExpends.findMany({
      select: {
        amount: true,
        description: true,
        createdAt: true,
      },
      where: {
        createdAt: {
          gte: dayjs().startOf("month").toDate(),
          lte: dayjs().endOf("month").toDate(),
        },
      },
    });
    const listMessage = variableExpends
      .map(
        (variableExpends: {
          description: string | null;
          amount: number | null;
          createdAt: Date | null;
        }) =>
          `- ${variableExpends.description} - S/. ${
            variableExpends.amount
          } - ${dayjs(variableExpends.createdAt).format("DD/MM/YYYY")}`
      )
      .join("\n");
    ctx.reply("*Lista de gastos del mes:*\n" + listMessage, {
      parse_mode: "Markdown",
    });
  });

  bot.command(["total", "Total", "TOTAL", "t", "T"], async (ctx) => {
    ctx.deleteMessage();
    const variableExpends = await prisma.variableExpends.findMany({
      select: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: dayjs().startOf("month").toDate(),
          lte: dayjs().endOf("month").toDate(),
        },
      },
    });
    const total = variableExpends.reduce(
      (total: number, variableExpends: { amount: number }) =>
        total + variableExpends.amount,
      0
    );
    ctx.reply(`Total gastado en el mes: S/. ${total}`);
  });

  bot.help((ctx) => {
    ctx.reply(
      "* Comandos disponibles *\n" +
        "/new - Agregar un nuevo gasto\n" +
        "/list - Listar gastos del mes\n" +
        "/total - Total gastado en el mes\n" +
        "/help - Ayuda",
      { parse_mode: "Markdown" }
    );
  });

  bot.on("text", getDescription, getAmount);
}
