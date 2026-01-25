<script setup>
</script>

<template>
  <header>
    <div class="header-top">
      <span class="badge">WEEK #42</span>
      <h1 class="title">Weekly Deal Challenge</h1>
    </div>

    <!-- Impact Proof Section -->
    <div class="impact-proof glass-panel">
      <div class="impact-header">
        <span class="impact-icon">⚡</span>
        <span class="impact-title">Impact de tes décisions passées</span>
      </div>
      <div class="impact-items">
        <div class="impact-item">
          <span class="check">✅</span>
          <p>2 comptes <strong>Engaged</strong> (S-3) → <span class="highlight">1 meeting obtenu</span></p>
        </div>
        <div class="impact-item">
          <span class="check">🔄</span>
          <p>Action <strong>Identifier décideur</strong> sur <em>TechFlow</em> lancée par Adrien</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  margin-bottom: 2rem;
  animation: slideDown 0.6s ease-out;
}

.header-top {
  text-align: center;
  margin-bottom: 1.5rem;
}

.badge {
  background: rgba(139, 92, 246, 0.2);
  color: var(--accent-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.title {
  margin-top: 0.5rem;
  font-size: 2rem;
  background: var(--gradient-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.impact-proof {
  padding: 1.25rem;
  border-left: 4px solid var(--success);
}

.impact-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.impact-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.impact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.highlight {
  color: var(--success);
  font-weight: 600;
}

.check {
  font-size: 1.1rem;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
