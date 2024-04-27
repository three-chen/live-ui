<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LiveMaskButton',
    props: {
        text: {
            type: String,
        },
        click: {
            type: Function,
        },
    },
    components: {},
    setup(props) {
    }
})

</script>

<template>
    <div class="liveMaskButton">
        <a-button :ghost="true" @click="click">
            <slot></slot>
            <div>{{ text }}</div>
        </a-button>
    </div>
</template>

<style lang="scss">
.liveMaskButton {
    background-color: var(--menu-collapsed-button-background-color);

    .ant-btn-default {
        border: none;
        height: fit-content;
    }
}
</style>