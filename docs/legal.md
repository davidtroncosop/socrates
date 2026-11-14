# Pendientes legales de socatres

Revisión hecha el 17 de octubre de 2026. No es asesoría legal: confirma cada punto con la fuente o con un abogado antes de usar socatres comercialmente.

## Voz de los videos (Fish Audio)

- Las 135 narraciones se generaron con el modelo `s2.1-pro-free` de Fish Audio, con la clave de `.env`.
- Según fuentes secundarias, el plan gratuito no incluye derechos de uso comercial (sirve para uso personal o de evaluación), y el acceso gratuito por API fue una promoción con fecha de término. Los términos oficiales (fish.audio/terms, Hanabi AI Inc.) no muestran la cláusula en los extractos revisados.
- **Qué hacer:** revisar en la cuenta de Fish Audio con qué plan se generaron las voces. Si fue gratuito, escribir a support@fish.audio para confirmar si pueden usarse en un producto comercial, o pasar a un plan pagado y volver a generar las voces (`npm run narrate` en `video/`; el costo de referencia publicado es de unos USD 15 por millón de bytes de texto).

## Herramienta de video (Remotion)

- La licencia gratuita cubre a personas, organizaciones sin fines de lucro y empresas con fines de lucro de hasta 3 personas.
- Desde 4 personas, se necesita una Company License (precios en remotion.pro/license; la licencia cambiará en Remotion 5.0).
- **Qué hacer:** si socatres opera como empresa de 4 o más personas, comprar la licencia antes de seguir renderizando videos.

## Datos personales (Ley 19.628 y Ley 21.719)

- socatres guarda datos de menores de edad. Las cuentas de menores de 14 años las crea el apoderado; los estudiantes de 14 o más pueden registrarse solos.
- Hay un borrador de política de privacidad en `docs/privacidad-borrador.md`, escrito a partir de lo que la app guarda de verdad. Antes de publicarlo falta:
  1. ~~Definir el responsable de los datos y un correo de contacto.~~ Hecho el 14 de noviembre de 2026 (David Troncoso).
  2. Revisarlo con un abogado, en especial lo relativo a la Ley 21.719 y a su fecha de entrada en vigencia.
  3. ~~Publicarlo como página y enlazarlo.~~ Hecho: `/privacidad`, enlazada desde la portada, el registro y «Mis datos».
