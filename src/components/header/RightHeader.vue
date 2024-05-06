<script lang="ts" setup>
import UserProfile from '@/components/profile/UserProfile.vue';
import { useUserStore } from '@/stores/user';
import { computed, ref, watch } from 'vue';

const userStore = useUserStore()

const userInfo = computed(() => userStore.user)
let isLogin = ref(false)
watch(
    () => userStore.isLogin,
    () => {
        isLogin.value = userStore.isLogin
    },
    {
        immediate: true
    })



const quitLogin = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    userStore.isLogin = false
    userStore.user = undefined
}
</script>

<template>
    <div class="rightHeader">
        <router-link v-if="isLogin === false" to="/auth/login" class="header-router">
            <div class="feature">登录</div>
        </router-link>
        <user-profile v-else :userInfo="userInfo" :quitLogin="quitLogin" />
    </div>
</template>

<style lang="scss" scoped>
.rightHeader {
    display: flex;
    align-items: center;

    .feature {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: var(--text-color-secondary);
        cursor: pointer;

        &:hover {
            color: var(--text-color);
        }
    }

    .header-router {
        text-decoration: none;
    }
}
</style>