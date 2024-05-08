<script lang="ts">
import SinglePicUpload from '@/components/upload/SinglePicUpload.vue';
import { useLiveStore } from '@/stores/live';
import { fileToBlob } from '@/utils';
import { UploadFile, notification } from 'ant-design-vue';
import { LiveInfo, postLiveInfo, uploadImgToServer } from 'live-service';
import { debounce } from 'lodash';
import { computed, ref } from 'vue';

export default {
    name: 'LiveUploaderHeader',
    components: {
        SinglePicUpload
    },
    setup() {
        const liveStore = useLiveStore();
        const live = computed(() => liveStore.live)
        const isCreated = computed(() => liveStore.isCreated)

        const liveTitle = computed({
            get: () => live?.value?.liveTitle || '新人主播，请多多关照~',
            set: async (value) => {
                liveStore.setLive({ liveTitle: value })
            }
        })
        const liveType = computed({
            get: () => live?.value?.typeId || '0',
            set: async (value) => {
                liveStore.setLive({ typeId: value })
            }
        })

        const coverFile = ref<UploadFile>(
            {
                uid: '-1',
                name: liveTitle.value,
                status: 'done',
                url: live?.value?.cover_picture_url || 'http://localhost:3000/imgs/cover/default_cover_picture.png',
            },
        );

        const onUpload = async (file: any) => {
            const blob = await fileToBlob(file.file);
            const url = await uploadImgToServer(blob, 'cover')
            if (url) {
                const arr = url.replace('public', '').split('/')
                const filename = arr[arr.length - 1]
                const finalUrl = `http://localhost:3000/imgs/cover/${filename}`

                coverFile.value.status = 'done'
                file.onSuccess()
                notification.success({
                    message: '直播封面上传成功',
                    description: '直播封面上传成功',
                })

                liveStore.setLive({ cover_picture_url: finalUrl })
                console.log("修改直播封面")
                await updateIfCreated({ cover_picture_url: finalUrl }, '直播封面修改成功')
            } else {
                notification.error({
                    message: '直播封面上传失败',
                    description: '直播封面上传失败',
                })
                file.onError()
            }
        }

        const debounceChangeLiveTitle = debounce(async (e: any) => {
            liveTitle.value = e.target.value
            await updateIfCreated({ liveTitle: e.target.value }, '直播标题修改成功')
        }, 1000)


        const handleChange = async (value: string) => {
            liveType.value = value
            await updateIfCreated({ typeId: value }, '直播分区修改成功')
        };

        const init = () => {
            liveStore.setLive({
                liveTitle: '新人主播，请多多关照~',
                typeId: '0',
                cover_picture_url: 'http://localhost:3000/imgs/cover/default_cover_picture.png'
            })
        }
        init()

        const updateIfCreated = async (liveInfo: Partial<LiveInfo>, message: string) => {
            if (isCreated.value) {
                console.log("update cover_pic_url", live?.value?.liveId, liveInfo)
                const res = await postLiveInfo(live?.value?.liveId!, liveInfo)
                if (res.success && res.data) {
                    notification.success({
                        message: message,
                        description: message,
                    })
                }
            }
        }

        return {
            liveTitle,
            liveType,
            onUpload,
            coverFile,
            handleChange,
            debounceChangeLiveTitle
        }
    }
};
</script>

<template>
    <div class="mediaBox-header">
        <SinglePicUpload :on-upload="onUpload" class="live-uploader-cover-pic" :file="coverFile"></SinglePicUpload>
        <a-input v-model:value="liveTitle" placeholder="请输入直播标题" @change="debounceChangeLiveTitle">
            <template #suffix>
                <svg t="1714667698715" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4277" width="20" height="20">
                    <path
                        d="M810.667 810.667c1.046 0 0 0.93 0 4.74v-4.74z m0 0V524.463c0-23.564 19.102-42.667 42.666-42.667 23.564 0 42.667 19.103 42.667 42.667v290.944C896 861.11 856.749 896 810.667 896H213.333C167.251 896 128 861.11 128 815.407V208.593C128 162.89 167.251 128 213.333 128h390.084c23.564 0 42.666 19.103 42.666 42.667s-19.102 42.666-42.666 42.666H213.333v597.334h597.334z m-597.334 0v4.74c0-3.81-1.046-4.74 0-4.74z m0-602.074v4.74c-1.046 0 0-0.93 0-4.74zM542.17 584.837c-16.662 16.662-43.678 16.662-60.34 0-16.662-16.663-16.662-43.678 0-60.34l341.333-341.334c16.663-16.662 43.678-16.662 60.34 0 16.663 16.663 16.663 43.678 0 60.34L542.17 584.837z"
                        fill="#bfbfbf" p-id="4278"></path>
                </svg>
            </template>
        </a-input>
        <a-select ref="select" v-model:value="liveType" style="width: 120px" @change="handleChange">
            <a-select-option value="0">未分区</a-select-option>
            <a-select-option value="1">游戏区</a-select-option>
            <a-select-option value="2">运动区</a-select-option>
            <a-select-option value="3">生活区</a-select-option>
        </a-select>
    </div>
</template>

<style lang="scss">
.mediaBox-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--row-gap);
    width: 100%;
    height: 65px;
    padding: 0 16px;
    background-color: var(--background);
    border-radius: var(--border-radius-sm);

    .ant-upload-wrapper.live-uploader-cover-pic {
        height: 65px;
        width: 65px;

        .ant-upload-list {
            height: 100%;
            width: 100%;

            .ant-upload-list-item-container {
                height: 100% !important;
                width: 100% !important;
            }

            .ant-upload-select {
                height: 100% !important;
                width: 100% !important;
            }
        }

    }

    .ant-input-affix-wrapper {
        flex: 1;
    }
}
</style>