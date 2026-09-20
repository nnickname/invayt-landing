# Invayt landing

Landing estática de Invayt, construida con Vite y publicada en Vercel.

## Rutas públicas

La configuración de `vercel.json` usa rewrites internos para que la URL no
cambie en el navegador:

- `/join/:token` se sirve desde `/join.html`. La página existente extrae el
  token desde `location.pathname` y mantiene funcionando los links de
  invitación `/join/{slug}`.
- `/pay/:matchId` se sirve desde `/pay.html`. La página extrae el
  `matchId` desde `location.pathname`, lo muestra en pantalla y arma el deep
  link `invayt://pay/{matchId}` para abrir la aplicación sin cambiar la URL
  web.

El rewrite de `/pay/*` es interno: `/pay/test-match-id` permanece visible en
el navegador y no se redirige a `/login` ni a `/join`. La aplicación Expo
mantiene además la ruta React Navigation `pay/:matchId`, que recibe el mismo
parámetro cuando el deep link abre la app.

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
Esta landing funciona como la página web visual pública para que el link de
pago tenga contenido aun cuando la aplicación no esté instalada.

El archivo `public/.well-known/apple-app-site-association` incluye tanto
`/join/*` como `/pay/*`; `assetlinks.json` ya declara el manejo de todas las
URLs en Android.