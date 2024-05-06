<script lang="ts">
import { TypedLives } from 'live-service';
import { PropType, defineComponent, ref } from 'vue';
import MainHallGroup from './MainHallGroup.vue';

export default defineComponent({
    name: 'MainHallGroups',
    components: { MainHallGroup },
    props: {
        groupData: {
            type: Object as PropType<TypedLives>
        }
    },
    setup(props) {
        const titles = ref<string[]>(['未分区', '游戏区', '运动区', '生活区'])

        return {
            titles,
        }
    }

})
</script>

<template>
    <div class="groups">
        <div v-for="(lives, key, index) in groupData" :key="key">
            <h1>{{ titles[index] }}</h1>
            <MainHallGroup :data="lives"></MainHallGroup>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.groups {
    width: 100%;
    padding: 0px var(--padding-xl);
}
</style>