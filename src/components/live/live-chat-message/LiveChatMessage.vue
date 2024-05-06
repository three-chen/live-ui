<script lang="ts">
import type { MenuProps } from 'ant-design-vue';
import { UserInfoR } from 'live-service';
import { PropType } from 'vue';

export default {
    name: 'LiveChatMessage',
    props: {
        user: {
            type: Object as PropType<UserInfoR>,
        },
        message: {
            type: String,
        },
    },
    setup() {
        const onClick: MenuProps['onClick'] = ({ key }) => {
            switch (key) {
                case '1':
                    break;
                case '2':
                    break;
                case '3':
                    break;

                default:
                    break;
            }
            console.log(`Click on item ${key}`);
        };

        return {
            onClick
        }
    }
}
</script>

<template>
    <div class="chat-message-box">
        <a-dropdown class="chat-dropdown" placement="bottom" :arrow="{ pointAtCenter: true }" :trigger="['click']">
            <a-avatar class="" :src="user && user.avatar" size="small" />
            <template #overlay>
                <a-menu @click="onClick">
                    <a-menu-item key="1">关注</a-menu-item>
                    <a-menu-item key="2">访问空间</a-menu-item>
                    <a-menu-item key="3">踢出直播间</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <span class="chat-user-name">{{ user && user.name }}：</span>
        <span v-html="message"></span>
    </div>
</template>

<style lang="scss" scoped>
.chat-message-box {
    .chat-dropdown {
        cursor: pointer;
        margin-right: 10px;
    }

    .chat-user-name {
        font-family: myFont;
        margin-right: 10px;
        color: #9499A0;
    }
}
</style>