<script>
import LiveWatcherChat from './LiveWatcherChat.vue';
import LiveWatcherMedia from './LiveWatcherMedia.vue';

export default {
    name: 'LiveWatcherBox',
    components: {
        LiveWatcherChat,
        LiveWatcherMedia
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
        <LiveWatcherMedia :room="room" class="watcherMedia" />
        <LiveWatcherChat :room="room" class="watcherChat"></LiveWatcherChat>
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

    .watcherMedia {
        height: 100%;
        flex: 1;
    }

    .watcherChat {
        height: 100%;
        flex: 0 0 428px;
        width: 428px
    }
}
</style>