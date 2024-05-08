<script setup lang="ts">
import MainHallGroups from '@/components/group/MainHallGroups.vue';
import { TypedLives, getTypedLives } from 'live-service';
import { ref } from 'vue';

const groupData = ref<TypedLives | undefined>(undefined);
const spinning = ref<boolean>(true);
getTypedLives().then(res => {
    if (res && res.data) {
        groupData.value = res.data;
        spinning.value = false;
    }
})
</script>

<template>
    <div class="main-hall">
        <a-spin :spinning="spinning">
            <MainHallGroups :groupData="groupData" />
        </a-spin>
    </div>
</template>

<style lang="scss" scoped>
.main-hall {
    width: 100%;
    background-color: #fff;
}
</style>
