<script setup lang="ts">

import { ref } from 'vue';

import { useUserStore } from '@/stores/user';

const userStore = useUserStore()

const loginEmail = ref('')
const loginPass = ref('')

const registerUserName = ref('')
const registerPass = ref('')
const registerEmail = ref('')

function login() {
}

function register() {
}

</script>

<template>
    <div class="box">
        <div>
            <h1>登录</h1>
            <input type="email" placeholder="邮箱" v-model="loginEmail">
            <input type="password" placeholder="密码" v-model="loginPass">
            <button @click="login()">登录</button>
        </div>
        <div>
            <h1>注册</h1>
            <input type="text" placeholder="用户名" v-model="registerUserName">
            <input type="password" placeholder="密码" v-model="registerPass">
            <input type="email" placeholder="邮箱" v-model="registerEmail">
            <button @click="register()">注册</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>