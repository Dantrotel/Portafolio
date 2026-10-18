# Tareas pendientes

Última actualización: 2026-10-18

## Seguridad

- [ ] **Revocar la API key de Resend expuesta en Perrines UBB.** Está escrita en el código de `backend/src/services/notification.service.js` del repo público [B4yr0ndg/PERRINES-UBB-](https://github.com/B4yr0ndg/PERRINES-UBB-). Hay que revocarla desde el panel de Resend y, si el repo se puede editar, moverla a un `.env`.

## Portafolio

- [ ] **Probar el formulario de contacto en producción.** Enviar un mensaje desde [el sitio](https://dantrotel.github.io/Portafolio/#contacto) y comprobar que aparece el aviso de "Gracias" y que el correo llega a `dantrottel@gmail.com` (revisar spam). Si Formspree pide confirmar el formulario en el primer envío, confirmarlo.
- [ ] **Agregar los proyectos que no están en GitHub.** Para cada uno: nombre, problema que resolvía, stack, contexto (personal, académico o laboral), año, rol y link (repo, demo o captura), y confirmar que se puede mostrar públicamente.
- [ ] **Definir si AcTitUBB fue individual o en equipo.** Si fue en equipo, indicar de cuántas personas, para mostrarlo en la tarjeta y en el CV.
- [ ] **Revisar los cambios sin commitear en `package.json` y `package-lock.json`.** Bajan `gh-pages` de `^6.3.0` a `^6.1.1` y no se sabe de dónde vienen. Commitearlos o descartarlos con `git restore package.json package-lock.json`.
- [ ] **Cambiar la rama por defecto de GitHub de `gh-pages` a `main`.** En el repo: Settings > General > Default branch.

## Proyectos

- [ ] **Reentrenar el clasificador GTZAN separando por canción.** Hoy `train_test_split` separa los fragmentos al azar, así que fragmentos de una misma canción quedan en entrenamiento y en validación, y el 93% de accuracy está inflado. Usar `GroupShuffleSplit` agrupando por canción, reentrenar y publicar la métrica real en el portafolio y en el CV.

## CV

- [ ] **Borrar la copia vieja del CV** en `D:\IA-JOBS\mi-busqueda\Daniel_Aguayo_CV.pdf`. Tiene los datos anteriores a la corrección (CNN, LLMs locales, fechas viejas).
- [ ] **Mantener sincronizado el CV del portafolio.** Cada vez que cambie el CV general, regenerar también la versión web sin teléfono (`output/cv-daniel-aguayo-web.json`) y copiar el PDF a `public/CV.pdf`.

## Flujo de trabajo

- Trabajar en `wip-updates` y mergear a `main` para desplegar.
- Hacer push con la cuenta propia: `git -c credential.username=Dantrotel push origin <rama>`.
