<script setup>
import { computed } from 'vue';

const props = defineProps({
  dealId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['decision-made']);

const attioUrl = computed(() => {
  return `https://app.attio.com/butterflyagency/company/${props.dealId}`;
});

const openAttio = () => {
  window.open(attioUrl.value, '_blank');
  emit('decision-made', { status: 'opened_attio' });
};
</script>

<template>
  <div class="action-panel-refactored">
    <div class="action-card">
      <div class="action-header">
        <label class="section-label">Business Status</label>
        <div class="action-badge disabled-badge">Non connecté</div>
      </div>
      
      <!-- Disabled message -->
      <div class="disabled-notice">
        <div class="notice-icon">⚠️</div>
        <p class="notice-text">
          L'enregistrement n'est pas encore connecté au CRM. 
          Pour modifier le statut de ce deal, veuillez effectuer la modification directement sur Attio.
        </p>
      </div>

      <!-- Attio Button -->
      <a :href="attioUrl" target="_blank" class="attio-btn" @click="openAttio">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Modifier sur Attio
      </a>
    </div>
  </div>
</template>

<style scoped>
.action-panel-refactored {
  width: 100%;
}

.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.25rem;
  position: relative;
  overflow: visible;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-badge {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.disabled-badge {
  background: #fef3c7;
  color: #92400e;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.05em;
}

/* Disabled Notice */
.disabled-notice {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.notice-icon {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.notice-text {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

/* Attio Button */
.attio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.attio-btn:hover {
  background: #334155;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(30, 41, 59, 0.3);
}

.attio-btn:active {
  transform: translateY(0);
}

.attio-btn svg {
  flex-shrink: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .action-card {
    border-radius: 16px;
    padding: 1rem;
  }

  .action-header {
    margin-bottom: 0.75rem;
  }

  .section-label {
    font-size: 0.7rem;
  }

  .action-badge {
    font-size: 0.6rem;
    padding: 2px 6px;
  }

  .disabled-notice {
    padding: 0.875rem;
    gap: 0.5rem;
  }

  .notice-icon {
    font-size: 1.1rem;
  }

  .notice-text {
    font-size: 0.8rem;
  }

  .attio-btn {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .action-card {
    padding: 0.875rem;
    border-radius: 14px;
  }

  .disabled-notice {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .attio-btn {
    padding: 0.875rem;
  }
}
</style>
