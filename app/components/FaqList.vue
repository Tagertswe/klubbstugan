<script setup lang="ts">
defineProps<{ items: { id: string; question: string; answer: string }[]; openFirst?: boolean }>();
</script>

<template>
  <div class="faq">
    <details v-for="(item, index) in items" :key="item.id" class="card" :open="openFirst && index === 0">
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </div>
</template>

<style scoped>
.faq {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
details {
  padding: var(--space-4) var(--space-5);
}
summary {
  font-weight: 800;
  font-size: 1.0625rem;
  cursor: pointer;
  min-height: 28px;
}
p {
  margin: var(--space-2) 0 0;
  color: var(--c-muted);
}
</style>
