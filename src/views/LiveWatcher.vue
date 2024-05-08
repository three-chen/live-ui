<script lang="ts">
import LiveWatcherBox from '@/components/live/LiveWatcherBox.vue';

export default {
    components: {
        LiveWatcherBox
    },
    props: {
        room: {
            type: String,
        },
    },
    setup(props) {
        console.log("props room", props.room);
    }
}
</script>

<template>
    <div class="live-watcher">
        <LiveWatcherBox :room="room">
        </LiveWatcherBox>
    </div>
</template>

<style lang="scss" scoped>
.live-watcher {
    width: 100%;
    height: 100%;
}
</style>
