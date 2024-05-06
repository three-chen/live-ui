<script lang="ts">
import MyHeaderVue from '@/components/header/MyHeader.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/user';

export default {
  name: 'App',
  components: {
    MyHeaderVue
  },
  setup() {
    const userStore = useUserStore();
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      const user = JSON.parse(userInfo)
      console.log("app.vue", user)
      if (user.id) {
        userStore.setLogin(true)
        userStore.setUser(user);
      }
    }
    return { zhCN };
  },
};
</script>

<template>
  <a-config-provider :locale="zhCN">
    <div class="box">
      <MyHeaderVue></MyHeaderVue>

      <div class="main-container">
        <RouterView />
      </div>
    </div>
  </a-config-provider>
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
