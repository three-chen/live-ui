<script>
// import LiveChat from './LiveChat.vue';
import LiveUploaderMedia from './LiveUploaderMedia.vue';

export default {
    components: {
        // LiveChat,
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
        <LiveUploaderMedia />
        <!-- <LiveChat /> -->
    </div>
</template>

<style lang="scss" scoped>
.liveStreamBox {
    height: 100%;
    display: flex;
    padding-bottom: var(--padding-xl);
    justify-content: space-between;
}
</style>