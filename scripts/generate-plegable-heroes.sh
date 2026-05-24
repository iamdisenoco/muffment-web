#!/bin/bash
# Pipeline batch: flux-kontext-pro → clarity-upscaler → 851-labs bg-remove → auto-crop
# Para plegable-2 a plegable-7 (el plegable-1 ya está hecho como hero-v3)
# Output: public/img/products/2026/plegable-N-hero-v3.png (N=2..7)

set -e
cd "$(dirname "$0")/.."
set -a && . ./.env.local && set +a

PROMPT='Transform this into a hyperrealistic professional product photograph of the EXACT SAME yellow folding A-frame sign holder. CRITICAL: KEEP IDENTICAL — same exact silhouette, same A-frame geometry, same proportions, same angle, same yellow plexi panel in center, same metal tubing structure, same hanging mechanism, same base feet. DO NOT redesign, DO NOT change shape, DO NOT add or remove anything. ONLY upgrade the surface finish to: photorealistic electrostatic powder coat paint in vibrant chartreuse yellow, semi-matte to satin texture, micro-grain visible on metal tubes, subtle realistic reflections, professional studio lighting from upper left, soft shadow on white seamless backdrop, sharp focus throughout, 8k catalog quality, ultra crisp metal edges, no blur.'

PROMPT_JSON=$(python -c "import json,sys; print(json.dumps(sys.argv[1]))" "$PROMPT")

FLUX_VERSION="897a70f5a7dbd8a0611413b3b98cf417b45f266bd595c571a22947619d9ae462"
CLARITY_VERSION="dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e"
BG_VERSION="a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc"

api_call() {
  local payload_file="$1"
  curl -sX POST https://api.replicate.com/v1/predictions \
    -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
    -H "Content-Type: application/json" \
    -H "Prefer: wait=60" \
    --data-binary @"$payload_file"
}

poll_until_done() {
  local pred_id="$1"
  for i in {1..20}; do
    R=$(curl -s "https://api.replicate.com/v1/predictions/$pred_id" -H "Authorization: Bearer $REPLICATE_API_TOKEN")
    S=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
    if [ "$S" = "succeeded" ]; then
      echo "$R" | python -c "import sys,json; d=json.load(sys.stdin); o=d.get('output'); print(o[0] if isinstance(o,list) else o)"
      return 0
    fi
    if [ "$S" = "failed" ]; then
      echo "FAILED: $(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('error',''))")" >&2
      return 1
    fi
    sleep 4
  done
  echo "TIMEOUT" >&2
  return 1
}

for N in 2 3 4 5 6 7; do
  echo ""
  echo "════════ PLEGABLE-$N ════════"
  SRC="public/img/products/2026/plegable-$N.jpg"
  if [ ! -f "$SRC" ]; then echo "MISS: $SRC"; continue; fi

  # ── STEP 1: flux-kontext-pro (RGB 1024 con pintura electrostática) ──
  echo "[$N/7] Flux render..."
  B64=$(base64 -w0 "$SRC")
  printf '{"version":"%s","input":{"input_image":"data:image/jpeg;base64,%s","prompt":%s,"aspect_ratio":"match_input_image","output_format":"png","safety_tolerance":2}}' "$FLUX_VERSION" "$B64" "$PROMPT_JSON" > /tmp/flux-$N.json
  R=$(api_call /tmp/flux-$N.json)
  ID=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
  S=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
  if [ "$S" = "succeeded" ]; then
    FLUX_URL=$(echo "$R" | python -c "import sys,json; o=json.load(sys.stdin).get('output'); print(o[0] if isinstance(o,list) else o)")
  else
    echo "[$N/7] Flux polling..."
    FLUX_URL=$(poll_until_done "$ID")
  fi
  echo "[$N/7] Flux done: $FLUX_URL"
  curl -sL "$FLUX_URL" -o /tmp/p${N}-flux.png

  # ── STEP 2: clarity-upscaler 2x (creativity 0.05, resemblance 2.5, sharpen 5) ──
  echo "[$N/7] Clarity upscale..."
  B64=$(base64 -w0 /tmp/p${N}-flux.png)
  printf '{"version":"%s","input":{"image":"data:image/png;base64,%s","scale_factor":2,"creativity":0.05,"resemblance":2.5,"sharpen":5,"dynamic":6,"num_inference_steps":25,"output_format":"png","prompt":"hyperrealistic photograph, sharp metal A-frame stand, yellow electrostatic powder coat finish, crisp metallic edges, studio product photography, 8k detail","negative_prompt":"blurry, soft, jpeg artifacts, low quality, smooth, painting, illustration"}}' "$CLARITY_VERSION" "$B64" > /tmp/clarity-$N.json
  R=$(api_call /tmp/clarity-$N.json)
  ID=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
  S=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
  if [ "$S" = "succeeded" ]; then
    CLARITY_URL=$(echo "$R" | python -c "import sys,json; o=json.load(sys.stdin).get('output'); print(o[0] if isinstance(o,list) else o)")
  else
    echo "[$N/7] Clarity polling..."
    CLARITY_URL=$(poll_until_done "$ID")
  fi
  echo "[$N/7] Clarity done: $CLARITY_URL"
  curl -sL "$CLARITY_URL" -o /tmp/p${N}-clarity.png

  # ── STEP 3: 851-labs bg-remove (alpha) ──
  echo "[$N/7] BG remove..."
  B64=$(base64 -w0 /tmp/p${N}-clarity.png)
  printf '{"version":"%s","input":{"image":"data:image/png;base64,%s","format":"png","background_type":"rgba","threshold":0,"reverse":false}}' "$BG_VERSION" "$B64" > /tmp/bg-$N.json
  R=$(api_call /tmp/bg-$N.json)
  ID=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
  S=$(echo "$R" | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
  if [ "$S" = "succeeded" ]; then
    BG_URL=$(echo "$R" | python -c "import sys,json; o=json.load(sys.stdin).get('output'); print(o[0] if isinstance(o,list) else o)")
  else
    echo "[$N/7] BG polling..."
    BG_URL=$(poll_until_done "$ID")
  fi
  echo "[$N/7] BG done: $BG_URL"
  curl -sL "$BG_URL" -o "public/img/products/2026/plegable-${N}-hero-pre-crop.png"

  echo "[$N/7] ✓ Pre-crop saved: plegable-${N}-hero-pre-crop.png"

  # Sleep entre batches para no exceder rate limit
  if [ "$N" -lt 7 ]; then sleep 6; fi
done

echo ""
echo "═══════ ALL DONE ═══════"
ls -la public/img/products/2026/plegable-*-hero-pre-crop.png 2>&1
