import { Context } from "telegraf";
import { Update } from "typegram";

interface SessionData {
  action: string | null;
  data: Record<string, unknown>;
}

export interface BotContext extends Context<Update> {
  session: SessionData | null;
}
