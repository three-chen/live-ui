<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { PropType, ref } from 'vue';

export default {
    name: 'SinglePicUpload',
    props: {
        onUpload: {
            type: Function,
            default: () => { }
        },
        class: {
            type: String,
            default: ''
        },
        file: {
            type: Object as PropType<UploadFile>,
            default: () => []
        }
    },
    components: {
        PlusOutlined
    },
    setup(props) {
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
            props.file
        ]);

        const handleCancel = () => {
            previewVisible.value = false;
            previewTitle.value = '';
        };
        const handlePreview = async (file: any) => {
            if (!file.url && !file.preview) {
                file.preview = (await getBase64(file.originFileObj)) as string;
            }
            previewImage.value = file.url || file.preview;
            previewVisible.value = true;
            previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
        };

        return {
            fileList,
            previewVisible,
            previewImage,
            previewTitle,
            handleCancel,
            handlePreview
        }
    }
}
</script>
<template>
    <a-upload :class="class" v-model:file-list="fileList" :customRequest="onUpload" list-type="picture-card"
        @preview="handlePreview">
        <div v-if="fileList && fileList.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
        </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>
<style lang="scss"></style>