/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from "@prisma/client";

import { actions } from "../../../utils/constants";
import { BotContext } from "../context";

export default async function (ctx: BotContext) {
  if (ctx.session?.action === actions.add_expenses.get_amount) {
    //@ts-ignore
    const message = ctx.message?.text;
    const amount = Number(message);
    const description = ctx.session?.data?.description;
    ctx.session = null;
    if (!Number.isNaN(amount)) {
      const db = ctx.state.client as PrismaClient;

      try {
        await db.variableExpends.create({
          data: {
            amount,
            description: description as string,
          },
        });
        ctx.reply(
          "**Gasto agregado:**" +
            `\n- Descripción: ${description}` +
            `\n- Monto: S/. ${amount}`,
          { parse_mode: "Markdown" }
        );
      } catch (error) {
        ctx.reply("Hubo un error al guardar el gasto");
        console.error(error);
      }
    } else {
      ctx.reply("Por favor, ingresa un número");
    }
    return;
  }
}
