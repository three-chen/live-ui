<script setup lang="ts">
import MainHallGroups from '@/components/group/MainHallGroups.vue';
const groupData = [
    {
        title: '全部分组',
        children: [
            {
                title: 'Item 1',
                roomId: 0,
            },
            {
                title: 'Item 2',
                roomId: 0,
            },
            {
                title: 'Item 3',
                roomId: 0,
            },
        ],
    },
    {
        title: '游戏区',
        children: [
            { title: 'Item 4', roomId: 0 },
            { title: 'Item 5', roomId: 0 },
            { title: 'Item 6', roomId: 0 },
        ],
    },
    {
        title: '游戏1区',
        children: [
            { title: 'Item 4', roomId: 0 },
            { title: 'Item 5', roomId: 0 },
            { title: 'Item 6', roomId: 0 },
        ],
    },
    {
        title: '游戏2区',
        children: [
            { title: 'Item 4', roomId: 0 },
            { title: 'Item 5', roomId: 0 },
            { title: 'Item 6', roomId: 0 },
        ],
    },
    {
        title: '游戏3区',
        children: [
            {
                title: 'Item 4',
                roomId: 0,
            },
            {
                title: 'Item 5',
                roomId: 0,
            },
            {
                title: 'Item 6',
                roomId: 0,
            },
        ],
    },
    {
        title: 'Group 3',
        children: [
            {
                title: 'Item 7',
                roomId: 0,
            },
            {
                title: 'Item 8',
                roomId: 0,
            },
            {
                title: 'Item 9',
                roomId: 0,
            },
        ],
    }]
</script>

<template>
    <div class="main-hall">
        <MainHallGroups :groupData="groupData" />
    </div>
</template>

<style lang="scss" scoped>
.main-hall {
    width: 100%;
    background-color: #fff;
}
</style>
