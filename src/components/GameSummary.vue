<script setup>
defineProps({
  score: Number,
  streak: Number,
  total: Number
});

defineEmits(['restart']);
</script>

<template>
  <div class="summary-container glass-panel">
    <div class="header">
      <div class="trophy">🏆</div>
      <h2>Challenge Complete!</h2>
      <p class="subtitle">Tes décisions ont été enregistrées.</p>
    </div>

    <!-- Score Card -->
    <div class="score-card">
      <div class="score-label">Score Semaine</div>
      <div class="score-value">{{ score }} <span class="total">/ {{ total * 2 }}</span></div>
      <div class="score-meta">⏱️ Temps total: 11 min</div>
    </div>

    <!-- Streak Section -->
    <div class="streak-section">
      <div class="streak-header">
        <span>Série active</span>
        <span class="streak-count">{{ streak }} semaines 🔥</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 100%"></div>
      </div>
      <p class="streak-msg">4 semaines consécutives ! Récompense débloquée.</p>
    </div>

    <!-- Reward Unlock -->
    <div class="reward-box">
      <div class="reward-icon">🎁</div>
      <div class="reward-content">
        <h3>CRM Insights Report</h3>
        <p>Top 10 comptes stratégiques générés par IA.</p>
        <button class="btn btn-primary download-btn">Télécharger le rapport</button>
      </div>
    </div>

    <div class="footer-msg">
      “Tes décisions ont déclenché 6 actions commerciales et 2 opportunités actives.”
    </div>

    <div class="summary-footer">
      <button class="btn btn-primary restart-btn" @click="$emit('restart')">
        Nouveau Challenge 🚀
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary-container {
  padding: 2rem;
  text-align: center;
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.header {
  margin-bottom: 2rem;
}

.trophy {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  background: var(--gradient-main);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.score-card {
  background: rgba(0,0,0,0.2);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.score-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.total {
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.score-meta {
  font-size: 0.9rem;
  color: var(--text-primary);
  opacity: 0.8;
}

.streak-section {
  margin-bottom: 2rem;
}

.streak-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.streak-count {
  color: var(--warning);
}

.progress-bar {
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--warning);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.streak-msg {
  font-size: 0.9rem;
  color: var(--success);
}

.reward-box {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  margin-bottom: 2rem;
}

.reward-icon {
  font-size: 2.5rem;
}

.reward-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.reward-content p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.download-btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.footer-msg {
  font-style: italic;
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 80%;
  margin: 0 auto;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
</style>
