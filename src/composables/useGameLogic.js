import { ref, computed, onMounted } from 'vue';
import { dealService } from '../services/dealService';

const weeklyDeals = ref([]);
const currentIndex = ref(0);
const results = ref([]);
const streak = ref(3); 
const isStarted = ref(false);
const showSummary = ref(false);
const isLoading = ref(true);
const error = ref(null);

export function useGameLogic() {
  
  const loadDeals = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await dealService.fetchDeals();
      weeklyDeals.value = data;
    } catch (e) {
      error.value = "Impossible de charger les deals.";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  // call on first use (singleton pattern like) or can be called by component
  // Since this is outside function scope, it persists. 
  // Good for this app structure. 
  // However, handle re-mounts if needed. For now simple.
  
  const currentDeal = computed(() => weeklyDeals.value[currentIndex.value]);
  
  const progress = computed(() => {
    return {
      current: currentIndex.value + 1,
      total: weeklyDeals.value.length
    };
  });

  const score = computed(() => {
     return results.value.reduce((acc, res) => {
      let pts = 1; 
      if (res.action && res.action !== 'None' && res.action !== 'Aucune action déclenchée') pts += 1;
      return acc + pts;
    }, 0);
  });

  const isGameCompleted = computed(() => showSummary.value);

  const submitDecision = (decision) => {
    // Check if result already exists for this deal, update if so
    const existingIndex = results.value.findIndex(r => r.dealId === currentDeal.value.id);
    if (existingIndex >= 0) {
       results.value[existingIndex] = { dealId: currentDeal.value.id, ...decision };
    } else {
       results.value.push({
        dealId: currentDeal.value.id,
        ...decision
      });
    }

    // Auto-advance logic (optional now with sidebar, but good for flow)
    if (currentIndex.value < weeklyDeals.value.length - 1) {
      setTimeout(() => {
        currentIndex.value++;
      }, 400); 
    } 
    // We remove the auto-show summary logic to allow free navigation. 
    // Summary can be a separate tab or shown when all done.
    if (results.value.length === weeklyDeals.value.length) {
      setTimeout(() => {
        showSummary.value = true;
      }, 800);
    }
  };

  const selectDeal = (index) => {
    currentIndex.value = index;
    showSummary.value = false;
  };

  const resetGame = () => {
     currentIndex.value = 0;
     results.value = [];
     showSummary.value = false;
     isStarted.value = false;
     loadDeals(); 
  };

  const startChallenge = () => {
    isStarted.value = true;
  };

  return {
    weeklyDeals,
    currentDeal,
    currentIndex,
    results,
    score,
    streak,
    progress,
    isGameCompleted,
    isStarted,
    isLoading,
    error,
    loadDeals,
    submitDecision,
    selectDeal,
    resetGame,
    startChallenge
  };
}
