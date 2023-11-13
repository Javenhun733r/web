<script setup>
// Тут можна додавати логіку для компоненту
</script>

<template>
  <div class="welcome-container">
    <p class="welcome-text">Welcome to my site!</p>
  </div>
</template>

<style scoped>
.welcome-container {
  text-align: center;
  margin-top: 50px;
  font-family: 'Arial', sans-serif;
}

.welcome-text {
  font-size: 24px;
  color: #3498db; /* Синій колір */
  letter-spacing: 2px;
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
