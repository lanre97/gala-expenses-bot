import LocalSession from "telegraf-session-local";

export default function getSession() {
  return new LocalSession({
    database: "sessions.json",
    storage: LocalSession.storageFileAsync,
    format: {
      serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
      deserialize: (str) => JSON.parse(str),
    },
    state: { action: null, data: {} },
  });
}
