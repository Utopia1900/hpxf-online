<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    <div>
      <img :src="typeImg" alt="户型图" style="width: 100%" v-show="typeImg" />
    </div>
    <div style="display: flex; flex-direction: row; height: 60px;background-color: #fff;">
      <div style="flex: 1; border-right: 1px solid #dddddd;" @click="goToRoomLists" v-if="type==0">
        <span style="display: flex; flex-direction: column; padding-top: 8px;">
          <v-ons-icon icon="my-icon-building" style="font-size: 24px;"></v-ons-icon>
          <span style="display:inline-block; height: 25px;line-height: 25px;">房源列表</span>
        </span>
      </div>
      <div
        style="flex: 1; border-right: 1px solid #dddddd;"
        @click="goToRoomLists"
        v-else-if="type==1"
      >
        <span style="display: flex; flex-direction: column; padding-top: 8px;">
          <v-ons-icon icon="my-icon-parking" style="font-size: 24px;"></v-ons-icon>
          <span style="display:inline-block; height: 25px;line-height: 25px;">车位列表</span>
        </span>
      </div>

      <div style="flex: 1; border-right: 1px solid #dddddd;" @click="goToMyFavorites">
        <span style="display: flex; flex-direction: column; padding-top: 8px;">
          <v-ons-icon icon="my-icon-shoucangjia" style="font-size: 24px;"></v-ons-icon>
          <span style="display:inline-block; height: 25px;line-height: 25px;">我的收藏</span>
        </span>
      </div>
      <div style="flex: 1; border-right: 1px solid #dddddd;">
        <span
          v-if="roomInfo.beSaved"
          style="color: #ff7000; display: flex; flex-direction: column; padding-top: 8px;"
        >
          <v-ons-icon
            icon="my-icon-heart"
            style="font-size: 24px;"
            @click="delFromFavorites(roomInfo.id)"
          ></v-ons-icon>
        </span>
        <span
          v-else-if="(!roomInfo.beSaved) && roomInfo.savedNum !='0' "
          style="display: flex; flex-direction: column; padding-top: 8px;"
        >
          <v-ons-icon
            icon="my-icon-heart"
            @click="saveToFavorites(roomInfo.id)"
            style="font-size: 24px;"
          ></v-ons-icon>
        </span>
        <span
          v-else-if="(!roomInfo.beSaved) && roomInfo.savedNum =='0'"
          style="display: flex; flex-direction: column; padding-top: 8px;"
        >
          <v-ons-icon
            icon="my-icon-heart"
            style="font-size: 24px;"
            @click="saveToFavorites(roomInfo.id)"
          ></v-ons-icon>
        </span>
        <span
          style="display:inline-block; height: 25px;line-height: 25px;"
        >{{roomInfo.savedNum === '0' ? '收藏': roomInfo.savedNum}}</span>
      </div>
      <div style="flex: 1" @click="refreshRoomDetail">
        <span style="display: flex; flex-direction: column; padding-top: 8px;">
          <v-ons-icon icon="my-icon-shuaxin" style="font-size: 24px;"></v-ons-icon>
          <span style="display:inline-block; height: 25px;line-height: 25px;">刷新</span>
        </span>
      </div>
    </div>
    <div style="margin-top:5px;margin-bottom: 135px;">
      <v-ons-list>
        <v-ons-list-item>
          <span>
            <span v-if="roomInfo.uNo">{{roomInfo.bNo}}栋-{{roomInfo.uNo}}单元-{{roomInfo.rNo}}</span>
            <span v-else>{{roomInfo.bNo}}-{{roomInfo.rNo}}</span>
          </span>
        </v-ons-list-item>
        <v-ons-list-item>
          <span style="font-size: 24px; color: #ff7000">￥ {{formatMoney(roomInfo.fPrice, 0)}} 元</span>
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.type">
          <span class="label">类型：</span>
          {{roomInfo.type}}
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.area">
          <span class="label">建筑面积：</span>
          {{roomInfo.area}} ㎡
        </v-ons-list-item>

        <v-ons-list-item v-show="roomInfo.suPrice">
          <span class="label">{{priceName['suPrice']}}:</span>
          {{roomInfo.suPrice}} 元/㎡
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.sPrice">
          <span class="label">{{priceName['sPrice']}}:</span>
          ￥{{formatMoney(roomInfo.sPrice, 0)}} 元
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.duPrice">
          <span class="label">{{priceName['duPrice']}}:</span>
          {{roomInfo.duPrice}} 元/㎡
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.dPrice">
          <span class="label">{{priceName['dPrice']}}:</span>
          ￥{{formatMoney(roomInfo.dPrice, 0)}} 元
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.fuPrice">
          <span class="label">{{priceName['fuPrice']}}:</span>
          {{roomInfo.fuPrice}} 元/㎡
        </v-ons-list-item>
        <v-ons-list-item v-show="roomInfo.fPrice">
          <span class="label">{{priceName['fPrice']}}:</span>
          ￥{{formatMoney(roomInfo.fPrice, 0)}} 元
        </v-ons-list-item>
      </v-ons-list>
      <div style="position: fixed; bottom: 0; width: 100%">
        <v-ons-button modifier="large" disabled="true" v-show="countDownShow">
          还有
          {{countDownVal}} 开始 &nbsp;{{timeTypeVal}}
        </v-ons-button>
        <div v-show="!countDownShow">
          <v-ons-button modifier="large" disabled="true" class="buyBtn" v-if="roomInfo.status===2">
            <span v-if="type==0">房源已选</span>
            <span v-else-if="type==1">车位已选</span>
          </v-ons-button>
          <v-ons-button
            modifier="large"
            @click="buyRoom(roomInfo.id)"
            style="background-color: #ff7000;"
            class="buyBtn"
            v-else-if="quickBuy"
          >点击抢购</v-ons-button>
          <v-ons-button
            modifier="large"
            @click="showMakeSureDialog"
            style="background-color: #ff7000;"
            class="buyBtn"
            v-else
          >立即选择</v-ons-button>
        </div>
      </div>

      <div class="agreeContainer" v-show="showMakeSure"></div>
      <div
        style="position: fixed; bottom: 0;height: auto;width: 100%;background-color: #fff; "
        class="makeSure"
        v-show="showMakeSure"
      >
        <div style="border-bottom: 1px solid #e2e2e2; height: 40px;line-height: 40px;">
          <div style="width: 70%; float: left;text-align: center;margin-left: 15%">确认订单</div>
          <div style="width: 15%; float: right;text-align: center" @click="hideMakeSureDialog">
            <v-ons-icon icon="my-icon-close" style="line-height: 40px;font-size: 20px;"></v-ons-icon>
          </div>
        </div>
        <div>
          <div style="text-indent: 15px;text-align: left;color: #686868;">【{{city}}】{{project}}</div>
          <h4 style="text-align: left; text-indent: 15px;">
            <span>
              <span v-if="roomInfo.uNo">{{roomInfo.bNo}}栋-{{roomInfo.uNo}}单元-{{roomInfo.rNo}}</span>
              <span v-else>{{roomInfo.bNo}}-{{roomInfo.rNo}}</span>
              &nbsp;&nbsp;&nbsp;
              <span
                style="color:#ff7000"
              >￥{{formatMoney(roomInfo.fPrice, 0)}} 元</span>
            </span>
          </h4>
          <ul class="subDetail">
            <li style="text-align: left;" v-if="roomInfo.type">
              <span class="label">类型：</span>
              {{roomInfo.type}}
            </li>
            <li style="text-align: left;" v-if="roomInfo.area">
              <span class="label">建筑面积：</span>
              {{roomInfo.area}} ㎡
            </li>
            <li style="text-align: left;" v-if="roomInfo.suPrice">
              <span class="label">{{priceName['suPrice']}}:</span>
              {{roomInfo.suPrice}} 元/㎡
            </li>
            <li style="text-align: left;" v-if="roomInfo.sPrice">
              <span class="label">{{priceName['sPrice']}}:</span>
              {{formatMoney(roomInfo.sPrice, 0)}} 元
            </li>
            <li style="text-align: left;" v-if="roomInfo.duPrice">
              <span class="label">{{priceName['duPrice']}}:</span>
              {{roomInfo.duPrice}} 元/㎡
            </li>
            <li style="text-align: left;" v-if="roomInfo.dPrice">
              <span class="label">{{priceName['dPrice']}}:</span>
              {{formatMoney(roomInfo.dPrice, 0)}} 元
            </li>
            <li style="text-align: left;" v-if="roomInfo.fuPrice">
              <span class="label">{{priceName['fuPrice']}}:</span>
              {{roomInfo.fuPrice}} 元/㎡
            </li>
            <li style="text-align: left;" v-if="roomInfo.fPrice">
              <span class="label">{{priceName['fPrice']}}:</span>
              {{formatMoney(roomInfo.fPrice, 0)}} 元
            </li>
          </ul>
        </div>
        <div style="width: 100%;border-top:1px solid #e2e2e2;">
          <div style="background-color: #fff;">
            <ul class="subDetail">
              <li style="text-align: left;">
                <span class="label">客户：</span>
                {{name}}
              </li>
              <li style="text-align: left;">
                <span class="label">手机号：</span>
                {{mobile}}
              </li>
              <li style="text-align: left;">
                <span class="label">证件号：</span>
                {{idCode}}
              </li>
            </ul>
          </div>

          <div
            style="padding-bottom: 10px;text-align:left;text-indent: 10px;font-size: 13px;color:#686868;"
          >
            <v-ons-checkbox :input-id="'agreement'" v-model="agreementVal"></v-ons-checkbox>
            <label class="center" :for="'agreement'">我已阅读并同意</label>
            <span style="color: #1e88e5" @click="showAgreement">《{{agreementTitle}}》</span>
          </div>

          <div style="display: flex">
            <div
              style="width: 100%;height:45px; line-height: 45px;background-color: #FF7000;color: #fff;font-size: 20px;margin: 0 25px 8px 25px; border-radius: 8px;"
              @click="buyRoom(roomInfo.id)"
            >确定</div>
          </div>
        </div>
      </div>

      <div
        id="agreementContainer"
        v-show="agreementDialogVisible"
        style="background-color: rgba(51, 45, 45, 0.88); height: 100%; width: 100%;position: fixed; top: 0;"
      >
        <div
          style="overflow-x: hidden; overflow-y:scroll; width:100%;-webkit-overflow-scrolling: touch;position:absolute; bottom:55px;top: 120px;background-color: #fff;"
          ref="iframeContainer"
        >
          <iframe
            :src="agreementUrl"
            width="100%"
            height="100%"
            style="border:none;"
            id="agreementFrame"
          ></iframe>
        </div>
        <div class="agreementClose" @click="iKnow">关闭</div>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import API from "../api";
import config from '../config'
export default {
  name: "RoomDetail",
  data() {
    return {
      toastVisible: false,
      toastTimeout: null, // toast定时器
      roomInfo: {},
      roomDetailInterval: null,
      countDownInterval: null,
      picName: null,
      type: null,
      showMakeSure: false, // 【确认订单】框\
      typeImgUrl: null,
      timer: null,
      agreementVal: false,
      agreementDialogVisible: false,
      agreementUrl: null,
      agreementTitle: window.sessionStorage.getItem("agreementTitle")
    };
  },
  computed: {
    city: function() {
      let city = window.sessionStorage.getItem("city");
      return city;
    },
    project: function() {
      let project = window.sessionStorage.getItem("project");
      return project;
    },
    countDownVal: function() {
      return API.countDown(this.$store.state.countDown.second);
    },
    countDownShow: function() {
      return this.$store.state.countDown.second <= 0 ? false : true;
    },
    typeImg: function() {
      if (this.picName) {
        return this.typeImgUrl + this.picName + ".jpg";
      }
    },
    timeTypeVal: function() {
      return this.$store.state.countDown.timeTypeVal;
    },
    name: function() {
      return window.sessionStorage.getItem("name");
    },
    idCode: function() {
      return window.sessionStorage.getItem("idCode");
    },
    mobile: function() {
      return window.sessionStorage.getItem("mobile");
    },
    quickBuy: function() {
      // 设置购买是否需要确认订单  false: 需要  true: 不需要
      return false;
    },
    //    agreementTitle: function () {
    //      let agreementTitle = window.sessionStorage.getItem('agreementTitle')
    //      return agreementTitle
    //    },
    toolbarInfo: function() {
      var toolbarInfo;
      if (this.roomInfo) {
        if (this.roomInfo.uNo) {
          toolbarInfo = `${this.roomInfo.bNo}栋-${this.roomInfo.uNo}单元-${this.roomInfo.rNo}`;
        } else {
          toolbarInfo = `${this.roomInfo.bNo}-${this.roomInfo.rNo}`;
        }
      } else {
        toolbarInfo = "";
      }
      return { title: toolbarInfo };
    },
    priceName: function() {
      return JSON.parse(window.sessionStorage.getItem("priceName"));
    }
  },
  methods: {
    showAgreement() {
      this.agreementDialogVisible = true;
    },
    iKnow() {
      this.agreementDialogVisible = false;
    },
    buyRoom(id) {
      let self = this;
      let token = window.sessionStorage.getItem("token");
      let timeType = window.sessionStorage.getItem("timeType");
      if (this.agreementVal) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        } else {
          this.timer = setTimeout(function() {
            API.handleBuyRoom(token, id, data => {
              if (!data.errcode) {
                if (timeType == 1) {
                  // 正式
                  let order = self.roomInfo;
                  if (data.signDesc) {
                    order.signDesc = data.signDesc;
                  }
                  if (data.roomDesc) {
                    order.roomDesc = data.roomDesc;
                  }
                  if (data.bTime) {
                    order.bTime = data.bTime;
                  }
                  // self.$store.commit('navigator/pop')
                  self.$router.replace("/buySuccess");
                  let allInfo = {};
                  allInfo.signDesc = data.signDesc ? data.signDesc : null;
                  allInfo.roomStr = data.uNo
                    ? `${data.bNo}楼${data.uNo}单元${data.rNo}`
                    : `${data.bNo}-${data.rNo}`;
                  allInfo.title = `恭喜您,选购成功`;
                  allInfo.type = "formal";
                  allInfo.order = order;
                  allInfo.toolbarInfo = {
                    title: `选购成功`
                  };
                  self.$store.commit("buyInfo/set", allInfo);
                } else if (timeType == 0) {
                  // 公测
                  self.$router.replace("/buySuccess");
                  let allInfo = {};
                  allInfo.signDesc = null;
                  allInfo.roomStr = data.uNo
                    ? `${data.bNo}楼${data.uNo}单元${data.rNo}`
                    : `${data.bNo}-${data.rNo}`;
                  allInfo.title = `恭喜您,公测选购成功`;
                  allInfo.type = "test";
                  allInfo.toolbarInfo = {
                    title: `公测选购成功`
                  };
                  self.$store.commit("buyInfo/set", allInfo);
                }
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
            self.timer = null;
          }, 200);
        }
      } else {
        API.toast(
          {
            type: "error",
            msg: `请保证您已阅读并同意《${self.agreementTitle}》`
          },
          self
        );
      }
    },
    saveToFavorites(roomId) {
      let self = this;
      let token = window.sessionStorage.getItem("token");
      let favoritesLength = this.$store.state.favorite.favoritesLists.length;
      if (token) {
        if (favoritesLength < 10) {
          API.handleSaveToFavorites(token, roomId, data => {
            if (!data.errcode) {
              API.toast(
                {
                  type: "success",
                  msg: "收藏成功"
                },
                self
              );
              self.refreshRoomDetail();
              API.handleQueryFavorites(token, data => {
                if (!data.errcode) {
                  if (data.length != 0) {
                    self.$store.commit("favorite/set", {
                      favoritesLists: data,
                      hasFavorite: true
                    });
                  } else {
                    self.$store.commit("favorite/set", {
                      favoritesLists: [],
                      hasFavorite: false
                    });
                  }
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
                        msg: `失败：${data.errmsg}`
                      },
                      self
                    );
                  }
                }
              });
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
        } else {
          let activityType = window.sessionStorage.getItem("type");
          API.toast(
            {
              type: "error",
              msg:
                activityType == 0
                  ? `最多只能收藏10套房源`
                  : `最多只能收藏10个车位`
            },
            self
          );
        }
      }
    },
    delFromFavorites(roomId) {
      let self = this;
      let token = window.sessionStorage.getItem("token");
      if (token) {
        API.handleDelFromFavorites(token, roomId, data => {
          if (!data.errcode) {
            API.toast(
              {
                type: "success",
                msg: "取消收藏"
              },
              self
            );
            self.refreshRoomDetail();
            API.handleQueryFavorites(token, data => {
              if (!data.errcode) {
                if (data.length != 0) {
                  self.$store.commit("favorite/set", {
                    favoritesLists: data,
                    hasFavorite: true
                  });
                } else {
                  self.$store.commit("favorite/set", {
                    favoritesLists: [],
                    hasFavorite: false
                  });
                }
              }
            });
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
    refreshRoomDetail() {
      let roomId = window.sessionStorage.getItem("roomId");
      let token = window.sessionStorage.getItem("token");
      let self = this;
      API.handleRoomDetail(token, roomId, data => {
        if (!data.errcode) {
          self.roomInfo = data;
          self.picName = data.picName;
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
    },
    goToMyFavorites() {
      this.$router.replace("/navigator");
      this.$store.commit("tabbar/set", 1);
    },
    goToRoomLists() {
      this.$router.replace("/navigator");
      this.$store.commit("tabbar/set", 0);
    },
    formatMoney(s, n) {
      return API.formatMoney(s, n);
    },
    showMakeSureDialog() {
      this.showMakeSure = true;
    },
    hideMakeSureDialog() {
      this.showMakeSure = false;
    }
  },
  created() {
    let self = this;
    API.initSessionData(self);
    let activityId = window.sessionStorage.getItem("activityId");
    let typeImgUrl = API.preImgUrl + activityId + "/pics/";
    this.typeImgUrl = typeImgUrl;
    this.type = window.sessionStorage.getItem("type");

    if (activityId) {
      API.handleGetSDKConfig(activityId, data => {
        wx.config(data.config);
        wx.ready(function() {
          wx.hideAllNonBaseMenuItem();
        });
      });
    }

    this.refreshRoomDetail();
    if (this.roomDetailInterval) {
      window.clearInterval(this.roomDetailInterval);
      this.roomDetailInterval = null;
    }
    this.roomDetailInterval = window.setInterval(function() {
      self.refreshRoomDetail();
    }, API.times);
  },
  mounted() {
    let activityId = window.sessionStorage.getItem("activityId");
    this.agreementUrl = config.preImgUrl + activityId + "/agreement.html?timestamp=" + new Date().getTime();
    let self = this;
    setTimeout(function() {
      let agreementTitle = window.document.getElementById("agreementFrame").contentWindow.document.title;
      if (agreementTitle) {
        self.agreementTitle = agreementTitle;
        window.sessionStorage.setItem("agreementTitle", agreementTitle);
        self.$cookie.set("agreementTitle", agreementTitle);
      }
    }, 800);
  },
  destroyed() {
    if (this.roomDetailInterval) {
      window.clearInterval(this.roomDetailInterval);
      this.roomDetailInterval = null;
    }
  }
};
</script>
<style scope>
.label {
  width: 100px;
  display: inline-block;
}
.subDetail li {
  list-style-type: none;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}
.dialog {
  width: 90%;
  height: 400px;
  overflow-y: auto;
}
</style>
<style>
.buyBtn {
  font-size: 20px;
}
.agreeContainer {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(100, 100, 100, 0.5);
}
.agreementClose {
  position: absolute;
  bottom: 0px;
  height: 60px;
  line-height: 60px;
  width: 100%;
  background-color: #fff;
  color: #767676;
  font-size: 16px;
  border-top: 1px solid #767676;
}
</style>
