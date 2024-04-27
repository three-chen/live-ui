<script lang="ts">
import { MediaFactory } from 'media-framework';
import { ref } from 'vue';

import LiveMaskButton from '@/components/button/LiveMaskButton.vue';

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
        const ready = ref(false)

        const init = async () => {
            await MediaFactory.init()
            ready.value = true
        }

        init()

        const captureScreen = async () => {
            await MediaFactory.desktopStreamSpawn()
        }

        const openCamera = async () => {
            await MediaFactory.cameraStreamSpawn()
        }

        return {
            ready,
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

        <div v-if="ready" class="video-mask">
            <LiveMaskButton text="窗口" :click="captureScreen">
                <svg t="1710871115045" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4275" width="48" height="48">
                    <path
                        d="M911.946436 131.156132 143.093511 131.156132c-35.149545 0-63.732533 28.591175-63.732533 63.733557L79.360977 795.681968c0 35.144428 28.584012 63.733557 63.732533 63.733557l768.852926 0c35.149545 0 63.732533-28.589129 63.732533-63.733557L975.67897 194.889689C975.67897 159.748331 947.093934 131.156132 911.946436 131.156132zM947.670056 795.681968c0 19.701714-16.029068 35.723619-35.723619 35.723619L143.093511 831.405587c-19.694551 0-35.723619-16.021905-35.723619-35.723619L107.369891 271.206842l840.300164 0L947.670056 795.681968zM947.670056 243.195881 107.369891 243.195881l0-48.306192c0-19.701714 16.029068-35.723619 35.723619-35.723619l768.852926 0c19.694551 0 35.723619 16.021905 35.723619 35.723619L947.670056 243.195881zM219.410664 187.176007l-56.019875 0c-7.740288 0-14.004969 6.27082-14.004969 14.004969 0 7.728008 6.263657 14.005992 14.004969 14.005992l56.019875 0c7.740288 0 14.005992-6.277984 14.005992-14.005992C233.414609 193.446827 227.150952 187.176007 219.410664 187.176007zM331.450413 187.176007l-56.019875 0c-7.741311 0-14.005992 6.27082-14.005992 14.004969 0 7.728008 6.262634 14.005992 14.005992 14.005992l56.019875 0c7.739265 0 14.004969-6.277984 14.004969-14.005992C345.454358 193.446827 339.190701 187.176007 331.450413 187.176007zM443.489138 187.176007l-56.019875 0c-7.740288 0-14.005992 6.27082-14.005992 14.004969 0 7.728008 6.263657 14.005992 14.005992 14.005992l56.019875 0c7.740288 0 14.005992-6.277984 14.005992-14.005992C457.49513 193.446827 451.231473 187.176007 443.489138 187.176007z"
                        p-id="4276" fill="#e6e6e6"></path>
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
        <!-- <a-spin :spinning="!ready" wrapperClassName="video-spin">
        </a-spin> -->
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

    .video {
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

    .video-container {
        width: 100%;
        height: 100%;
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