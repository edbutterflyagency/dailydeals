#!/bin/bash
# Generate weekly deals from Google Sheet and rebuild static site
# Usage: ./scripts/generate-deals.sh

set -e

SHEET_ID="1JYLRAlI-fNrJyKjnzAH2vpT2ixpRuZCLrQrLmRLH8Xs"
N8N_ENDPOINT="https://flows.butterflyagency.io/webhook/daily-deals/get-deals"
REPO_DIR="$(dirname "$0")/.."
cd "$REPO_DIR"

# Get current week number (ISO week)
CURRENT_WEEK=$(date +%V)
CURRENT_YEAR=$(date +%Y)
WEEK_KEY="${CURRENT_YEAR}-W${CURRENT_WEEK}"

echo "📅 Generating deals for week $WEEK_KEY..."

# Check if we have cached deals from fetch-weekly-deals.sh
if [ -f /tmp/weekly-deals.json ]; then
  echo "📦 Using cached deal data from fetch step..."
  DEALS_JSON=$(cat /tmp/weekly-deals.json)
else
  # Read Attio IDs from Google Sheet
  echo "📖 Reading Attio IDs from Google Sheet..."
  SHEET_DATA=$(gog sheets get "$SHEET_ID" "Feuille 1!A:F" --json 2>/dev/null)

  # Find the row for current week
  ATTIO_IDS=$(echo "$SHEET_DATA" | jq -r --arg week "$WEEK_KEY" '
    .values[]? | select(.[0] == $week) | .[3] // ""
  ')

  if [ -z "$ATTIO_IDS" ] || [ "$ATTIO_IDS" == "null" ]; then
    echo "❌ No Attio IDs found for week $WEEK_KEY in Google Sheet"
    echo "   Run ./scripts/fetch-weekly-deals.sh first"
    exit 1
  fi

  echo "🔗 Attio IDs: $ATTIO_IDS"

  # Fetch deals from n8n for these specific IDs
  # For now, we'll fetch all and filter by the IDs we have
  echo "🔄 Fetching deal details from Attio..."
  
  # Convert comma-separated to array for filtering
  IFS=',' read -ra ID_ARRAY <<< "$ATTIO_IDS"
  NUM_IDS=${#ID_ARRAY[@]}
  
  RESPONSE=$(curl -s -X POST "$N8N_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"limit\": 100}")
  
  # Filter to only the IDs we want
  DEALS_JSON=$(echo "$RESPONSE" | jq -c --arg ids "$ATTIO_IDS" '
    .deals | map(select(.attioRecordId as $id | ($ids | split(",") | map(. == $id) | any)))
  ')
fi

# Count deals
NUM_DEALS=$(echo "$DEALS_JSON" | jq 'length')
echo "📊 Found $NUM_DEALS deals"

if [ "$NUM_DEALS" -eq 0 ]; then
  echo "❌ No deals to generate"
  exit 1
fi

# Generate deals.js
echo "📝 Generating src/data/deals.js..."

cat > src/data/deals.js << EOF
export const weeklyDeals = $(echo "$DEALS_JSON" | jq '.');
EOF

echo "✅ Generated deals.js with $NUM_DEALS deals"

# List the deals
echo ""
echo "📋 Deals for this week:"
echo "$DEALS_JSON" | jq -r '.[].name' | while read name; do
  echo "  • $name"
done

echo ""
echo "🔨 Building static site..."
npm run build

echo ""
echo "📤 Pushing to GitHub..."
git add -A
git commit -m "🔄 Weekly deals update - $WEEK_KEY" || echo "No changes to commit"
git push origin main

echo ""
echo "✅ Done! Site will auto-deploy to Netlify"
