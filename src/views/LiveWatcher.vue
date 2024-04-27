<script setup lang="ts">
import LiveBox from '@/components/live/LiveBox.vue';
import router from '@/router';
</script>

<template>
    <div class="live-watcher">
        <LiveBox :room="router.currentRoute.value.params.room"></LiveBox>
    </div>
</template>

<style lang="scss" scoped>
.live-watcher {
    width: 100%;
    height: 100%;
}
</style>
