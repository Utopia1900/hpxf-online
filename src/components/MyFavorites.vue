<template>
  <v-ons-page>
    <div style="background-color: #fff;padding: 10px;margin-bottom: 15px;">
      <p>
        您已经收藏
        <span class="favoriteNum">{{favoriteNum}}</span>
        <span v-if="activityType==0">套房源</span>
        <span v-else-if="activityType==1">个车位</span>
        ,还可以收藏
        <span class="favoriteNum">{{moreCanNum}}</span>
        <span v-if="activityType==0">套房源</span>
        <span v-else-if="activityType==1">个车位</span>
      </p>
      <p style="font-size: 14px;color: #666;text-indent: 20px; padding-left: 20px;">温馨提示：请按顺序排列意向。</p>
    </div>
    <div>
      <div v-if="hasFavorite">
        <div v-for="(item, index) in favoritesLists" :key="index">
          <v-ons-list
            v-if="item.status === 2"
            :style="{background: 'url(' + choosedPng+ ') center center no-repeat #fff'}"
            style="border-bottom: 1px solid #ccc;margin-bottom: 5px;"
          >
            <v-ons-list-item style="border-bottom: 1px solid #ccc;">
              <div class="left">
                <span
                  style="color: rgb(255, 255, 255);font-size: 15px;height: 20px;width: 20px;text-align: center;border-radius: 50%;background-color: rgb(68, 68, 68);"
                >{{index+1}}</span>
              </div>
              <div class="center">
                <span
                  class="list-item__title"
                  v-if="item.uNo"
                >{{item.bNo}}栋-{{item.uNo}}单元-{{item.rNo}}</span>
                <span class="list-item__title" v-else>{{item.bNo}}-{{item.rNo}}</span>
              </div>
              <div
                class="right"
                @click="delFromFavorites(item.id)"
                style="width:60px;padding-left: 20px;"
              >
                <v-ons-icon icon="my-icon-close"></v-ons-icon>
              </div>
            </v-ons-list-item>
            <v-ons-list-item>
              <div class="center">
                <div style="width: 100%; height: 35px;">
                  <span class="list-item__subtitle">线上总价：{{formatMoney(item.fPrice, 0)}} 元</span>
                  <v-ons-icon
                    icon="my-icon-up"
                    style="font-size: 15px;float: right;padding-right: 20px;"
                    v-show="(index < favoritesLists.length) && (index != 0)"
                    @click="move('up', item.id)"
                  ></v-ons-icon>
                </div>
                <div style="width: 100%">
                  <span class="list-item__subtitle">收藏人数：{{item.savedNum}}</span>
                  <v-ons-icon
                    icon="my-icon-down"
                    style="font-size: 15px;float: right;padding-right: 20px;"
                    v-show="(index < favoritesLists.length) && (index != favoritesLists.length-1)"
                    @click="move('down', item.id)"
                  ></v-ons-icon>
                </div>
              </div>
            </v-ons-list-item>
          </v-ons-list>
          <v-ons-list v-else style="margin-bottom: 5px;">
            <v-ons-list-item style="border-bottom: 1px solid #ccc; ">
              <div class="left" style>
                <span
                  style="color: rgb(255, 255, 255);font-size: 15px;height: 20px;width: 20px;text-align: center;border-radius: 50%;background-color: rgb(68, 68, 68);"
                >{{index+1}}</span>
              </div>
              <div class="center" @click="goToRoomDetail(item)">
                <span
                  class="list-item__title"
                  v-if="item.uNo"
                >{{item.bNo}}栋-{{item.uNo}}单元-{{item.rNo}}</span>
                <span class="list-item__title" v-else>{{item.bNo}}-{{item.rNo}}</span>
              </div>
              <div
                class="right"
                @click="delFromFavorites(item.id)"
                style="width:60px;padding-left: 20px;"
              >
                <v-ons-icon icon="my-icon-close"></v-ons-icon>
              </div>
            </v-ons-list-item>
            <v-ons-list-item>
              <div class="center">
                <div style="width: 100%; height: 35px;">
                  <span class="list-item__subtitle">线上总价：{{formatMoney(item.fPrice, 0)}} 元</span>
                  <v-ons-icon
                    icon="my-icon-up"
                    style="font-size: 15px;float: right;padding-right: 20px;"
                    v-show="(index < favoritesLists.length) && (index != 0)"
                    @click="move('up', item.id)"
                  ></v-ons-icon>
                </div>
                <div style="width: 100%">
                  <span class="list-item__subtitle">收藏人数：{{item.savedNum}}</span>
                  <v-ons-icon
                    icon="my-icon-down"
                    style="font-size: 15px;float: right;padding-right: 20px;"
                    v-show="(index < favoritesLists.length) && (index != favoritesLists.length-1)"
                    @click="move('down', item.id)"
                  ></v-ons-icon>
                </div>
              </div>
            </v-ons-list-item>
          </v-ons-list>
        </div>
      </div>
      <div v-else class="no-favorite-pic">
        <img :src="favoritePng" alt style="width: 100px;">
        <div style="text-align: center;padding-top: 10px; color:#454545;">收藏夹空空如也！</div>
      </div>
    </div>
  </v-ons-page>
</template>
<script>
import API from "../api";
import RoomDetail from "./RoomDetail.vue";
import choosedPng from "../assets/choose.png";
import favoritePng from "../assets/favorite.png";
export default {
  name: "MyFavorites",
  data() {
    return {
      choosedPng: choosedPng,
      favoritePng: favoritePng,
      isRequesting: false,
      activityType: window.sessionStorage.getItem("type"),
      timer: null
    };
  },
  computed: {
    favoriteNum: function() {
      return this.$store.state.favorite.favoritesLists.length;
    },
    moreCanNum: function() {
      return 10 - this.favoriteNum;
    },
    favoritesLists: function() {
      return this.$store.state.favorite.favoritesLists;
    },
    hasFavorite: function() {
      return this.$store.state.favorite.hasFavorite;
    }
  },
  methods: {
    queryMyFavorites() {
        let self = this;
        let token = window.sessionStorage.getItem("token");
        if (token) {
          API.handleQueryFavorites(token, data => {
            if (!data.errcode) {
              self.favoriteNum = data.length;
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
                    msg: `${data.errmsg}`
                  },
                  self
                );
              }
            }
          });
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
            self.queryMyFavorites();
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
    goToRoomDetail(room) {
      window.sessionStorage.setItem("roomId", room.id);
      this.$cookie.set('roomId', room.id)
      this.$router.push("/roomDetail");
    },
    formatMoney(s, n) {
      return API.formatMoney(s, n);
    },
    move(dir, roomId) {
      let self = this;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(function() {
          let token = window.sessionStorage.getItem("token");
          API.handleChangeFavorites(token, roomId, dir, data => {
            if (!data.errcode) {
              self.queryMyFavorites();
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
    }
  }
};
</script>
<style>
.favoriteNum {
  color: #ff7000;
  font-size: 20px;
}
.no-favorite-pic {
  width: 100%;
  margin: 15px auto;
  background-color: #fff;
  padding-top: 80px;
  height: 400px;
}
</style>
