# Invayt landing

Landing de Invayt construida con Next.js y publicada en Vercel.

## Rutas públicas

- `/` muestra la landing principal.
- `/join/:slug` resuelve el club, permite seleccionar un jugador no verificado,
  completar sus datos y unirse desde la web sin instalar la aplicación.
- `/pay/:matchId` muestra el identificador del partido y arma el deep link
  `invayt://pay/{matchId}` para abrir la aplicación.
- `/terminos-y-condiciones` muestra los términos y condiciones de uso de Invayt.

Las rutas `join` y `pay` son rutas dinámicas nativas de Next.js; el parámetro
permanece en la URL del navegador y no depende de páginas HTML separadas.

## Links de iOS y Android

Los archivos de asociación para Universal Links y Android App Links se sirven
desde:

- `/.well-known/apple-app-site-association`
- `/.well-known/assetlinks.json`

El `appID` de iOS y el `package_name` de Android ya están configurados. Hay que
reemplazar `<TU_SHA256_FINGERPRINT_AQUI>` por la huella SHA-256 del certificado
de firma de producción de Android; no es posible deducirla desde la landing.

Las URLs de las tiendas se configuran con las variables de entorno de
`.env.example`:

- `NEXT_PUBLIC_APP_STORE_URL`
- `NEXT_PUBLIC_GOOGLE_PLAY_URL`

Si no están configuradas, los botones se muestran como “Próximamente” y no
generan enlaces inválidos.

## Deploy en Vercel

Desde la raíz de este repositorio:

```bash
npm ci
npm run build
```

El build genera `dist/`, que es el output estático que Vercel publica. Luego
se puede desplegar mediante la integración Git de Vercel o con la CLI:

```bash
vercel --prod
```

Después del deploy se deben comprobar, sin seguir redirects:

```bash
curl -I https://invayt.com/join/test-slug
curl -I https://invayt.com/pay/test-match-id
```

La respuesta debe ser exitosa y la URL solicitada debe permanecer sin cambios.

## Relación con la app Expo

La configuración de linking de la app Expo está en el repositorio `invayt2.0`.
Esta landing funciona como la página web visual pública para que los links de
invitación y pago tengan contenido aun cuando la aplicación no esté instalada.