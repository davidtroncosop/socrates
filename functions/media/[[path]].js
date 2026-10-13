import { serveMedia } from "../_lib/media.js";

export const onRequestGet = ({ request, env, params }) => serveMedia(request, env, params.path);
export const onRequestHead = onRequestGet;
