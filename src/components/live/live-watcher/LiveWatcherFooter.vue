<script lang="ts">
import { ref, watch } from 'vue';

export default {
    name: 'LiveWatcherFooter',
    props: {
        selectDecodeProtocol: {
            type: Function,
        }
    },
    setup(props) {
        const decodeProtocol = ref('SYSTEM');

        watch(decodeProtocol, (val) => {
            props.selectDecodeProtocol?.(val);
        })
        return {
            decodeProtocol
        }
    }
}
</script>

<template>
    <div class="mediaBox-footer">
        <a-radio-group v-model:value="decodeProtocol">
            <a-radio-button value="WEBRTC">WEBRTC</a-radio-button>
            <a-radio-button value="HTTPFLV">HTTP-FLV</a-radio-button>
            <a-radio-button value="HLS">HLS</a-radio-button>
            <a-radio-button value="SYSTEM">系统匹配</a-radio-button>
        </a-radio-group>
    </div>
</template>

<style lang="scss" scoped>
.mediaBox-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--row-gap);
    width: 100%;
    height: 40px;
    padding: 0 16px;
    background-color: var(--background);
    border-radius: var(--border-radius-sm);
}
</style>