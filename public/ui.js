export const $ = (s) => document.querySelector(s);
export const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function button(text, action, cls = "") {
  return `<button class="${cls}" data-action="${action}">${text}</button>`;
}
export function heading(eye, title, desc) {
  return `<div class="eyebrow">${escape(eye)}</div><h1>${escape(title)}</h1><p class="intro">${escape(desc)}</p>`;
}
