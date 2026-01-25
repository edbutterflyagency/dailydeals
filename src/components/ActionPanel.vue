<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['decision-made']);

const selectedStatus = ref(null);

const statuses = [
  { id: 'engaged', label: 'Engaged', color: 'var(--success)', borderColor: 'var(--success)', icon: '🤝' },
  { id: 'engaging', label: 'Engaging', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', icon: '⚡' },
  { id: 'to_engage', label: 'To engage', color: 'var(--warning)', borderColor: 'var(--warning)', icon: '🎯' },
  { id: 'tbd', label: 'To be defined', color: 'var(--text-secondary)', borderColor: 'var(--border-color)', icon: '❓' },
  { id: 'dq', label: 'DQ', color: 'var(--danger)', borderColor: 'var(--danger)', icon: '🚫' }
];

const canValidate = computed(() => {
  // Toujours grisé pour le moment
  return false;
});

const handleValidate = () => {
    emit('decision-made', {
        status: selectedStatus.value
    });
};
</script>

<template>
  <div class="action-panel-clean">
    
    <div class="row">
      <div class="col">
        <label class="section-label">Business Status</label>
        <div class="status-grid">
          <button 
            v-for="status in statuses" 
            :key="status.id"
            class="status-choice"
            :class="{ active: selectedStatus === status.id }"
            :style="{ '--status-color': status.color }"
            @click="selectedStatus = status.id"
          >
            <span class="status-icon" v-if="status.icon">{{ status.icon }}</span>
            <span class="status-text">{{ status.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="actions-footer">
      <button 
        class="btn btn-primary validate-btn"
        :disabled="!canValidate"
        @click="handleValidate"
      >
        Valider la décision
      </button>
    </div>

  </div>
</template>

<style scoped>
.action-panel-clean {
  margin-top: 1rem;
}

.row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.status-choice {
  background: white;
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.status-choice:hover {
  background: var(--bg-color);
  border-color: var(--text-tertiary);
}

.status-choice.active {
  background: #fdfdfd; 
  border-color: var(--status-color);
  color: var(--status-color);
  box-shadow: 0 0 0 1px var(--status-color);
  font-weight: 600;
}

.actions-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.validate-btn {
  min-width: 150px;
}

.validate-btn:disabled {
  background: var(--border-color);
  border-color: var(--border-color);
  color: var(--text-tertiary);
  cursor: not-allowed;
}
</style>
