// One-time: generates a VAPID key pair. Public key -> config.js, private key -> vapid-private.txt (git-ignored).
import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const pub = publicKey.export({ format: 'jwk' });
const priv = privateKey.export({ format: 'jwk' });
const b64u = (b) => b.toString('base64url');
const publicRaw = b64u(Buffer.concat([Buffer.from([4]), Buffer.from(pub.x, 'base64url'), Buffer.from(pub.y, 'base64url')]));

writeFileSync(new URL('../config.js', import.meta.url), `export const VAPID_PUBLIC_KEY = '${publicRaw}';\n`);
writeFileSync(new URL('../vapid-private.txt', import.meta.url), `VAPID_PUBLIC_KEY=${publicRaw}\nVAPID_PRIVATE_KEY=${priv.d}\n`);
console.log('Wrote config.js and vapid-private.txt');
