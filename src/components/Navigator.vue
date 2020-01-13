<template>
  <div>
    <title>{{project}}</title>
    <v-ons-page class="page-maintabs">
      <custom-toolbar>
        <span class="countdown-cover">
          <span :class="{formal:timeTypeVal=='正式', test:timeTypeVal=='公测'}">{{timeTypeVal}}</span>
          <span style="color: #252020;padding-left: 40px;display: inline-block" v-if="countDownShow">
            还有
          {{countDownVal}} 开始 &nbsp;{{timeTypeVal}}</span>
          <span v-else style="color: #252020;padding-left: 80px;display: inline-block">进行中</span>
          <!--<span-->
            <!--style="color: #252020;display: inline-block; width: 40px;height: 40px;float:right"-->
            <!--@click="getRestAndCountdown"-->
            <!--v-show="showRefreshBtn"-->
          <!--&gt;-->
            <!--<v-ons-icon icon="my-icon-shuaxin" style="font-size: 25px;"></v-ons-icon>-->
          <!--</span>-->
        </span>
        <span>{{ title }}</span>
      </custom-toolbar>
      <v-ons-tabbar
        position="bottom"
        :tabs="tabs"
        :visible="true"
        :index.sync="activeIndex"
        v-on:postchange="changeTab"
      ></v-ons-tabbar>
    </v-ons-page>
  </div>
</template>

<script>
import RoomLists from "./RoomLists";
import MyFavorites from "./MyFavorites";
import MyOrder from "./MyOrder";
import API from "../api";
export default {
  name: "Navigator",
  data() {
    return {
      countDownInterval: null,
      showRefreshBtn: false,
      roomsInterval: null,
      favoriteInterval: null,
      orderInterval: null
    };
  },
  computed: {
    tabs() {
      let type = window.sessionStorage.getItem("type");
      var tabs;
      if (type == 0) {
        tabs = [
          {
            icon: "my-icon-building",
            label: "房源列表",
            page: RoomLists
          },
          {
            icon: "my-icon-shoucangjia",
            label: "我的收藏",
            page: MyFavorites
          },
          {
            icon: "my-icon-order",
            label: "我的订单",
            page: MyOrder
          }
        ];
      }
      if (type == 1) {
        tabs = [
          {
            icon: "my-icon-parking",
            label: "车位列表",
            page: RoomLists
          },
          {
            icon: "my-icon-shoucangjia",
            label: "我的收藏",
            page: MyFavorites
          },
          {
            icon: "my-icon-order",
            label: "我的订单",
            page: MyOrder
          }
        ];
      }
      return tabs;
    },
    activeIndex: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        // console.log("in set activeIndex", newValue);
        this.$store.commit("tabbar/set", newValue);
      }
    },
    title() {
      return this.tabs[this.activeIndex].label;
    },
    project: function() {
      let project = window.sessionStorage.getItem("project");
      return project ? project : "default_project";
    },

    countDownVal: function() {
      return API.countDown(this.$store.state.countDown.second);
    },
    countDownShow: function() {
      return this.$store.state.countDown.second <= 0 ? false : true;
    },
    timeTypeVal: function() {
      return this.$store.state.countDown.timeTypeVal;
    }
  },
  methods: {
    errorFuc(data, self) {
      // 调用接口返回1000或3时的错误处理
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
    },
    changeTab(e) {
      // 切换底部导航时调用
      let lastActiveIndex = e.lastActiveIndex;
      switch (lastActiveIndex) {
        case 0:
          if (this.roomsInterval) {
            window.clearInterval(this.roomsInterval);
            this.roomsInterval = null;
          }
          break;
        case 1:
          if (this.favoriteInterval) {
            window.clearInterval(this.favoriteInterval);
            this.favoriteInterval = null;
          }
          break;
        case 2:
          if (this.orderInterval) {
            window.clearInterval(this.orderInterval);
            this.orderInterval = null;
          }
          break;
      }

      switch (e.activeIndex) {
        case 0:
          this.openRoomsInterval();
          break;
        case 1:
          this.openFavoriteInterval();
          break;
        case 2:
          this.openOrderInterval();
          break;
      }
    },
    getBuildings() {
      // 获取楼栋信息
      let _this = this;
      if (this.$store.state.rooms.building) {
        // do nothing
      } else {
        let token = window.sessionStorage.getItem("token");
        API.getBuildings(token, data => {
          if (!data.errcode) {
            _this.$store.commit("rooms/setBuilding", data);
          } else {
            _this.errorFuc(data, _this);
          }
        });
      }
    },
    queryRooms() {
      let _this = this;
      this.$store.dispatch("rooms/queryRooms", {}).then(data => {
        if (data !== undefined) {
          if (data.errcode == 1000 || data.errcode == 3) {
            _this.$store.commit("activity/close", data.errmsg);
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
              _this
            );
          }
        }
      });
    },
    async openRoomsInterval() {
      if (!this.$store.state.rooms.building) {
        await API.sleep(500);
      }
      this.queryRooms();
      let _this = this;
      let roomsInterval = window.setInterval(() => {
        _this.queryRooms();
      }, API.times);
      _this.roomsInterval = roomsInterval;
    },
    queryMyFavorites() {
      let _this = this;
      let token = window.sessionStorage.getItem("token");
      if (token) {
        API.handleQueryFavorites(token, data => {
          if (!data.errcode) {
            if (data.length != 0) {
              _this.$store.commit("favorite/set", {
                favoritesLists: data,
                hasFavorite: true
              });
            } else {
              _this.$store.commit("favorite/set", {
                favoritesLists: [],
                hasFavorite: false
              });
            }
          } else {
            _this.errorFuc(data, _this);
          }
        });
      }
    },
    openFavoriteInterval() {
      this.queryMyFavorites();
      if (this.favoriteInterval) {
        window.clearInterval(this.favoriteInterval);
        this.favoriteInterval = null;
      }
      let _this = this;
      let favoriteInterval = window.setInterval(() => {
        // 查询收藏信息的定时器
        _this.queryMyFavorites();
      }, API.times);
      _this.favoriteInterval = favoriteInterval;
    },
    queryOrder() {
      let _this = this;
      let token = window.sessionStorage.getItem("token");
      if (token) {
        API.handleQueryOrder(token, function(data) {
          if (!data.errcode) {
            if (data.length != 0) {
              _this.$store.commit("order/query", {
                orderList: data,
                hasOrder: true
              });
            } else {
              _this.$store.commit("order/query", {
                orderList: data,
                hasOrder: false
              });
            }
          } else {
            _this.errorFuc(data, _this);
          }
        });
      }
    },
    openOrderInterval() {
      this.queryOrder();
      if (this.orderInterval) {
        window.clearInterval(this.orderInterval);
        this.orderInterval = null;
      }
      let _this = this;
      let token = window.sessionStorage.getItem("token");
      let orderInterval = window.setInterval(() => {
        // 查询剩余时间的定时器
        API.handleRestTime(token, function(data) {
          if (!data.errcode) {
          } else {
            _this.errorFuc(data, _this);
          }
        });
      }, API.times);
      _this.orderInterval = orderInterval;
    },
    getSDKConfig(activityId) {
      API.handleGetSDKConfig(activityId, data => {
        wx.config(data.config);
        wx.ready(function() {
          wx.hideAllNonBaseMenuItem();
        });
      });
    },
    checkToken() {
      let _this = this
      let activityId = window.sessionStorage.getItem('activityId')
      API.initSessionData(_this)
      this.getSDKConfig(activityId);
    }
  },
  created() {
    this.checkToken();
     /*window.sessionStorage.setItem("activityId", 21)
     window.sessionStorage.setItem("type", 0);
     window.sessionStorage.setItem("project", "测试翡翠新城"); // 存储楼盘（车位）项目名称
     window.sessionStorage.setItem("city", "武汉"); // 存储楼盘（车位）所在城市
     window.sessionStorage.setItem("timeType", 1)
     window.sessionStorage.setItem(
     "userInfo",
     '{"name":"测试2","mobile":"13476175050","idCode":"421001199310155678","saler":"章三"}'
     );
     window.sessionStorage.setItem(
     "token",
       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOjMsImFjdGl2aXR5SWQiOiIyNCIsInJvbGUiOjMsImlhdCI6MTU0NzIwMDg0MCwiZXhwIjoxNTQ3MjA4MDQwfQ.tVpwvdA1mmY_Dr-Q6K700P56bSgwQ4KAsSi3_xTn8qw"
     );*/
  },
  mounted() {
    this.getBuildings();
    if (this.activeIndex == 0) {
      this.openRoomsInterval();
    }
    if (this.activeIndex == 1) {
      this.openFavoriteInterval();
    }
    if (this.activeIndex == 2) {
      this.openOrderInterval();
    }
  },
  destroyed() {
    if (this.roomsInterval) {
      window.clearInterval(this.roomsInterval);
      this.roomsInterval = null;
    }
    if (this.favoriteInterval) {
      window.clearInterval(this.favoriteInterval);
      this.favoriteInterval = null;
    }
    if (this.orderInterval) {
      window.clearInterval(this.orderInterval);
      this.orderInterval = null;
    }
    if(this.countDownInterval) {
      window.clearInterval(this.countDownInterval);
      this.countDownInterval = null;
    }
  }
};
</script>
<style>
.countdown-cover {
  background-color: rgba(220, 216, 211, 0.98);
  color: rgb(255, 255, 255);
  padding: 5px;
  position: fixed;
  left: 0;
  top: 0;
  height: 33px;
  width: 100%;
  line-height: 30px;
  text-align: left;
  font-size: 14px;
}
.test {
  background-color: #ff7000;
  padding: 5px;
  font-size: 16px;
}
.formal {
  background-color: #7fe27f;
  padding: 5px;
  font-size: 16px;
}
</style>
