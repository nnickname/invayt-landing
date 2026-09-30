# Invayt landing

Landing de Invayt construida con Next.js y publicada en Vercel.

## Rutas públicas

- `/` muestra la landing principal.
- `/join/:slug` resuelve el club, permite seleccionar un jugador no verificado,
  completar sus datos y unirse desde la web sin instalar la aplicación.
- `/pay/:matchId` permite consultar el partido y completar el flujo de pago
  desde la web.
- `/terminos-y-condiciones` muestra los términos y condiciones de uso de Invayt.

Las rutas `join` y `pay` son rutas dinámicas nativas de Next.js; el parámetro
permanece en la URL del navegador y no depende de páginas HTML separadas.

## Enlaces web de unión y pago

Las rutas `/join/:slug` y `/pay/:matchId` deben abrirse y continuar en el
navegador. La landing no publica archivos AASA ni Android Asset Links para evitar
que iOS o Android asocien estas URLs con la app y se salten el flujo web.

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
Esta landing procesa los links de invitación y pago desde la web, tanto si la app
está instalada como si no. La configuración nativa de la app debe dejar de
reclamar estas rutas HTTPS si se vuelven a habilitar asociaciones en el futuro.