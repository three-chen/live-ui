<script lang="ts" setup>
import LeftHeader from './LeftHeader.vue';
import RightHeader from './RightHeader.vue';
import SearchHeader from './SearchHeader.vue';
</script>

<template>
    <div class="header">
        <LeftHeader />
        <SearchHeader />
        <RightHeader />
    </div>
</template>

<style scoped lang="scss">
.header {
    position: sticky;
    height: 64px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: solid 1px #e5e5e5;
    padding: 0px var(--padding-xl);
    box-shadow: 10px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>