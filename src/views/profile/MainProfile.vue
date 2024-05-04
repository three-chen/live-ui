<template>
    <div class="box">
        <MyHeader ref="selfHeader"></MyHeader>
        <div class="PersonTop">
            <el-card class="cardtop">
                <div class="PersonTop_img">
                    <el-image class="profileimg" :src="profilesrc" fit="fill"></el-image>
                </div>
                <div class="PersonTop_text">
                    <div class="user_text">
                        <div class="user_name">
                            <span> {{ $store.state.name }} </span>
                        </div>
                        <div class="user_anniu">
                            <el-upload class="upload-demo" action="https://61.139.65.134:61956/user_add_head/"
                                :headers="myHeader" name="head" multiple :limit="3" :on-error="handleError"
                                :on-success="handleSuccess" :show-file-list="fileList" ref="myUpload">
                                <el-button class="el-icon-edit" size="medium" type="primary">上传头像</el-button>
                            </el-upload>
                            <!-- <el-button class="el-icon-edit" type="primary" size="medium" plain @click="upload">上传头像
                            </el-button> -->
                        </div>
                        <div class="user_anniu">
                            <el-button class="el-icon-edit" type="primary" size="medium" plain
                                @click="dialogFormVisible = true">修改密码
                            </el-button>
                        </div>

                        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item label="请输入原密码" :label-width="formLabelWidth">
                                    <el-input v-model="form.oldPass" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="请输入新密码" :label-width="formLabelWidth">
                                    <el-input v-model="form.newPass" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="alter">确 定</el-button>
                            </div>
                        </el-dialog>

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
                            <span class="num_text">获赞</span>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="person_body">
            <div class="person_body_left" :class="menuFixed == true ? 'isFixed' : ''">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                    <div slot="header" class="clearfix">
                        <span class="person_body_list" style="border-bottom: none">个人中心</span>
                    </div>
                    <el-menu router active-text-color="#00c3ff" class="el-menu-vertical-demo">
                        <el-menu-item index="info" route="/self/mymusic">
                            <i class="el-icon-user"></i>
                            <span slot="title">我的音乐</span>
                        </el-menu-item>
                        <el-menu-item index="myarticle" route="/self/mycomments">
                            <i class="el-icon-edit-outline"></i>
                            <span slot="title">我的评论</span>
                        </el-menu-item>
                        <el-menu-item index="mycollect" route="/self/mycollect">
                            <i class="el-icon-document"></i>
                            <span slot="title">我的收藏</span>
                        </el-menu-item>
                        <el-menu-item index="mylike" route="/self/mylike">
                            <i class="el-icon-document"></i>
                            <span slot="title">我赞过的</span>
                        </el-menu-item>
                    </el-menu>
                </el-card>
            </div>
            <div class="person_body_right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import axios from 'axios';
import qs from 'qs';
export default {
    name: "SelfPage",
    components: {
        MyHeader,
    },
    data() {
        return {
            menuFixed: false,
            fanCounts: 0,
            followCounts: 0,
            goodCounts: 0,
            fileList: false,
            dialogFormVisible: false,
            form: {
                oldPass: "",
                newPass: "",
            },
            formLabelWidth: '120px',
            profilesrc: "https://61.139.65.134:61956/user_head/" + this.$cookies.get("head"),
            myHeader: { 'Authorization': 'jwt ' + this.$cookies.get('token') },
        };
    },
    mounted() {
        window.scrollTo(0, 0);
        this.$refs.selfHeader.change(5);
        document.querySelector('body').setAttribute('style', 'display: block;');
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        document.querySelector('body').setAttribute('style', 'display: flex;');
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            var offsetTop = document.querySelector('.person_body_left').offsetTop + 190
            // console.log(scrollTop) //滑动的长度
            // console.log(offsetTop);
            if (scrollTop > offsetTop) {
                this.menuFixed = true
                // console.log("页面高度大于执行操作")
            } else {
                this.menuFixed = false
                // console.log("页面高度小于执行操作")
            }
        },
        alter() {
            this.dialogFormVisible = false;
            axios.post("/modify_password/", qs.stringify({
                email: this.$store.state.email,
                password: this.form.oldPass,
                newPassword: this.form.newPass,
            })).then(
                response => {
                    // console.log(response);
                    if (response.data.status === true) {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                        });
                    } else {
                        this.$message.error('修改失败');
                        return false;
                    }
                })
        },
        handleError(err, file, fileList) {
            console.log(err);
            console.log(file);
            console.log(fileList);
        },
        handleSuccess(response) {
            console.log(response);
            this.$refs.myUpload.clearFiles();
            this.$cookies.set("head", response.head);
            this.$store.dispatch("changehead", response.head);
            this.profilesrc = this.profilesrc.split("?")[0] + "?" + Math.random();
            this.$bus.$emit("picChange", this.profilesrc);
            console.log(this.profilesrc);
        },
    },
}
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #f4f4f4;
}

.me-video-player {
    background-color: transparent;
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    position: fixed;
    left: 0;
    z-index: 0;
    top: 0;
}

.PersonTop {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 160px;
    padding-top: 20px;
    // background-color: #;
    margin-top: 30px;
    position: absolute;
    /* left: 50%; */
    /* transform: translateX(-50%); */
    border-radius: 5px;
}

.cardtop {
    width: 82%;
    border-radius: 15px;
}

.PersonTop /deep/ .el-card__body {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 0;
    height: 100%;
}

.PersonTop_img {
    width: 9.6%;
    height: 86%;
    background-color: #8c939d;
    margin-left: 20px;
    overflow: hidden;
    border-radius: 20px;
}

.PersonTop_img .profileimg {
    width: 100%;
    height: 100%;
    border-radius: 20px;
}

.PersonTop_text {
    display: flex;
    align-items: center;
    margin-left: 2%;
    height: 100%;
    width: 80%;
}

.user_text {
    width: 60%;
    height: 80%;
    line-height: 30px;
}

.user_name {
    font-weight: bold;
    text-indent: 2em;
}

.user_anniu {
    margin: 4px;
}

.el-icon-edit {
    width: auto !important;
}

.user_num {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.user_num>div {
    text-align: center;
    border-right: 1px dotted #999;
    box-sizing: border-box;
    width: 80px;
    height: 40px;
    line-height: 20px;
}

.num_text {
    color: #999;
}

.num_number {
    font-size: 20px;
    color: #333;
}

.el-menu-item>span {
    font-size: 16px;
    color: #999;
}

/*下面部分样式*/
.person_body {
    display: flex;
    position: absolute;
    width: 100%;
    margin-top: 15%;
    /* left: 50%;
    transform: translateX(-50%); */
    border-radius: 5px;
}

.person_body_left {
    transition: 0.5s;
    width: 25%;
    height: 410px;
    border-radius: 5px;
    margin-left: 9%;
    margin-right: 3%;
    text-align: center;
}

.person_body_list {
    width: 100%;
    height: 50px;
    margin-top: 25px;
    font-size: 22px;
    border-bottom: 1px solid #f0f0f0;
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

.el-menu-item {
    margin-top: 22px;
}

.person_body_right {
    position: absolute;
    margin-left: 37%;
    width: 54%;
    /* height: 500px; */
    border-radius: 5px;
    // background-color: white;
}

.box-card {
    height: 405px;
}

/*ui样式*/
.el-button {
    width: 84px;
}

.isFixed {
    position: fixed;
    top: 40px;
    left: 0;
    z-index: 999;
}
</style>