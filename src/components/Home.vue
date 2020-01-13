<template>
  <div>
    <title>首页</title>
    <div style="width:auto;height:auto;" id="imgContainer">
      <img :src="imgUrl" alt="首页图片" style="width:100%;height:100%;">
    </div>
    <div
      style="overflow-x: hidden; overflow-y:scroll; width:100%;-webkit-overflow-scrolling: touch;position:absolute; bottom:55px;top: 0;"
      ref="iframeContainer"
    >
      <iframe :src="homeUrl" width="100%" height="100%" style="border:none"></iframe>
    </div>
    <div class="quckGoContainer" @click="quickGo">立即进入</div>
  </div>
</template>
<script>
import config from "../config";
import API from "../api";
export default {
  name: "Home",
  data() {
    return {
      restInterval: null
    };
  },
  computed: {
    homeUrl: function() {
      let activityId = window.sessionStorage.getItem("activityId");
//       let activityId = 14
      let homeUrl =
        config.preImgUrl +
        activityId +
        "/index.html?timestamp=" +
        new Date().getTime();
      return homeUrl;
    },
    imgUrl: function() {
      let activityId = window.sessionStorage.getItem("activityId");
//      let activityId = 14
      let imgUrl = config.preImgUrl + activityId + '/images/open.jpeg';
      return imgUrl;
    }
  },
  methods: {
    quickGo() {
      this.$router.replace('/navigator');
      this.$store.commit('tabbar/set', 0);
    }
  },
  created() {
    let _this = this
    API.initSessionData(_this)
    if (this.restInterval) {
      window.clearInterval(this.restInterval);
      this.restInterval = null;
    }
    let token = window.sessionStorage.getItem('token');
    if (token) {
      let restInterval = window.setInterval(function() {
        API.handleRestTime(token, function(data) {
          if (!data.errcode) {
          } else {
            if (data.errcode == 1000 || data.errcode == 3) {
              _this.$store.commit('activity/close', data.errmsg);
              window.setTimeout(function() {
                wx.ready(function() {
                  wx.closeWindow();
                });
              }, 800);
            }
          }
        });
      }, API.times);
      _this.restInterval = restInterval;
    }
  },
  mounted() {
    let imgContainer = document.getElementById('imgContainer');
    let _this = this
    setTimeout(function(){
      _this.$refs.iframeContainer.style.top = imgContainer.clientHeight + 'px';
    }, 500)
  },
  destroyed() {
    if (this.restInterval) {
      window.clearInterval(this.restInterval);
      this.restInterval = null;
    }
  }
};
</script>
<style>
.quckGoContainer {
  position: absolute;
  bottom: 0px;
  height: 55px;
  line-height: 55px;
  width: 100%;
  background-color: #ff7000;
  color: #ffffff;
  font-size: 24px;
}
.agreeContainer {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(100, 100, 100, 0.6);
}
</style>
