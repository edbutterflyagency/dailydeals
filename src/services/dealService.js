import { weeklyDeals as staticDeals } from '../data/deals';

// No more Laravel API - deals are now static (baked in at build time)
const STATUS_CHECK_URL = 'https://flows.butterflyagency.io/webhook/daily-deals/check-status';
const STATUS_UPDATE_URL = 'https://flows.butterflyagency.io/webhook/daily-deals/update-status';

// Helper to safely extract value from Attio's array structure
const getAttioValue = (values, key, type = 'text') => {
  if (!values || !values[key] || values[key].length === 0) return null;
  
  if (type === 'options') {
    return values[key].map(item => item.option?.title).filter(Boolean);
  }

  const item = values[key][0];
  
  if (type === 'domain') return item.domain;
  if (type === 'option') return item.option?.title;
  if (type === 'number') return item.value;
  if (type === 'year') return item.value ? new Date(item.value).getFullYear() : null;
  if (type === 'location') return `${item.locality || ''}${item.locality && item.region ? ', ' : ''}${item.region || ''}${ (item.locality || item.region) && item.country_code ? ' (' + item.country_code + ')' : item.country_code || '' }`.trim();
  if (type === 'country_code') return item.country_code;
  if (type === 'interaction') return { date: item.interacted_at, type: item.interaction_type };
  if (type === 'email') return item.email_address;
  if (type === 'currency') return `${item.currency_value.toLocaleString()} ${item.currency_code}`;
  if (item.attribute_type === 'personal-name') return item.full_name;
  
  return item.value || item.option?.title || null;
};

export const dealService = {
  /**
   * Return static deals (baked in at build time from Google Sheet)
   * No more runtime API call to Laravel
   */
  async fetchDeals() {
    return staticDeals;
  },

  adaptAttioDeal(item) {
    const company = item.company || {};
    const values = company.values || {};
    const people = item.people || [];

    // Extract basic fields
    const name = getAttioValue(values, 'name') || "Unknown Company";
    const domain = getAttioValue(values, 'domains', 'domain') || "";
    const description = getAttioValue(values, 'description');
    
    // Sector / Categories
    const sector = getAttioValue(values, 'categories', 'option') || "General";
    
    // Context Logic
    // Try to find a meaningful 'reason' from attributes
    let reason = "Opportunité à qualifier"; // Default
    let contextIcon = "⚡";
    let contextColor = "accent-primary";

    const event = getAttioValue(values, 'external_events_attended_4', 'option');
    if (event) {
      reason = `Présent à l'événement : ${event}`;
      contextIcon = "🎫";
      contextColor = "success";
    }

    // Contact Logic - Map all people
    const contacts = people.map(p => ({
      id: p.id?.record_id,
      name: getAttioValue(p.values, 'name') || "Contact",
      title: getAttioValue(p.values, 'job_title') || getAttioValue(p.values, 'job-title'),
      email: getAttioValue(p.values, 'email_addresses', 'email'),
      linkedin: getAttioValue(p.values, 'linkedin'),
      avatar: getAttioValue(p.values, 'avatar_url'),
      strength: getAttioValue(p.values, 'strongest_connection_strength', 'option'),
      lastInteraction: getAttioValue(p.values, 'last_interaction', 'interaction')
    }));
    
    return {
      id: company.id?.record_id || Math.random().toString(),
      name: name,
      logo: getAttioValue(values, 'logo_url') || (domain ? `https://logo.clearbit.com/${domain}` : `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random`),
      website: domain,
      linkedin: values.crm_link ? getAttioValue(values, 'crm_link') : `linkedin.com/company/${name.toLowerCase().replace(/\s/g, '-')}`,
      size: getAttioValue(values, 'employee_range', 'option') || "N/A",
      revenue: getAttioValue(values, 'estimated_arr_usd', 'option') || "N/A",
      companyType: getAttioValue(values, 'company_type', 'option') || "N/A",
      eventsAttended: getAttioValue(values, 'external_events_attended_4', 'options') || [],
      location: getAttioValue(values, 'primary_location', 'location') || "N/A",
      countryCode: getAttioValue(values, 'primary_location', 'country_code') || null,
      description: getAttioValue(values, 'description') || "",
      twitter: getAttioValue(values, 'twitter') || null,
      foundation: getAttioValue(values, 'foundation_date', 'year') || null,
      followerCount: getAttioValue(values, 'twitter_follower_count', 'number') || 0,
      sector: sector,
      growth: "", 
      crmTags: [sector].filter(Boolean),
      maturity: 3,
      contacts: contacts,
      hasContact: contacts.length > 0,
      context: {
        reason: reason,
        icon: contextIcon,
        color: contextColor
      }
    };
  },

  /**
   * Update business status in Attio
   * @param {string} attioRecordId - Attio record ID
   * @param {string} status - Status value (engaged, engaging, to engage, DQ)
   */
  async updateBusinessStatus(attioRecordId, status) {
    try {
      const response = await fetch(STATUS_UPDATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attioRecordId, status })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to update status:', data.error);
        return { success: false, error: data.error };
      }

      console.log(`Updated company ${attioRecordId} status to ${data.status}`);
      return { success: true, status: data.status };
    } catch (error) {
      console.error('Failed to update business status:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check Attio statuses for a list of Attio record IDs
   * Returns which companies are already categorized
   * @param {string[]} attioRecordIds - Array of Attio record IDs
   */
  async checkAttioStatuses(attioRecordIds) {
    // Filter out null/undefined IDs
    const validIds = attioRecordIds.filter(id => id != null);
    
    if (validIds.length === 0) {
      console.warn('No valid Attio record IDs to check');
      return { statuses: [] };
    }

    try {
      const response = await fetch(STATUS_CHECK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyIds: validIds })
      });

      if (!response.ok) {
        console.warn('Status check failed, assuming none processed');
        return { statuses: [] };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to check Attio statuses:', error);
      return { statuses: [] };
    }
  }
};
