#!/bin/sh
# Re-encode films to 6–10 MB (intro) with faststart, without changing resolution.
# Does not overwrite the originals: writes into ./optimized/.
# After a visual check, copy the files over and keep ?v= cache-bust.
# Throw SFX are left as WAV so the sound does not change.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
OUT="$ROOT/optimized"
mkdir -p "$OUT/intro"
# Intro is already 1920x1080 / 24 fps / ~25 s, moov is already at the start.
# The problem is the 15 Mbit/s bitrate (47 MB), not a missing faststart atom.
# Constrained CRF: high quality, hard cap so the file lands in the 6–10 MB band.
ffmpeg -y -i "$ROOT/intro/eddie_intro.mp4" \
  -c:v libx264 -preset slow -crf 20 -maxrate 3.2M -bufsize 6.4M -pix_fmt yuv420p \
  -c:a aac -b:a 160k -ac 2 -movflags +faststart \
  "$OUT/intro/eddie_intro.mp4"
# Petition clips: same picture, only shrink if the result is smaller.
for clip in v19-loss v19-refuse; do
  ffmpeg -y -i "$ROOT/intro/${clip}.mp4" \
    -c:v libx264 -preset slow -crf 20 -maxrate 2.8M -bufsize 5.6M -pix_fmt yuv420p \
    -c:a aac -b:a 160k -movflags +faststart \
    "$OUT/intro/${clip}.mp4"
done
# Optional: recompress hand frames at the same pixel size, quality 90.
# Compare visually with the originals before replacing — default look must not change.
if command -v cwebp >/dev/null 2>&1; then
  mkdir -p "$OUT/assets"
  for f in "$ROOT"/assets/*.webp; do
    base=$(basename "$f")
    cwebp -q 90 -m 6 -metadata none "$f" -o "$OUT/assets/$base"
  done
fi
echo "Wrote $OUT — compare visually, then replace and keep cache-bust ?v=."
ls -lah "$OUT/intro" "$OUT/assets" 2>/dev/null || true
