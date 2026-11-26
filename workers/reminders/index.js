// Worker con cron: Cloudflare Pages no ejecuta tareas programadas.
import { sendDueReminders } from "../../functions/_lib/reminders.js";
import { sendDueTelegram } from "../../functions/_lib/telegram.js";

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      Promise.all([sendDueReminders(env), sendDueTelegram(env)]).then(([push, telegram]) =>
        console.log(JSON.stringify({ push, telegram })),
      ),
    );
  },
};
