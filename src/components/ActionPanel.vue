<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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

const isOpen = ref(false);

const statuses = [
  { id: 'engaged', label: 'Engaged', color: '#10b981', icon: '🤝' },
  { id: 'engaging', label: 'Engaging', color: '#6366f1', icon: '⚡' },
  { id: 'to_engage', label: 'To engage', color: '#f59e0b', icon: '🎯' },
  { id: 'tbd', label: 'To be defined', color: '#94a3b8', icon: '❓' },
  { id: 'dq', label: 'DQ', color: '#ef4444', icon: '🚫' }
];

// Map Attio status to our ID format
const attioToId = {
  'engaged': 'engaged',
  'engaging': 'engaging',
  'to engage': 'to_engage',
  'tbd': 'tbd',
  'dq': 'dq'
};

// Initialize from prop or null
const selectedId = ref(props.currentStatus ? attioToId[props.currentStatus.toLowerCase()] || null : null);

// Watch for prop changes (when switching deals)
watch(() => props.currentStatus, (newStatus) => {
  selectedId.value = newStatus ? attioToId[newStatus.toLowerCase()] || null : null;
});

const selectedItem = computed(() => {
  return statuses.find(s => s.id === selectedId.value) || { label: 'Choisir un statut...', color: '#94a3b8' };
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectStatus = (status) => {
  selectedId.value = status.id;
  isOpen.value = false;
  emit('decision-made', { status: status.id });
  
  // Victory animation 🎉
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.8 },
    colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
  });
};

// Close on outside click
const closeDropdown = (e) => {
  if (!e.target.closest('.modern-select-container')) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', closeDropdown));
onUnmounted(() => window.removeEventListener('click', closeDropdown));
</script>

<template>
  <div class="action-panel-refactored">
    <div class="action-card">
      <div class="action-header">
        <label class="section-label">Business Status</label>
        <div class="action-badge">Action Finale</div>
      </div>
      
      <div class="modern-select-container">
        <!-- Main Toggle -->
        <div 
          class="dropdown-toggle" 
          :class="{ open: isOpen }"
          @click="toggleDropdown"
        >
          <div class="selected-content">
            <span v-if="selectedId" class="status-icon">{{ selectedItem.icon }}</span>
            <span class="label-text" :style="{ color: selectedId ? 'var(--text-primary)' : '#94a3b8' }">
              {{ selectedId ? selectedItem.label : 'Qualifier le deal...' }}
            </span>
          </div>
          <span class="chevron" :class="{ rotated: isOpen }">⌄</span>
        </div>

        <!-- Dropdown Menu (Opens Upwards) -->
        <Transition name="slide-up">
          <div v-if="isOpen" class="dropdown-menu">
            <div 
              v-for="status in statuses" 
              :key="status.id"
              class="menu-item"
              :class="{ selected: selectedId === status.id }"
              @click="selectStatus(status)"
            >
              <div class="item-visual" :style="{ background: status.color + '20', color: status.color }">
                {{ status.icon }}
              </div>
              <span class="item-label">{{ status.label }}</span>
              <span v-if="selectedId === status.id" class="check">✓</span>
            </div>
          </div>
        </Transition>
      </div>
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

.modern-select-container {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  min-height: 44px;
}

.dropdown-toggle:hover {
  border-color: var(--accent-primary);
  background: white;
}

.dropdown-toggle.open {
  border-color: var(--accent-primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.selected-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.chevron {
  font-size: 1rem;
  color: #94a3b8;
  transition: transform 0.2s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 -10px 25px -5px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 0.5rem;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item.selected {
  background: #eff6ff;
}

.item-visual {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.item-label {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.check {
  color: #3b82f6;
  font-weight: 900;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

  .dropdown-toggle {
    min-height: 48px;
    border-radius: 10px;
  }

  .selected-content {
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  .dropdown-menu {
    border-radius: 14px;
  }

  .menu-item {
    padding: 0.75rem;
  }

  .item-visual {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .item-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .action-card {
    padding: 0.875rem;
    border-radius: 14px;
  }

  .dropdown-toggle {
    padding: 0.6rem 0.875rem;
  }

  .menu-item {
    padding: 0.6rem;
    gap: 0.5rem;
  }
}
</style>
