<script setup>
import { computed, onMounted, ref } from 'vue';
import SidebarNav from './components/SidebarNav.vue';
import CompanyCard from './components/CompanyCard.vue';
import GameSummary from './components/GameSummary.vue';
import StartScreen from './components/StartScreen.vue';
import { useGameLogic } from './composables/useGameLogic';

const { 
  weeklyDeals,
  currentDeal, 
  currentIndex, 
  results,
  submitDecision, 
  selectDeal,
  isGameCompleted,
  isStarted,
  startChallenge,
  score,
  streak,
  remainingDeals,
  resetGame,
  isLoading,
  error,
  loadDeals
} = useGameLogic();

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleSelectDeal = (index) => {
  selectDeal(index);
  closeMobileMenu();
};

// Get current deal's status from results
const currentDealStatus = computed(() => {
  if (!currentDeal.value) return null;
  const result = results.value.find(r => r.dealId === currentDeal.value.id);
  return result?.status || null;
});

onMounted(() => {
  loadDeals();
});
</script>

<template>
  <div class="dashboard-container">
    
    <!-- Mobile Menu Toggle -->
    <button 
      v-if="!isLoading && !error && isStarted"
      class="mobile-menu-toggle"
      @click="toggleMobileMenu"
      aria-label="Menu"
    >
      <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile Overlay -->
    <div 
      class="mobile-overlay" 
      :class="{ visible: isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <SidebarNav 
      v-if="!isLoading && !error && isStarted"
      :deals="weeklyDeals"
      :current-index="currentIndex"
      :results="results"
      :is-mobile-open="isMobileMenuOpen"
      @select-deal="handleSelectDeal"
      @close="closeMobileMenu"
    />

    <main class="main-content">
      
      <!-- Loading / Error States -->
      <div v-if="isLoading" class="center-msg">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="center-msg">
         <p class="text-danger">⚠️ {{ error }}</p>
         <button class="btn btn-primary" @click="loadDeals">Réessayer</button>
      </div>

      <!-- Main View -->
      <template v-else>
        <!-- Start Screen -->
        <StartScreen 
          v-if="!isStarted && !isGameCompleted" 
          :deal-count="remainingDeals" 
          :streak="streak"
          @start="startChallenge"
        />

        <!-- Game Summary -->
        <div v-else-if="isGameCompleted" class="content-wrapper">
          <GameSummary 
            :score="score" 
            :streak="streak" 
            :total="weeklyDeals.length"
            @restart="resetGame"
          />
        </div>

        <!-- Card View -->
        <div v-else-if="currentDeal" class="content-wrapper">
           <CompanyCard 
            :deal="currentDeal"
            :current-status="currentDealStatus"
            @decision="submitDecision" 
          />
        </div>
        
        <div v-else class="center-msg">
          <p>Sélectionnez un deal dans le menu.</p>
        </div>
      </template>

    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.center-msg {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.text-danger {
  color: var(--danger);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .main-content {
    padding: 1rem;
    padding-top: 4.5rem; /* Space for mobile header */
  }

  .content-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
    padding-top: 4rem;
  }
}
</style>
