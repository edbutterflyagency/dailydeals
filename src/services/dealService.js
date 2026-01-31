import { weeklyDeals as mockDeals } from '../data/deals';

const API_URL = 'https://lamp.butterflyagency.io/api/companies/deals';

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
  async fetchDeals() {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check for empty or error response
      if (data.message === "Unused Respond to Webhook node found in the workflow") {
        console.warn("API Workflow incomplete. Using mock data.");
        // Mocking 2 items as requested by user test case
        return mockDeals.slice(0, 2); 
      }

      const list = Array.isArray(data) ? data.flat() : (data.data || []);
      
      return list.map(item => this.adaptAttioDeal(item));

    } catch (error) {
      console.error("Failed to fetch deals:", error);
      return mockDeals.slice(0, 2);
    }
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

  async updateBusinessStatus(companyId, status) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Updated company ${companyId} status to ${status}`);
    return { success: true };
  }
};
