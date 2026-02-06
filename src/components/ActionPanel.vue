<script setup>
import { ref, watch } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  dealId: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['decision-made']);

// Map Attio value to our format
const attioToValue = {
  'yes': 'yes',
  'no': 'no'
};

// Initialize from prop
const selectedValue = ref(props.currentStatus ? attioToValue[props.currentStatus.toLowerCase()] || null : null);

// Watch for prop changes (when switching deals)
watch(() => props.currentStatus, (newStatus) => {
  selectedValue.value = newStatus ? attioToValue[newStatus.toLowerCase()] || null : null;
});

const selectQualification = (value) => {
  selectedValue.value = value;
  emit('decision-made', { status: value });
  
  // Victory animation 🎉
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.8 },
    colors: value === 'yes' 
      ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
      : ['#ef4444', '#f87171', '#fca5a5', '#fecaca']
  });
};
</script>

<template>
  <div class="action-panel">
    <div class="action-card">
      <div class="action-header">
        <label class="section-label">Qualification</label>
        <div class="action-badge">Action Finale</div>
      </div>
      
      <div class="buttons-container">
        <button 
          class="qual-btn yes-btn"
          :class="{ selected: selectedValue === 'yes' }"
          @click="selectQualification('yes')"
        >
          <span class="btn-icon">✅</span>
          <span class="btn-label">YES</span>
        </button>
        
        <button 
          class="qual-btn no-btn"
          :class="{ selected: selectedValue === 'no' }"
          @click="selectQualification('no')"
        >
          <span class="btn-icon">❌</span>
          <span class="btn-label">NO</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-panel {
  width: 100%;
}

.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-badge {
  background: var(--accent-soft);
  color: var(--accent-primary);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #1e293b;
  letter-spacing: 0.05em;
}

.buttons-container {
  display: flex;
  gap: 1rem;
}

.qual-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.qual-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.qual-btn:active {
  transform: translateY(0);
}

/* YES Button */
.yes-btn:hover {
  border-color: #10b981;
  background: #ecfdf5;
}

.yes-btn.selected {
  border-color: #10b981;
  background: #10b981;
  box-shadow: 0 8px 25px -5px rgba(16, 185, 129, 0.4);
}

.yes-btn.selected .btn-label,
.yes-btn.selected .btn-icon {
  color: white;
}

/* NO Button */
.no-btn:hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.no-btn.selected {
  border-color: #ef4444;
  background: #ef4444;
  box-shadow: 0 8px 25px -5px rgba(239, 68, 68, 0.4);
}

.no-btn.selected .btn-label,
.no-btn.selected .btn-icon {
  color: white;
}

.btn-icon {
  font-size: 2rem;
}

.btn-label {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: 0.05em;
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

  .buttons-container {
    gap: 0.75rem;
  }

  .qual-btn {
    padding: 1rem 0.75rem;
    border-radius: 14px;
  }

  .btn-icon {
    font-size: 1.75rem;
  }

  .btn-label {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .action-card {
    padding: 0.875rem;
    border-radius: 14px;
  }

  .qual-btn {
    padding: 0.875rem 0.5rem;
    border-radius: 12px;
  }

  .btn-icon {
    font-size: 1.5rem;
  }

  .btn-label {
    font-size: 0.9rem;
  }
}
</style>
