<script lang="ts">
import { LiveInfoR, UserInfoR, getUserInfo } from 'live-service';
import { PropType, defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MainHallGroup',
    props: {
        data: {
            type: Object as PropType<LiveInfoR[]>,
        }
    },
    setup(props) {
        const isEmpty = ref<boolean>(props.data?.length === 0 ? true : false)
        const finalData = ref<(LiveInfoR & UserInfoR)[]>([])

        // 获取用户信息
        if (!isEmpty.value) {
            Promise.all(props.data!.map(async (live) => {
                return new Promise(async (resolve) => {
                    const res = await getUserInfo(live.uploaderId)
                    if (res.success && res.data) {
                        resolve(res.data)
                    }
                })
            })).then((res) => {
                const users = res as UserInfoR[]
                users.forEach((user, index) => {
                    finalData.value.push({
                        ...user,
                        ...props.data![index]
                    })
                })
            })
        }

        return {
            isEmpty,
            finalData
        }
    }
})
</script>

<template>
    <div class="main-hall-group">
        <a-row v-if="!isEmpty" :gutter="24" style="max-width: 100%;row-gap: 16px;">
            <a-col :span="6" v-for="(live, index) in finalData" :key="live.roomId">
                <router-link :to="`/live/watcher/${live.roomId}`" class="live-router">
                    <a-card hoverable>
                        <template #cover>
                            <img alt="cover_pic" :src="live.cover_picture_url" />
                        </template>
                        <a-card-meta :title="live.name" :description="live.liveTitle">
                            <template #avatar>
                                <a-avatar :src="live.avatar" />
                            </template>
                        </a-card-meta>
                        <span class="view-count">
                            <svg class="view-count-icon icon" t="1715008941545" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4269" width="20" height="20">
                                <path
                                    d="M512 768c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m8.533333-426.666667c-128 0-256 55.466667-328.533333 170.666667 72.533333 115.2 200.533333 170.666667 328.533333 170.666667s238.933333-55.466667 311.466667-170.666667c-72.533333-115.2-183.466667-170.666667-311.466667-170.666667z m-8.533333 298.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z m0-85.333333c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z"
                                    fill="#8a8a8a" p-id="4270"></path>
                            </svg>
                            {{ live.view_count }}
                        </span>
                        <span class="like-count">
                            <svg class="like-count-icon icon" t="1715009045336" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5364" width="20" height="20">
                                <path
                                    d="M512 883.2l-140.8-140.8c-4.266667-4.266667-8.533333-8.533333-17.066667-12.8l-209.066666-209.066667c-85.333333-85.333333-85.333333-221.866667 0-307.2l4.266666-4.266666c85.333333-85.333333 221.866667-85.333333 307.2 0l55.466667 42.666666 46.933333-46.933333c85.333333-85.333333 221.866667-85.333333 307.2 0l4.266667 4.266667c85.333333 85.333333 85.333333 221.866667 0 307.2L512 883.2zM311.466667 209.066667c-38.4 0-76.8 12.8-106.666667 42.666666l-8.533333 4.266667c-59.733333 59.733333-59.733333 157.866667 0 217.6L405.333333 682.666667c4.266667 4.266667 8.533333 8.533333 12.8 8.533333l4.266667 4.266667 93.866667 93.866666 136.533333-136.533333 179.2-179.2c59.733333-59.733333 59.733333-157.866667 0-217.6l-4.266667-4.266667c-59.733333-59.733333-157.866667-59.733333-217.6 0L512 345.6 418.133333 251.733333c-29.866667-29.866667-68.266667-42.666667-106.666666-42.666666z"
                                    fill="#bfbfbf" p-id="5365"></path>
                            </svg>
                            {{ live.like_count }}
                        </span>
                    </a-card>
                </router-link>
            </a-col>
        </a-row>

        <a-empty v-else :imageStyle="{ display: 'flex' }"></a-empty>
    </div>
</template>

<style lang="scss">
.main-hall-group {
    width: 100%;

    .live-router {
        color: var(--text-color);
    }

    .ant-card-cover {
        aspect-ratio: 7 / 4;
        display: flex;
        overflow: hidden;
        align-items: center;
    }

    .ant-card-body {
        position: relative;

        .ant-card-meta {
            display: flex;
            align-items: center;

            .ant-card-meta-description {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .view-count {
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            align-items: center;
            padding: var(--padding-xs);

            .view-count-icon {
                margin: 0 var(--margin-xs);
            }
        }

        .like-count {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            padding: var(--padding-xs);

            .like-count-icon {
                margin: 0 var(--margin-xs);
            }
        }
    }
}
</style>