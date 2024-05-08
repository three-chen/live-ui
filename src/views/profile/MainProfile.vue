<template>
    <div class="main-profile-box">
        <div class="PersonTop">
            <a-card class="cardtop">
                <div class="PersonTop_img">
                    <SinglePicUpload :on-upload="onUpload" class="main-profile-avatar" :file="avatarFile">
                    </SinglePicUpload>
                </div>
                <div class="PersonTop_text">
                    <div class="user_text">
                        <div class="user_name">
                            <span> {{ userInfo && userInfo.name }} </span>
                        </div>
                        <div class="user_email">
                            <span> {{ userInfo && userInfo.email }} </span>
                        </div>
                        <div class="user_brief">
                            <span> {{ (userInfo && userInfo.briefInfo) || '这个人什么也没写哦~' }} </span>
                        </div>
                    </div>
                    <div class="user_num">
                        <div style="cursor: pointer">
                            <div class="num_number">{{ fanCounts }}</div>
                            <span class="num_text">粉丝</span>
                        </div>
                        <div style="cursor: pointer">
                            <div class="num_number">{{ followCounts }}</div>
                            <span class="num_text">关注</span>
                        </div>
                        <div>
                            <div class="num_number">{{ goodCounts }}</div>
                            <span class="num_text">收到礼物</span>
                        </div>
                    </div>
                </div>
            </a-card>
        </div>
        <div class="person_body">
            <div class="person_body_left">
                <a-card title="个人中心" class="person_body_left-card">
                    <a-menu class="a-menu-vertical-demo" v-model:selectedKeys="selectedKeys" @click="handleClick">
                        <a-menu-item key="1">
                            个人信息
                        </a-menu-item>
                    </a-menu>
                </a-card>
            </div>
            <div class="person_body_right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import SinglePicUpload from '@/components/upload/SinglePicUpload.vue';
import { useUserStore } from '@/stores/user';
import { fileToBlob } from '@/utils';
import { MenuProps, UploadFile, notification } from 'ant-design-vue';
import { getAllLikeCount, getFollowCount, getFollowerCount, postUserInfo, uploadImgToServer } from 'live-service';
import { ref } from 'vue';

export default {
    name: "MainProfile",
    components: {
        SinglePicUpload
    },
    setup() {
        const userStore = useUserStore();
        const userInfo = userStore.user;

        const fanCounts = ref<string>('0');
        const followCounts = ref<string>('0');
        const goodCounts = ref<string>('0')
        const selectedKeys = ref<string[]>(['1']);

        const handleClick: MenuProps['onClick'] = e => {
            console.log('click', e);
        };

        const avatarFile = ref<UploadFile>(
            {
                uid: '-1',
                name: userInfo?.name || '',
                status: 'done',
                url: userInfo?.avatar || 'http://localhost:3000/imgs/avatar/0.png',
            }
        );

        const onUpload = async (file: any) => {
            const blob = await fileToBlob(file.file);
            const url = await uploadImgToServer(blob, 'avatar')
            if (url) {
                const arr = url.replace('public', '').split('/')
                const filename = arr[arr.length - 1]
                const finalUrl = `http://localhost:3000/imgs/avatar/${filename}`

                userStore.setUser({
                    avatar: finalUrl
                })
                avatarFile.value.url = finalUrl
                avatarFile.value.status = 'done'
                file.onSuccess()
                const res = await postUserInfo(userInfo?.id!, {
                    avatar: finalUrl
                })
                if (res) {
                    notification.success({
                        message: '头像上传成功',
                        description: '头像上传成功',
                    })
                } else {
                    notification.error({
                        message: '头像上传失败',
                        description: '头像上传失败',
                    })
                    file.onError()
                }
            } else {
                notification.error({
                    message: '头像上传失败',
                    description: '头像上传失败',
                })
                file.onError()
            }
        }

        const init = async () => {
            const resFan = await getFollowerCount(userInfo?.id!)
            if (resFan.success && resFan.data) {
                fanCounts.value = resFan.data.followerCount
            }

            const resFollow = await getFollowCount(userInfo?.id!)
            if (resFollow.success && resFollow.data) {
                followCounts.value = resFollow.data.followCount
            }

            const resGood = await getAllLikeCount(userInfo?.id!)
            if (resGood.success && resGood.data) {
                goodCounts.value = resGood.data.likeCount
            }
        }
        init()

        return {
            userInfo,
            avatarFile,
            onUpload,
            fanCounts,
            followCounts,
            goodCounts,
            selectedKeys,
            handleClick
        }
    }
}
</script>

<style lang="scss">
.main-profile-box {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--row-gap);
    width: 100%;
    height: 100%;
    padding-bottom: var(--padding);

    .PersonTop {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 160px;
        padding-top: var(--padding);
        border-radius: 5px;

        .cardtop {
            width: 100%;
            border-radius: 15px;

            .ant-card-body {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--row-gap);
                height: 100%;

                .PersonTop_img {
                    aspect-ratio: 1 / 1;
                    height: 100%;

                    .main-profile-avatar {
                        width: 100%;
                        height: 100%;
                        border-radius: 20px;

                        .ant-upload-list {
                            height: 100%;
                            width: 100%;

                            .ant-upload-list-item-container {
                                height: 100% !important;
                                width: 100% !important;
                            }

                            .ant-upload-select {
                                height: 100% !important;
                                width: 100% !important;
                            }
                        }
                    }
                }

                .PersonTop_text {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-right: var(--padding-xl);
                    height: 100%;
                    flex: 1;

                    .user_text {
                        width: 30%;
                        padding-left: var(--padding);

                        .user_name {
                            font-weight: bold;
                        }

                        .user_email {}

                        .user_brief {
                            overflow: hidden;
                        }
                    }

                    .user_num {
                        width: 40%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;

                        &>div {
                            text-align: center;
                            border-right: 1px dotted #999;
                            box-sizing: border-box;
                            width: 80px;
                            height: 40px;
                            line-height: 20px;

                            .num_text {
                                color: #999;
                            }

                            .num_number {
                                font-size: 20px;
                                color: #333;
                            }
                        }
                    }
                }
            }
        }
    }

    /*下面部分样式*/
    .person_body {
        display: flex;
        flex: 1;
        width: 100%;
        border-radius: 5px;
        justify-content: space-between;
        gap: var(--row-gap);

        .person_body_left {
            transition: 0.5s;
            flex: 0 0 25%;
            height: 100%;
            border-radius: 5px;
            text-align: center;

            .person_body_left-card {
                height: 100%;
                padding: var(--padding);

                .ant-card-head-title {
                    width: 100%;
                    font-size: 22px;
                    font-family: myFont;
                    background-image: -webkit-linear-gradient(left,
                            rgb(42, 134, 141),
                            #e9e625dc 20%,
                            #3498db 40%,
                            #e74c3c 60%,
                            #09ff009a 80%,
                            rgba(82, 196, 204, 0.281) 100%);
                    -webkit-text-fill-color: transparent;
                    -webkit-background-clip: text;
                    -webkit-background-size: 200% 100%;
                    -webkit-animation: masked-animation 4s linear infinite;
                }

                .ant-card-body {
                    .ant-menu {
                        border-inline-end: none;
                    }
                }
            }
        }

        .person_body_right {
            flex: 1;
            height: 100%;
            overflow: auto;
            border-radius: 5px;
        }
    }
}
</style>