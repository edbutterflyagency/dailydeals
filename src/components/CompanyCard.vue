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
const showDetails = ref(false);

const openContactDetails = (contact) => {
  selectedContact.value = contact;
  isModalOpen.value = true;
};

const closeContactDetails = () => {
  isModalOpen.value = false;
  selectedContact.value = null;
};

const onDecision = (decision) => {
  emit('decision', decision);
}

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

const attioUrl = computed(() => {
  return `https://app.attio.com/butterflyagency/company/${props.deal.id}`;
});

const isFrance = computed(() => props.deal.countryCode === 'FR');
</script>

<template>
  <div class="company-card panel">

    <!-- Header with branding -->
    <div class="card-header">
      <div class="brand-section">
        <img v-if="deal.logo" :src="deal.logo" class="company-logo" :alt="deal.name">
        <div class="brand-info">
          <div class="name-row">
            <h2 class="company-name">{{ deal.name }}</h2>
            <span v-if="isFrance" class="country-flag">🇫🇷</span>
            <span v-else-if="deal.countryCode" class="country-badge">{{ deal.countryCode }}</span>
          </div>
          <p v-if="deal.description" class="tagline">{{ deal.description }}</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="links-group">
        <a v-if="deal.website" :href="'https://' + deal.website" target="_blank" class="link-btn site-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Site
        </a>
        <a v-if="deal.linkedin" :href="'https://' + deal.linkedin" target="_blank" class="link-btn linkedin-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          LinkedIn
        </a>
        <a :href="attioUrl" target="_blank" class="link-btn attio-btn">
          Attio
        </a>
      </div>
    </div>

    <!-- KEY METRICS - Big & Bold -->
    <div class="metrics-strip">
      <div class="metric-card">
        <span class="metric-icon">💰</span>
        <div class="metric-content">
          <span class="metric-label">Chiffre d'affaires</span>
          <span class="metric-value">{{ deal.revenue || 'N/A' }}</span>
        </div>
      </div>
      <div class="metric-card">
        <span class="metric-icon">👥</span>
        <div class="metric-content">
          <span class="metric-label">Employés</span>
          <span class="metric-value">{{ deal.size || 'N/A' }}</span>
        </div>
      </div>
      <div class="metric-card type-card">
        <span class="metric-icon">🏷️</span>
        <div class="metric-content">
          <span class="metric-label">Type</span>
          <span class="metric-value highlight">{{ deal.companyType || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Warning -->
    <div v-if="!deal.hasContact" class="warning-banner">
      <span class="warning-icon">⚠️</span>
      <span>Aucun contact identifié dans le CRM</span>
    </div>

    <!-- Expandable Details -->
    <div class="details-toggle" @click="showDetails = !showDetails">
      <span>{{ showDetails ? 'Masquer' : 'Plus d\'infos' }}</span>
      <svg :class="{ rotated: showDetails }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </div>

    <div v-if="showDetails" class="details-section">
      <div class="details-grid">
        <div v-if="deal.sector" class="detail-item">
          <span class="detail-label">Secteur</span>
          <span class="detail-value">{{ deal.sector }}</span>
        </div>
        <div v-if="deal.location && deal.location !== 'N/A'" class="detail-item">
          <span class="detail-label">Localisation</span>
          <span class="detail-value">{{ deal.location }}</span>
        </div>
        <div v-if="deal.foundation" class="detail-item">
          <span class="detail-label">Fondée en</span>
          <span class="detail-value">{{ deal.foundation }}</span>
        </div>
      </div>

      <div v-if="deal.eventsAttended?.length" class="events-section">
        <span class="detail-label">Événements</span>
        <div class="events-chips">
          <span v-for="event in deal.eventsAttended" :key="event" class="event-chip">{{ event }}</span>
        </div>
      </div>

      <!-- Contacts -->
      <div v-if="deal.hasContact" class="contacts-section">
        <span class="detail-label">Contacts</span>
        <div class="contacts-list">
          <div
            v-for="contact in sortedContacts"
            :key="contact.name"
            class="contact-item"
            @click="openContactDetails(contact)"
          >
            <div class="contact-avatar">{{ contact.name.charAt(0) }}</div>
            <div class="contact-info">
              <span class="contact-name">{{ contact.name }}</span>
              <span v-if="contact.title" class="contact-title">{{ contact.title }}</span>
            </div>
            <span v-if="contact.strength" class="strength-tag" :class="contact.strength.toLowerCase().replace(' ', '-')">
              {{ contact.strength }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Decision Area -->
    <div class="decision-area">
      <ActionPanel :deal-id="deal.id" @decision-made="onDecision" />
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
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.card-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
  border-bottom: 1px solid var(--border-color);
}

.brand-section {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.company-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 12px;
  background: white;
  padding: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  flex-shrink: 0;
}

.brand-info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.company-name {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.country-flag {
  font-size: 1.3rem;
  line-height: 1;
}

.country-badge {
  background: #64748b;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.tagline {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Links */
.links-group {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.link-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.site-btn { background: var(--accent-primary); }
.linkedin-btn { background: #0077b5; }
.attio-btn { background: #1e293b; }

/* KEY METRICS STRIP */
.metrics-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.metric-card {
  background: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.metric-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.metric-value.highlight {
  color: var(--accent-primary);
}

/* Warning */
.warning-banner {
  background: #fef3c7;
  color: #92400e;
  padding: 0.75rem 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #fde68a;
}

.warning-icon {
  font-size: 1rem;
}

/* Details Toggle */
.details-toggle {
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 600;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s;
}

.details-toggle:hover {
  background: #f1f5f9;
}

.details-toggle svg {
  transition: transform 0.2s;
}

.details-toggle svg.rotated {
  transform: rotate(180deg);
}

/* Details Section */
.details-section {
  padding: 1.25rem 2rem;
  background: #fafbfc;
  border-bottom: 1px solid var(--border-color);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.detail-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.detail-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 600;
}

/* Events */
.events-section {
  margin-bottom: 1rem;
}

.events-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.event-chip {
  background: white;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid var(--border-color);
}

/* Contacts */
.contacts-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.contact-item:hover {
  background: white;
  border-color: var(--accent-primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.contact-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-soft) 0%, #e0e7ff 100%);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.contact-title {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.3;
}

.strength-tag {
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
}

.strength-tag.strong { background: #dcfce7; color: #15803d; }
.strength-tag.good { background: #d1fae5; color: #059669; }
.strength-tag.weak, .strength-tag.very-weak { background: #fee2e2; color: #dc2626; }

/* Decision Area */
.decision-area {
  padding: 1.5rem 2rem;
}
</style>
