<template>
    <div class="user-config-container">
        <a-spin :spinning="spinning">
            <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState"
                @finish="onFinish" @finishFailed="onFinishFailed">
                <a-row :gutter="24" style="max-width: 100%;">
                    <a-col :span="12">
                        <a-form-item name="name" label="用户名" :rules="[{ required: true, message: '请输入用户名' }]">
                            <a-input v-model:value="formState.name" placeholder="请输入用户名"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="email" label="邮箱" :rules="[{ required: true, message: '请输入邮箱' }]">
                            <a-input v-model:value="formState.email" placeholder="请输入邮箱"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="phoneNumber" label="手机号">
                            <a-input v-model:value="formState.phoneNumber" placeholder="请输入手机号"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="birthday" label="生日">
                            <a-date-picker format="YYYY/MM/DD" v-model:value="formState.birthday" placeholder="请输入生日" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item name="briefInfo" label="简介">
                            <a-textarea v-model:value="formState.briefInfo" placeholder="请输入个人简介" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="4" :offset="20" class="sumit-col">
                        <a-form-item>
                            <a-button type="primary" html-type="submit">提交</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user';
import { notification } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { UserInfo, getUserInfo, postUserInfo } from 'live-service';
import { onMounted, ref } from 'vue';

interface FormState {
    name: string;
    email: string;
    phoneNumber?: string;
    birthday?: Dayjs;
    briefInfo?: string;
}


export default {
    name: 'UserConfig',
    components: {},
    setup() {
        dayjs.locale('zh-cn');
        const spinning = ref<boolean>(true);
        const userStore = useUserStore();
        const userInfo = userStore.user;

        const formState = ref<FormState>({
            name: userInfo!.name!,
            email: userInfo!.email!,
            phoneNumber: userInfo!.phoneNumber,
            birthday: undefined,
            briefInfo: userInfo!.briefInfo,
        });

        const onFinish = async (values: FormState) => {
            const updateUserInfo: Partial<UserInfo> = {
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                birthday: values.birthday?.toDate(),
                briefInfo: values.briefInfo,
            }
            const res = await postUserInfo(userInfo!.id!, updateUserInfo)
            if (res.success && res.data) {
                const finalUserInfo: UserInfo = {
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber,
                    birthday: res.data.birthday,
                    briefInfo: res.data.briefInfo,
                    avatar: res.data.avatar,
                }
                formState.value = {
                    name: finalUserInfo.name!,
                    email: finalUserInfo.email!,
                    phoneNumber: finalUserInfo.phoneNumber,
                    birthday: dayjs(finalUserInfo.birthday),
                    briefInfo: finalUserInfo.briefInfo,
                };
                userStore.setUser(finalUserInfo);

                notification.success({
                    message: '成功',
                    description:
                        '提交成功。',
                });
            }
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
            notification.error({
                message: '错误',
                description:
                    '提交失败，请检查输入是否正确。',
            });
        };

        onMounted(async () => {
            const res = await getUserInfo(userInfo!.id!);
            if (res.success && res.data) {
                console.log("res", res.data)
                const finalUserInfo: UserInfo = {
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber,
                    birthday: new Date(res.data.birthday as unknown as string),
                    briefInfo: res.data.briefInfo,
                    avatar: res.data.avatar,
                }
                formState.value = {
                    name: finalUserInfo.name!,
                    email: finalUserInfo.email!,
                    phoneNumber: finalUserInfo.phoneNumber,
                    birthday: dayjs(finalUserInfo.birthday),
                    briefInfo: finalUserInfo.briefInfo,
                };
                console.log("formState", finalUserInfo, formState.value)
                userStore.setUser(finalUserInfo);
            }
            spinning.value = false;
        })

        return {
            formState,
            onFinish,
            onFinishFailed,
            spinning,
        };
    },
};

</script>

<style lang="scss">
.user-config-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--background);
    padding: var(--padding);
    overflow: auto;

    .sumit-col {
        .ant-form-item-control-input-content {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>