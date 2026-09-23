import { handle } from "../_lib/router.js";

export const onRequest = ({ request, env }) => handle(request, env);
