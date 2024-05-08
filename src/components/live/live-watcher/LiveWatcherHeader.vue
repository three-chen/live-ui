<script lang="ts">
import { useLiveStore } from '@/stores/live';
import { useUserStore } from '@/stores/user';
import { notification } from 'ant-design-vue';
import { UserInfoR, addFollow, canselFollow, getUserInfo, isFollowed } from 'live-service';
import { computed, ref, watch } from 'vue';

export default {
    name: 'LiveWatcherHeader',
    props: {
        viewCount: {
            type: String,
            default: "0"
        },
        likeCount: {
            type: String,
            default: "0"
        }
    },
    setup() {
        const titles = ref<string[]>(['未分区', '游戏区', '运动区', '生活区'])
        // liveInfo
        const liveStore = useLiveStore();
        const live = computed(() => liveStore.live);
        const liveTitle = computed(() => live.value?.liveTitle);
        const liveType = computed(() => titles.value[Number(live.value?.typeId) ?? 0]);
        const cover_pic_url = computed(() => live.value?.cover_picture_url);
        // uploaderInfo
        const uploader = ref<UserInfoR | undefined>(undefined)
        const userName = ref<string | undefined>(uploader.value?.name)
        const userStore = useUserStore();
        const userInfo = computed(() => userStore.user);
        // followInfo
        const followd = ref<boolean>(true)

        watch(
            () => live.value?.uploaderId,
            async (newValue) => {
                if (newValue) {
                    const res = await getUserInfo(newValue)
                    if (res.success && res.data) {
                        uploader.value = res.data
                        userName.value = res.data.name
                        console.log("liveInfo uploaderId liveStore", liveStore.live, live)
                        initFollowed()
                    }
                }
            },
            { immediate: true }
        )

        const initFollowed = async () => {
            const res = await isFollowed({
                userId: live.value?.uploaderId!,
                followerId: userInfo.value?.id!
            })
            if (res.success && res.data) {
                followd.value = res.data.followd
            }
        }

        const handleFollow = async () => {
            if (followd.value) {
                const res = await canselFollow({
                    userId: live.value?.uploaderId!,
                    followerId: userInfo.value?.id!
                })
                if (res.success && res.data) {
                    followd.value = res.data.followd
                    console.log("cancel follow res", res.data)
                    notification.success({
                        message: '取消关注成功',
                        description: '已取消对' + userName.value + '的关注'
                    })
                }
            } else {
                const res = await addFollow({
                    userId: live.value?.uploaderId!,
                    followerId: userInfo.value?.id!
                })
                if (res.success && res.data) {
                    followd.value = res.data.followd
                    console.log("add follow res", res.data)
                    notification.success({
                        message: '关注成功',
                        description: '已关注' + userName.value
                    })
                }
            }
        }

        return {
            liveTitle,
            liveType,
            cover_pic_url,
            userName,
            followd,
            handleFollow
        }
    }
};
</script>

<template>
    <div class="live-watcher-header">
        <a-image class="live-watcher-coverpic" :width="60" :src="cover_pic_url" />
        <div class="live-watcher-liveinfo">
            <div class="live-watcher-liveinfo-up">
                <div class="live-watcher-liveinfo-up-left">
                    <div class="live-watcher-uploaderinfo-name">{{ userName }}</div>
                    <a-button class="live-watcher-uploaderinfo-likebtn" type="primary" danger @click="handleFollow">{{
            followd ? '取消关注' : '关注' }}</a-button>
                </div>
                <div class="live-watcher-liveinfo-up-right">
                    <div class="live-watcher-uploaderinfo-viewcount">
                        <svg class="view-count-icon icon" t="1715008941545" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4269" width="20" height="20">
                            <path
                                d="M512 768c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m8.533333-426.666667c-128 0-256 55.466667-328.533333 170.666667 72.533333 115.2 200.533333 170.666667 328.533333 170.666667s238.933333-55.466667 311.466667-170.666667c-72.533333-115.2-183.466667-170.666667-311.466667-170.666667z m-8.533333 298.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z m0-85.333333c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z"
                                fill="#8a8a8a" p-id="4270"></path>
                        </svg>
                        {{ viewCount }}
                    </div>
                    <div class="live-watcher-uploaderinfo-likecount">
                        <svg t="1715093651015" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4289" width="20" height="20">
                            <path
                                d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z"
                                p-id="4290" fill="#8a8a8a"></path>
                        </svg>
                        {{ likeCount }}
                    </div>
                </div>
            </div>
            <div class="live-watcher-liveinfo-down">
                <span class="live-watcher-liveinfo-title">{{ liveTitle }}</span>
                <a-button type="link" class="live-watcher-liveinfo-type" style="padding-right: 0;">#{{ liveType
                    }}</a-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.live-watcher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--row-gap);
    width: 100%;
    height: 80px;
    padding: 0 16px;
    background-color: var(--background);
    border-radius: var(--border-radius-sm);

    .live-watcher-coverpic {
        max-height: 60px;
        overflow: hidden;
    }

    .live-watcher-liveinfo {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: var(--padding-sm);

        .live-watcher-liveinfo-up {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .live-watcher-liveinfo-up-left {
                display: flex;
                align-items: center;

                .live-watcher-uploaderinfo-name {
                    padding: 0 var(--padding-sm);
                    font-family: myFont;
                }
            }

            .live-watcher-liveinfo-up-right {
                display: flex;
                align-items: center;

                .live-watcher-uploaderinfo-viewcount {
                    padding-right: var(--padding-sm);
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .live-watcher-uploaderinfo-likecount {
                    padding-right: var(--padding-sm);
                    display: flex;
                    align-items: center;
                    gap: 5px;

                }
            }
        }

        .live-watcher-liveinfo-down {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 var(--padding-sm);
        }
    }

}
</style>