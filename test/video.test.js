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

test("own lesson videos take precedence and are served from our own domain", async () => {
  const { withLessonVideos, videoPlayer } = await import("../public/video.js");
  const own = { src: "/media/lessons/equations-ab12cd34.mp4", title: "La balanza", duration: 115 };
  const lessons = [
    { id: "equations", video: { id: ID, title: "YouTube" } },
    { id: "signs" },
    { id: "both" },
  ];
  const result = withLessonVideos(lessons, {
    equations: own,
    signs: { src: "https://evil.example/x.mp4", title: "x" },
  });
  assert.equal(result[0].video, own, "own video replaces YouTube");
  assert.equal(result[1].video, undefined, "only /media/lessons/ paths are accepted");
  assert.equal(result[2], lessons[2]);
  assert.equal(lessons[0].video.id, ID, "the catalog itself is untouched");

  const facade = videoFacade(own, "equations");
  assert.match(facade, /data-action="play-video:equations"/);
  assert.match(facade, /1:55 min/);
  assert.doesNotMatch(facade, /youtube|<video/i, "nothing loads before ▶");
  const player = videoPlayer(own);
  assert.match(player, /<video src="\/media\/lessons\/equations-ab12cd34\.mp4"[^>]* controls playsinline/);
  assert.doesNotMatch(player, /youtube/i);
});

test("media function serves R2 videos with byte ranges and immutable caching", async () => {
  const { serveMedia } = await import("../functions/_lib/media.js");
  const bytes = new TextEncoder().encode("0123456789");
  const MEDIA = {
    async get(key, { range, onlyIf }) {
      if (key !== "lessons/equations-ab12.mp4") return null;
      if (onlyIf.get("if-none-match") === '"v1"') return { size: 10, httpEtag: '"v1"' };
      const m = (range.get("range") ?? "").match(/bytes=(\d+)-(\d*)/);
      const offset = m ? Number(m[1]) : 0;
      const end = m && m[2] ? Number(m[2]) + 1 : 10;
      return {
        size: 10,
        httpEtag: '"v1"',
        range: m ? { offset, length: end - offset } : undefined,
        body: bytes.slice(offset, end),
      };
    },
  };
  const get = (path, headers = {}) =>
    serveMedia(new Request("https://socatres.pages.dev/media/" + path, { headers }), { MEDIA }, path.split("/"));

  const full = await get("lessons/equations-ab12.mp4");
  assert.equal(full.status, 200);
  assert.equal(full.headers.get("content-type"), "video/mp4");
  assert.match(full.headers.get("cache-control"), /immutable/);
  assert.equal(await full.text(), "0123456789");

  const part = await get("lessons/equations-ab12.mp4", { range: "bytes=2-5" });
  assert.equal(part.status, 206);
  assert.equal(part.headers.get("content-range"), "bytes 2-5/10");
  assert.equal(await part.text(), "2345");

  assert.equal((await get("lessons/equations-ab12.mp4", { "if-none-match": '"v1"' })).status, 304);
  assert.equal((await get("lessons/otro.mp4")).status, 404);
  for (const bad of ["../secret.mp4", "lessons/x.html", "otros/x.mp4"])
    assert.equal((await get(bad)).status, 404, bad);
  assert.equal((await serveMedia(new Request("https://x/media/lessons/a.mp4"), {}, ["lessons", "a.mp4"])).status, 404, "no bucket");
});
