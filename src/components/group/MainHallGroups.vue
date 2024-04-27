<script>
import { defineComponent } from 'vue';
import MainHallGroup from './MainHallGroup.vue';

export default defineComponent({
    name: 'MainHallGroups',
    components: { MainHallGroup },
    props: {
        groupData: {
            type: Array,
            required: true
        }
    },
    setup(props) {
    }

})
</script>

<template>
    <div class="groups">
        <div v-for="(group) in groupData" :key="group.title">
            <h1>{{ group.title }}</h1>
            <MainHallGroup :data="group.children"></MainHallGroup>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.groups {
    width: 100%;
    padding: 0px var(--padding-xl);
}
</style>