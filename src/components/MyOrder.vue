<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        <div class="left" style="width: 150px;">
          <span>
            <span class="list-item__title" style="font-weight: bold;font-size: 18px;">{{name}}</span>
          </span>
        </div>
        <div class="right" style="display: flex;text-align: center;">
          <div style="display: flex;flex-direction: column;margin-right:15px;" @click="goHome">
            <v-ons-icon icon="my-icon-home"></v-ons-icon>
            <span>首页</span>
          </div>
          <div
            style="display: flex;flex-direction: column;margin-right:15px;"
            @click="showUpdatePwdDialog"
          >
            <v-ons-icon icon="my-icon-user"></v-ons-icon>
            <span>修改密码</span>
          </div>
          <div style="display: flex;flex-direction: column" @click="showAlertDialog">
            <v-ons-icon icon="my-icon-exit"></v-ons-icon>
            <span>退出</span>
          </div>
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center">
          <span class="list-item__subtitle" style="text-indent: 15px;">证件号码：{{idCode}}</span>
          <span class="list-item__subtitle" style="text-indent: 15px;">手机号码：{{mobile}}</span>
        </div>
      </v-ons-list-item>
      <v-ons-list-item v-if="saler">
        <span style="width: 100px;">置业顾问：</span>
        <span style="opacity: .75;">{{saler}}</span>
      </v-ons-list-item>
    </v-ons-list>
    <div style="margin-top: 15px;" v-if="hasOrder">
      <v-ons-card
        v-for="(item, index) in orderList"
        :key="index"
        style="padding: 0"
        @click="goToOrderDetail(item)"
      >
        <div
          v-if="item.uNo"
          class="title"
          style="height: 70px;background-color: #ffffff; padding: 10px; border-top:25px solid #7fe27f; border-top-left-radius: 6px;border-top-right-radius: 6px;"
        >
          {{item.bNo}}号楼&nbsp;-&nbsp;{{item.uNo}}单元&nbsp;-&nbsp;{{item.rNo}}
          <div
            style="font-size: 14px;margin-top: 10px;padding-left: 20px;color: #333333;text-align: right"
          >选择时间：{{formatDate(item.bTime)}}</div>
        </div>
        <div
          v-else
          class="title"
          style="height: 70px;background-color: #ffffff; padding: 10px; border-top:25px solid #7fe27f; border-top-left-radius: 6px;border-top-right-radius: 6px;"
        >
          {{item.bNo}}&nbsp;-&nbsp;{{item.rNo}}
          <div
            style="font-size: 14px;margin-top: 10px;padding-left: 20px;color: #333333;text-align: right"
          >选择时间：{{formatDate(item.bTime)}}</div>
        </div>
        <div class="content" style="border-top: 1px solid #ccc; margin-top: 50px;">
          <div style="text-align: center; color:#787878; padding: 8px;">查看订单详情</div>
        </div>
      </v-ons-card>
    </div>
    <div v-else class="no-order-pic">
      <img :src="noOrderPng" alt style="width: 100px;">
      <div style="text-align: center;padding: 40px; color:#454545;">{{orderDesc}}</div>
    </div>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'提示'"
      :footer="{
                          '取消': cancel,
                          '确定退出': loginOut
                        }"
      :visible.sync="alertDialogVisible"
    >您确定要注销并退出吗?</v-ons-alert-dialog>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'修改密码'"
      :footer="{
                          '取消': cancelUpdatePwd,
                          '确定修改': handleUpdatePwd
                        }"
      :visible.sync="updatePwdDialog"
    >
      <input
        type="password"
        placeholder="请输入新密码"
        style="width:100%;height:40px;font-size:18px;border:1px solid #ccc;"
        v-model="newPwd"
      >
    </v-ons-alert-dialog>
  </v-ons-page>
</template>
<script>
import API from "../api";
import "../utils/dateFormat";
import noOrderPng from "../assets/noOrder.png";

export default {
  name: "MyOrder",
  data() {
    return {
      noOrderPng: noOrderPng,
      alertDialogVisible: false,
      updatePwdDialog: false,
      newPwd: ""
    };
  },
  computed: {
    name: function() {
      return window.sessionStorage.getItem("name");
    },
    idCode: function() {
      return window.sessionStorage.getItem("idCode");
    },
    mobile: function() {
      return window.sessionStorage.getItem("mobile");
    },
    saler: function() {
      return window.sessionStorage.getItem("saler");
    },
    orderList: function() {
      return this.$store.state.order.orderList;
    },
    hasOrder: function() {
      let timeType = window.sessionStorage.getItem("timeType");
      return this.$store.state.order.hasOrder && timeType == 1;
    },
    orderDesc: function() {
      let timeType = window.sessionStorage.getItem("timeType");
      if (timeType == 1) {
        return "暂无订单";
      } else if (timeType == 0) {
        return "您好, 公测期间不会产生订单, 敬请准时参加正式活动！";
      } else {
        return "暂无订单";
      }
    }
  },
  methods: {
    showAlertDialog() {
      this.alertDialogVisible = true;
    },
    loginOut() {
      let self = this;
      let token = window.sessionStorage.getItem("token");
      if (token) {
        API.handleLogout(token, data => {
          if (!data.errcode) {
            self.alertDialogVisible = false;
            API.toast(
              {
                type: "success",
                msg: `注销成功`,
                period: 500
              },
              self,
              () => {
                // wx.ready(function () {
                // wx.closeWindow()
                // })
                // this.$router.replace(`/`);
                let loginUrl = '/?activityId=' + window.sessionStorage.getItem('activityId') + '#/'
                window.location.href = loginUrl
                window.sessionStorage.clear();
              }
            );
          } else {
            if (data.errcode == 1000 || data.errcode == 3) {
              self.$store.commit("activity/close", data.errmsg);
              window.setTimeout(function() {
                wx.ready(function() {
                  wx.closeWindow();
                });
              }, 800);
            } else {
              API.toast(
                {
                  type: "error",
                  msg: `${data.errmsg}`
                },
                self
              );
            }
          }
        });
      }
    },
    goToOrderDetail(order) {
      this.$cookie.set('orderDetail', JSON.stringify(order))
      this.$store.commit("orderDetail/set", order);
      this.$router.push("/orderDetail");
    },
    goHome() {
      this.$router.replace("/home");
    },
    cancel() {
      this.alertDialogVisible = false;
    },
    showUpdatePwdDialog() {
      this.updatePwdDialog = true;
    },
    cancelUpdatePwd() {
      this.updatePwdDialog = false;
    },
    handleUpdatePwd() {
      let self = this;
      let token = window.sessionStorage.getItem("token");
      let newPwd = this.trim(this.newPwd);
      if (newPwd != "") {
        API.handleUpdatePwd(token, newPwd, data => {
          if (!data.errcode) {
            self.updatePwdDialog = false;
            API.toast(
              {
                type: "success",
                msg: `修改成功`,
                period: 500
              },
              self,
              () => {
                // self.$store.commit("navigator/clear");
                window.sessionStorage.clear();
                // wx.ready(function () {
                // wx.closeWindow()
                // })
                this.$router.replace("/");
              }
            );
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
        alert("请输入新密码");
      }
    },
    trim(str) {
      //删除左右两端的空格
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    formatDate(date) {
      let parseDate = Date.parse(date);
      let reqDate = new Date(parseDate).FormatDate("yyyy-MM-dd hh:mm:ss");
      return reqDate;
    },
    formatMoney(s, n) {
      return API.formatMoney(s, n);
    }
  }
};
</script>
<style>
.no-order-pic {
  width: 100%;
  margin: 15px auto;
  background-color: #fff;
  height: 100%;
  padding-top: 80px;
}
</style>
