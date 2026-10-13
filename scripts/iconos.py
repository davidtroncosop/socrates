# Genera los íconos de la app desde la ilustración del búho.
# Uso: python3 scripts/iconos.py docs/marca/buho-original.png public
#
# 1. Separa el búho del fondo claro (la ilustración trae un recuadro blanco
#    con margen gris que, si se usa tal cual, queda doblemente redondeado).
# 2. Lo compone sobre blanco con el margen que exige cada plataforma.
import sys
from collections import deque
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]


def extract(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    # Fondo: casi blanco y sin color. La cara y el pecho del búho son crema o
    # están rodeados de café, así que el relleno desde los bordes no entra.
    is_bg = lambda p: min(p) >= 228 and max(p) - min(p) <= 10
    mask = Image.new("L", (w, h), 255)
    m = mask.load()
    seen = bytearray(w * h)
    queue = deque([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
                  + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
    while queue:
        x, y = queue.popleft()
        if seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        if not is_bg(px[x, y]):
            continue
        m[x, y] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                queue.append((nx, ny))
    # Las florcitas blancas del borde de la rama tocan el fondo: un cierre
    # rellena esas muescas. Los restos claros no se ven sobre fondo blanco.
    mask = mask.filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.MinFilter(25))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop(mask.point(lambda a: 255 if a > 20 else 0).getbbox())


owl = extract(src)
FACE = (int(owl.width * 0.27), 0, owl.width, int(owl.height * 0.46))  # la cabeza, centrada


def compose(size, share, crop=None):
    art = owl.crop(crop) if crop else owl
    scale = size * share / max(art.width, art.height)
    w, h = round(art.width * scale * 4), round(art.height * scale * 4)
    big = Image.new("RGBA", (size * 4, size * 4), (255, 255, 255, 255))
    big.alpha_composite(art.resize((w, h), Image.LANCZOS), ((size * 4 - w) // 2, (size * 4 - h) // 2))
    return big.resize((size, size), Image.LANCZOS).convert("RGB")


compose(512, 0.86).save(f"{out}/icon-512.png", optimize=True)
compose(192, 0.86).save(f"{out}/icon-192.png", optimize=True)
# Android recorta en círculo u otras formas: el búho cabe en el 80 % central.
compose(512, 0.66).save(f"{out}/icon-maskable-512.png", optimize=True)
# iOS redondea las esquinas por su cuenta.
compose(180, 0.84).save(f"{out}/apple-touch-icon.png", optimize=True)
# En la pestaña del navegador solo se lee bien la cara.
compose(32, 0.94, FACE).save(f"{out}/favicon-32x32.png", optimize=True)
compose(64, 0.94, FACE).save(f"{out}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
# Logo junto al nombre (barra de la app y portada): la cara, sin fondo,
# a 4× para pantallas de alta densidad (se muestra a ~40 px).
# Va dentro de un círculo crema: tapa los bordes del recorte y combina con
# los cafés del búho.
S = 640
face = owl.crop((int(owl.width * 0.22), 0, owl.width, int(owl.height * 0.62)))
scale = S * 0.98 / face.width
face = face.resize((round(face.width * scale), round(face.height * scale)), Image.LANCZOS)
badge = Image.new("RGBA", (S, S), (255, 241, 222, 255))
badge.alpha_composite(face, ((S - face.width) // 2, round(S * 0.07)))
from PIL import ImageDraw
circle = Image.new("L", (S, S), 0)
ImageDraw.Draw(circle).ellipse((0, 0, S - 1, S - 1), fill=255)
badge.putalpha(circle)
badge.resize((160, 160), Image.LANCZOS).save(f"{out}/logo-buho.png", optimize=True)
# Insignia de las notificaciones: Android solo usa la silueta (canal alfa).
# Los ojos se recortan como huecos: sin ellos la silueta es una mancha.
alpha = owl.getchannel("A")
head = owl.crop((0, 0, owl.width, int(owl.height * 0.4))).convert("L")
eyes = Image.new("L", owl.size, 0)
eyes.paste(head.point(lambda v: 255 if v < 70 else 0), (0, 0))
# Abrir (quitar restos finos del contorno) y luego agrandar: quedan los ojos.
eyes = eyes.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(2))
alpha = Image.composite(Image.new("L", owl.size, 0), alpha, eyes)
side = max(owl.size)
square = Image.new("L", (side, side), 0)
square.paste(alpha, ((side - owl.width) // 2, (side - owl.height) // 2))
silhouette = Image.new("RGBA", (96, 96), (255, 255, 255, 0))
silhouette.putalpha(square.resize((84, 84), Image.LANCZOS).crop((-6, -6, 90, 90)))
silhouette.save(f"{out}/badge-96.png", optimize=True)
print("íconos generados en", out)
