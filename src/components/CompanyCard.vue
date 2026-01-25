<script setup>
import { computed, ref } from 'vue';
import ActionPanel from './ActionPanel.vue';
import ContactModal from './ContactModal.vue';

const props = defineProps({
  deal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['decision']);

const selectedContact = ref(null);
const isModalOpen = ref(false);

const openContactDetails = (contact) => {
  selectedContact.value = contact;
  isModalOpen.ref = true; // Wait, actually isModalOpen.value
};

const closeContactDetails = () => {
  isModalOpen.value = false;
  selectedContact.value = null;
};

// Re-defining to fix potential typo in brainstorming
const openContactDetailsFixed = (contact) => {
  selectedContact.value = contact;
  isModalOpen.value = true;
};

const onDecision = (decision) => {
  emit('decision', decision); 
}

const FOLLOWER_THRESHOLD = 5000;

const sortedContacts = computed(() => {
  if (!props.deal.contacts) return [];
  
  const strengthOrder = {
    'strong': 0,
    'good': 1,
    'weak': 2,
    'very weak': 3,
    'none': 4
  };

  return [...props.deal.contacts].sort((a, b) => {
    const sA = strengthOrder[a.strength?.toLowerCase()] ?? 4;
    const sB = strengthOrder[b.strength?.toLowerCase()] ?? 4;
    return sA - sB;
  });
});
const getGaugeInfo = (value, type) => {
  if (!value || value === "N/A") return { percent: 0, label: "N/A" };
  
  const cleanVal = value.toLowerCase().replace(/\s/g, '');
  
  const sizeTiers = [
    '1-10', '11-50', '51-250', '251-1K', '1K-5K', '5K-10K', '10K-50K', '50K-100K', '100K+'
  ];
  const sizeMap = {
    '1-10': 0, '11-50': 1, '51-200': 2, '51-250': 2, '201-500': 3, '251-1k': 3, 
    '501-1k': 3, '1k-5k': 4, '5k-10k': 5, '10k-50k': 6, '50k-100k': 7, '100k+': 8
  };
  
  const revenueTiers = [
    '$0-$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M-$250M', '$250M-$500M', '$500M-$1B', '$1B-$10B', '$10B+'
  ];
  const revMap = {
    '$0-$1m': 0, '$0m-$1m': 0, '$1m-$10m': 1, '$10m-$50m': 2, '$50m-$100m': 3, 
    '$100m-$250m': 4, '$250m-$500m': 5, '$500m-$1b': 6, '$1b-$10b': 7, '$10b+': 8
  };

  if (type === 'size') {
    const index = sizeMap[cleanVal];
    return {
      index: index !== undefined ? index : -1,
      percent: index !== undefined ? ((index + 1) / sizeTiers.length) * 100 : 0,
      label: index !== undefined ? sizeTiers[index] : value
    };
  }
  
  if (type === 'revenue') {
    const index = revMap[cleanVal];
    return {
      index: index !== undefined ? index : -1,
      percent: index !== undefined ? ((index + 1) / revenueTiers.length) * 100 : 0,
      label: index !== undefined ? revenueTiers[index] : value
    };
  }
  
  return { index: -1, percent: 0, label: value };
};
</script>

<template>
  <div class="company-card panel">
    
    <!-- Branding Header -->
    <div class="card-header">
      <div class="branding-group">
        <img v-if="deal.logo" :src="deal.logo" class="company-logo" :alt="deal.name">
        <div class="identity-group">
          <div class="title-row">
            <h2 class="company-name">{{ deal.name }}</h2>
            <span v-if="deal.countryCode === 'FR'" class="country-flag">🇫🇷</span>
            <span v-else-if="deal.countryCode" class="country-badge">{{ deal.countryCode }}</span>
            <span v-if="deal.foundation" class="foundation-year">est. {{ deal.foundation }}</span>
          </div>
          <div class="crm-tags">
            <span class="tag sector">{{ deal.sector }}</span>
            <span class="tag location" v-if="deal.location !== 'N/A'">{{ deal.location }}</span>
          </div>
        </div>
      </div>
      <div class="links-group">
        <a v-if="deal.website" :href="'https://' + deal.website" target="_blank" class="btn link-btn site-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Site
        </a>
        <a v-if="deal.linkedin" :href="'https://' + deal.linkedin" target="_blank" class="btn link-btn linkedin-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          LinkedIn
        </a>
      </div>
    </div>

    <!-- About Section -->
    <div class="info-section about-section" v-if="deal.description">
      <p class="description">{{ deal.description }}</p>
    </div>

    <!-- Key Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-block">
        <span class="label">Identity 🆔</span>
        <div class="sub-metrics">
          <div class="sub-item gauge-item">
            <div class="sub-label-row">
              <span class="sub-label">Taille</span>
              <span class="sub-value">{{ getGaugeInfo(deal.size, 'size').label }}</span>
            </div>
            <div class="gauge-container">
              <div class="icon-gauge size-gauge">
                <span 
                  v-for="i in 9" 
                  :key="i" 
                  class="gauge-icon" 
                  :class="{ active: i <= getGaugeInfo(deal.size, 'size').index + 1 }"
                >👤</span>
              </div>
            </div>
          </div>
          <div class="sub-item gauge-item">
            <div class="sub-label-row">
              <span class="sub-label">Revenue</span>
              <span class="sub-value">{{ getGaugeInfo(deal.revenue, 'revenue').label }}</span>
            </div>
            <div class="gauge-container">
              <div class="icon-gauge revenue-gauge">
                <span 
                  v-for="i in 9" 
                  :key="i" 
                  class="gauge-icon" 
                  :class="{ active: i <= getGaugeInfo(deal.revenue, 'revenue').index + 1 }"
                >$</span>
              </div>
            </div>
          </div>
          <div class="sub-item">
            <span class="sub-label">Type</span>
            <span class="sub-value">{{ deal.companyType }}</span>
          </div>
        </div>
      </div>

      <div class="metric-block">
        <span class="label">Signals ⚡</span>
        <div class="sub-metrics">
          <div class="sub-item events-item">
            <span class="sub-label">Événements</span>
            <div class="events-chips">
              <span v-for="event in deal.eventsAttended" :key="event" class="event-chip">{{ event }}</span>
              <span v-if="!deal.eventsAttended?.length" class="sub-value">N/A</span>
            </div>
          </div>
          <div class="sub-item" v-if="deal.followerCount >= FOLLOWER_THRESHOLD">
            <span class="sub-label">Followers X</span>
            <span class="sub-value">{{ deal.followerCount.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="metric-block contacts-block" v-if="deal.hasContact">
        <span class="label">Contacts 👥</span>
        <div class="contacts-list">
          <div 
            v-for="contact in sortedContacts" 
            :key="contact.name" 
            class="contact-card-inner clickable"
            @click="openContactDetailsFixed(contact)"
          >
            <img v-if="contact.avatar" :src="contact.avatar" class="contact-avatar" alt="Avatar">
            <div v-else class="contact-avatar-placeholder">{{ contact.name.charAt(0) }}</div>
            
            <div class="contact-info">
              <span class="contact-name">{{ contact.name }}</span>
              <span class="contact-title" v-if="contact.title">{{ contact.title }}</span>
              
              <div class="contact-footer">
                <span v-if="contact.email" class="email-tag">{{ contact.email }}</span>
                <span v-if="contact.strength" class="strength-tag" :class="contact.strength.toLowerCase().replace(' ', '-')">
                   {{ contact.strength }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Warning if needed -->
    <div v-if="!deal.hasContact" class="warning-banner">
      ⚠️ Aucun contact identifié dans le CRM
    </div>

    <!-- Decision Area -->
    <div class="decision-area">
       <ActionPanel @decision-made="onDecision" />
    </div>

    <ContactModal 
      v-if="selectedContact"
      :is-open="isModalOpen"
      :contact="selectedContact"
      @close="closeContactDetails"
    />

  </div>
</template>

<style scoped>
.company-card {
  background: white;
  padding: 0;
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
}

/* Header & Branding */
.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.branding-group {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.company-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  background: #f8f9fa;
  padding: 4px;
  border: 1px solid var(--border-color);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.country-badge {
  background: #1e293b;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.country-flag {
  font-size: 1.5rem;
  line-height: 1;
}

.foundation-year {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-left: 0.25rem;
}

.events-item {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 0.5rem;
}

.events-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.event-chip {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  border: 1px solid var(--border-color);
}

.identity-group {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.crm-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.tag.sector::after {
  content: "•";
  margin-left: 0.5rem;
}

.links-group {
  display: flex;
  gap: 0.5rem;
}

.link-btn {
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white !important;
  border: none;
  font-weight: 600;
}

.site-btn { background-color: var(--accent-primary); }
.linkedin-btn { background-color: #0077b5; }

/* Sections */
.info-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.about-section {
  background: #fff;
}

.description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  background: var(--bg-color);
  padding: 1.5rem;
  gap: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.metric-block {
  background: white;
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
}

.metric-block:last-child {
  border-right: 1px solid var(--border-color);
}

.label {
  display: block;
  font-size: 0.6rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 900;
  margin-bottom: 1.25rem;
  letter-spacing: 0.15em;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #f1f5f9;
}

.sub-metrics {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.sub-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.gauge-item {
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.4rem;
}

.sub-label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.gauge-container {
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid #f1f5f9;
}

.icon-gauge {
  display: flex;
  gap: 4px;
  align-items: center;
}

.gauge-icon {
  font-size: 0.75rem;
  color: #e2e8f0; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.25;
}

.gauge-icon.active {
  opacity: 1;
  transform: scale(1.1);
}

/* Color progression for Taille (Active icons) */
.size-gauge .gauge-icon.active { color: #f59e0b; }
.size-gauge .gauge-icon:nth-child(-n+3).active { color: #ef4444; }
.size-gauge .gauge-icon:nth-child(n+7).active { color: #10b981; }

/* Color progression for Revenue (Active icons) */
.revenue-gauge .gauge-icon.active { 
  font-weight: 800;
  color: #f59e0b;
}
.revenue-gauge .gauge-icon:nth-child(-n+3).active { color: #ef4444; }
.revenue-gauge .gauge-icon:nth-child(n+7).active { color: #10b981; }

.sub-label {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sub-value {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 0.85rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-card-inner.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.6rem;
  margin: -0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
}

.contact-card-inner.clickable:hover {
  background: #f8fafc;
  border-color: var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.contact-card-inner {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.contact-card-inner:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.contact-avatar, .contact-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.contact-avatar-placeholder {
  background: var(--accent-soft);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contact-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-title {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.15rem;
  line-height: 1.2;
}

.contact-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.email-tag {
  font-size: 0.7rem;
  color: var(--accent-primary);
  font-weight: 500;
}

.strength-tag {
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 700;
  text-transform: uppercase;
}

.strength-tag.strong { background: #dcfce7; color: #15803d; }
.strength-tag.weak, .strength-tag.very-weak { background: #fef2f2; color: #b91c1c; }
.strength-tag.good { background: #f0fdf4; color: #166534; }

/* Footer */
.warning-banner {
  background: #fffbeb;
  color: #b45309;
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
}

.decision-area {
  padding: 2rem;
}
</style>
