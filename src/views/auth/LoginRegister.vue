<template>
    <div class="box">
        <div class="container">
            <div class="drop notcodeLogin" @click="selectLogin" :class="[selected === 1 ? big1 : mini1]">
                <div class="content notcodeLogin">
                    <p class="content-title">登录</p>
                    <a-form :class="[selected === 1 ? '' : 'formUnselected']" :model="loginForm" class="loginRuleForm">
                        <div>
                            <a-form-item class="myBox inputBox" :rules="[{ required: true, message: '请输入你的邮箱地址!' }]">
                                <a-input v-model:value="loginForm.email" placeholder="邮箱地址">
                                    <template #prefix>
                                        <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
                                    </template>
                                </a-input>
                            </a-form-item>
                            <a-form-item class="myBox inputBox" :rules="[{ required: true, message: '请输入你的密码!' }]">
                                <a-input-password v-model:value="loginForm.password" placeholder="密码">
                                    <template #prefix>
                                        <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                                    </template>
                                </a-input-password>
                            </a-form-item>
                        </div>
                        <a-form-item class="myBox submitBox">
                            <a-button type="primary" @click="submitLogin()">Login</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="drop" @click="selectRegiste" :class="[selected === 2 ? big2 : mini2]">
                <div class="content">
                    <p class="content-title">注册</p>
                    <a-form :class="[selected === 2 ? '' : 'formUnselected']" :model="registerForm"
                        class="loginRuleForm">
                        <a-form-item class="myBox inputBox" :rules="[{ required: true, message: '请输入你的用户名!' }]">
                            <a-input v-model:value="registerForm.name" placeholder="用户名">
                                <template #prefix>
                                    <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item class="myBox inputBox" :rules="[{ required: true, message: '请输入你的密码!' }]">
                            <a-input-password v-model:value="registerForm.password" placeholder="密码">
                                <template #prefix>
                                    <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item class="myBox inputBox" :rules="[{ required: true, message: '请输入你的邮箱地址!' }]">
                            <a-input v-model:value="registerForm.email" placeholder="邮箱地址">
                                <template #prefix>
                                    <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item class="myBox submitBox">
                            <a-button type="primary" @click="submitRegiste()">Registe</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { LoginInfo, RegisterInfo, postLoginInfo, postRegisterInfo } from 'live-service';
import { ref } from "vue";
import { useRouter } from 'vue-router';

export default {
    name: "LoginRegister",
    components: {
        LockOutlined,
        MailOutlined,
        UserOutlined
    },
    setup() {
        const selected = ref(1);//1为登录，2为注册，3为找回密码
        const big1 = ref<string>("selected selected1")
        const big2 = ref<string>("selected selected2")
        const mini1 = ref<string>("unselected unselected1")
        const mini2 = ref<string>("unselected unselected2")

        const userStore = useUserStore();
        const router = useRouter();

        const loginForm = ref<LoginInfo>({
            email: '',
            password: ""
        })
        const registerForm = ref<RegisterInfo>({
            name: '',
            password: "",
            email: ""
        })

        const submitLogin = () => {
            console.log("submitLogin", loginForm.value);
            postLoginInfo(loginForm.value).then(res => {
                if (res.success && res.data) {
                    console.log("res loginR", res);
                    const { auth, token, useremail, username, avatar, userId } = res.data
                    const userInfo = { userId, username, avatar, useremail, auth, token }
                    userStore.setLogin(true)
                    userStore.setUser(userInfo)
                    localStorage.setItem("token", token)
                    localStorage.setItem('userInfo', JSON.stringify(userInfo))

                    notification.success({
                        message: '登陆成功',
                        description: `欢迎${username}`,
                    });
                    router.push({ path: '/' })
                }
            })

        }
        const submitRegiste = () => {
            console.log("submitRegiste", registerForm.value);
            postRegisterInfo(registerForm.value).then(res => {
                if (res.success && res.data) {
                    console.log("res registerR", res);
                    const registerR = res.data
                    notification.success({
                        message: '注册成功',
                        description: `感谢${registerR.username}注册`,
                    });
                }
            })
        }

        const selectLogin = () => {
            selected.value = 1;
        }
        const selectRegiste = () => {
            selected.value = 2;
        }
        return {
            loginForm,
            registerForm,
            selected,
            big1,
            big2,
            mini1,
            mini2,
            submitLogin,
            submitRegiste,
            selectLogin,
            selectRegiste,
        };
    }
};
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}

.container {
    position: absolute;
    left: calc(50% - 250px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: myFont;
    // transform-style: preserve-3d;
}

.myEmail {
    position: absolute !important;
    // width: 100px px !important;
    top: 30%;
    right: -6%;
    text-align: center;
    background: #ff0f5b;
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
}

.myEmail1 {
    position: absolute !important;
    top: 35.3%;
    right: -9%;
    text-align: center;
    background: #ff0f5b;
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
}

.myEmail2 {
    position: absolute !important;
    transform: scale(0.8);
    top: 25%;
    right: -5%;
    text-align: center;
    background: #ff0f5b;
    box-shadow: inset 2px 5px 10px rgb(0 0 0 / 10%), 15px 15px 10px rgb(0 0 0 / 5%), 15px 10px 15px rgb(0 0 0 / 3%);
}

.container .drop {
    position: relative;
    transition: 1s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container .drop::before {
    content: '';
    position: absolute;
    top: 14%;
    left: 24%;
    width: 10%;
    height: 10%;
    border-radius: 50%;
    background: #fff;
    opacity: 0.9;
}

.container .drop::after {
    content: '';
    position: absolute;
    top: 25%;
    left: 31%;
    width: 5%;
    height: 5%;
    border-radius: 50%;
    background: #fff;
    opacity: 0.9;
    z-index: 0;
}

.container .drop .content {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 40px;
    gap: 20px;
    z-index: 1;
}

.container .drop .content .el-icon-s-promotion {
    position: absolute;
    color: #ff0f5b;
    top: 10%;
    right: 9%;
    font-weight: bold;
    // transform: rotate(-55deg);
}

.container .drop .content .content-title {
    position: relative;
    color: #333;
}

.container .drop .content .loginRuleForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
}

.codeLogin {
    transform: rotateY(180deg);
}

.container .drop .content .loginRuleForm .myBox {
    position: relative;
    border-radius: 25px;
    transition: 0.5s;
}

.container .drop .content .loginRuleForm .inputBox {
    width: 225px;
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
        inset -2px -5px 10px rgba(255, 255, 255, 1),
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
}

.container .drop .content .loginRuleForm .myBox::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 65%;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
}

.container .drop .content .loginRuleForm .myBox .ant-input-affix-wrapper {
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
    width: 100%;
    font-size: 1em;
    padding: 10px 15px;
    font-family: myFont;
    transition: 1s;
}

.container .drop .content .loginRuleForm .myBox .ant-input-affix-wrapper :deep(input.ant-input) {
    background: transparent !important;
    font-family: myFont;
}

.container .drop .content .loginRuleForm .myBox .ant-btn-primary {
    text-transform: uppercase;
    font-size: 1em;
    cursor: pointer;
    letter-spacing: 0.1em;
    font-weight: 500;
    font-family: myFont;
    background-color: transparent;
    border: none;
    transition: 1s;
}

.container .drop .content .loginRuleForm .submitBox {
    width: 120px;
    background: #ff0f5b;
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
}

.container .drop .content .loginRuleForm .submitBox:hover {
    width: 150px;
}

.formUnselected {
    transform: scale(0);
    position: absolute;
}

.selected {
    width: 380px;
    height: 380px;
    font-size: 2em;
}

.selected1 {
    box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
        25px 35px 20px rgba(0, 0, 0, 0.05),
        25px 30px 30px rgba(0, 0, 0, 0.05),
        inset -20px -20px 25px rgba(255, 255, 255, 0.9);
    border-radius: 52% 48% 33% 67% / 38% 45% 55% 62%;
}

.selected2 {
    width: 450px;
    height: 450px;
    border-radius: 49% 51% 52% 48% / 63% 59% 41% 37%;
    background: #01b4ff !important;
    box-shadow: inset 10px 10px 10px rgba(1, 180, 255, 0.05),
        15px 25px 10px rgba(1, 180, 255, 0.1),
        15px 20px 20px rgba(1, 180, 255, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.selected3 {
    background: #c61dff !important;
    box-shadow: inset 10px 10px 10px rgba(190, 1, 254, 0.05),
        15px 25px 10px rgba(190, 1, 254, 0.1),
        15px 20px 20px rgba(190, 1, 254, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
    border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
}

.selected:hover {
    border-radius: 50%;
}

.unselected {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
    line-height: 1.2em;
    letter-spacing: 0.1em;
    font-size: 0.8em;
    text-align: center;
}

.unselected:hover {
    border-radius: 50%;
}

.unselected1 {
    width: 100px;
    height: 100px;
    top: 10px;
    right: 115px;
    box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
        25px 35px 20px rgba(0, 0, 0, 0.05),
        25px 30px 30px rgba(0, 0, 0, 0.05),
        inset -20px -20px 25px rgba(255, 255, 255, 0.9);
    border-radius: 52% 48% 33% 67% / 38% 45% 55% 62%;
}

.unselected2 {
    width: 80px;
    height: 80px;
    top: 10px;
    left: 400px;
    border-radius: 49% 51% 52% 48% / 63% 59% 41% 37%;
    background: #01b4ff !important;
    box-shadow: inset 10px 10px 10px rgba(1, 180, 255, 0.05),
        15px 25px 10px rgba(1, 180, 255, 0.1),
        15px 20px 20px rgba(1, 180, 255, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.unselected3 {
    width: 120px;
    height: 120px;
    top: 150px;
    right: 110px;
    background: #c61dff !important;
    box-shadow: inset 10px 10px 10px rgba(190, 1, 254, 0.05),
        15px 25px 10px rgba(190, 1, 254, 0.1),
        15px 20px 20px rgba(190, 1, 254, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
    border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
}
</style>