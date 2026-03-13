<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>Canban App</h1>
      <nav>
        <RouterLink to="/">Board</RouterLink>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #111827;
  color: #fff;

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  a {
    color: #93c5fd;
    text-decoration: none;
    font-weight: 600;
  }
}

.app-content {
  padding: 1.25rem;
}
</style>
