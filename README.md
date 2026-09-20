# Invayt landing

Landing estática de Invayt, construida con Vite y publicada en Vercel.

## Rutas públicas

La configuración de `vercel.json` usa rewrites internos para que la URL no
cambie en el navegador:

- `/pay/:matchId*` se sirve desde `/index.html`. Por ejemplo,
  `/pay/123` conserva esa URL y el frontend puede leer `123` desde el
  pathname para resolver la ruta `pay/:matchId`.
- `/join/:token` se sirve desde `/join.html`. La página existente extrae el
  token desde `location.pathname` y mantiene funcionando los links de
  invitación `/join/{slug}`.

Estos rewrites no son redirects y no envían las URLs a `/login` ni a `/join`.
Las demás rutas y el entrypoint raíz siguen siendo servidos por Vercel como
antes.

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
curl -I https://invayt.com/pay/test-match-id
curl -I https://invayt.com/join/test-slug
```

La respuesta debe ser exitosa y la URL solicitada debe permanecer sin cambios.

## Relación con la app Expo

Este repositorio contiene únicamente la landing y las páginas HTML públicas;
no contiene `App.tsx`, React Navigation ni `MatchPaymentInviteScreen`. Por lo
tanto, la configuración de linking de la app debe estar en el repositorio del
frontend Expo que se publica como entrypoint web. Allí debe incluir, como
mínimo:

```ts
MatchPaymentInvite: 'pay/:matchId'
```

El rewrite de `/pay/*` presupone que `/index.html` en el deployment es el
entrypoint de ese frontend Expo. Si la app Expo se despliega en otro proyecto
o dominio de Vercel, la misma regla debe agregarse en ese proyecto y su
destino debe ser el `index.html` generado por Expo Web. Este repositorio no
puede verificar el render de `MatchPaymentInviteScreen` porque esos archivos
no forman parte del checkout actual.

El archivo `public/.well-known/apple-app-site-association` incluye tanto
`/join/*` como `/pay/*`; `assetlinks.json` ya declara el manejo de todas las
URLs en Android.