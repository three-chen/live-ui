<script setup lang="ts">
import MyHeaderVue from '@/components/header/MyHeader.vue';
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/user';

const userStore = useUserStore();
const userInfo = localStorage.getItem('userInfo');

if (userInfo) {
  userStore.setLogin(true)
  userStore.setUser(JSON.parse(userInfo));
}

</script>

<template>
  <div class="box">
    <MyHeaderVue></MyHeaderVue>

    <div class="main-container">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &>.main-container {
    flex-grow: 1;
    overflow-y: auto;
    max-height: calc(100vh - 64px);
    background-color: var(--body-background);
    padding: var(--padding-sm) var(--padding-xl) 0 var(--padding-xl);
  }
}
</style>
