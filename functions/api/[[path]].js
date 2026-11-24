import { handle } from "../_lib/router.js";

export const onRequest = (context) =>
  handle(context.request, context.env, (promise) => context.waitUntil(promise));
