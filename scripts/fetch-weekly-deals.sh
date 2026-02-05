#!/bin/bash
# Fetch random deals from Attio via n8n and save to Google Sheet
# Run this every Monday at 6am via cron
# Usage: ./scripts/fetch-weekly-deals.sh [num_deals]

set -e

NUM_DEALS=${1:-10}
SHEET_ID="1JYLRAlI-fNrJyKjnzAH2vpT2ixpRuZCLrQrLmRLH8Xs"
N8N_ENDPOINT="https://flows.butterflyagency.io/webhook/daily-deals/get-deals"
REPO_DIR="$(dirname "$0")/.."
cd "$REPO_DIR"

# Get current week info
CURRENT_WEEK=$(date +%V)
CURRENT_YEAR=$(date +%Y)
WEEK_KEY="${CURRENT_YEAR}-W${CURRENT_WEEK}"
WEEK_START=$(date -d "monday" +%Y-%m-%d 2>/dev/null || date -v-mon +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)
GENERATED_AT=$(date -Iseconds)

echo "📅 Fetching $NUM_DEALS deals for week $WEEK_KEY..."

# Fetch more deals than needed to allow random selection
FETCH_COUNT=$((NUM_DEALS * 5))
echo "🔄 Fetching $FETCH_COUNT deals from Attio for random selection..."

RESPONSE=$(curl -s -X POST "$N8N_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"limit\": $FETCH_COUNT}")

# Check if we got data
TOTAL=$(echo "$RESPONSE" | jq '.deals | length')
if [ "$TOTAL" -eq 0 ] || [ "$TOTAL" == "null" ]; then
  echo "❌ No deals returned from Attio"
  exit 1
fi

echo "📊 Got $TOTAL deals from Attio"

# Randomly select NUM_DEALS from the response
SELECTED=$(echo "$RESPONSE" | jq -c --argjson n "$NUM_DEALS" '
  .deals | 
  to_entries | 
  [limit($n; .[range(0; length)] | select(true))] | 
  map(.value)
' | jq -c "[ .[] | {id, attioRecordId, name} ] | .[0:$NUM_DEALS]")

# Use shuf if available for better randomness
if command -v shuf &> /dev/null; then
  SELECTED=$(echo "$RESPONSE" | jq -c '.deals[]' | shuf | head -n $NUM_DEALS | jq -s '.')
fi

# Extract IDs and names
ATTIO_IDS=$(echo "$SELECTED" | jq -r '.[].attioRecordId' | tr '\n' ',' | sed 's/,$//')
COMPANY_NAMES=$(echo "$SELECTED" | jq -r '.[].name')

echo ""
echo "🎲 Selected $NUM_DEALS random deals:"
echo "$COMPANY_NAMES" | head -10 | while read name; do
  echo "  ✅ $name"
done

echo ""
echo "📦 Attio IDs: $ATTIO_IDS"

# Save the full deal data to a temp file for generate-deals.sh
echo "$SELECTED" > /tmp/weekly-deals.json

# Check if week already exists in sheet
EXISTING=$(gog sheets get "$SHEET_ID" "Feuille 1!A:A" --json 2>/dev/null | jq -r --arg week "$WEEK_KEY" '.values[]?[] | select(. == $week)' 2>/dev/null || echo "")

if [ -n "$EXISTING" ]; then
  echo "⚠️ Week $WEEK_KEY already exists in sheet, updating..."
  # Find row number and update
  ROW_NUM=$(gog sheets get "$SHEET_ID" "Feuille 1!A:A" --json | jq -r --arg week "$WEEK_KEY" '.values | to_entries[] | select(.value[0] == $week) | .key + 1')
  gog sheets update "$SHEET_ID" "Feuille 1!A${ROW_NUM}:F${ROW_NUM}" \
    --values-json "[[\"$WEEK_KEY\", \"$WEEK_START\", \"\", \"$ATTIO_IDS\", \"$GENERATED_AT\", \"pending\"]]" \
    --input USER_ENTERED
else
  echo "➕ Adding new row for week $WEEK_KEY..."
  gog sheets append "$SHEET_ID" "Feuille 1!A:F" \
    --values-json "[[\"$WEEK_KEY\", \"$WEEK_START\", \"\", \"$ATTIO_IDS\", \"$GENERATED_AT\", \"pending\"]]" \
    --insert INSERT_ROWS
fi

echo ""
echo "✅ Saved to Google Sheet!"
echo ""
echo "🔄 Next step: Run ./scripts/generate-deals.sh to build the site"
