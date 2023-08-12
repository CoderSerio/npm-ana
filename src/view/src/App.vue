<script setup lang="ts">
import Content from "./components/Content/index.vue";
</script>

<template>
  <div class="wrapper">
    <Content />
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
