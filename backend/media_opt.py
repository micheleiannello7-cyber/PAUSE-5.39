"""Mobile-optimised cover encoding (WebP, content-addressed paths).

Covers are stored twice: a hero (≤1200px, for the reader/home card) and a
thumbnail (≤600px, for lists). Both WebP at high quality — typically 5–10×
smaller than the PNG/JPEG originals with no visible loss on phone screens.
"""
import hashlib
import io

from PIL import Image, ImageOps

from storage import put_object, APP_NAME

HERO_MAX = 1200
THUMB_MAX = 600
QUALITY = 84


def encode_webp(raw: bytes, max_side: int) -> bytes:
    image = Image.open(io.BytesIO(raw))
    # Sorgente già WebP entro il limite (es. backend/covers pre-ottimizzate):
    # nessuna ricompressione, si usa il file così com'è.
    if (image.format == "WEBP" and max(image.size) <= max_side
            and image.getexif().get(274, 1) == 1):
        return raw
    image = ImageOps.exif_transpose(image)
    image = image.convert("RGB") if image.mode not in ("RGB", "RGBA") else image
    image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    out = io.BytesIO()
    image.save(out, "WEBP", quality=QUALITY, method=6)
    return out.getvalue()


def cutout_png(raw: bytes, tight: bool = False) -> bytes:
    """Oggetto 3D su sfondo nero → PNG RGBA con lo sfondo reso trasparente
    (stesso keying delle icone CTA), per usarlo sopra superfici colorate."""
    from generate_cta_icons import fit_square, key_out_background
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert("RGB")
    out = io.BytesIO()
    # Ritaglio stretto sull'oggetto (stesso margine delle icone CTA), così
    # occupa lo stesso spazio delle altre icone 3D.
    cutout = key_out_background(image)
    if tight:
        bbox = cutout.getchannel("A").point(lambda alpha: 255 if alpha > 8 else 0).getbbox()
        if bbox:
            cutout = cutout.crop(bbox)
        cutout = ImageOps.expand(cutout, border=max(2, round(max(cutout.size) * 0.015)))
        cutout.thumbnail((320, 320), Image.Resampling.LANCZOS)
    else:
        cutout = fit_square(cutout, size=320)
    cutout.save(out, "PNG", optimize=True)
    return out.getvalue()


def source_digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()[:12]


def _row_is_black(px, w: int, y: int) -> bool:
    step = max(1, w // 40)
    vals = [sum(px[x, y]) / 3 for x in range(0, w, step)]
    mean = sum(vals) / len(vals)
    var = sum((v - mean) ** 2 for v in vals) / len(vals)
    return mean < 16.0 and var ** 0.5 < 12.0


def crop_letterbox(raw: bytes) -> bytes:
    """Rimuove bande nere piene (letterbox) in alto/basso cotte dentro le
    copertine AI: il generatore lascia "spazio negativo" che esce nero pieno e
    in app sembra una card tagliata. L'app disegna da sé lo scrim del titolo,
    quindi la banda va solo ritagliata. Ritaglio prudente: solo righe quasi
    pure nere e uniformi, e solo se restano un ritratto valido (lato ≥ 768)."""
    try:
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
        rgb = image.convert("RGB")
    except Exception:  # noqa: BLE001
        return raw
    w, h = rgb.size
    px = rgb.load()
    top = 0
    for y in range(0, int(h * 0.5)):
        if _row_is_black(px, w, y):
            top += 1
        else:
            break
    bot = 0
    for y in range(h - 1, int(h * 0.5), -1):
        if _row_is_black(px, w, y):
            bot += 1
        else:
            break
    if top + bot < h * 0.03:
        return raw
    new_h = h - top - bot
    if new_h < 768 or new_h <= w:
        return raw
    out = io.BytesIO()
    rgb.crop((0, top, w, h - bot)).save(out, "WEBP", quality=90, method=6)
    return out.getvalue()


def upload_cover(story_id: str, raw: bytes) -> dict:
    """Encode + upload hero and thumb. Returns the Mongo fields to set.
    Le bande nere letterbox eventualmente presenti vengono ritagliate qui, così
    OGNI copertina servita (generate_covers, reduce_faces, covers_sync) è pulita."""
    raw = crop_letterbox(raw)
    digest = source_digest(raw)
    hero = encode_webp(raw, HERO_MAX)
    thumb = encode_webp(raw, THUMB_MAX)
    hero_path = f"{APP_NAME}/hero/{story_id}-{digest}.webp"
    thumb_path = f"{APP_NAME}/hero/{story_id}-{digest}-thumb.webp"
    put_object(hero_path, hero, "image/webp")
    put_object(thumb_path, thumb, "image/webp")
    return {
        "hero_image_generated": hero_path,
        "hero_image_thumb": thumb_path,
        "hero_source_digest": digest,
        "hero_bytes": {"hero": len(hero), "thumb": len(thumb), "source": len(raw)},
    }


def upload_avatar(user_id: str, raw: bytes) -> dict:
    """Foto profilo: raddrizza (EXIF), ritaglia al quadrato centrale, 320px,
    WebP. Path versionato dal digest → URL immutabile e cache-friendly."""
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert("RGB")
    side = min(img.size)
    left, top = (img.width - side) // 2, (img.height - side) // 2
    img = img.crop((left, top, left + side, top + side)).resize((320, 320), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=86, method=6)
    data = buf.getvalue()
    digest = hashlib.sha256(data).hexdigest()[:12]
    path = f"{APP_NAME}/avatar/{user_id}/{digest}.webp"
    put_object(path, data, "image/webp")
    return {"avatar_path": path, "avatar_version": digest}
