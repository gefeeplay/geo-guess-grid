<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

const verifyEmail = async () => {
  const token = route.query.token
  
  if (!token) {
    error.value = true
    errorMessage.value = 'No verification token provided'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`http://localhost:8000/auth/verify?token=${token}`)
    
    if (response.ok) {
      success.value = true
    } else {
      const errorData = await response.json()
      error.value = true
      errorMessage.value = errorData.detail || 'Verification failed'
    }
  } catch (err) {
    error.value = true
    errorMessage.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  verifyEmail()
})
</script>

<template>
  <div class="verify-container">
    <div class="verify-card">
      <div v-if="loading" class="loading">
        <p>Verifying your email...</p>
      </div>
      
      <div v-else-if="success" class="success">
        <h2>✅ Email Verified Successfully!</h2>
        <p>Your email has been verified. You can now enjoy all features of the application.</p>
        <button @click="goToHome" class="home-button">
          Go to Home Page
        </button>
      </div>
      
      <div v-else-if="error" class="error">
        <h2>❌ Verification Failed</h2>
        <p>{{ errorMessage }}</p>
        <button @click="goToHome" class="home-button">
          Go to Home Page
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #9e7b79;
}

.verify-card {
  background: #ceb5b4;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.loading {
  color: #667eea;
}

.success {
  color: #10b981;
}

.error {
  color: #ef4444;
}

.home-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.home-button:hover {
  background: #5a6fd8;
}

h2 {
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
</style>