<template>
    <div class="box">
        <MyHeader ref="logHeader"></MyHeader>
        <div class="container">
            <div class="drop" @click="selectLogin"
                :class="[selected === 1 ? big1 : mini1, isCodeLogin ? 'codeLogin' : 'notcodeLogin']">
                <div class="content" :class="isCodeLogin ? 'codeLogin' : 'notcodeLogin'">
                    <div class="el-icon-s-promotion" @click="changeLogin" style="cursor: pointer;"></div>
                    <p class="content-title">登录</p>
                    <a-form v-show="selected === 1 ? true : false" :model="login" status-icon :rules="rules" ref="login"
                        class="loginRuleForm">
                        <div>
                            <a-form-item prop="usernamel" class="myBox inputBox">
                                <el-input type="text" v-model="login.usernamel" :placeholder="loginHolder"></el-input>
                            </a-form-item>
                            <a-form-item v-show="isCodeLogin" class="myBox myEmail">
                                <el-button class="el-icon-message" type="primary" @click="getLoginCode"></el-button>
                            </a-form-item>
                            <a-form-item prop="passl" class="myBox inputBox">
                                <el-input type="password" v-model="login.passl" :placeholder="passHolder"></el-input>
                            </a-form-item>
                        </div>
                        <a-form-item class="myBox submitBox">
                            <el-button type="primary" @click="submitLogin('login')">Login</el-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="drop" @click="selectRegiste" :class="[selected === 2 ? big2 : mini2]">
                <div class="content">
                    <p class="content-title">注册</p>
                    <a-form v-show="selected === 2 ? true : false" :model="registe" status-icon :rules="rules"
                        ref="registe" class="loginRuleForm">
                        <a-form-item prop="usernamer" class="myBox inputBox">
                            <el-input type="text" v-model="registe.usernamer" placeholder="用户名"></el-input>
                        </a-form-item>
                        <a-form-item prop="emailr" class="myBox inputBox">
                            <el-input type="text" v-model="registe.emailr" placeholder="邮箱地址"></el-input>
                        </a-form-item>
                        <a-form-item class="myBox myEmail1">
                            <el-button class="el-icon-message" type="primary" @click="getRegisteCode"></el-button>
                        </a-form-item>
                        <a-form-item prop="emailCoder" class="myBox inputBox">
                            <el-input type="text" v-model="registe.emailCoder" placeholder="邮箱验证码"></el-input>
                        </a-form-item>
                        <a-form-item prop="passr" class="myBox inputBox">
                            <el-input type="password" v-model="registe.passr" placeholder="密码"></el-input>
                        </a-form-item>
                        <a-form-item class="myBox submitBox">
                            <el-button type="primary" @click="submitRegiste('registe')">Registe</el-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
        <!-- <div class="container">
            <div class="drop" @click="selectForget" :class="[selected === 3 ? big3 : mini3]">
                <div class="content">
                    <p class="content-title">忘记密码</p>
                    <a-form v-show="selected === 3 ? true : false" :model="query" status-icon :rules="rules" ref="query"
                        class="loginRuleForm">
                        <a-form-item prop="emailq" class="myBox inputBox">
                            <el-input type="text" v-model="query.emailq" placeholder="邮箱地址"></el-input>
                        </a-form-item>
                        <a-form-item class="myBox myEmail2">
                            <el-button class="el-icon-message" type="primary" @click="getQueryCode"></el-button>
                        </a-form-item>
                        <a-form-item prop="emailCodeq" class="myBox inputBox">
                            <el-input type="text" v-model="query.emailCodeq" placeholder="确认邮箱验证码"></el-input>
                        </a-form-item>
                        <a-form-item prop="newpassq" class="myBox inputBox">
                            <el-input type="password" v-model="query.newpassq" placeholder="请输入新密码"></el-input>
                        </a-form-item>
                        <a-form-item class="myBox submitBox">
                            <el-button type="primary" @click="submitQuery('query')">Change</el-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: "LoginRegister",
    setup() {
        return {
            login: {
                usernamel: '',
                passl: '',
            },
            registe: {
                usernamer: '',
                emailr: '',
                emailCoder: '',
                passr: '',
            },
            query: {
                emailq: '',
                emailCodeq: '',
                newpassq: '',
            },
            selected: 1,//1为登录，2为注册，3为找回密码
            big1: "selected selected1",
            big2: "selected selected2",
            big3: "selected selected3",
            mini1: "unselected unselected1",
            mini2: "unselected unselected2",
            mini3: "unselected unselected3",
            isCodeLogin: false,
            loginHolder: "邮箱地址",
            passHolder: "密码",
        };
    },
    methods: {
        submitLogin(formName) {
        },
        submitRegiste(formName) {
        },
        submitQuery(formName) {
        },
        selectLogin() {
            this.selected = 1;
        },
        selectRegiste() {
            this.selected = 2;
        },
        selectForget() {
            this.selected = 3;
        },

    },
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

// .container .drop .content .loginRuleForm .myBox /deep/ .el-input__inner {
//     border: none;
//     outline: none;
//     background: transparent;
//     width: 100%;
//     font-size: 1em;
//     padding: 10px 15px;
//     font-family: myFont;
//     transition: 1s;
// }

// .container .drop .content .loginRuleForm .myBox /deep/ .el-button--primary {
//     text-transform: uppercase;
//     font-size: 1em;
//     cursor: pointer;
//     letter-spacing: 0.1em;
//     font-weight: 500;
//     font-family: myFont;
//     background-color: transparent;
//     border: none;
//     transition: 1s;
// }

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