<script lang="ts">
import { useUserStore } from '@/stores/user';
import { notification, type MenuProps } from 'ant-design-vue';
import { UserInfoR, addFollow } from 'live-service';
import { PropType, computed } from 'vue';
import { useRouter } from 'vue-router';

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
    setup(props) {
        const meStore = useUserStore();
        const me = computed(() => meStore.user);
        const router = useRouter();

        const onClick: MenuProps['onClick'] = async ({ key }) => {
            switch (key) {
                case '1':
                    const res = await addFollow({ userId: props.user?.id!, followerId: me.value?.id! })
                    if (res.success && res.data) {
                        notification.success({
                            message: '关注成功',
                            description: `你关注了${props.user?.name}`,
                        });
                    }
                    break;
                case '2':
                    router.push({
                        path: '/space',
                        query: {
                            id: props.user?.id
                        }
                    })
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
                    <!-- <a-menu-item key="2">访问空间</a-menu-item> -->
                    <!-- <a-menu-item key="3">踢出直播间</a-menu-item> -->
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