<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MainHallGroup',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    setup(props) {
    }
})
</script>

<template>
    <div class="group">
        <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :data-source="data">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card>
                        <router-link :to="'/live/uploader/' + `${item.roomId}`" class="live-router">
                            <a-empty :imageStyle="{ display: 'flex' }"></a-empty>
                        </router-link>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<style lang="scss" scoped>
.group {
    width: 100%;

    .live-router {
        color: var(--text-color);
    }
}
</style>