<script setup>
defineProps({
  deals: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  results: {
    type: Array,
    required: true
  },
  isMobileOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select-deal', 'close']);

const isProcessed = (dealId, results) => {
  return results.some(r => r.dealId === dealId);
};
</script>

<template>
  <aside class="sidebar" :class="{ 'mobile-open': isMobileOpen }">
    <div class="sidebar-header">
      <div class="logo-area">
        <span class="logo-icon">🦋</span>
        <span class="logo-text">DealFlow</span>
      </div>
      <div class="week-label">Week #42</div>
    </div>

    <!-- Progress Tracker -->
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-title">Progression</span>
        <span class="progress-count">{{ results.length }} / {{ deals.length }}</span>
      </div>
      <div class="progress-bar-bg">
        <div 
          class="progress-bar-fill" 
          :style="{ width: (results.length / deals.length) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <nav class="nav-list">
      <div class="nav-section-label">Deals à qualifier</div>
      
      <button 
        v-for="(deal, index) in deals" 
        :key="deal.id"
        class="nav-item"
        :class="{ 
          active: index === currentIndex,
          processed: isProcessed(deal.id, results)
        }"
        @click="$emit('select-deal', index)"
      >
        <span class="status-indicator">
          <span v-if="isProcessed(deal.id, results)" class="check">✓</span>
          <span v-else class="circle"></span>
        </span>
        <span class="company-name">{{ deal.name }}</span>
      </button>

    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  flex-shrink: 0;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.week-label {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-left: 2rem; /* Align with text */
}

.progress-section {
  background: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-title {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.progress-count {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--accent-primary);
}

.progress-bar-bg {
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary) 0%, #818cf8 100%);
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.nav-section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.1s;
}

.nav-item:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent-primary);
  font-weight: 500;
}

.status-indicator {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
}

.nav-item.active .circle {
  background: var(--accent-primary);
}

.check {
  font-size: 0.75rem;
  color: var(--success);
  font-weight: 700;
}

.company-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: none;
    width: 280px;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .sidebar-header {
    margin-top: 0.5rem;
  }

  .nav-item {
    padding: 1rem;
  }

  .company-name {
    font-size: 1rem;
  }
}
</style>
