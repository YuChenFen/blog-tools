<template><div></div></template>

<script setup>
import { onMounted } from 'vue';
import demo from './ouroboros.html?raw'
onMounted(() => {
  document.open();
  document.write(demo);
  document.close();
});
</script>
