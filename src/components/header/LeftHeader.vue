<script lang="ts" setup>
</script>

<template>
    <div class="leftHeader">
        <i class="leftHeader-live-icon">
            <svg t="1710776216275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="1485" width="32" height="32">
                <path
                    d="M772.437333 97.52381l51.712 51.712-126.342095 126.342095H828.952381a73.142857 73.142857 0 0 1 73.142857 73.142857v487.619048a73.142857 73.142857 0 0 1-73.142857 73.142857H195.047619a73.142857 73.142857 0 0 1-73.142857-73.142857v-487.619048a73.142857 73.142857 0 0 1 73.142857-73.142857h131.120762L199.850667 149.23581 251.562667 97.52381l178.054095 178.054095h164.742095L772.437333 97.52381zM828.952381 348.720762H195.047619v487.619048h633.904762v-487.619048z m-280.380952 73.142857v341.333333h-73.142858v-341.333333h73.142858z m-134.095239 73.142857v195.047619h-73.142857v-195.047619h73.142857z m268.190477 24.380953v146.285714h-73.142857v-146.285714h73.142857z"
                    p-id="1486" fill="#1296db"></path>
            </svg>
        </i>
        <router-link to="/" class="header-router">
            <div class="feature">大厅</div>
        </router-link>
        <router-link to="/live/uploader/0" class="header-router">
            <div class="feature">我要直播</div>
        </router-link>

    </div>
</template>

<style lang="scss" scoped>
.leftHeader {
    display: flex;
    align-items: center;

    &-live-icon {
        margin-right: var(--margin);
    }

    .feature {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: var(--text-color-secondary);
        cursor: pointer;

        &:hover {
            color: var(--text-color);
        }
    }

    .header-router {
        text-decoration: none;
    }
}
</style>