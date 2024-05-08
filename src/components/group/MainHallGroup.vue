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
                            <svg t="1715175814973" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2856" width="20" height="20">
                                <path
                                    d="M474.18097 127.290893l-134.35708 0q-13.933327 0-21.397609-6.469045t-10.449995-16.421421-2.985713-22.392847 1.990475-23.388084q0.995238-10.947614 3.980951-23.885703t8.45952-21.895228 14.430946-11.942852 21.895228 4.976188q14.928564 8.957139 33.83808 19.407134t36.823792 20.89999 33.340461 18.909515 23.388084 13.435708q9.952376 6.966663 14.928564 15.426183t3.980951 15.923802-7.961901 12.44047-19.904753 4.976188zM551.809505 126.295656l133.361843 0q13.933327 0 21.397609-6.469045t10.449995-16.421421 2.985713-22.392847-0.995238-23.388084q-1.990475-10.947614-4.478569-23.388084t-7.961901-21.397609-14.430946-11.942852-21.895228 3.980951q-14.928564 8.957139-33.83808 19.407134t-37.321411 20.89999-33.83808 18.909515-22.392847 13.435708q-10.947614 6.966663-15.923802 15.426183t-3.980951 15.923802 7.961901 12.44047 20.89999 4.976188zM460.247643 191.981339l-288.618913 0q-31.847604 0-41.302362 10.449995t-9.454758 33.340461l0 87.580912q0 24.880941 10.449995 36.823792t41.302362 11.942852l287.623676 0 0-180.138011zM568.728545 191.981339l284.637963 0q31.847604 0 43.292837 12.44047t11.445233 35.330936l0 85.590436q0 23.885703-10.449995 35.330936t-41.302362 11.445233l-287.623676 0 0-180.138011zM460.247643 424.866945l-305.537953 0 0 163.218972 0 64.690446 0 60.709496 0 51.752357 0 35.828555q0 50.757119 28.861891 78.623773t89.571387 27.866654l187.104675 0 0-482.690252zM568.728545 424.866945l304.542716 0 0 373.214112q-0.995238 50.757119-28.861891 80.116629t-88.576149 29.35951l-187.104675 0 0-482.690252z"
                                    p-id="2857" fill="#8a8a8a"></path>
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