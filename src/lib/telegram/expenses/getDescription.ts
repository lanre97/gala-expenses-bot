/* eslint-disable @typescript-eslint/ban-ts-comment */
import { actions } from "../../../utils/constants";
import { BotContext } from "../context";

export default function (ctx: BotContext, next: () => Promise<void>) {
  if (ctx.session?.action === actions.add_expenses.get_description) {
    if (ctx.session) {
      ctx.session.data = {
        // @ts-ignore
        description: ctx.message?.text,
      };
      ctx.session.action = actions.add_expenses.get_amount;
    }
    ctx.state.data = ctx.session?.data;
    ctx.state.action = ctx.session?.action;
    ctx.reply("¿Cuánto fue?");
    return;
  }
  next();
}
