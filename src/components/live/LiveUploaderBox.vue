<script>
import LiveUploaderChat from './LiveUploaderChat.vue';
import LiveUploaderMedia from './LiveUploaderMedia.vue';

export default {
    components: {
        LiveUploaderChat,
        LiveUploaderMedia
    },
    props: {
        room: {
            type: String,
        },
    },
    setup(props) {
        // console.log(props.live)
    }
}

</script>

<template>
    <div class="liveStreamBox">
        <LiveUploaderMedia :room="room" class="uploaderMedia" />
        <LiveUploaderChat :room="room" class="uploaderChat"></LiveUploaderChat>
    </div>
</template>

<style lang="scss" scoped>
.liveStreamBox {
    height: 100%;
    display: flex;
    padding-bottom: var(--padding-sm);
    justify-content: space-between;
    gap: var(--padding-xl);
    justify-content: space-between;

    .uploaderMedia {
        height: 100%;
        flex: 1;
    }

    .uploaderChat {
        height: 100%;
        flex: 0 0 428px;
        width: 428px
    }
}
</style>