<script lang="ts">
import { DecodeProtocol, DecodeProtocolEnum, Decoder, EncodeProtocol, EncodeProtocolEnum, Encoder } from 'media-framework';
import { computed, onMounted, ref, watch } from 'vue';

import LiveMaskButton from '@/components/button/LiveMaskButton.vue';

enum StreamStatus {
    PREPARING = 'preparing',
    READY = 'ready',
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error',
    PAUSED = 'paused',
    RESUMING = 'resuming'
}

export default {
    components: {
        LiveMaskButton
    },
    props: {
        room: {
            type: String,
        },
    },
    setup(props) {
        const supportEncodeProtocol = ref<EncodeProtocol[]>([])
        const supportDecodeProtocol = ref<DecodeProtocol[]>([])

        // const url = ref<string>('http://localhost:8080/live/livestream.m3u8')
        const encodeProtocol = ref<EncodeProtocol>(EncodeProtocolEnum.RTMP)
        const decodeProtocol = ref<DecodeProtocol>(DecodeProtocolEnum.HLS)
        const videoElement = ref<HTMLVideoElement | undefined>(undefined)
        const status = ref<StreamStatus>(StreamStatus.PREPARING)

        const initSupportProtocol = async () => {
            supportEncodeProtocol.value = await Encoder.getSupportedProtocols()
            supportDecodeProtocol.value = await Decoder.getSupportedProtocols()
            console.log("supportDecodeProtocol", supportDecodeProtocol)
            console.log("supportEncodeProtocol", supportEncodeProtocol)
        }
        const askProtocol = async () => {
            // const encodeProtocol = await Encoder.getProtocol()
            // const decodeProtocol = await Decoder.getProtocol()
            // console.log("encodeProtocol", encodeProtocol)
            // console.log("decodeProtocol", decodeProtocol)
        }
        const init = async () => {
            await initSupportProtocol()
        }
        init()

        const ready = computed(() => {
            if (props.room && decodeProtocol && videoElement.value) {
                changeStatus(StreamStatus.READY)
                console.log("ready true")
                return true
            }
            console.log("ready false")
            return false
        })

        watch(
            () => ready.value,
            (newVal) => {
                console.log("newVal", newVal)
                if (newVal) {
                    Encoder.init({
                        room: props.room,
                        protocol: encodeProtocol.value,
                    })
                    Decoder.init({
                        room: props.room,
                        protocol: decodeProtocol.value,
                        videoElement: videoElement.value,
                    })
                }
            }
        )

        onMounted(() => {
            console.log(videoElement.value)
        })

        const captureScreen = async () => {
            await Encoder.desktopStreamSpawn()
            changeStatus(StreamStatus.STARTED)
            Decoder.decoder?.loadAndPlay()
        }

        const openCamera = async () => {
            await Encoder.cameraStreamSpawn()
            changeStatus(StreamStatus.STARTED)
            if (decodeProtocol.value === DecodeProtocolEnum.HLS) {
                setTimeout(() => {
                    console.log("loadAndPlay")
                    Decoder.decoder?.loadAndPlay()
                }, 10000)
            } else {
                Decoder.decoder?.loadAndPlay()
            }
        }

        const changeStatus = (newStatus: StreamStatus) => {
            status.value = newStatus
        }

        return {
            status,
            ready,
            videoElement,
            captureScreen,
            openCamera
        }
    }
}

</script>

<template>
    <div class="mediaBox" ref="videoMedia">
        <!-- <div class="mediaBox-header">
            <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click.prevent>
                    Click me
                    <DownOutlined />
                </a>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="0">
                            <a href="http://www.alipay.com/">1st menu item</a>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a href="http://www.taobao.com/">2nd menu item</a>
                        </a-menu-item>
                    </a-menu>
                </template>
</a-dropdown>
</div> -->

        <div v-if="status === 'ready'" class="video-mask">
            <LiveMaskButton text="显示器" :click="captureScreen">
                <svg t="1714320434423" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4295" width="48" height="48">
                    <path
                        d="M1024 736V160c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h348c2.2 0 4 1.8 4 4v108H260c-2.2 0-4 1.8-4 4v40c0 2.2 1.8 4 4 4h504c2.2 0 4-1.8 4-4v-40c0-2.2-1.8-4-4-4H640V772c0-2.2 1.8-4 4-4h348c17.7 0 32-14.3 32-32zM576 880H448v-96c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96zM64 688V208c0-8.8 7.2-16 16-16h864c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16z"
                        p-id="4296" fill="#e6e6e6"></path>
                </svg>
            </LiveMaskButton>
            <LiveMaskButton text="摄像头" :click="openCamera">
                <svg t="1710872745053" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5431" width="48" height="48">
                    <path
                        d="M896 448c0-212-172-384-384-384S128 236 128 448c0 192.8 142.4 352.8 328 380l-4 68H256v64h512v-64H573.6l-4-68C754.4 800 896 640.8 896 448zM512 768c-176.8 0-320-143.2-320-320s143.2-320 320-320 320 143.2 320 320-143.2 320-320 320z m0-560c-132.8 0-240 107.2-240 240s107.2 240 240 240 240-107.2 240-240-107.2-240-240-240zM416 512c-52.8 0-96-43.2-96-96s43.2-96 96-96 96 43.2 96 96-43.2 96-96 96z"
                        p-id="5432" fill="#e6e6e6"></path>
                </svg>
            </LiveMaskButton>
        </div>
        <div v-show="status === 'started'" class="video-container">
            <video ref="videoElement" src="" class="video" controls autoplay muted></video>
        </div>
    </div>
</template>

<style lang="scss">
.mediaBox {
    position: relative;
    flex: 0 0 65%;
    min-width: 720px;
    min-height: 480px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    border-radius: var(--border-radius-lg);
    background-color: var(--background);


    &>.video-spin {
        width: 100%;
        height: 100%;

        &>.ant-spin-container {
            height: 100%;
            width: 100%;
        }

    }

    .video-container {
        width: 100%;
        height: 100%;

        .video {
            width: 100%;
            height: 100%;
        }
    }

    .video-mask {
        position: absolute;
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