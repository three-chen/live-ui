<script lang="ts">
import LiveUploaderBox from '@/components/live/LiveUploaderBox.vue';

export default {
    components: {
        LiveUploaderBox
    },
    props: {
        room: {
            type: String,
        },
    },
    setup(props) {
        console.log(props.room);
    }
}
</script>

<template>
    <div class="live-uploader">
        <LiveUploaderBox :room="room">
        </LiveUploaderBox>
    </div>
</template>

<style lang="scss" scoped>
.live-uploader {
    width: 100%;
    height: 100%;
}
</style>
