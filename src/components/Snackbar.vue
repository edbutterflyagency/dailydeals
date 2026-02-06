<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 2500
  }
});

const emit = defineEmits(['hide']);

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('hide');
    }, props.duration);
  }
});
</script>

<template>
  <Transition name="snackbar">
    <div v-if="show" class="snackbar">
      <span class="snackbar-message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.1) inset;
  z-index: 9999;
  text-align: center;
  min-width: 200px;
  max-width: 90vw;
  animation: shake 0.5s ease-in-out;
}

.snackbar-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Street Fighter style shake */
@keyframes shake {
  0%, 100% { transform: translateX(-50%) scale(1); }
  10% { transform: translateX(-50%) scale(1.1) rotate(-2deg); }
  20% { transform: translateX(-50%) scale(1.1) rotate(2deg); }
  30% { transform: translateX(-50%) scale(1.05) rotate(-1deg); }
  40% { transform: translateX(-50%) scale(1.05) rotate(1deg); }
  50% { transform: translateX(-50%) scale(1); }
}

/* Transitions */
.snackbar-enter-active {
  animation: snackbarIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.snackbar-leave-active {
  animation: snackbarOut 0.3s ease-in forwards;
}

@keyframes snackbarIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(100px) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes snackbarOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.9);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .snackbar {
    bottom: 1.5rem;
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    min-width: 180px;
  }
}
</style>
