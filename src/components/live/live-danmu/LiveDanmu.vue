<template>
    <vue-danmaku ref="danmaku" v-model:danmus="bullets" useSlot :channels="5"
        style="width: 100%;height: 40%;position: absolute;">
        <template v-slot:dm="{ index, danmu }">
            <a-avatar :src="danmu.user.avatar" class="profile" />
            <span>{{ danmu.user.name }}：</span>
            <span v-html="danmu.message"></span>
        </template>
    </vue-danmaku>
</template>

<script lang="ts">
import { useBulletsStore } from '@/stores/bulletScreen';
import { computed, onUnmounted } from 'vue';
import vueDanmaku from 'vue3-danmaku';

export default {
    components: {
        vueDanmaku,
    },
    setup(props) {
        const bulletsStore = useBulletsStore()
        const bullets = computed(() => bulletsStore.bullets)

        onUnmounted(() => {
            bulletsStore.clearAllBullets()
        })
        return { bullets }
    },
}
</script>