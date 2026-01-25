<script setup>
defineProps({
  context: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="context-banner glass-panel">
    <div class="icon-wrapper" :style="{ background: `var(--${context.color || 'accent-primary'})` }">
      {{ context.icon }}
    </div>
    <div class="content">
      <span class="label">Pourquoi ce compte ?</span>
      <p class="reason">{{ context.reason }}</p>
    </div>
  </div>
</template>

<style scoped>
.context-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: var(--accent-primary); /* Fallback */
  /* If we passed a CSS variable name in prompt like 'danger' we'd need mapped vars, 
     but assuming simple usage here or inline style binding handled by parent/logic */
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.content {
  flex: 1;
}

.label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.reason {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}
</style>
