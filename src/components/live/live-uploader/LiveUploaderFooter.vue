<script lang="ts">


export default {
    name: 'LiveUploaderFooter',
    props: {
        status: {
            type: String,
        },
        stopStream: {
            type: Function,
        },
    },
    setup() {
        return {
        }
    }
}
</script>

<template>
    <div class="mediaBox-footer">
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