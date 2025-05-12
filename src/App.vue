<script setup>
import { RouterView } from 'vue-router'

// 禁用双指缩放
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, {
  passive: false
});
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>