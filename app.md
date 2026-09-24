# Integración de Invayt con la landing web

> Documento de referencia para el equipo de landing, frontend web, backend y producto.
>
> Estado del documento: 24/09/2026. La sección de unión describe el contrato que ya existe. La sección de pago distingue la resolución de partidos que ya está implementada del checkout online que todavía hay que desarrollar.

## 1. Qué es Invayt

Invayt es una app para organizar clubes y cobrar los partidos o actividades del equipo.

El administrador de un club puede:

- Crear su cuenta y completar su perfil.
- Crear un club.
- Importar o cargar jugadores.
- Compartir un enlace permanente para que los jugadores se incorporen al club.
- Crear un cobro/partido con un importe por jugador.
- Compartir un enlace público de pago.
- Consultar el estado de cobro de cada jugador.

El jugador no necesita instalar la app para completar la incorporación al club. El objetivo del nuevo flujo es que tampoco necesite instalarla para pagar desde la web.

### Tecnología actual

- App móvil: Expo SDK 57, React Native 0.86 y React 19.
- Navegación: React Navigation Native Stack.
- Backend y base de datos: Supabase.
- Función pública actual: Edge Function `join-club`.
- Proveedor de pago previsto: Mercado Pago.
- Dominio público: `https://invayt.com`.
- Esquema móvil alternativo: `invayt://`.

La landing debe utilizar únicamente la `anon key` pública de Supabase si necesita llamar a Supabase desde el navegador. Nunca debe incluir la `service role key`; esa clave solo existe en funciones backend.

## 2. URLs públicas que la landing debe soportar

| URL | Uso | Parámetro | Estado |
|---|---|---|---|
| `https://invayt.com/join/{slug}` | Unirse a un club | `slug` permanente del club | Implementado en la app y backend actual |
| `https://invayt.com/pay/{matchId}` | Consultar un cobro y pagar un partido | UUID del partido | Resolución implementada; checkout pendiente |

### Reglas importantes de las URLs

- El `slug` no es un token temporal: es el identificador permanente y reutilizable del club.
- Un club puede tener un slug como `los-tigres-fc`.
- Los slugs se generan a partir del nombre del club: minúsculas, sin acentos y con guiones.
- Si hay una colisión, se agrega un sufijo numérico, por ejemplo `los-tigres-fc-2`.
- El enlace de unión no vence y no tiene límite de usos.
- `matchId` es el UUID real de `matches.id`. No es un slug.
- La landing debe conservar estos paths; no deben cambiarse por rutas de frontend incompatibles con la app.
- Los paths deben admitir carga directa, refresh y navegación sin JavaScript previo. El servidor debe devolver la aplicación web para `/join/*` y `/pay/*`.

## 3. Comportamiento esperado de la landing

### 3.1. Cuando el enlace se abre en un dispositivo con la app instalada

La configuración nativa ya declara:

- iOS Universal Links para `invayt.com`.
- Android App Links para `/join/*` y `/pay/*`.
- Deep links por esquema `invayt://`.

Por lo tanto, en una build nativa correctamente firmada, el sistema operativo puede abrir directamente la app al acceder a:

- `https://invayt.com/join/{slug}` → pantalla `Invite`.
- `https://invayt.com/pay/{matchId}` → pantalla `MatchPaymentInvite`.

La landing debe seguir siendo la experiencia de fallback cuando:

- La app no está instalada.
- El navegador no delega el enlace a la app.
- El usuario está en desktop.

No conviene redirigir automáticamente a la descarga de la app: la unión y, cuando esté terminado, el pago deben poder completarse desde la web.

### 3.2. Cuando se abre directamente en la web

La landing debe:

1. Leer el parámetro de la URL.
2. Resolver el club o partido contra el backend.
3. Mostrar el contexto antes de pedir datos sensibles o de pago.
4. Permitir completar la acción sin crear una cuenta de administrador.
5. Mostrar un estado final claro y permitir reintentar cuando corresponda.

## 4. Flujo de unión a un club — implementado

### 4.1. Paso 1: resolver el club

Endpoint actual:

```text
POST {SUPABASE_URL}/functions/v1/join-club
```

Headers recomendados desde la landing:

```http
Content-Type: application/json
apikey: {EXPO_PUBLIC_SUPABASE_ANON_KEY}
Authorization: Bearer {EXPO_PUBLIC_SUPABASE_ANON_KEY}
```

Body:

```json
{
  "action": "resolve",
  "slug": "los-tigres-fc"
}
```

Respuesta exitosa:

```json
{
  "clubId": "uuid-del-club",
  "clubName": "Los Tigres FC"
}
```

La landing debería mostrar, como mínimo:

- Nombre del club.
- Título del flujo: “Ingresar al equipo”.
- Explicación breve: “Completá tus datos para activarte en el club”.

No es necesario mostrar `clubId` al usuario. Se conserva solo para telemetría o estado interno si hace falta.

### 4.2. Paso 2: completar los datos del jugador

Campos que espera el backend actual:

| Campo | Tipo | Obligatorio | Observaciones |
|---|---|---:|---|
| `name` | `string` | Sí | Nombre |
| `lastName` | `string` | Sí | Apellido |
| `phone` | `string` | Sí | Se acepta como texto para conservar prefijos y formato |

Body completo:

```json
{
  "action": "join",
  "slug": "los-tigres-fc",
  "name": "Juan",
  "lastName": "Pérez",
  "phone": "+54 9 11 5555-5555",
}
```

La función actual crea un registro en `players` con:

- `club_id` resuelto desde el slug.
- `name` y `last_name` normalizados con `trim`.
- `phone` y `email` normalizados con `trim`.
- `status: "active"`.

Respuesta exitosa actual:

```json
{
  "id": "uuid-del-jugador",
  "club_id": "uuid-del-club",
  "name": "Juan",
  "last_name": "Pérez",
  "status": "active",
  "clubName": "Los Tigres FC"
}
```

### 4.3. Estados de UI del flujo de unión

La landing debería contemplar estos estados:

1. **Cargando club**: se está resolviendo el slug.
2. **Club válido**: se muestra el formulario.
3. **Procesando**: deshabilitar el botón para evitar doble envío.
4. **Unión exitosa**: confirmar “Ahora formás parte de {clubName}”.
5. **Club inexistente o enlace inválido**: ofrecer volver a la landing o contactar al administrador.
6. **Error temporal**: permitir reintentar sin perder los datos del formulario.

### 4.4. Errores esperados

La Edge Function responde con HTTP 400 y un body con esta forma:

```json
{
  "error": "Mensaje del error"
}
```

Mensajes actuales relevantes:

- `This club does not exist.` / `Este club no existe.`
- `The invitation link is invalid.`
- `Required data is missing.`
- `The registration could not be completed.`

La landing puede traducir o mejorar estos mensajes para el usuario, pero debe conservar un estado de error accionable.

### 4.5. Importante: no se crea una cuenta de autenticación

El flujo actual de `/join/{slug}` registra un jugador en `public.players`, pero no crea un usuario en Supabase Auth ni una contraseña. Por lo tanto:

- No hay login dentro del flujo de unión.
- No hay confirmación de email implementada para este alta.
- No se debe enviar al jugador al formulario de “crear cuenta de administrador”.
- Si en el futuro se quiere que cada jugador tenga cuenta, deberá definirse un flujo separado y un cambio de modelo.

## 5. Flujo de pago de un partido

### 5.1. Lo que ya existe

La app crea un partido/cobro con:

- Nombre del evento.
- Fecha.
- Importe por jugador.
- Club asociado.

Después comparte:

```text
https://invayt.com/pay/{matchId}
```

La resolución pública actual se hace con la misma Edge Function:

```json
{
  "action": "resolve-match",
  "matchId": "uuid-del-partido"
}
```

Respuesta actual:

```json
{
  "match": {
    "id": "uuid-del-partido",
    "clubId": "uuid-del-club",
    "name": "Partido domingo 10hs",
    "date": "2026-09-27T13:00:00.000Z",
    "amountPerPlayer": 2500
  },
  "clubName": "Los Tigres FC",
  "players": [
    {
      "id": "uuid-del-jugador",
      "name": "Juan",
      "lastName": "Pérez"
    }
  ]
}
```

La landing puede usar este contrato para mostrar:

- Nombre del club.
- Nombre del partido o evento.
- Fecha y hora, convertidas a la zona horaria del usuario o a la zona definida por producto.
- Importe por jugador.
- Selector de jugador del plantel.

El endpoint no devuelve teléfono ni email del plantel. No hay que ampliar esa respuesta con datos personales salvo que exista una necesidad explícita.

### 5.2. Lo que todavía no existe

En la app actual el botón de Mercado Pago aparece deshabilitado con el texto “Mercado Pago estará disponible próximamente”. Todavía no hay:

- Endpoint para crear una preferencia de Mercado Pago.
- Registro de una orden de checkout pendiente.
- URL de retorno de éxito, pendiente o error.
- Webhook de Mercado Pago.
- Verificación server-to-server del estado del pago.
- Asociación idempotente entre un pago externo y `match_payments`.
- Protección contra que una persona pague seleccionando a otro jugador.

La landing no debe insertar directamente en `match_payments` desde el navegador. La tabla tiene políticas RLS orientadas al administrador del club y, además, un pago no debe considerarse confirmado porque el frontend haya recibido una respuesta de redireccionamiento.

## 6. Contrato propuesto para implementar el pago web

Esta sección es una propuesta de integración para el próximo desarrollo. No debe tratarse como endpoint disponible hasta que backend lo implemente.

### 6.1. Crear checkout

Propuesta:

```text
POST {SUPABASE_URL}/functions/v1/create-payment-checkout
```

Request:

```json
{
  "matchId": "uuid-del-partido",
  "playerId": "uuid-del-jugador",
  "payerEmail": "juan@example.com",
  "idempotencyKey": "uuid-generado-por-la-landing",
  "returnUrls": {
    "success": "https://invayt.com/pay/uuid-del-partido/success",
    "pending": "https://invayt.com/pay/uuid-del-partido/pending",
    "failure": "https://invayt.com/pay/uuid-del-partido/failure"
  }
}
```

Respuesta propuesta:

```json
{
  "checkoutId": "uuid-de-la-orden",
  "status": "pending",
  "amount": 2500,
  "currency": "ARS",
  "initPoint": "https://www.mercadopago.com/checkout/v1/redirect?..."
}
```

Reglas del backend:

1. Resolver el importe en el servidor usando `matchId`; nunca confiar en un importe enviado por el navegador.
2. Verificar que `playerId` pertenece al club del partido.
3. Crear una orden interna antes o durante la creación de la preferencia.
4. Usar `idempotencyKey` para que un doble click no cree dos cobros.
5. Mantener las credenciales de Mercado Pago exclusivamente en Supabase Edge Functions o infraestructura segura.
6. No registrar `match_payments` como pago confirmado en este paso.

### 6.2. Webhook de Mercado Pago

El webhook debe ser un endpoint backend, no una ruta que dependa de la landing:

```text
POST {SUPABASE_URL}/functions/v1/mercado-pago-webhook
```

Al recibir una notificación, backend debe:

1. Validar la firma o autenticidad según la configuración de Mercado Pago.
2. Consultar el pago directamente a Mercado Pago.
3. Verificar que el importe, moneda, partido y jugador coincidan con la orden interna.
4. Aceptar únicamente el estado aprobado para registrar un pago cobrado.
5. Registrar en `match_payments` un único registro con `method: "mercado_pago"`.
6. Guardar el ID externo del pago y hacer el procesamiento idempotente.
7. Actualizar la orden interna a `approved`, `pending`, `rejected` o `cancelled`.

La app ya distingue `method: "manual"` de `method: "mercado_pago"`. Los pagos de Mercado Pago deben quedar bloqueados para que el administrador no los pueda desmarcar manualmente.

### 6.3. Pantallas de retorno

Las pantallas de retorno solo informan el estado visual al usuario. No confirman el pago por sí mismas.

Rutas sugeridas:

```text
/pay/{matchId}/success?checkoutId={checkoutId}
/pay/{matchId}/pending?checkoutId={checkoutId}
/pay/{matchId}/failure?checkoutId={checkoutId}
```

En cualquiera de ellas, la landing debería consultar el estado real de la orden mediante un endpoint seguro, por ejemplo:

```text
GET {SUPABASE_URL}/functions/v1/payment-status?checkoutId={checkoutId}
```

Si el webhook todavía no procesó la confirmación, mostrar “Estamos verificando tu pago” y hacer polling limitado o permitir actualizar la pantalla. No mostrar “Pago confirmado” solo porque Mercado Pago redirigió al usuario a `success`.

## 7. Modelo de datos relevante

| Tabla | Uso | Datos relevantes |
|---|---|---|
| `clubs` | Clubes administrados | `id`, `name`, `admin_id`, `slug` |
| `players` | Plantel del club | `id`, `club_id`, `name`, `last_name`, `phone`, `email`, `status` |
| `matches` | Partido o cobro | `id`, `club_id`, `name`, `date`, `amount_per_player` |
| `match_payments` | Pagos registrados | `match_id`, `player_id`, `amount`, `paid_at`, `method` |
| `invitations` | Modelo legado de invitaciones temporales | No usar para el nuevo enlace permanente por slug |

El modelo actual no tiene explícitos `currency`, `checkout_id`, `external_payment_id`, `payment_status` ni una tabla de órdenes. Esos datos deberían agregarse antes de poner Mercado Pago en producción.

## 8. CORS y requisitos backend para que funcione desde navegador

La Edge Function actual tiene un problema que debe corregirse antes de consumirla desde una landing en otro origen. En `supabase/functions/_shared/cors.ts` el header está escrito como:

```http
Access-Controle-Allow-Origin
```

Debe ser:

```http
Access-Control-Allow-Origin: https://invayt.com
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
Access-Control-Allow-Methods: POST, OPTIONS
```

Para desarrollo puede permitirse `*`, pero para producción es preferible restringir el origen a los dominios reales de la landing.

La respuesta a `OPTIONS` también debe incluir los headers CORS correctos. Sin esto, la petición del navegador puede fallar aunque la función responda correctamente desde Postman o desde la app nativa.

## 9. Seguridad y privacidad

- No exponer la `service role key` en la landing.
- Validar y limitar la longitud de `slug`, nombres, teléfono y email en backend.
- Aplicar rate limiting o protección anti-bot al endpoint de unión; el enlace es público y reutilizable.
- Evitar doble submit en unión y checkout.
- No aceptar el importe desde el cliente como fuente de verdad.
- Verificar que el jugador seleccionado pertenece al partido antes de crear el checkout.
- No entregar teléfonos ni emails al endpoint público de resolución de partido.
- No considerar un pago confirmado desde un query param de retorno.
- Usar una clave de idempotencia por intento de checkout.
- Registrar logs sin almacenar datos de tarjeta ni secretos.
- Definir una política para altas duplicadas: actualmente dos envíos pueden crear dos filas de jugador porque no hay una restricción visible de unicidad por club/email.

## 10. Deep links, asociación móvil y fallback web

La app tiene configurado:

- iOS: `associatedDomains: ["applinks:invayt.com"]`.
- Android: intent filters para `https://invayt.com/join/*` y `https://invayt.com/pay/*`.
- React Navigation: prefixes `invayt://` y `https://invayt.com`.

Para que esto funcione en producción, el dominio debe servir:

```text
https://invayt.com/.well-known/apple-app-site-association
https://invayt.com/.well-known/assetlinks.json
```

Antes de publicar hay que reemplazar los valores de ejemplo o pendientes:

- Team ID real de Apple en `apple-app-site-association`.
- Huella SHA-256 real del certificado de firma Android en `assetlinks.json`.

La app utiliza Expo SDK 57. Los Universal Links y App Links son configuración nativa; no se pueden validar correctamente en Expo Go. Deben probarse con una development build o una build de producción instalada en un dispositivo.

## 11. Autenticación web

El flujo de unión y el futuro checkout público no deberían requerir autenticación de administrador.

Si la landing incorpora login, registro o recuperación de contraseña, hay que coordinarlo con Supabase Auth:

- Agregar las URLs web de producción y preview a las Redirect URLs permitidas.
- Usar HTTPS para los redirects de producción.
- La app actual usa `invayt://reset-password` para recuperación nativa; ese redirect no reemplaza al redirect HTTPS de la landing.
- No mezclar el alta pública de jugador con el registro de administrador: son perfiles y objetivos diferentes.

## 12. Checklist de implementación para la landing

### Unión

- [ ] Crear la ruta `/join/[slug]`.
- [ ] Resolver el club antes de mostrar el formulario.
- [ ] Mostrar nombre del club.
- [ ] Enviar `name`, `lastName`, `phone` y `email` al action `join`.
- [ ] Deshabilitar el botón mientras se procesa.
- [ ] Mostrar confirmación y errores claros.
- [ ] Probar slug inexistente, refresh, doble click y respuesta lenta.
- [ ] Corregir/verificar CORS antes de probar en navegador.

### Pago

- [ ] Crear la ruta `/pay/[matchId]`.
- [ ] Resolver partido, club, fecha, importe y plantel.
- [ ] Permitir seleccionar un jugador.
- [ ] Definir moneda y formato de importe; el código actual muestra `$` y el modelo no guarda moneda.
- [ ] Implementar checkout backend de Mercado Pago.
- [ ] Implementar orden interna e idempotencia.
- [ ] Implementar webhook y validación server-to-server.
- [ ] Implementar estados `pending`, `approved`, `rejected` y `cancelled`.
- [ ] Implementar pantallas de retorno sin asumir que `success` equivale a pago confirmado.
- [ ] Probar pago aprobado, pendiente, rechazado, cancelado, doble click y webhook duplicado.

### App links

- [ ] Mantener disponibles `/join/*` y `/pay/*` en el hosting de la landing.
- [ ] Publicar AASA y Asset Links válidos.
- [ ] Completar Team ID de Apple y fingerprint Android.
- [ ] Probar con builds nativas, no solo Expo Go.
- [ ] Verificar que en desktop y sin app instalada la landing procesa el flujo web.

## 13. Criterios de aceptación del flujo completo

### Unión

Un jugador que recibe `https://invayt.com/join/{slug}` debe poder:

1. Ver el nombre correcto del club.
2. Completar sus cuatro datos.
3. Confirmar el alta sin instalar la app ni crear una cuenta.
4. Ver una confirmación de que ya forma parte del club.
5. Obtener un error comprensible si el slug no existe.

### Pago

Un jugador que recibe `https://invayt.com/pay/{matchId}` debe poder:

1. Ver el club, partido, fecha e importe correcto.
2. Seleccionar únicamente su identidad del plantel.
3. Ser enviado a un checkout de Mercado Pago creado en backend.
4. Volver a una pantalla de estado.
5. Ver el pago como confirmado solo después de la validación del webhook.
6. No generar dos pagos por doble click o reintento del navegador.

### App y web

El mismo enlace debe tener una experiencia válida en:

- App instalada en iOS.
- App instalada en Android.
- Navegador móvil sin app.
- Navegador desktop.

## 14. Decisiones que producto debe confirmar

1. ¿La moneda será siempre ARS? El código actual muestra `$`, pero la base no guarda moneda.
2. ¿El jugador puede pagar por otro integrante del plantel o solo por sí mismo?
3. ¿Se exige email del pagador para Mercado Pago?
4. ¿Qué ocurre si un jugador ya existe en el club y vuelve a usar el enlace?
5. ¿Se necesita vencimiento del cobro o el enlace queda activo indefinidamente?
6. ¿Qué datos debe recibir el administrador después de un pago aprobado?
7. ¿La landing tendrá un dominio de producción diferente de `invayt.com`? Si es así, hay que actualizar redirects y estrategia de App Links.
