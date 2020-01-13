<template>
  <div id="app">
    <router-view/>
    <v-ons-toast disable-auto-styling :visible="toastVisible" animation="fade" modifier="hp"
                 :class="[toastDisplay]">
      <span :class="[toastType]" style="font-size: 33px;" :style="{ color: toastColor }"></span>
      <div style="margin-left: 15px; text-align: left; line-height: 24px;">{{ toastMsg }}</div>
    </v-ons-toast>
    <div class="coverCountDown" v-show="countDown">
      <div style="text-align: center; margin-top: 150px;z-index: 100">
        <span style="font-size: 120px;" class="second">
          {{second}}
        </span>
      </div>
      <div style="width: 50px; height:50px; color: #FF9900; margin: 150px auto; z-index: 100">
        <v-ons-icon icon="my-icon-close" @click="closeCover" style="font-size: 25px">

        </v-ons-icon>
      </div>
      <div class="fireworks">
        <div class="firework" style="margin-top: 0px">
          <div class="explosion">
            <div class="spark green"></div>
          </div>
          <div class="explosion">
            <div class="spark blue"></div>
          </div>
          <div class="explosion">
            <div class="spark red"></div>
          </div>
          <div class="explosion">
            <div class="spark red"></div>
          </div>
          <div class="explosion">
            <div class="spark yellow"></div>
          </div>
          <div class="explosion">
            <div class="spark blue"></div>
          </div>
          <div class="explosion">
            <div class="spark green"></div>
          </div>
          <div class="explosion">
            <div class="spark yellow"></div>
          </div>
        </div>
        <div class="firework" style="margin-top: 150px">
          <div class="explosion">
            <div class="spark green"></div>
          </div>
          <div class="explosion">
            <div class="spark blue"></div>
          </div>
          <div class="explosion">
            <div class="spark red"></div>
          </div>
          <div class="explosion">
            <div class="spark red"></div>
          </div>
          <div class="explosion">
            <div class="spark yellow"></div>
          </div>
          <div class="explosion">
            <div class="spark blue"></div>
          </div>
          <div class="explosion">
            <div class="spark green"></div>
          </div>
          <div class="explosion">
            <div class="spark yellow"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isFinished">
      <v-ons-alert-dialog class="newVersionDialog" modifier="rowfooter"
                          :visible.sync="isFinished"
      >
        <span slot="title" style="font-size: 14px">{{errmsg}}</span>
        <!--<template slot="footer">-->
          <!--<v-ons-alert-dialog-button @click="exit" style="color:#427dcc">点击退出</v-ons-alert-dialog-button>-->
        <!--</template>-->
      </v-ons-alert-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    computed: {
      toastType () {
        if (this.$store.state.toast.type === 'success') {
          return 'ion-ios-checkmark-outline'
        } else if (this.$store.state.toast.type === 'warning') {
          return 'ion-ios-information-outline'
        } else if (this.$store.state.toast.type === 'error') {
          return 'ion-ios-close-outline'
        } else {
          return 'ion-ios-checkmark-outline'
        }
      },
      toastColor () {
        if (this.$store.state.toast.type === 'success') {
          return '#5cb85c'
        } else if (this.$store.state.toast.type === 'warning') {
          return '#f0ad4e'
        } else if (this.$store.state.toast.type === 'error') {
          return '#d9534f'
        } else {
          return '#5cb85c'
        }
      },
      toastMsg () {
        return this.$store.state.toast.msg
      },
      toastVisible () {
        return this.$store.state.toast.visible
      },
      toastDisplay () {
        if (this.$store.state.toast.visible) {
          return 'hp-toast-show'
        } else {
          return 'hp-toast-hidden'
        }
      },
      countDown () {
        return this.$store.state.countDown.show
      },
      second () {
        return this.$store.state.countDown.second
      },
      isFinished () {
        return this.$store.state.activity.isFinished
      },
      errmsg () {
        return this.$store.state.activity.errmsg
      }
    },
    methods: {
      closeCover () {
        this.$store.commit('countDown/closeCounterCover')
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .coverCountDown {
    background-color: rgba(3, 8, 45, 0.78);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    color: #ffffff;
    font-size: 25px;
    z-index: 100
  }

  .fireworks {
    height: 100vh;
    width: 100vw;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: -100;
  }

  .fireworks .firework {
    position: relative;
    top: 0px;
    left: 0px;
    margin: 0px 50px;
  }

  .fireworks .firework .explosion {
    position: absolute;
    top: 0;
    width: 5px;
    height: 20px;
    opacity: 0;
    -webkit-transform-origin: top center;
    transform-origin: top center;
    will-change: transform;
    -webkit-animation: explosion 1s linear 1s infinite;
    animation: explosion 1s linear 1s infinite;
  }

  .fireworks .firework .explosion:nth-child(1) {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  .fireworks .firework .explosion:nth-child(2) {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .fireworks .firework .explosion:nth-child(3) {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .fireworks .firework .explosion:nth-child(4) {
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }

  .fireworks .firework .explosion:nth-child(5) {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .fireworks .firework .explosion:nth-child(6) {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .fireworks .firework .explosion:nth-child(7) {
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  .fireworks .firework .explosion:nth-child(8) {
    -webkit-transform: rotate(225deg);
    transform: rotate(225deg);
  }

  .fireworks .firework .explosion .spark {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    will-change: transform;
    -webkit-animation: explosion2 1s ease-in-out 1s infinite;
    animation: explosion2 1s ease-in-out 1s infinite;
  }

  .fireworks .firework .explosion .spark.red {
    background-color: #E91E63;
  }

  .fireworks .firework .explosion .spark.blue {
    background-color: skyblue;
  }

  .fireworks .firework .explosion .spark.green {
    background-color: limegreen;
  }

  .fireworks .firework .explosion .spark.yellow {
    background-color: yellow;
  }

  .fireworks .firework .explosion .spark.purple {
    background-color: purple;
  }

  @-webkit-keyframes explosion {
    0% {
      height: 0px;
      opacity: 0;
    }
    50% {
      height: 25px;
      opacity: 1;
    }
    100% {
      height: 0px;
      opacity: 0;
    }
  }

  @keyframes explosion {
    0% {
      height: 0px;
      opacity: 0;
    }
    50% {
      height: 25px;
      opacity: 1;
    }
    100% {
      height: 0px;
      opacity: 0;
    }
  }

  @-webkit-keyframes explosion2 {
    0% {
      -webkit-transform: translateY(0px);
      transform: translateY(0px);
    }
    50% {
      -webkit-transform: translateY(5px);
      transform: translateY(5px);
    }
    75% {
      -webkit-transform: translateY(50px);
      transform: translateY(50px);
    }
    100% {
      -webkit-transform: translateY(70px);
      transform: translateY(70px);
    }
  }

  @keyframes explosion2 {
    0% {
      -webkit-transform: translateY(0px);
      transform: translateY(0px);
    }
    50% {
      -webkit-transform: translateY(5px);
      transform: translateY(5px);
    }
    75% {
      -webkit-transform: translateY(50px);
      transform: translateY(50px);
    }
    100% {
      -webkit-transform: translateY(70px);
      transform: translateY(70px);
    }
  }

  .second {
    color: #FF9900;
    text-shadow: 0 0 10px #fff,
    0 0 10px #fff,
    0 0 15px #fff,
    0 0 20px #FF9900,
    0 0 35px #FF9900,
    0 0 40px #FF9900,
    0 0 50px #FF9900,
    0 0 75px #FF9900;
  }
</style>
