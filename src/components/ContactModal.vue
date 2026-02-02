<script setup>
defineProps({
  contact: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getAttioUrl = (id) => {
  return `https://app.attio.com/butterflyagency/person/${id}`;
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content panel">
          <header class="modal-header">
            <div class="header-main">
              <img v-if="contact.avatar" :src="contact.avatar" class="modal-avatar" :alt="contact.name">
              <div v-else class="modal-avatar-placeholder">{{ contact.name.charAt(0) }}</div>
              <div class="header-text">
                <h3>{{ contact.name }}</h3>
                <p class="title">{{ contact.title }}</p>
              </div>
            </div>
            <button class="close-btn" @click="emit('close')">&times;</button>
          </header>

          <div class="modal-body">
            <div class="info-grid">
              <div class="info-group">
                <span class="label">Email</span>
                <a :href="'mailto:' + contact.email" class="value link">{{ contact.email || 'N/A' }}</a>
              </div>
              <div class="info-group">
                <span class="label">Relation</span>
                <span class="value strength-tag" :class="contact.strength?.toLowerCase().replace(' ', '-')">
                  {{ contact.strength || 'No data' }}
                </span>
              </div>
            </div>

            <div v-if="contact.lastInteraction" class="info-group full-width last-interaction">
              <span class="label">Dernière interaction</span>
              <div class="interaction-card">
                <span class="interaction-type">{{ contact.lastInteraction.type }}</span>
                <span class="interaction-date">{{ formatDate(contact.lastInteraction.date) }}</span>
              </div>
            </div>

            <div class="links-actions">
              <a :href="getAttioUrl(contact.id)" target="_blank" class="btn attio-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                Voir dans Attio
              </a>
              <a v-if="contact.linkedin" :href="'https://' + contact.linkedin" target="_blank" class="btn linkedin-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 480px;
  max-width: 90%;
  background: white;
  padding: 0;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-main {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.modal-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
}

.modal-avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--accent-soft);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.75rem;
}

.header-text h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.header-text .title {
  margin: 0.25rem 0 0 0;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-tertiary);
  cursor: pointer;
  line-height: 0.5;
  padding: 0.5rem;
}

.modal-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.full-width {
  grid-column: 1 / -1;
}

.label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.value {
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
}

.value.link {
  color: var(--accent-primary);
  text-decoration: none;
}

.interaction-card {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interaction-type {
  text-transform: capitalize;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.interaction-date {
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.links-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.attio-btn {
  background: #000;
  color: white !important;
}

.linkedin-btn {
  background: #0077b5;
  color: white !important;
}

.strength-tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 800;
}

.strength-tag.strong { background: #dcfce7; color: #15803d; }
.strength-tag.weak, .strength-tag.very-weak { background: #fef2f2; color: #b91c1c; }
.strength-tag.good { background: #f0fdf4; color: #166534; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
    align-items: flex-end;
  }

  .modal-content {
    width: 100%;
    max-width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 20px 20px 0 0;
    margin-bottom: 0;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .header-main {
    gap: 1rem;
  }

  .modal-avatar,
  .modal-avatar-placeholder {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    font-size: 1.5rem;
  }

  .header-text h3 {
    font-size: 1.1rem;
  }

  .header-text .title {
    font-size: 0.85rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .interaction-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.875rem;
  }

  .links-actions {
    gap: 0.5rem;
  }

  .btn {
    padding: 0.75rem 1rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 1rem 1.25rem;
  }

  .modal-avatar,
  .modal-avatar-placeholder {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .close-btn {
    font-size: 1.75rem;
  }
}
</style>
