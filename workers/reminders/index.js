// Worker con cron: Cloudflare Pages no ejecuta tareas programadas.
import { sendDueReminders } from "../../functions/_lib/reminders.js";

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sendDueReminders(env).then((summary) => console.log(JSON.stringify(summary))));
  },
};
