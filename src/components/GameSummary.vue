<script setup>
import confetti from 'canvas-confetti';
import { onMounted } from 'vue';
import { gameSummary as copy } from '../data/copy';

defineProps({
  score: Number,
  streak: Number,
  total: Number
});

defineEmits(['restart']);

// Big celebration on mount
onMounted(() => {
  // First burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
  
  // Second burst after delay
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 300);
});
</script>

<template>
  <div class="summary-container glass-panel">
    <div class="header">
      <div class="celebration-gif">
        <img 
          :src="copy.celebrationGif" 
          alt="Celebration"
        />
      </div>
      <h2>{{ copy.title }}</h2>
      <p class="subtitle">{{ copy.subtitle }}</p>
    </div>

    <!-- Score Card -->
    <div class="score-card">
      <div class="score-label">{{ copy.scoreLabel }}</div>
      <div class="score-value">{{ total }} <span class="total">/ {{ total }}</span></div>
      <div class="score-meta">{{ copy.completionText }}</div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">{{ copy.stat1Icon }}</div>
        <div class="stat-value">{{ total }}</div>
        <div class="stat-label">{{ copy.stat1Label }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">{{ copy.stat2Icon }}</div>
        <div class="stat-value">{{ total }}</div>
        <div class="stat-label">{{ copy.stat2Label }}</div>
      </div>
    </div>

    <div class="footer-msg" v-html="copy.footerMessage"></div>

    <div class="summary-footer">
      <button class="btn btn-secondary back-btn" @click="$emit('restart')">
        {{ copy.backButton }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary-container {
  padding: 2rem;
  text-align: center;
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.header {
  margin-bottom: 2rem;
}

.celebration-gif {
  width: 200px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 16px;
  overflow: hidden;
}

.celebration-gif img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-weight: 800;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.score-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  color: white;
}

.score-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  opacity: 0.9;
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
  opacity: 0.7;
  font-weight: 400;
}

.score-meta {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.footer-msg {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}

.summary-footer {
  margin-top: 1rem;
}

.back-btn {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e2e8f0;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .summary-container {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .celebration-gif {
    width: 160px;
    height: 120px;
  }

  .header h2 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .score-card {
    padding: 1.25rem;
  }

  .score-value {
    font-size: 2.5rem;
  }

  .stats-grid {
    gap: 0.75rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .footer-msg {
    font-size: 0.85rem;
    padding: 0.875rem;
  }

  .back-btn {
    width: 100%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .summary-container {
    padding: 1.25rem;
  }

  .celebration-gif {
    width: 140px;
    height: 100px;
  }

  .header h2 {
    font-size: 1.4rem;
  }

  .score-value {
    font-size: 2rem;
  }

  .total {
    font-size: 1rem;
  }
}
</style>
