/**
 * Created by doudou on 2018/10/26.
 */
import axios from 'axios'
import config from '../config'
import md5 from 'blueimp-md5'

const API = {
  async sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve()
      }, timeout)
    })
  },
  initSessionData(self) {
    let token = window.sessionStorage.getItem('token')
    if (!token) {
      if (self.$cookie.get('token')) {
        if (self.$cookie.get('name')) {
          window.sessionStorage.setItem('name', self.$cookie.get('name'))
        }
        if (self.$cookie.get('idCode')) {
          window.sessionStorage.setItem('idCode', self.$cookie.get('idCode'))
        }
        if (self.$cookie.get('mobile')) {
          window.sessionStorage.setItem('mobile', self.$cookie.get('mobile'))
        }
        if (self.$cookie.get('saler')) {
          window.sessionStorage.setItem('saler', self.$cookie.get('saler'))
        }

        if (self.$cookie.get('timeType')) {
          // 存储 时间类型 0：公测 1: 正式
          window.sessionStorage.setItem('timeType', self.$cookie.get('timeType'))
        }
        if (self.$cookie.get('activityId')) {
          window.sessionStorage.setItem('activityId', self.$cookie.get('activityId'))
        }
        // 存储token
        token = self.$cookie.get('token')
        window.sessionStorage.setItem('token', token)
        if (self.$cookie.get('project')) {
          // 存储楼盘（车位）项目名称
          window.sessionStorage.setItem('project', self.$cookie.get('project'))
        }
        if (self.$cookie.get('city')) {
          // 存储楼盘（车位）所在城市
          window.sessionStorage.setItem('city', self.$cookie.get('city'))
        }
        if (self.$cookie.get('type')) {
          // 存储活动类型 0-房源 1-车位
          window.sessionStorage.setItem('type', self.$cookie.get('type'))
          // self.$cookie.delete('type')
        }
        if (self.$cookie.get('roomId')) {
          window.sessionStorage.setItem('roomId', self.$cookie.get('roomId'))
        }
        if (self.$cookie.get('priceName')) {
          window.sessionStorage.setItem('priceName', self.$cookie.get('priceName'))
        }
      } else {
        window.location.href = '/error.html'
      }
    }

    this.getRestAndCountdown(self, token)
    let timeType = window.sessionStorage.getItem('timeType')
    if (timeType == 0) {
      self.$store.commit('countDown/setTimeTypeVal', '公测')
    } else if (timeType == 1) {
      self.$store.commit('countDown/setTimeTypeVal', '正式')
    }
  },

  getRestAndCountdown(self, token) {
    if (self.$store.state.countDown.counterTimer) {
      return
    }
    self.$store.commit('countDown/setCounter')
    this.handleRestTime(token, data => {
      if (!data.errcode) {
        var second = data.rest
        var initial = 0
        if (second > 0) {
          self.$store.commit('countDown/setSecond', second)
          var countDownInterval = window.setInterval(() => {
            second--
            initial++
            if (second > 0) {
              if (second === 10) {
                self.$store.commit('countDown/showCountDownCover')
              }
              self.$store.commit('countDown/setSecond', second)

              if (second > 10 && (initial % 6 === 0)) {
                // 时间校准  定时器每执行6s调用请求重新获取剩余时间
                this.handleRestTime(token, data => {
                  if (!data.errcode) {
                    second = data.rest
                  }
                })
              }
            } else {
              self.$store.commit('countDown/closeCounter')
              window.clearInterval(countDownInterval)
              // self.$store.commit('countDown/closeCountDownCover') // 关闭倒计时遮罩
            }
          }, 1000)
        }
      } else {
        if (data.errcode === 1000 || data.errcode === 3) {
          self.$store.commit('activity/close')
          window.setTimeout(() => {
            wx.ready(() => {
              wx.closeWindow()
            })
          }, 800)
        }
      }
    })
  },

  handleLogin(bindInfo, activityId, username, password, successCb, errorCb) {
    let formData = { bindInfo, activityId, username, password: md5(password) }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'login'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },

  handleBind(bindInfo, activityId, id, successCb) {
    let formData = { bindInfo, activityId, id }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'bind'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      // if (errorCb) errorCb(error)
      console.log(error)
    })
  },

  handleLogout(token, successCb) {
    let formData = { token }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'logout'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  getBuildings(token, successCb) {
    let formData = { token }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'buildings'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  queryRooms(token, bNo, uNo, successCb) {
    let formData = { token, bNo, uNo }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'rooms'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  queryParkings(token, bNo, successCb) {
    let formData = { token, bNo }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'rooms'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleRoomDetail(token, roomId, successCb) {
    let formData = { token, roomId }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'roomDetail'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleBuyRoom(token, id, successCb) {
    let formData = { token, id }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'buy'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      alert(error)
    })
  },
  handleSaveToFavorites(token, roomId, successCb) {
    let formData = { token, roomId }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'saveToFavorites'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleQueryFavorites(token, successCb) {
    let formData = { token }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'favorites'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleDelFromFavorites(token, roomId, successCb) {
    let formData = { token, roomId }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'delFromFavorites'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleQueryOrder(token, successCb) {
    let formData = { token }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'order'
    }
    axios(options).then(response => {
      if (successCb) successCb(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  handleChangeFavorites(token, roomId, direction, successCb) {
    let formData = {
      token: token,
      roomId: roomId,
      direction: direction === 'up' ? 1 : 2
    }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'changeFavorites'
    }
    axios(options).then(response => {
      if (successCb) {
        successCb(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  handleGetSDKConfig(activityId, successCb) {
    let formData = {
      activityId: activityId,
      url: window.location.href
    }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.wxUrl + 'getSDKConfig'
    }
    axios(options).then(response => {
      if (successCb) {
        successCb(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  handleRestTime(token, successCb) {
    let formData = { token }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'restTime'
    }
    axios(options).then(response => {
      if (successCb) {
        successCb(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  handleUpdatePwd(token, newPwd, successCb) {
    let formData = {
      token: token,
      newPwd: md5(newPwd)
    }
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(formData),
      url: config.url + 'modifyPwd'
    }
    axios(options).then(response => {
      if (successCb) {
        successCb(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  toast(option, self, successCb) {
    if (!option || !option.msg) {
      throw new Error('msg参数不能为空')
    }
    if (self.toastTimeout) window.clearTimeout(self.toastTimeout)
    self.$store.commit('toast/set', {
      type: option.type || 'success',
      msg: option.msg,
      visible: true
    })
    self.toastTimeout = window.setTimeout(() => {
      self.$store.commit('toast/close')
      if (successCb) {
        successCb()
      }
    }, option.period || 2000)
  },
  formatMoney(s, n) {
    n = n > 0 && n <= 20 ? n : 0
    s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
    var l = s.split('.')[0].split('').reverse()
    var r = s.split('.')[1]
    var t = ''
    for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
    }
    if (n > 0) {
      return t.split('').reverse().join('') + '.' + r
    } else {
      return t.split('').reverse().join('')
    }
  },
  times: 3 * 1000, // 定时器频率（ms）
  preImgUrl: config.preImgUrl, // 户型图存储Url
  countDown(second, formatCb) {
    var minute = 0 // 分钟
    var hour = 0 // 小时
    // var day = 0 // 天
    minute = parseInt(second / 60)// 算出一共有多少分钟
    second %= 60 // 算出有多少秒
    if (minute > 60) { // 如果分钟大于60，计算出小时和分钟
      hour = parseInt(minute / 60)
      minute %= 60 // 算出有多分钟
    }
    if (hour > 24) { // 如果小时大于24，计算出天和小时
      // day = parseInt(hour / 24)
      hour %= 24 // 算出有多分钟
    }
    second = second > 9 ? second : '0' + second
    minute = minute > 9 ? minute : '0' + minute
    hour = hour > 9 ? hour : '0' + hour
    if (formatCb) {
      // formatCb(day + '天' + hour + '时' + minute + '分' + second + '秒')
      formatCb(`${minute}分${second}秒`)
    } else {
      return minute + '分' + second + '秒'
      // return day + '天' + hour + '时' + minute + '分' + second + '秒'
    }
  }
}

export default API
