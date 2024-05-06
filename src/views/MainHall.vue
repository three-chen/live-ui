<script setup lang="ts">
import MainHallGroups from '@/components/group/MainHallGroups.vue';
import { TypedLives, getTypedLives } from 'live-service';
import { ref } from 'vue';

const groupData = ref<TypedLives | undefined>(undefined);
getTypedLives().then(res => {
    if (res && res.data) {
        groupData.value = res.data;
    }
})
</script>

<template>
    <div class="main-hall">
        <MainHallGroups :groupData="groupData" />
    </div>
</template>

<style lang="scss" scoped>
.main-hall {
    width: 100%;
    background-color: #fff;
}
</style>
