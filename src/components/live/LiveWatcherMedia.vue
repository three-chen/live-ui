<script lang="ts">
import { LiveInfoR, addLikeCount, addViewCount, askDecodeProtocol, getLiveByRoomId } from 'live-service';
import { DecodeProtocol, DecodeProtocolEnum, Decoder } from 'media-framework';
import { computed, onUnmounted, ref, watch } from 'vue';

import LiveDanmu from './live-danmu/LiveDanmu.vue';
import LiveGiftSend from './live-svga/LiveGiftSend.vue';
import LiveGiftShow from './live-svga/LiveGiftShow.vue';
import LiveWatcherFooter from './live-watcher/LiveWatcherFooter.vue';
import LiveWatcherHeader from './live-watcher/LiveWatcherHeader.vue';

import { Chat } from '@/modules';
import { useLiveStore } from '@/stores/live';
import { useUserStore } from '@/stores/user';

enum StreamStatus {
    PREPARING = 'preparing', //主播准备中，不在直播间
    READY = 'ready', // 可以初始化 Decoder
    STARTED = 'started',
}

export default {
    components: {
        LiveWatcherHeader,
        LiveDanmu,
        LiveWatcherFooter,
        LiveGiftShow,
        LiveGiftSend
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
        const isEnded = computed(() => liveStore.isEnded)
        const liveViewCount = computed(() => live.value?.view_count)
        const liveLikeCount = computed(() => live.value?.like_count)

        const supportDecodeProtocol = ref<DecodeProtocol[]>([])

        const decodeMode = ref<DecodeProtocol | "SYSTEM">('SYSTEM')
        const decodeProtocol = ref<DecodeProtocol>(DecodeProtocolEnum.WEBRTC)
        const videoElement = ref<HTMLVideoElement | undefined>(undefined)
        const status = ref<StreamStatus>(StreamStatus.PREPARING)

        const changeStatus = (newStatus: StreamStatus) => {
            status.value = newStatus
            console.log("changeStatus", status.value)
        }

        const addViewC = async (liveId: string) => {
            const res = await addViewCount(liveId)
            if (res.success && res.data) {
                console.log("addViewCount res", res.data)
                liveStore.setLive({ view_count: res.data.viewCount })
            }
        }

        const addLikeC = async (liveId: string) => {
            const res = await addLikeCount(liveId)
            if (res.success && res.data) {
                liveStore.setLive({ like_count: res.data.likeCount })
            }
        }

        const initSupportProtocol = async () => {
            supportDecodeProtocol.value = await Decoder.getSupportedProtocols()
            console.log("supportDecodeProtocol", supportDecodeProtocol)
        }

        const initLiveInfo = async () => {
            const res = await getLiveByRoomId(props.room!)
            if (res.success && res.data) {
                console.log('getlivebyroominfo', res.data)
                liveStore.setLive(res.data)
            }
        }

        const init = async () => {
            await initLiveInfo()
            await initSupportProtocol()
        }
        init()

        const ready = ref<boolean>(false)

        watch(
            () => [props.room, videoElement.value, supportDecodeProtocol.value, isEnded.value],
            ([newRoom, newVideoElement, newSupportDecodeProtocol, newIsEnded]) => {
                newSupportDecodeProtocol = newSupportDecodeProtocol as DecodeProtocol[]
                if (newRoom && newVideoElement && newSupportDecodeProtocol?.length && !newIsEnded) {
                    ready.value = true
                } else {
                    ready.value = false
                }
            });

        watch(
            () => ready.value,
            async (newVal) => {
                console.log("newVal", newVal)
                if (newVal) {
                    await initDecodeAndPlay()
                    changeStatus(StreamStatus.STARTED)
                } else {
                    changeStatus(StreamStatus.PREPARING)
                }
            }
        )

        const initDecodeAndPlay = async () => {
            await addViewC(live.value?.liveId!)
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
            console.log("initDecode")
            if (decodeMode.value === "SYSTEM") {
                const res = await askDecodeProtocol(
                    {
                        id: live.value?.liveId!,
                        supportProtocols: supportDecodeProtocol.value
                    }
                )
                console.log("askDecodeProtocol", res)
                if (res.success && res.data) {
                    decodeProtocol.value = res.data

                }
            } else {
                decodeProtocol.value = decodeMode.value
            }
            Decoder.init({
                room: props.room!,
                protocol: decodeProtocol.value,
                videoElement: videoElement.value,
            })
        }

        const onStartLive = async (live: LiveInfoR) => {
            console.log("livewatcher onStartLive")
            liveStore.setEnded(false)
            await init()
            await initDecodeAndPlay()
        }
        Chat.setOnStartLive(onStartLive)

        onUnmounted(async () => {
            await Decoder.destroy()
        })

        const selectDecodeProtocol = async (protocol: DecodeProtocol | "SYSTEM") => {
            decodeMode.value = protocol
            await Decoder.destroy()
            await initDecodeAndPlay()
        }

        return {
            status,
            videoElement,
            liveViewCount,
            liveLikeCount,
            selectDecodeProtocol
        }
    }
}

</script>

<template>
    <div class="mediaBox">
        <LiveWatcherHeader :viewCount="liveViewCount" :likeCount="liveLikeCount" />

        <div class="video-box">
            <div v-if="status === 'preparing'" class="video-mask">
                <h1>主播已离开直播间...</h1>
            </div>
            <div v-show="status === 'started'" class="video-container">
                <video ref="videoElement" src="" class="video" controls autoplay muted></video>
            </div>
            <LiveDanmu></LiveDanmu>
            <LiveGiftShow v-show="status === 'started'"></LiveGiftShow>
            <LiveGiftSend v-show="status === 'started'"></LiveGiftSend>
        </div>

        <LiveWatcherFooter :selectDecodeProtocol="selectDecodeProtocol" />
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