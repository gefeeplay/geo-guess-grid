<script setup>
import { useUserStore } from '../stores/userStore.js';

const userStore = useUserStore();
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const handleLogout = () => {
  userStore.clearAuth();
  closeModal();
};
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">×</button>
      
      <div class="profile-header">
        <h2>Профиль пользователя</h2>
      </div>

      <div class="profile-info">
        <div class="info-item">
          <label>Email:</label>
          <span>{{ userStore.email }}</span>
        </div>
        
        <div class="info-item">
          <label>Username:</label>
          <span>{{ userStore.username }}</span>
        </div>
      </div>

      <div class="profile-actions">
        <button 
          class="logout-button" 
          @click="handleLogout"
        >
          Выйти
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.profile-info {
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.info-item span {
  color: #333;
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.authenticated {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status-badge:not(.authenticated) {
  background-color: #ffebee;
  color: #c62828;
}

.profile-actions {
  display: flex;
  justify-content: center;
}

.logout-button {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.logout-button:hover:not(:disabled) {
  background-color: #ff3742;
  transform: translateY(-1px);
}

.logout-button:active:not(:disabled) {
  transform: translateY(0);
}

.logout-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}    
</style>