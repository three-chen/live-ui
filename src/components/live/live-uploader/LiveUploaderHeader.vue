<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import { ref } from 'vue';

export default {
    name: 'LiveUploaderHeader',
    props: {
    },
    setup() {
        function getBase64(file: File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        const previewVisible = ref(false);
        const previewImage = ref('');
        const previewTitle = ref('');

        const fileList = ref<UploadProps['fileList']>([
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
        ]);

        const handleCancel = () => {
            previewVisible.value = false;
            previewTitle.value = '';
        };
        const handlePreview = async (file: UploadProps['fileList'][number]) => {
            if (!file.url && !file.preview) {
                file.preview = (await getBase64(file.originFileObj)) as string;
            }
            previewImage.value = file.url || file.preview;
            previewVisible.value = true;
            previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
        };

        const liveTitle = ref('初来报道，关注一下吧~');
        return {
            PlusOutlined,
            fileList,
            previewVisible,
            previewImage,
            previewTitle,
            handleCancel,
            handlePreview,
            liveTitle
        }
    }
};
</script>

<template>
    <div class="mediaBox-header">
        <a-upload class="ant-upload" v-model:file-list="fileList"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" @preview="handlePreview">
            <div v-if="fileList && fileList.length < 1">
                <plus-outlined />
                <div style="margin-top: 8px">Upload</div>
            </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>

        <a-input v-model:value="liveTitle" placeholder="Basic usage">

            <template #suffix>
                <svg t="1714667698715" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4277" width="20" height="20">
                    <path
                        d="M810.667 810.667c1.046 0 0 0.93 0 4.74v-4.74z m0 0V524.463c0-23.564 19.102-42.667 42.666-42.667 23.564 0 42.667 19.103 42.667 42.667v290.944C896 861.11 856.749 896 810.667 896H213.333C167.251 896 128 861.11 128 815.407V208.593C128 162.89 167.251 128 213.333 128h390.084c23.564 0 42.666 19.103 42.666 42.667s-19.102 42.666-42.666 42.666H213.333v597.334h597.334z m-597.334 0v4.74c0-3.81-1.046-4.74 0-4.74z m0-602.074v4.74c-1.046 0 0-0.93 0-4.74zM542.17 584.837c-16.662 16.662-43.678 16.662-60.34 0-16.662-16.663-16.662-43.678 0-60.34l341.333-341.334c16.663-16.662 43.678-16.662 60.34 0 16.663 16.663 16.663 43.678 0 60.34L542.17 584.837z"
                        fill="#bfbfbf" p-id="4278"></path>
                </svg>
            </template>
        </a-input>
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

    .ant-upload-wrapper {
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
}
</style>