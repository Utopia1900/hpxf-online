<template>
  <v-ons-page>
    <v-ons-toolbar class="custom-toolbar">
      <div class="center" style="color: #ff7000;">
        <slot>订单详情</slot>
      </div>
      <div class="right" @click="backToOrder">
        <v-ons-toolbar-button icon="my-icon-order" style="font-size: 16px;">返回</v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div>
      <v-ons-card v-bind="order" style="padding: 5px 0 0 0;background-color: #7fe27f;color:#fff;">
        <div style="text-indent: 10px;">
          <span>[{{city}}]&nbsp;{{project}}</span>
        </div>
        <div class="title" style="color:#fff;padding: 10px;" v-if="order.uNo">
          {{order.bNo}}号楼-{{order.uNo}}单元-{{order.rNo}}
          <div style="font-size: 14px;margin-top: 20px;color: #fdfbff;">
            <span v-if="order.fPrice">{{priceName['fPrice']}}：￥ {{formatMoney(order.fPrice, 0)}} 元</span><br/>
            <span v-if="order.fuPrice">{{priceName['fuPrice']}}：{{order.fuPrice}} 元/㎡</span>
          </div>
          <div style="font-size: 14px;color: #fdfbff;">
            <span v-if="order.suPrice">{{priceName['suPrice']}}：{{order.suPrice}} 元/㎡</span><br/>
            <span v-if="order.duPrice">{{priceName['duPrice']}}：{{order.duPrice}} 元/㎡</span>
          </div>
        </div>
        <div class="title" style="background-color: #7fe27f; color:#fff;padding: 10px;" v-else>
          {{order.bNo}}-{{order.rNo}}
          <div style="font-size: 14px;margin-top: 20px;color: #fdfbff;">
            <span v-if="order.fPrice">{{priceName['fPrice']}}：￥ {{formatMoney(order.fPrice, 0)}} 元 |</span><br/>
            <span v-if="order.fuPrice">{{priceName['fuPrice']}}：{{order.fuPrice}} 元/㎡</span>
          </div>
          <div style="font-size: 14px;color: #fdfbff;">
            <span v-if="order.suPrice">{{priceName['suPrice']}}：{{order.suPrice}} 元/㎡</span><br/>
            <span v-if="order.duPrice">{{priceName['duPrice']}}：{{order.duPrice}} 元/㎡</span>
          </div>
        </div>
        <div style="padding: 12px;background-color:#fff;color:#000;">{{order.signDesc}}</div>
        <div class="content">
          <v-ons-list>
            <!--<v-ons-list-item>
              <span style="width: 100px;">
                订单号：
              </span>
              <span style="opacity: .75;">
                。。。。。
              </span>
            </v-ons-list-item>-->
            <v-ons-list-item v-if="order.area">
              <span style="width: 100px;">房源面积：</span>
              <span style="opacity: .75;">{{order.area}} ㎡</span>
            </v-ons-list-item>
            <v-ons-list-item>
              <span style="width: 100px;">选择时间：</span>
              <span style="opacity: .75">{{formatDate(order.bTime)}}</span>
            </v-ons-list-item>
          </v-ons-list>
        </div>
        <div
          style="padding: 12px;background-color:#fff;color:#000;"
          v-if="order.roomDesc"
        >描述：{{order.roomDesc}}</div>
      </v-ons-card>
    </div>
  </v-ons-page>
</template>
<script>
import API from "../api";
import "../utils/dateFormat";
export default {
  name: "OrderDetail",
  data() {
    return {
      restInterval: null
    };
  },
  computed: {
    project: function() {
      let project = window.sessionStorage.getItem("project");
      return project ? project : "default_project";
    },
    city: function() {
      let city = window.sessionStorage.getItem("city");
      return city ? city : "default_city";
    },
    order: function() {
      return this.$store.state.orderDetail.items;
    },
    priceName: function() {
      return JSON.parse(window.sessionStorage.getItem("priceName"));
    }
  },
  methods: {
    formatDate(date) {
      let parseDate = Date.parse(date);
      let reqDate = new Date(parseDate).FormatDate("yyyy-MM-dd hh:mm:ss");
      return reqDate;
    },
    formatMoney(s, n) {
      return API.formatMoney(s, n);
    },
    backToOrder() {
      this.$router.replace("/navigator");
      this.$store.commit("tabbar/set", 2);
    }
  },
  created() {
    let self = this;
    // API.initSessionData(self)
    if (!this.$store.state.orderDetail.items) {
      if (this.$cookie.get("orderDetail")) {
        this.$store.commit(
          "orderDetail/set",
          JSON.parse(this.$cookie.get("orderDetail"))
        );
      }
    }
    let token = window.sessionStorage.getItem("token");
    if (!token) {
      this.backToOrder();
      return;
    }

    let activityId = window.sessionStorage.getItem("activityId");
    if (activityId) {
      API.handleGetSDKConfig(activityId, data => {
        wx.config(data.config);
        wx.ready(function() {
          wx.hideAllNonBaseMenuItem();
        });
      });
    }

    if (this.restInterval) {
      window.clearInterval(this.restInterval);
      this.restInterval = null;
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