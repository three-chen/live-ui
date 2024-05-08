<script lang="ts">
import { LiveInfoR, askDecodeProtocol, askEncodeProtocol, createLive, stopLive } from 'live-service';
import { DecodeProtocol, DecodeProtocolEnum, Decoder, EncodeProtocol, EncodeProtocolEnum, Encoder } from 'media-framework';
import { computed, onUnmounted, ref, watch } from 'vue';

import LiveMaskButton from '@/components/button/LiveMaskButton.vue';
import LiveDanmu from './live-danmu/LiveDanmu.vue';
import LiveUploaderFooter from './live-uploader/LiveUploaderFooter.vue';
import LiveUploaderHeader from './live-uploader/LiveUploaderHeader.vue';

import { Chat } from '@/modules';
import { useLiveStore } from '@/stores/live';
import { useUserStore } from '@/stores/user';

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
        LiveUploaderHeader,
        LiveMaskButton,
        LiveUploaderFooter,
        LiveDanmu
    },
    props: {
        room: {
            type: String,
        },
    },
    setup(props) {
        const userStore = useUserStore()
        const user = computed(() => userStore.user)
        const liveStore = useLiveStore()
        const live = computed(() => liveStore.live)
        const liveViewCount = computed(() => live.value?.view_count)
        const liveLikeCount = computed(() => live.value?.like_count)
        // 直播开始时间 格式 yyyy-mm-dd hh:mm:ss 年-月-日 时:分:秒
        const liveStartTime = computed(() => {
            const startTime = new Date(live.value?.startTime || '').toLocaleString()
            // 直播开始时间 格式 yyyy-mm-dd hh:mm:ss 年-月-日 时:分:秒
            // 格式化时间
            return startTime.replace('/', '-').replace('/', '-')

        })
        // 计算直播时长 格式 hh-mm-ss 时:分:秒
        const liveProceedTime = computed(() => {
            const startTime = new Date(live.value?.startTime || '')
            const endTime = new Date(live.value?.endTime || '')
            const diff = endTime.getTime() - startTime.getTime()
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)
            console.log("liveProceedTime", hours, minutes, seconds)
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        })

        const supportEncodeProtocol = ref<EncodeProtocol[]>([])
        const supportDecodeProtocol = ref<DecodeProtocol[]>([])

        // const url = ref<string>('http://localhost:8080/live/livestream.m3u8')
        const encodeProtocol = ref<EncodeProtocol>(EncodeProtocolEnum.WEBRTC)
        const decodeProtocol = ref<DecodeProtocol>(DecodeProtocolEnum.WEBRTC)
        const videoElement = ref<HTMLVideoElement | undefined>(undefined)
        const status = ref<StreamStatus>(StreamStatus.PREPARING)

        const modalVisible = ref<boolean>(false)
        const obsModalVisible = ref<boolean>(false)

        const initSupportProtocol = async () => {
            supportEncodeProtocol.value = await Encoder.getSupportedProtocols()
            supportDecodeProtocol.value = await Decoder.getSupportedProtocols()
            console.log("supportDecodeProtocol", supportDecodeProtocol)
            console.log("supportEncodeProtocol", supportEncodeProtocol)
        }

        const init = async () => {
            await initSupportProtocol()
        }
        init()

        const ready = computed(() => {
            if (props.room && videoElement.value) {
                changeStatus(StreamStatus.READY)
                console.log("ready true")
                return true
            }
            console.log("ready false")
            return false
        })

        watch(
            () => ready.value,
            async (newVal) => {
                console.log("newVal", newVal)
                if (newVal) {
                    await initEncode()
                }
            }
        )

        const uploaderCreateLive = async () => {
            const res = await createLive(
                {
                    uploaderId: user.value?.id!,
                    encodeProtocol: encodeProtocol.value,
                    liveTitle: live.value?.liveTitle,
                    cover_picture_url: live.value?.cover_picture_url,
                    typeId: live.value?.typeId
                })

            if (res.success && res.data) {
                console.log("createLive success", res.data)
                liveStore.setLive(res.data)
                liveStore.setCreate(true)
            }
        }

        const captureScreen = async () => {
            await uploaderCreateLive()
            await Encoder.encoder?.desktopStreamSpawn()
            changeStatus(StreamStatus.STARTED)
            // await initDecodeAndPlay()
        }

        const openCamera = async () => {
            await uploaderCreateLive()
            await Encoder.encoder?.cameraStreamSpawn()
            changeStatus(StreamStatus.STARTED)
            // await initDecodeAndPlay()
        }

        const handleOBSSream = async () => {
            Encoder.changeEncoderWithoutDestroy({ protocol: EncodeProtocolEnum.RTMP })
            encodeProtocol.value = EncodeProtocolEnum.RTMP
            await uploaderCreateLive()
            changeStatus(StreamStatus.STARTED)
            obsModalVisible.value = false
            // await initDecodeAndPlay()
        }

        const showObsModal = () => {
            obsModalVisible.value = true
        }

        const changeStatus = (newStatus: StreamStatus) => {
            status.value = newStatus
        }

        const stopStream = async () => {
            if (status.value === StreamStatus.STARTED) {
                await Encoder.destroy()
                await processStopLive()
                if (ready.value === true) changeStatus(StreamStatus.READY)
            }
        }

        const processStopLive = async () => {
            const res = await stopLive(live.value!.liveId!)
            if (res.success && res.data) {
                liveStore.setLive(res.data)
                liveStore.setCreate(false)
                modalVisible.value = true
                console.log("stopLive success")
            }
        }

        onUnmounted(async () => {
            await stopStream()
            await Decoder.destroy()
        })

        const initEncode = async () => {
            const res = await askEncodeProtocol(
                {
                    id: user.value?.id!,
                    supportProtocols: supportEncodeProtocol.value
                }
            )
            if (res.success && res.data) {
                encodeProtocol.value = res.data

                Encoder.init({
                    room: props.room!,
                    protocol: encodeProtocol.value,
                })
            }
        }

        const initDecodeAndPlay = async () => {
            await initDecode()
            if (decodeProtocol.value === DecodeProtocolEnum.HLS) {
                setTimeout(() => {
                    console.log("loadAndPlay")
                    Decoder.decoder?.loadAndPlay()
                }, 10000)
            } else {
                Decoder.decoder?.loadAndPlay()
            }
        }
        const initDecode = async () => {
            const res = await askDecodeProtocol(
                {
                    id: live.value?.liveId!,
                    supportProtocols: supportDecodeProtocol.value
                }
            )
            if (res.success && res.data) {
                decodeProtocol.value = res.data

                const videoEl: HTMLVideoElement | null = document.querySelector('.video')
                Decoder.init({
                    room: props.room!,
                    protocol: decodeProtocol.value,
                    videoElement: videoEl!,
                })
            }
        }
        const onStartLive = async (live: LiveInfoR) => {
            liveStore.setLive(live)
            supportDecodeProtocol.value = await Decoder.getSupportedProtocols()
            await initDecodeAndPlay()
        }
        Chat.setOnStartLive(onStartLive)

        return {
            status,
            ready,
            videoElement,
            captureScreen,
            openCamera,
            handleOBSSream,
            stopStream,
            modalVisible,
            obsModalVisible,
            showObsModal,
            liveViewCount,
            liveLikeCount,
            liveStartTime,
            liveProceedTime,
        }
    }
}

</script>

<template>
    <div class="mediaBox">
        <LiveUploaderHeader />

        <div class="video-box">
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
                <LiveMaskButton text="OBS推流" :click="showObsModal">
                    <svg t="1715108809889" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4643" width="48" height="48">
                        <path
                            d="M512 1024C229.674667 1024 0 794.325333 0 512S229.674667 0 512 0s512 229.674667 512 512-229.674667 512-512 512z m0-976.682667C255.786667 47.317333 47.36 255.786667 47.36 512S255.786667 976.64 512 976.64 976.64 768.213333 976.64 512c0-256.213333-208.426667-464.682667-464.64-464.682667zM263.765333 255.573333c15.018667-72.448 64.128-137.770667 130.133334-170.496-11.477333 11.648-25.386667 20.608-36.010667 33.28-43.52 46.933333-63.146667 114.858667-51.157333 177.322667 15.146667 95.36 104.746667 173.226667 201.898666 171.861333 75.306667 3.370667 148.693333-39.978667 185.514667-105.301333 78.848 2.688 155.52 43.392 200.533333 108.714667 23.04 34.090667 41.045333 74.069333 42.282667 115.669333-14.592-55.253333-51.285333-104.362667-101.333333-132.053333a208.725333 208.725333 0 0 0-160.938667-18.133334c-66.56 19.114667-121.557333 73.514667-140.501333 140.501334-16.085333 53.333333-9.216 112.128 16.085333 160.938666-35.2 60.970667-98.773333 104.490667-167.765333 117.589334-53.077333 11.136-108.842667 2.517333-158.250667-19.797334 44.202667 12.885333 92.202667 15.146667 136.149333-0.469333a209.621333 209.621333 0 0 0 129.024-125.226667c23.722667-63.573333 14.72-139.136-25.216-193.706666-29.866667-42.965333-76.928-73.258667-128.085333-84.010667-16.213333-2.901333-32.597333-4.181333-48.981333-5.717333-26.069333-52.522667-35.584-113.493333-22.528-170.496l-0.853334-0.469334z"
                            p-id="4644" fill="#e6e6e6"></path>
                    </svg>
                </LiveMaskButton>
            </div>
            <div v-show="status === 'started'" class="video-container">
                <video ref="videoElement" src="" class="video" controls autoplay muted></video>
            </div>
            <LiveDanmu></LiveDanmu>
        </div>

        <LiveUploaderFooter :status="status" :stopStream="stopStream" />


        <a-modal v-model:open="modalVisible" centered @ok="modalVisible = false">
            <a-descriptions title="直播数据" bordered>
                <a-descriptions-item label="观看人数" :span="2">{{ liveViewCount }}</a-descriptions-item>
                <a-descriptions-item label="点赞人数" :span="2">{{ liveLikeCount }}</a-descriptions-item>
                <a-descriptions-item label="开始时间" :span="2">{{ liveStartTime }}</a-descriptions-item>
                <a-descriptions-item label="持续时长" :span="2">{{ liveProceedTime }}</a-descriptions-item>
            </a-descriptions>
        </a-modal>

        <a-modal v-model:open="obsModalVisible" centered @ok="handleOBSSream">
            <a-descriptions title="推流设置" bordered>
                <a-descriptions-item label="OBS推流地址" :span="3">
                    {{ `rtmp://localhost/live/${room}` }}
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </div>
</template>

<style lang="scss">
.mediaBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 720px;
    // gap: var(--row-gap);
    justify-content: space-between;

    .video-box {
        aspect-ratio: 16 / 9;
        position: relative;
        width: 100%;
        min-width: 720px;
        display: flex;
        flex-wrap: wrap;
        border-radius: var(--border-radius-sm);
        background-color: black;

        .video-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgb(73 73 73 / 80%);
            border-radius: var(--border-radius-lg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;

            &>h1 {
                color: var(--multi-tabs-border-color-theme2);
            }
        }

        .video-container {
            width: 100%;
            height: 100%;
            display: flex;
            background-color: hsla(0, 0%, 9%, .8);

            .video {
                width: 100%;
                max-height: 100%;
            }
        }
    }
}
</style>