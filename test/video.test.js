import test from "node:test";
import assert from "node:assert/strict";
import {
  parseYouTube,
  parseTime,
  validateVideo,
  videoFromFields,
  videoFacade,
  embedUrl,
} from "../public/video.js";

const ID = "dQw4w9WgXcQ";

test("recognizes every common YouTube link and rejects others", () => {
  for (const url of [
    ID,
    `https://www.youtube.com/watch?v=${ID}`,
    `youtube.com/watch?v=${ID}&list=PL123`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}`,
  ])
    assert.equal(parseYouTube(url)?.id, ID, url);
  assert.equal(parseYouTube(`https://youtu.be/${ID}?t=95`).start, 95);
  assert.equal(parseYouTube(`https://www.youtube.com/watch?v=${ID}&t=1m30s`).start, 90);
  for (const bad of [
    "",
    "https://vimeo.com/123",
    `https://evil.com/watch?v=${ID}`,
    `https://youtube.com.evil.com/watch?v=${ID}`,
    "https://www.youtube.com/watch?v=corto",
    `javascript:alert(1)//${ID}`,
  ])
    assert.equal(parseYouTube(bad), null, bad);
});

test("times accept seconds, m:ss and h/m/s notation", () => {
  assert.equal(parseTime(""), null);
  assert.equal(parseTime("90"), 90);
  assert.equal(parseTime("1:30"), 90);
  assert.equal(parseTime("1:02:03"), 3723);
  assert.equal(parseTime("2m"), 120);
  assert.ok(Number.isNaN(parseTime("hola")));
});

test("teacher fields become a validated video", () => {
  assert.equal(videoFromFields({ url: "" }), undefined);
  assert.deepEqual(
    videoFromFields({ url: `https://youtu.be/${ID}?t=30`, title: " Ecuaciones ", start: "", end: "3:00" }),
    { id: ID, title: "Ecuaciones", start: 30, end: 180 },
  );
  assert.deepEqual(
    videoFromFields({ url: `https://youtu.be/${ID}?t=30`, title: "E", start: "1:00" }),
    { id: ID, title: "E", start: 60 },
    "explicit start wins over the link",
  );
  assert.throws(() => videoFromFields({ url: "https://vimeo.com/1", title: "x" }), /enlace/);
  assert.throws(() => videoFromFields({ url: ID, title: "" }), /título/);
  assert.throws(() => videoFromFields({ url: ID, title: "x", start: "2:00", end: "1:00" }), /posterior/);
  assert.throws(() => videoFromFields({ url: ID, title: "x", end: "mañana" }), /tiempo|escribirse/);
  assert.throws(() => validateVideo({ id: "<script>", title: "x" }), /enlace/);
});

test("the facade loads nothing external and the player uses youtube-nocookie", () => {
  const html = videoFacade({ id: ID, title: "<b>Balanza</b>", start: 30, end: 180 }, "equations");
  assert.doesNotMatch(html, /<iframe|<img|ytimg|googleapis/);
  assert.match(html, /&lt;b&gt;Balanza/);
  assert.match(html, /0:30–3:00 · 2:30 min/);
  const url = new URL(embedUrl({ id: ID, title: "t", start: 30, end: 180 }));
  assert.equal(url.hostname, "www.youtube-nocookie.com");
  assert.equal(url.searchParams.get("start"), "30");
  assert.equal(url.searchParams.get("end"), "180");
  assert.equal(url.searchParams.get("rel"), "0");
});
