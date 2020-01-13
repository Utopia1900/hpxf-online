<template>
  <v-ons-page>
    <div style="position: fixed;top:0px;width: 100%; z-index: 999;background-color: #fff;">
      <div style="height: 35px;line-height: 35px;text-align: left; padding-left: 15px; ">
        <span
          style="width: 20px; height: 20px;line-height:20px;background-color: #e50000;color:#e50000; display: inline-block"
        >1</span>&nbsp;&nbsp;已选 &nbsp;&nbsp;&nbsp;&nbsp;
        <span
          style="width: 18px; height: 18px;line-height:20px;background-color: #fff;color: #fff; display: inline-block;border: 1px solid #bbbbbb"
        >1</span>&nbsp;&nbsp;未选
      </div>
      <div style="display: flex; flex-direction: row;border: 1px solid #ddd; overflow-x: auto;" v-if="type==0">
        <span style="line-height: 45px;font-size: 13px;padding-right: 10px;padding-left: 5px;">楼栋</span>
        <div v-for="(item, index) in building" :key="index">
          <div
            :class="{activeFloor: activeBuildingIndex === index}"
            @click="chooseBuilding(index)"
            style="flex: 1; height: 45px;width:45px; line-height: 45px;"
          >{{item.bNo}}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: row;border: 1px solid #ddd;overflow-x: auto;" v-else-if="type==1">
        <span style="line-height: 45px;font-size: 13px;padding-right: 10px;padding-left: 5px;">区域</span>
        <div v-for="(item, index) in building" :key="index">
          <div
            style="flex: 1; height: 45px;width:80px; line-height: 45px;"
            :class="{activeFloor: activeBuildingIndex === index}"
            @click="chooseBuilding(index)"
          >{{item.bNo}}</div>
        </div>
      </div>
      <div
        style="display: flex; flex-direction: row;border: 1px solid #ddd;border-top:none;"
        v-if="type=='0'"
      >
        <span style="line-height: 45px;font-size: 13px;padding-right: 10px;padding-left: 5px;">单元</span>
        <div v-for="(item, index) in building" :key="index">
          <span
            v-show="activeBuildingIndex === index"
            v-for="(list, key) in item.uNo"
            style="display: inline-block; height: 30px;width:40px;line-height: 30px;margin-top: 5px;"
            :class="{activeUnit: activeUnitIndex === key}"
            @click="chooseUnit(key)"
            :key="key"
          >{{list}}</span>
        </div>
      </div>
    </div>
    <div
      class="content"
      style="overflow-x: hidden; z-index:900;overflow-y: scroll"
      ref="scrollList"
    >
      <div
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="margin-top: 135px;margin-bottom: 20px;display: flex;"
      >
        <ul
          v-for="(item, index) in roomLists"
          style="padding: 0; flex:1; display: flex; flex-direction: column"
          :key="index"
        >
          <li
            style="
              display:inline-block;
              border: 1px solid #ccc;
              width: 100%;
              height: 45px;
              line-height: 45px;
              background-color: #fff;
              "
            v-for="(room, rindex) in item"
            :key="rindex"
          >
            <span v-if="room != null">
              <span
                class="activeRoom"
                style="display: inline-block; width: 100%;height: 100%;"
                v-if="room.status === 2"
              >
              {{room.rNo}}
              <span v-show="room.type">&nbsp;{{room.type}}</span>
            </span>
            <span
              style="display: inline-block; width: 100%;height: 100%;"
              @click="goToDetails(room)"
              v-else
            >
              {{room.rNo}}
              <span v-show="room.type">&nbsp;{{room.type}}</span>
            </span>
            </span>
            <span v-else>
              <span style="background-color: #e9ecef;display: inline-block;width: 100%;height: 100%;">

              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </v-ons-page>
</template>
<script>
import API from "../api";
import RoomDetail from "./RoomDetail.vue";
const type = window.sessionStorage.getItem("type");
export default {
  name: "RoomLists",
  data() {
    return {
      timer: null,
      type: window.sessionStorage.getItem("type")
    };
  },
  computed: {
    building: function() {
      return this.$store.state.rooms.building;
    },
    roomLists: function() {
      return this.$store.state.rooms.roomLists;
    },
    activeBuildingIndex() {
      return this.$store.state.rooms.activedBuildingIndex;
    },
    activeUnitIndex() {
      return this.$store.state.rooms.activedUnitIndex;
    },
    scroll() {
      return this.$store.state.rooms.scroll;
    }
  },
  methods: {
    chooseBuilding(index) {
      let _this = this;
      setTimeout(function() {
        // 滑动位置重置为0
        _this.$refs.scrollList.scrollTop = 0;
      }, 300);
      this.$store.commit("rooms/setActivedBuildingIndex", index);
      this.$store.commit("rooms/setActivedUnitIndex", 0);
      let building = this.building;
      console.log("run here 1", index);
      console.log(
        "uNo  sd",
        building[index].uNo ? building[index].uNo[0] : undefined
      );
      this.$store
        .dispatch("rooms/queryRooms", {
          bNo: building[index].bNo,
          uNo: building[index].uNo ? building[index].uNo[0] : undefined
        })
        .then(data => {
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
    chooseUnit(index) {
      let _this = this;
      setTimeout(function() {
        _this.$refs.scrollList.scrollTop = 0;
      }, 300);
      let building = this.building;
      let activeBuilding = this.$store.state.rooms.activedBuilding;
      let activedBuildingIndex = this.activeBuildingIndex;
      this.$store.commit("rooms/setActivedUnitIndex", index);
      this.$store
        .dispatch("rooms/queryRooms", {
          bNo: activeBuilding,
          uNo: building[activedBuildingIndex].uNo
            ? building[activedBuildingIndex].uNo[index]
            : undefined
        })
        .then(data => {
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
    goToDetails(room) {
      window.sessionStorage.setItem("roomId", room.id)
      this.$cookie.set('roomId', room.id)
      this.$router.push("/roomDetail")
    },
    handleScroll() {
      let scroll = this.$refs.scrollList.scrollTop;
      this.$store.commit("rooms/setScroll", scroll);
    }
  },
  mounted() {
    let _this = this;
    this.$refs.scrollList.addEventListener("scroll", this.handleScroll, false);
    setTimeout(function() {
      _this.$refs.scrollList.scrollTop = _this.scroll;
    }, 300);
  }
};
</script>
<style>
.activeFloor {
  border-bottom: 2px solid #e50000;
  color: #e50000;
  font-weight: bold;
  height: 43px;
}

.activeUnit {
  background-color: rgba(216, 94, 94, 0.9);
  color: #fff;
  border-radius: 5px;
}

.activeRoom {
  background-color: #c30303;
  color: #ffffff;
}
</style>
