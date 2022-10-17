/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const LocalSession = require("telegraf-session-local");

export default function getSession() {
  return new LocalSession({
    database: "sessions.json",
    storage: LocalSession.storageFileAsync,
    format: {
      serialize: (obj: any) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
      deserialize: (str: string) => JSON.parse(str),
    },
    state: { action: null, data: {} },
  });
}
