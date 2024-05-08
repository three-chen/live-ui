<script lang="ts">
import { ref } from 'vue';



export default {
    name: 'LiveUploaderFooter',
    props: {
        status: {
            type: String,
        },
        stopStream: {
            type: Function,
        },
        selectEncodeProtocol: {
            type: Function,
        }
    },
    setup() {
        const encodeProtocol = ref('');
        return {
            encodeProtocol
        }
    }
}
</script>

<template>
    <div class="mediaBox-footer">
        <a-radio-group v-model:value="encodeProtocol">
            <a-radio-button value="WEBRTC">WEBRTC</a-radio-button>
            <a-radio-button value="SRT">SRT</a-radio-button>
            <a-radio-button value="RTMP">RTMP</a-radio-button>
            <a-radio-button value="HTTPFLV">HTTP-FLV</a-radio-button>
            <a-radio-button value="HLS">HLS</a-radio-button>
        </a-radio-group>
        <a-button :onclick="stopStream" type="primary" danger>{{ status === 'started' ? '结束直播' : '未开始直播' }}</a-button>
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