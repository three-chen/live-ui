<script setup>
import { useRTCStore } from '@/stores/rtc';
import { onMounted, ref } from 'vue';

const videoMedia = ref(null);
const rtcStroe = useRTCStore();

onMounted(() => {
    rtcStroe.setMediaBoxElement(videoMedia.value);
})

</script>

<template>
    <div class="mediaBox" ref="videoMedia">
    </div>
</template>

<style lang="scss">
.mediaBox {
    flex: 0 0 65%;
    min-width: 720px;
    min-height: 480px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    border-radius: var(--border-radius-lg);
    background-color: var(--background);

    &>.video {
        width: 100%;
        height: 100%;
    }

    &>.video-spin {
        width: 100%;
        height: 100%;

        &>.ant-spin-container {
            height: 100%;
            width: 100%;
        }

    }

    .video-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: var(--border-radius-lg);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;

        &>h1 {
            color: var(--multi-tabs-border-color-theme2);
        }
    }
}
</style>