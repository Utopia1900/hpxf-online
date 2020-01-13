<template>
  <div>
    <title>购买成功</title>
    <v-ons-page>
      <custom-toolbar v-bind="buyInfo.toolbarInfo"></custom-toolbar>
      <v-ons-card>
        <div class="title" style="padding: 6px;">
          <img src="../assets/success.png" style="height: 25px; width: 25px;">
          <span>{{buyInfo.title}}</span>
          <div style="padding-left: 20px;padding-top: 8px; font-size: 15px;">{{buyInfo.roomStr}}</div>
        </div>
        <div
          v-if="buyInfo.type=='test'"
          style="color: #ff7000;font-size: 14px; padding-left: 20px;"
        >公测不能作为正式凭证，请准时参加正式活动</div>
        <div
          v-if="buyInfo.type=='formal' && buyInfo.signDesc"
          style="color: #51c160;font-size: 14px; padding: 8px;"
        >{{buyInfo.signDesc}}</div>
        <div class="content">
          <ul style="margin-top: 20px;padding: 0">
            <li v-if="buyInfo.type=='formal'" @click="goToOrderDetail">
              <v-ons-button
                modifier="large"
                style="margin: 6px 0;background-color: #ff7000; color: #ffffff"
              >订单详情</v-ons-button>
            </li>
            <li @click="backToRooms">
              <v-ons-button
                v-if="buyInfo.type=='formal'"
                modifier="large"
                style="margin: 6px 0;background-color: #f2f2f2; color: #454545"
              >
                <span v-if="activityType==0">返回房源列表</span>
                <span v-else-if="activityType==1">返回车位列表</span>
              </v-ons-button>
              <div v-else>
                <div v-if="activityType==0">
                  <v-ons-icon icon="my-icon-building"></v-ons-icon>&nbsp;&nbsp;房源列表
                </div>
                <div v-else-if="activityType==1">
                  <v-ons-icon icon="my-icon-parking"></v-ons-icon>&nbsp;&nbsp;车位列表
                </div>
              </div>
            </li>
            <li @click="backToMyFavorites">
              <v-ons-button
                v-if="buyInfo.type=='formal'"
                modifier="large"
                style="margin: 6px 0;background-color: #f2f2f2; color: #454545"
              >返回我的收藏</v-ons-button>
              <div v-else>
                <v-ons-icon icon="my-icon-shoucangjia"></v-ons-icon>&nbsp;&nbsp;我的收藏
              </div>
            </li>
          </ul>
        </div>
      </v-ons-card>
    </v-ons-page>
  </div>
</template>
<script>
import OrderDetail from "./OrderDetail";
import API from "../api";
export default {
  name: "BuySuccess",
  data() {
    return {
      activityType: window.sessionStorage.getItem("type"),
      restInterval: null
    };
  },
  computed: {
    buyInfo: function() {
      return this.$store.state.buyInfo.items;
    }
  },
  methods: {
    backToRooms() {
      this.$router.replace("/navigator");
      this.$store.commit("tabbar/set", 0);
    },
    backToMyFavorites() {
      this.$router.replace("/navigator");
      this.$store.commit("tabbar/set", 1);
    },
    goToOrderDetail() {
      let self = this;
      let order = self.buyInfo.order;
      this.$store.commit("orderDetail/set", order);
      this.$router.replace("/orderDetail");
    }
  },
  created() {
    let self = this;
    API.initSessionData(self)
    if (this.restInterval) {
      window.clearInterval(this.restInterval);
      this.restInterval = null;
    }
    let token = window.sessionStorage.getItem("token");
    let activityId = window.sessionStorage.getItem('activityId')

    if(activityId) {
      API.handleGetSDKConfig(activityId, data => {
        wx.config(data.config);
        wx.ready(function() {
          wx.hideAllNonBaseMenuItem();
        });
      });
    }

    let restInterval = window.setInterval(function() {
      API.handleRestTime(token, function(data) {
        if (!data.errcode) {
        } else {
          if (data.errcode == 1000 || data.errcode == 3) {
            self.$store.commit("activity/close", data.errmsg);
            window.setTimeout(function() {
              wx.ready(function() {
                wx.closeWindow();
              });
            }, 800);
          }
        }
      });
    }, API.times);
    this.restInterval = restInterval;
  },
  destroyed() {
    if (this.restInterval) {
      window.clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }
};
</script>
<style scope>
ul li {
  list-style-type: none;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
