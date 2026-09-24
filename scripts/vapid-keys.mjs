// Genera las claves VAPID. La pública va en wrangler.toml (no es secreta);
// la privada se guarda como secreto del worker de recordatorios:
//   node scripts/vapid-keys.mjs
import { generateVapidKeys } from "../functions/_lib/push.js";

const { publicKey, privateKey } = await generateVapidKeys();
console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
