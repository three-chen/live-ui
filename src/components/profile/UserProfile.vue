<template>
    <div class="box">
        <a-dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
            <a-avatar :src="userInfo && userInfo.avatar" class="profile" />
            <template #overlay>
                <a-menu @click="onClick">
                    <a-menu-item key="1">个人中心</a-menu-item>
                    <a-menu-item key="2">退出登录</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
import type { MenuProps } from 'ant-design-vue';
import { UserInfo } from 'live-service';
import { PropType } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: "UserProfile",
    props: {
        userInfo: {
            type: Object as PropType<UserInfo>
        }
    },
    setup(props) {
        const router = useRouter()
        const onClick: MenuProps['onClick'] = ({ key }) => {
            switch (key) {
                case '1':

                    break;
                case '2':

                    break;

                default:
                    break;
            }
            console.log(`Click on item ${key}`);
        };

        const gotoProfile = () => {
            router.push('/profile')
        }

        console.log(props.userInfo)

        return {
            onClick
        }
    }

};
</script>

<style lang="scss" scoped>
.box {
    overflow: visible;
}

.profile {
    margin-top: 10px;
    border-radius: 5px;
}
</style>