#!/bin/bash
# Fetch random deals from Laravel API and save to Google Sheet
# Run this every Monday at 6am via cron
# Usage: ./scripts/fetch-weekly-deals.sh [num_deals]

set -e

NUM_DEALS=${1:-10}
SHEET_ID="1JYLRAlI-fNrJyKjnzAH2vpT2ixpRuZCLrQrLmRLH8Xs"
REPO_DIR="$(dirname "$0")/.."
cd "$REPO_DIR"

# Get current week info
CURRENT_WEEK=$(date +%V)
CURRENT_YEAR=$(date +%Y)
WEEK_KEY="${CURRENT_YEAR}-W${CURRENT_WEEK}"
WEEK_START=$(date -d "monday" +%Y-%m-%d 2>/dev/null || date -v-mon +%Y-%m-%d)
GENERATED_AT=$(date -Iseconds)

echo "📅 Fetching $NUM_DEALS deals for week $WEEK_KEY..."

# Get total number of pages (each page = 1 company when per_page=1)
TOTAL_PAGES=$(curl -s "https://lamp.butterflyagency.io/api/companies?per_page=1" | jq '.pagination.last_page')
echo "📊 Total companies available: $TOTAL_PAGES"

# Keep track of used IDs to avoid duplicates
USED_IDS=""

# Generate random page numbers and fetch companies
COMPANY_IDS=""
COMPANY_NAMES=""

FETCHED=0
ATTEMPTS=0
MAX_ATTEMPTS=$((NUM_DEALS * 3))

while [ $FETCHED -lt $NUM_DEALS ] && [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
  ATTEMPTS=$((ATTEMPTS + 1))
  
  # Random page (1 to total pages)
  RANDOM_PAGE=$((RANDOM % TOTAL_PAGES + 1))
  
  # Fetch one company from that page
  COMPANY=$(curl -s "https://lamp.butterflyagency.io/api/companies?per_page=1&page=$RANDOM_PAGE" | jq '.data[0]')
  
  if [ "$COMPANY" != "null" ] && [ -n "$COMPANY" ]; then
    ID=$(echo "$COMPANY" | jq -r '.id')
    NAME=$(echo "$COMPANY" | jq -r '.name')
    
    # Check for duplicates
    if [[ "$USED_IDS" == *",$ID,"* ]] || [[ "$USED_IDS" == "$ID,"* ]]; then
      continue
    fi
    
    USED_IDS="${USED_IDS}${ID},"
    FETCHED=$((FETCHED + 1))
    
    if [ -n "$COMPANY_IDS" ]; then
      COMPANY_IDS="${COMPANY_IDS},${ID}"
    else
      COMPANY_IDS="${ID}"
    fi
    
    echo "  ✅ #$FETCHED: $NAME (ID: $ID)"
  fi
done

echo ""
echo "📦 Company IDs: $COMPANY_IDS"

# Check if week already exists in sheet
EXISTING=$(gog sheets get "$SHEET_ID" "Feuille 1!A:A" --json | jq -r --arg week "$WEEK_KEY" '.values[]?[] | select(. == $week)')

if [ -n "$EXISTING" ]; then
  echo "⚠️ Week $WEEK_KEY already exists in sheet, updating..."
  # Find row number and update
  ROW_NUM=$(gog sheets get "$SHEET_ID" "Feuille 1!A:A" --json | jq -r --arg week "$WEEK_KEY" '.values | to_entries[] | select(.value[0] == $week) | .key + 1')
  gog sheets update "$SHEET_ID" "Feuille 1!A${ROW_NUM}:F${ROW_NUM}" \
    --values-json "[[\"$WEEK_KEY\", \"$WEEK_START\", \"$COMPANY_IDS\", \"\", \"$GENERATED_AT\", \"pending\"]]" \
    --input USER_ENTERED
else
  echo "➕ Adding new row for week $WEEK_KEY..."
  gog sheets append "$SHEET_ID" "Feuille 1!A:F" \
    --values-json "[[\"$WEEK_KEY\", \"$WEEK_START\", \"$COMPANY_IDS\", \"\", \"$GENERATED_AT\", \"pending\"]]" \
    --insert INSERT_ROWS
fi

echo ""
echo "✅ Saved to Google Sheet!"
echo ""
echo "🔄 Next step: Run ./scripts/generate-deals.sh to build the site"
