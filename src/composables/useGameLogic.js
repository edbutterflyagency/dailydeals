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
      // 1. Load static deals (baked in at build time)
      const data = await dealService.fetchDeals();
      weeklyDeals.value = data;

      // 2. Check Attio statuses using attioRecordId (not Laravel id)
      const attioIds = data.map(deal => deal.attioRecordId).filter(Boolean);
      
      if (attioIds.length > 0) {
        const statusData = await dealService.checkAttioStatuses(attioIds);
        
        // 3. Mark already-qualified deals as processed
        if (statusData.statuses && statusData.statuses.length > 0) {
          statusData.statuses.forEach(item => {
            // isProcessed = true means qualification field has a value (yes or no)
            if (item.isProcessed && item.qualification) {
              // Find the deal by attioRecordId and add to results
              const deal = data.find(d => d.attioRecordId === item.companyId);
              if (deal) {
                const existingIndex = results.value.findIndex(r => r.dealId === deal.id);
                if (existingIndex < 0) {
                  results.value.push({
                    dealId: deal.id,
                    attioRecordId: item.companyId,
                    status: item.qualification, // 'yes' or 'no'
                    fromAttio: true // Flag to indicate this came from Attio
                  });
                }
              }
            }
          });
        }
      }
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

  // Count of deals that haven't been processed yet (not in results)
  const remainingDeals = computed(() => {
    const processedIds = new Set(results.value.map(r => r.dealId));
    return weeklyDeals.value.filter(deal => !processedIds.has(deal.id)).length;
  });

  const score = computed(() => {
     return results.value.reduce((acc, res) => {
      let pts = 1; 
      if (res.action && res.action !== 'None' && res.action !== 'Aucune action déclenchée') pts += 1;
      return acc + pts;
    }, 0);
  });

  const isGameCompleted = computed(() => showSummary.value);

  const submitDecision = async (decision) => {
    const deal = currentDeal.value;
    const attioRecordId = deal.attioRecordId || deal.id;
    
    // Qualification is simply yes or no
    const qualification = decision.status; // 'yes' or 'no'
    
    // Update qualification in Attio
    try {
      const result = await dealService.updateQualification(attioRecordId, qualification);
      if (!result.success) {
        console.error('Failed to update Attio qualification:', result.error);
        // Continue anyway to update local state
      }
    } catch (e) {
      console.error('Error updating Attio qualification:', e);
    }
    
    // Check if result already exists for this deal, update if so
    const existingIndex = results.value.findIndex(r => r.dealId === deal.id);
    if (existingIndex >= 0) {
       results.value[existingIndex] = { dealId: deal.id, attioRecordId, ...decision };
    } else {
       results.value.push({
        dealId: deal.id,
        attioRecordId,
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
    remainingDeals,
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
