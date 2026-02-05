#!/bin/bash
# Generate weekly deals from Google Sheet and rebuild static site
# Usage: ./scripts/generate-deals.sh

set -e

SHEET_ID="1JYLRAlI-fNrJyKjnzAH2vpT2ixpRuZCLrQrLmRLH8Xs"
REPO_DIR="$(dirname "$0")/.."
cd "$REPO_DIR"

# Get current week number (ISO week)
CURRENT_WEEK=$(date +%V)
CURRENT_YEAR=$(date +%Y)
WEEK_KEY="${CURRENT_YEAR}-W${CURRENT_WEEK}"

echo "📅 Generating deals for week $WEEK_KEY..."

# Find the row for current week in Sheet
SHEET_DATA=$(gog sheets get "$SHEET_ID" "Feuille 1!A:F" --json 2>/dev/null)

# Extract company IDs and Attio IDs for current week
# Parse the JSON to find the row matching current week
WEEK_ROW=$(echo "$SHEET_DATA" | jq -r --arg week "$WEEK_KEY" '.values[]? | select(.[0] == $week)')

if [ -z "$WEEK_ROW" ]; then
  echo "❌ No deals found for week $WEEK_KEY in Google Sheet"
  exit 1
fi

COMPANY_IDS=$(echo "$WEEK_ROW" | jq -r '.[2] // ""')
ATTIO_IDS=$(echo "$WEEK_ROW" | jq -r '.[3] // ""')

if [ -z "$COMPANY_IDS" ] || [ "$COMPANY_IDS" == "null" ]; then
  echo "❌ No company IDs for week $WEEK_KEY"
  exit 1
fi

echo "📦 Company IDs: $COMPANY_IDS"
echo "🔗 Attio IDs: $ATTIO_IDS"

# Fetch company details from Laravel API and generate deals.js
echo "🔄 Fetching company details..."

node -e "
const https = require('https');
const fs = require('fs');

const companyIds = '$COMPANY_IDS'.split(',').map(s => s.trim()).filter(Boolean);
const attioIds = '$ATTIO_IDS'.split(',').map(s => s.trim()).filter(Boolean);

async function fetchCompany(id) {
  return new Promise((resolve, reject) => {
    https.get('https://lamp.butterflyagency.io/api/companies/' + id, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const deals = [];
  
  for (let i = 0; i < companyIds.length; i++) {
    const id = companyIds[i];
    const attioId = attioIds[i] || null;
    
    try {
      const company = await fetchCompany(id);
      
      // Generate initials for avatar
      const initials = company.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      const colors = ['8b5cf6', '10b981', 'ef4444', 'f59e0b', '3b82f6', 'ec4899'];
      const color = colors[i % colors.length];
      
      deals.push({
        id: parseInt(id),
        attioRecordId: attioId,
        name: company.name,
        logo: company.logo 
          ? 'https://lamp.butterflyagency.io/' + company.logo
          : 'https://ui-avatars.com/api/?name=' + initials + '&background=' + color + '&color=fff',
        website: company.website || '',
        linkedin: company.linkedin_url || '',
        size: company.employees_count || 'N/A',
        revenue: company.annual_revenue || 'N/A',
        sector: company.industry || 'N/A',
        growth: 'N/A',
        crmTags: company.industry ? [company.industry] : [],
        maturity: 3,
        contact: {
          name: null,
          title: null,
          lastContact: null,
          hasContact: false
        },
        context: {
          reason: 'Deal de la semaine',
          icon: '🎯',
          color: 'blue'
        }
      });
      
      console.log('✅ Fetched: ' + company.name);
    } catch (e) {
      console.error('❌ Failed to fetch company ' + id + ': ' + e.message);
    }
  }
  
  const output = 'export const weeklyDeals = ' + JSON.stringify(deals, null, 2) + ';\\n';
  fs.writeFileSync('src/data/deals.js', output);
  console.log('\\n📝 Generated src/data/deals.js with ' + deals.length + ' deals');
}

main().catch(console.error);
"

echo "🔨 Building static site..."
npm run build

echo "📤 Pushing to GitHub..."
git add -A
git commit -m "🔄 Weekly deals update - $WEEK_KEY" || echo "No changes to commit"
git push origin main

echo "✅ Done! Site will auto-deploy to Netlify"
