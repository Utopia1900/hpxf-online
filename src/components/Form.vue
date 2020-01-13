<template>
  <div>
    <title>登录</title>
    <div style="width: 100%;overflow: hidden; margin-top: 100px;">
      <img :src="src" />
      <div
        style="text-align: center; font-size: 18px;margin-top: 20px;margin-bottom: 30px;"
      >{{title}}</div>
      <div style="height: 55px;">
        <div class="hb-container">
          <div class="hp-icon-container">
            <v-ons-icon
              icon="my-icon-user"
              class="hp-icon"
              style="font-size: 25px;line-height: 50px;"
            ></v-ons-icon>
            <input
              placeholder="请输入用户名"
              @input="handleChange"
              name="username"
              type="text"
              id="username"
              v-model="username"
            />
            <v-ons-icon
              icon="my-icon-close"
              @click="clear('username')"
              class="hp-icon"
              style="line-height: 50px;"
            ></v-ons-icon>
          </div>
          <span class="feed-back">{{formErrors.username}}</span>
        </div>
      </div>
      <div style="height: 55px;margin-top:20px;">
        `
        <div class="hb-container">
          <div class="hp-icon-container">
            <v-ons-icon
              icon="my-icon-lock"
              class="hp-icon"
              style="font-size: 25px;line-height: 50px;"
            ></v-ons-icon>
            <input
              placeholder="请输入密码"
              @input="handleChange"
              name="password"
              type="password"
              id="password"
              v-model="password"
              @keyup.enter="submitHandle"
            />
            <v-ons-icon
              icon="my-icon-close"
              @click="clear('password')"
              class="hp-icon"
              style="line-height: 50px;"
            ></v-ons-icon>
          </div>
          <span class="feed-back">{{formErrors.password}}</span>
        </div>
      </div>
      <div style="margin-top:50px;padding: 10px;">
        <button style="margin: 6px 0" :disabled="isSubmitDisabled" @click="submitHandle">确定</button>
      </div>
    </div>
    <div class="agreeContainer" v-show="noAgreed">
      <div style="margin-top: 100%">
        <svg class="progress-circular">
          <circle
            class="progress-circular__primary"
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke-width="10%"
            stroke-miterlimit="10"
          />
        </svg>
      </div>
    </div>

    <div
      style="position: fixed; top:15%;height: 85%;width: 100%;background-color: #fff;"
      v-show="noAgreed"
    >
      <div
        style="border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;background-color: rgba(232, 225, 225, 0.12);color:rgb(255, 112, 0)"
      >{{agreementTitle}}</div>
      <div
        style="overflow: auto; position: absolute; top:40px;bottom: 155px;width: 100%;-webkit-overflow-scrolling : touch;"
      >
        <iframe
          :src="agreementUrl"
          width="100%"
          height="100%"
          style="border:none"
          id="agreementFrame"
        ></iframe>
      </div>
      <div style="position: fixed; bottom: 0;width: 100%;">
        <div
          style="height: 110px;background-color: rgba(232, 225, 225, 0.12);color:rgb(255, 112, 0)"
        >
          <ul style="list-style-type: none; padding-top: 5px;">
            <li style="text-align: left;height: 25px;line-height: 24px;">客户姓名：{{name}}</li>
            <li style="text-align: left;height: 25px;line-height: 24px;">证件号码：{{idCode}}</li>
          </ul>
          <div style="text-align: left; padding-left: 20px;">
            <label class="left">
              <v-ons-checkbox :input-id="'agreement'" v-model="agreementVal"></v-ons-checkbox>
            </label>
            <label class="center" :for="'agreement'">已阅读该协议</label>
          </div>
        </div>
        <div style="display: flex; border-top: 1px solid #ccc;">
          <div
            style="width: 50%;height:45px; line-height: 45px;color: #666;font-size: 20px;"
            @click="handleNoAgree"
          >不同意</div>
          <div
            style="width: 50%;height:45px; line-height: 45px;background-color: #ff7000;color: #fff;font-size: 20px;"
            @click="handleAgree"
          >同意</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "../api";
import config from "../config";
export default {
  name: "Form",
  data() {
    return {
      title: "",
      activityId: null,
      username: "",
      password: "",
      isSubmitDisabled: true,
      formErrors: {
        username: "",
        password: ""
      },
      formValidity: {
        username: false,
        password: false
      },
      noAgreed: false,
      hasSubmitReq: false,
      agreementVal: false,
      name: "",
      idCode: "",
      agreementUrl: null,
      agreementTitle: null
    };
  },
  computed: {
    src: function() {
      return require("../assets/room.png");
    }
    //    agreementUrl: function () {
    //      let activityId = window.sessionStorage.getItem("activityId")
    //      let agreementUrl = config.preImgUrl + activityId + "/agreement.html?timestamp=" + new Date().getTime();
    //      return agreementUrl
    //    },
    //    agreementTitle: function () {
    //      if (window.document.getElementById('agreementFrame').title) {
    //        let agreementTitle = window.document.getElementById('agreementFrame').title
    //        return agreementTitle
    //      } else {
    //        return ''
    //      }
    //    }
  },
  methods: {
    handleChange(event) {
      let self = this;
      switch (event.target.name) {
        case "username":
          self.username = event.target.value;
          break;
        case "password":
          self.password = event.target.value;
          break;
      }
      this.validateField(event.target.name, event.target.value);
    },
    validateField(name, value) {
      const fieldValidationErrors = this.formErrors;
      const validity = this.formValidity;
      const isPassword = name === "password";
      //        const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      //        const mobileTest = /^1(3|4|5|7|8)\d{9}$/
      validity[name] = value.length > 0;
      const text = name === "username" ? "用户名" : "密码";
      fieldValidationErrors[name] = validity[name] ? "" : `请输入${text}`;
      if (validity[name]) {
        if (isPassword) {
          validity[name] = value.length >= 6;
          fieldValidationErrors[name] = validity[name] ? "" : `密码至少为6位`;
        }
        //          if (isEmail) {
        //            validity[name] = emailTest.test(value);
        //            fieldValidationErrors[name] = validity[name] ? '' : `${name} should be a valid email address`;
        //          }
      }
      this.formErrors = fieldValidationErrors;
      this.formValidity = validity;
      this.canSubmit();
    },
    canSubmit() {
      let self = this;
      const formValidity = this.$data.formValidity;
      if (formValidity.username && formValidity.password) {
        self.isSubmitDisabled = false;
      } else {
        self.isSubmitDisabled = true;
      }
    },
    submitHandle() {
      let self = this;
      if (this.$cookie.get("bindInfo")) {
        let bindInfo = this.$cookie.get("bindInfo");
        // console.log('bindInfo cookie', bindInfo)
        if (this.password == "") {
          API.toast(
            {
              type: "error",
              msg: `请填写密码 `
            },
            self
          );
        } else {
          this.isSubmitDisabled = true;
          this.hasSubmitReq = true;
          API.handleLogin(
            JSON.parse(bindInfo),
            self.activityId,
            self.username,
            self.password,
            data => {
              if (!data.errcode) {
                window.sessionStorage.setItem("name", data.name);
                self.$cookie.set("name", data.name);
                self.name = data.name;
                window.sessionStorage.setItem("idCode", data.idCode);
                self.$cookie.set("idCode", data.idCode);
                self.idCode = data.idCode;
                window.sessionStorage.setItem("mobile", data.mobile);
                self.$cookie.set("mobile", data.mobile);

                if (data.token) {
                  window.sessionStorage.setItem("token", data.token);
                  self.$cookie.set("token", data.token);
                  window.sessionStorage.setItem(
                    "userInfo",
                    JSON.stringify(data)
                  );
                  self.$cookie.set("userInfo", JSON.stringify(data));
                  window.sessionStorage.setItem("timeType", data.timeType);
                  self.$cookie.set("timeType", data.timeType);
                  window.sessionStorage.setItem("project", data.project); // 楼盘（车位）项目名称
                  self.$cookie.set("project", data.project);
                  window.sessionStorage.setItem("city", data.city); // 楼盘（车位）所在城市
                  self.$cookie.set("city", data.city);
                  window.sessionStorage.setItem("type", data.type); // 活动类型 0-房源 1-车位
                  self.$cookie.set("type", data.type);
                  window.sessionStorage.setItem("activityId", data.activityId);
                  self.$cookie.set("activityId", data.activityId);
                  window.sessionStorage.setItem("priceName", JSON.stringify(data.priceName))
                  
                  self.$router.replace("/home"); // 直接跳转到home页面
                } else {
                  window.sessionStorage.setItem("id", data.id);
                  self.$cookie.set("id", data.id);

                  self.noAgreed = true; // 弹出协议
                }
              } else {
                API.toast(
                  {
                    type: "error",
                    msg: `${data.errmsg}`
                  },
                  self
                );
              }
              self.isSubmitDisabled = false;
              self.hasSubmitReq = false;
            },
            error => {
              alert(error);
              self.isSubmitDisabled = false;
              self.hasSubmitReq = false;
            }
          );
        }
      } else {
        API.toast(
          {
            type: "error",
            msg: `页面停留超时,请关闭后从公众号菜单重新进入!`
          },
          self,
          () => {
            wx.ready(function() {
              wx.closeWindow();
            });
            self.isSubmitDisabled = false;
            self.hasSubmitReq = false;
          }
        );
        // alert('no bindInfo')
      }
    },
    clear(arg) {
      switch (arg) {
        case "username":
          this.username = "";
          break;
        case "password":
          this.password = "";
          break;
      }
      this.validateField(arg, this.$data[arg]);
    },
    handleAgree() {
      let self = this;
      if (this.agreementVal) {
        let bindInfo = this.$cookie.get("bindInfo");
        let activityId = window.sessionStorage.getItem("activityId");
        let id = window.sessionStorage.getItem("id");
        if (bindInfo) {
          API.handleBind(JSON.parse(bindInfo), activityId, id, data => {
            if (!data.errcode) {
              window.sessionStorage.setItem("token", data.token);
              self.$cookie.set("token", data.token);
              window.sessionStorage.setItem("userInfo", JSON.stringify(data));
              self.$cookie.set("userInfo", JSON.stringify(data));
              window.sessionStorage.setItem("timeType", data.timeType);
              self.$cookie.set("timeType", data.timeType);
              window.sessionStorage.setItem("project", data.project); // 楼盘（车位）项目名称
              self.$cookie.set("project", data.project);
              window.sessionStorage.setItem("city", data.city); // 楼盘（车位）所在城市
              self.$cookie.set("city", data.city);
              window.sessionStorage.setItem("type", data.type); // 活动类型 0-房源 1-车位
              self.$cookie.set("type", data.type);
              window.sessionStorage.setItem("activityId", data.activityId); // 活动id
              self.$cookie.set("activityId", data.activityId);
              window.sessionStorage.setItem("name", data.name); // 客户姓名
              self.$cookie.set("name", data.name);
              window.sessionStorage.setItem("idCode", data.idCode); // 客户身份证号码
              self.$cookie.set("idCode", data.idCode);
              window.sessionStorage.setItem("mobile", data.mobile); // 客户手机号
              self.$cookie.set("mobile", data.mobile);
              window.sessionStorage.setItem("priceName", JSON.stringify(data.priceName))  // 价格名称
              
              self.noAgreed = false;
              self.$router.replace("/home");
            } else {
              API.toast(
                {
                  type: "error",
                  msg: `${data.errmsg}`
                },
                self
              );
            }
          });
        } else {
          API.toast(
            {
              type: "error",
              msg: `页面停留超时,请关闭后从公众号菜单重新进入!`
            },
            self,
            () => {
              wx.ready(function() {
                wx.closeWindow();
              });
            }
          );
        }
      } else {
        API.toast(
          {
            type: "error",
            msg: "请保证您已阅读完协议"
          },
          self
        );
      }
    },
    handleNoAgree() {
      wx.ready(function() {
        wx.closeWindow();
      });
    },
    getActivityIdFromUrl(url) {
      if (url.indexOf("?") >= 0) {
        let arr1 = url.split("?");
        let str1 = arr1[1];
        let arr2 = str1.split("#");
        return arr2;
      } else {
        return false;
      }
    },
    getSDKConfig() {
      if (this.getActivityIdFromUrl(window.location.href)) {
        // let activityId = (JSON.parse(this.$cookie.get('bindInfo'))).activityId
        let activityId = this.getActivityIdFromUrl(
          window.location.href
        )[0].split("=")[1];
        this.activityId = activityId;
        let _this = this;
        window.sessionStorage.setItem("activityId", activityId);
        API.handleGetSDKConfig(activityId, data => {
          _this.title = data.title;
          wx.config(data.config);
          wx.ready(function() {
            wx.hideAllNonBaseMenuItem();
          });
        });
      }
    }
  },
  created() {
    this.getSDKConfig();
  },
  mounted() {
    let self = this;
    let activityId = window.sessionStorage.getItem("activityId");
    self.agreementUrl =
      config.preImgUrl +
      activityId +
      "/agreement.html?timestamp=" +
      new Date().getTime();
    window.addEventListener("load", function() {
      //      console.log('run hereree  hello')
      setTimeout(function() {
        let agreementTitle = window.document.getElementById("agreementFrame")
          .contentWindow.document.title;
        if (agreementTitle) {
          self.agreementTitle = agreementTitle;
        }
      }, 1000);
    });
  }
};
</script>
<style>
input {
  border: none;
  height: 50px;
  font-size: 18px;
  border: none;
  text-indent: 10px;
  display: inline-block;
  width: 80%;
}

button {
  height: 50px;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  background-color: #ff7000;
  color: #fff;
  font-weight: bold;
  outline: none;
  border: none;
}

button[disabled] {
  background-color: #eac6c6;
}

.feed-back {
  height: 25px;
  width: 100%;
  text-align: left;
  margin-left: 5%;
  position: relative;
  font-size: 12px;
  color: #e50000;
  top: 0px;
  display: inline-block;
}

.hp-icon {
  color: #bbb;
  height: 50px;
  width: 50px;
}

.hp-icon-container {
  background-color: #fff;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ccc;
}

.hb-container {
  width: 100%;
  padding: 0;
}

.agreeContainer {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(100, 100, 100, 0.5);
}
</style>
