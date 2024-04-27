<script lang="ts" setup>
</script>

<template>
    <div class="rightHeader">
        <router-link to="/auth/login" class="header-router">
            <div class="feature">登录</div>
        </router-link>
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