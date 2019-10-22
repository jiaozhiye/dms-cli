<template>
  <div class="login">
    <div class="left"></div>
    <div class="right">
      <div class="wrap">
        <h3>
          <img src="@/assets/img/login_title.png" width="260" />
        </h3>
        <div class="main">
          <div class="top">
            <span
              v-for="item in labels"
              :class="{ actived: currentMark === item.value }"
              :key="item.value"
              @click="clickHandler(item.value)"
            >{{ item.text }}</span>
          </div>
          <div class="container">
            <div class="scroll" :style="scrollTranslate">
              <div class="box">
                <el-form ref="form-user" size="medium" :rules="rules">
                  <el-form-item prop="username">
                    <el-input
                      v-model="form.username"
                      prefix-icon="el-icon-user"
                      placeholder="请输入用户名"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      type="password"
                      v-model="form.password"
                      placeholder="请输入密码"
                      prefix-icon="el-icon-lock"
                    />
                  </el-form-item>
                </el-form>
                <div class="forget">
                  <a href="/">忘记密码</a>
                </div>
              </div>
              <div class="box">
                <el-form ref="form-phone" size="medium" :rules="rules">
                  <el-form-item prop="phone">
                    <el-input
                      v-model="form.phone"
                      prefix-icon="el-icon-mobile-phone"
                      placeholder="请输入手机号"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      type="password"
                      class="fl"
                      v-model="form.vcode"
                      placeholder="验证码"
                      style="width: 50%"
                      prefix-icon="el-icon-message"
                    />
                    <el-button class="fr" style="width: 38%">获取验证码</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div style="padding-top: 30px;">
              <multiuse-button
                type="primary"
                size="medium"
                class="login-btn"
                :click="loginHandle"
              >登 录</multiuse-button>
            </div>
          </div>
          <div class="footer">
            <div class="quick">
              <span>微信登录</span>
              <span>APP下载</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { sleep } from '@/utils';
import { doLogin } from '@/api/login';

export default {
  name: 'Login',
  data() {
    // tab 标签
    this.labels = [{ text: '用户名登录', value: 'user' }, { text: '手机号登录', value: 'phone' }];
    return {
      form: {
        username: '',
        password: '',
        phone: '',
        vcode: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      currentMark: 'user' // 当前标记
    };
  },
  computed: {
    scrollTranslate() {
      const index = this.labels.findIndex(x => x.value === this.currentMark);
      const val = -1 * (index / this.labels.length) * 100 + '%';
      return {
        transform: `translate3d(${val}, 0, 0)`
      };
    }
  },
  methods: {
    ...mapActions('app', ['createLoginInfo']),
    clickHandler(type) {
      this.currentMark = type;
    },
    async loginHandle() {
      const res = await doLogin({
        username: this.form.username,
        password: this.form.password
      });
      if (res.code === 1) {
        this.createLoginInfo({
          id: res.data.id,
          name: res.data.name,
          token: res.data.token
        });
        await sleep(100);
        this.$router.push({ path: '/' });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #fff url(../../assets/img/login_bg.svg) no-repeat 50%;
  background-size: 100%;
  .left {
    flex: 1;
    background: url(../../assets/img/login_left_bg.jpg) 100% 0 no-repeat;
    background-size: cover;
  }
  .right {
    width: 34vw;
    .wrap {
      padding: 15vh 40px 0;
      .main {
        padding-top: 10vh;
        .top {
          color: @textColorSecondary;
          span {
            padding: 6px;
            cursor: pointer;
            &.actived {
              color: @primaryColor;
            }
          }
        }
        .container {
          width: 100%;
          padding-top: 30px;
          overflow: hidden;
          .scroll {
            width: 200%;
            height: 130px;
            display: flex;
            transition: transform 0.3s ease;
            .box {
              width: 50%;
              /deep/ .el-form-item {
                margin-bottom: 20px;
              }
              /deep/ .el-input__inner {
                font-size: 14px;
                border: 0;
                border-bottom: 1px solid #d6d6d6 !important;
              }
              /deep/ .el-input__icon {
                font-size: 18px;
              }
              .forget {
                margin-top: -5px;
                text-align: right;
                a {
                  font-size: 13px;
                  transition: all 0.3s ease;
                  &:hover {
                    color: @primaryColor;
                  }
                }
              }
            }
          }
          .login-btn {
            width: 100%;
            height: 42px;
            font-size: 14px;
          }
        }
        .footer {
          margin-top: 15vh;
          .quick {
            line-height: 30px;
            span {
              margin-right: 20px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
