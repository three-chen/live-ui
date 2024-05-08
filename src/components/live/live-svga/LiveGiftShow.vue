<script setup lang="ts">
import { useSvgaStore } from '@/stores/svga';
import { Parser, Player } from 'svga';
import { computed, onUnmounted, ref, watch } from 'vue';

const canvas = ref<HTMLCanvasElement | undefined>(undefined)
const parser = new Parser()
const player = ref<Player | null>(null)

const svgaStore = useSvgaStore();
const isGifted = computed(() => svgaStore.isGifted)
const gift = computed(() => svgaStore.gift)

watch(() =>
    isGifted.value,
    (newValue) => {
        if (newValue) {
            playGift(gift.value)
            svgaStore.setIsGifted(false)
        }
    }
)

const playGift = async (gift: string) => {
    const svga = await parser.load(`http://localhost:3000/svga/${gift}.svga`)

    player.value = new Player({ container: canvas.value!, loop: 1 })
    await player.value!.mount(svga)
    player.value.onStart = () => console.log('onStart')
    player.value.onEnd = () => {
        player.value?.clear()
    }

    // 开始播放动画
    player.value!.start()
}

onUnmounted(() => {
    player.value?.clear()
    parser.destroy()
    player.value?.destroy()
})

</script>

<template>
    <canvas class="svga-canvas" ref="canvas"></canvas>
</template>

<style scoped>
.svga-canvas {
    position: absolute;
    width: 100%;
    height: 100%
}
</style>
