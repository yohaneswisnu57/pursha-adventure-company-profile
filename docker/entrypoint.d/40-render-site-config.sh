#!/bin/sh
set -eu

template="/usr/share/nginx/html/config.template.js"
output="/usr/share/nginx/html/config.js"

if [ -f "$template" ]; then
  envsubst '${WHATSAPP_NUMBER} ${PRICE_BROMO} ${PRICE_IJEN} ${PRICE_KOMODO} ${PRICE_SUMBA}' < "$template" > "$output"
fi
