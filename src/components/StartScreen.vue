<script setup>
import { computed } from 'vue';

const props = defineProps({
  dealCount: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  }
});

defineEmits(['start']);
</script>

<template>
  <div class="start-screen">
    <div class="glow-container">
      <div class="glow-circle blue"></div>
      <div class="glow-circle purple"></div>
    </div>

    <div class="content">
      <div class="streak-badge">
        <span class="fire">🔥</span>
        <span class="count">{{ streak }} jours consécutifs</span>
      </div>

      <h1 class="title">Challenge du Jour</h1>
      <p class="subtitle">T'es prêt à exploser tes quotas ?</p>

      <div class="challenge-box card">
        <div class="objective">
          <div class="count-bubble">{{ dealCount }}</div>
          <div class="text">
            <strong>Deals à qualifier</strong>
            <span>Temps estimé : 3 min</span>
          </div>
        </div>
      </div>

      <button class="start-btn pulse" @click="$emit('start')">
        C'est parti ! 🚀
      </button>

      <p class="hint">Plus que 2 challenges pour atteindre ton record de la semaine.</p>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.glow-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
}

.glow-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.blue { background: #3b82f6; transform: translate(-150px, -100px); }
.purple { background: #a855f7; transform: translate(50px, 50px); }

.content {
  position: relative;
  z-index: 1;
  max-width: 500px;
  animation: slideUpFade 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.5rem;
  color: #64748b;
  margin: 1rem 0 3rem;
  font-weight: 500;
}

.challenge-box {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
}

.objective {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.count-bubble {
  width: 60px;
  height: 60px;
  background: var(--accent-primary);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
}

.text {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.text strong {
  font-size: 1.25rem;
  color: #1e293b;
}

.text span {
  color: #94a3b8;
  font-size: 0.9rem;
}

.start-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 1.25rem 3.5rem;
  border-radius: 100px;
  font-size: 1.5rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.4);
}

.start-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.5);
}

.start-btn:active {
  transform: translateY(0) scale(0.98);
}

.hint {
  margin-top: 2rem;
  color: #94a3b8;
  font-size: 0.95rem;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.pulse {
  animation: heartRate 2s infinite ease-in-out;
}

@keyframes heartRate {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>
