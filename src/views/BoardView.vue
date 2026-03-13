<template>
  <section class="board-view">
    <div class="board-view__meta">
      <p>Всего задач: {{ boardStore.totalTasks }}</p>
    </div>

    <KanbanBoard :columns="boardStore.columns" />
  </section>
</template>

<script setup>
import KanbanBoard from '../components/KanbanBoard.vue';
import { useBoardStore } from '../stores/board';

const boardStore = useBoardStore();
</script>

<style scoped lang="scss">
.board-view__meta {
  margin-bottom: 1rem;
  font-weight: 600;
}
</style>
