import axios from 'axios'
import config from './config'
export default {
  modules: {
    toast: {
      strict: true,
      namespaced: true,
      state: {
        type: '',
        msg: '',
        visible: false
      },
      mutations: {
        set (state, params) {
          if (params) {
            if (params.type) state.type = params.type
            if (params.msg) state.msg = params.msg
            if (params.visible) state.visible = params.visible
          }
        },
        open (state) {
          state.visible = true
        },
        close (state) {
          state.visible = false
        }
      }
    },

    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 0
      },
      mutations: {
        set (state, index) {
          state.index = index
        }
      }
    },
    order: {
      strict: true,
      namespaced: true,
      state: {
        orderList: [],
        hasOrder: false
      },
      mutations: {
        query (state, payload) {
          state.orderList = payload.orderList
          state.hasOrder = payload.hasOrder
        }
      }
    },
    rooms: {
      strict: true,
      namespaced: true,
      state: {
        roomLists: [],
        activedBuilding: 0,
        lastUNo: -1,
        hasOrder: false,
        building: null,
        activedBuildingIndex: 0,
        activedUnitIndex: 0,
        scroll: null
      },
      mutations: {
        setBuilding (state, payload) {
          state.building = payload
          state.activedBuilding = payload[0].bNo // 获取到楼栋信息后初始化楼栋号
          state.lastUNo = payload[0].uNo ? payload[0].uNo[0] : -1 // 如果有单元 初始化单元号
        },
        setRooms (state, payload) {
          state.roomLists = payload
        },
        selectBuilding (state, payload) {
          state.activedBuilding = payload
        },
        selectUNo (state, uNo) {
          state.lastUNo = uNo
        },
        setActivedBuildingIndex (state, payload) {
          state.activedBuildingIndex = payload
        },
        setActivedUnitIndex (state, payload) {
          state.activedUnitIndex = payload
        },
        setScroll (state, payload) {
          state.scroll = payload
        }
      },
      actions: {
        queryRooms ({
          commit,
          state
        }, options) {
          return new Promise((resolve, reject) => {
            if (options.bNo === undefined && options.uNo === undefined) {
              options.bNo = state.activedBuilding
              if (state.lastUNo !== -1) {
                options.uNo = state.lastUNo
              }
            } else {
              console.log('run heeeeeeeee 3')
              if ((options.bNo === state.activedBuilding) && ((options.uNo === undefined) ||
                  (options.uNo !== undefined && options.uNo === state.lastUNo))) {
                resolve()
              }
              commit('selectBuilding', options.bNo)
              if (options.uNo !== undefined) {
                commit('selectUNo', options.uNo)
              }
            }

            let token = window.sessionStorage.getItem('token')
            let formData
            if (options.uNo !== undefined) {
              formData = {
                token,
                bNo: options.bNo,
                uNo: options.uNo
              }
            } else {
              formData = {
                token,
                bNo: options.bNo
              }
            }
            const args = {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              data: JSON.stringify(formData),
              url: config.url + 'rooms'
            }
            axios(args).then(response => {
              if (!response.data.errcode) {
                commit('setRooms', response.data)
                resolve()
                // self.$store.commit('rooms/query', roomLists)
              } else {
                resolve(response.data)
              }
            }).catch(error => {
              reject(error)
              // alert(error)
            })
          })
        }
      }
    },
    countDown: {
      strict: true,
      namespaced: true,
      state: {
        show: false,
        second: 0,
        timeTypeVal: '',
        counterTimer: false
      },
      mutations: {
        showCountDownCover (state) {
          state.show = true
        },
        setSecond (state, payload) {
          state.second = payload
        },
        closeCounter (state) {
          state.second = 0
          state.show = false
          state.counterTimer = false
        },
        closeCounterCover (state) {
          state.show = false
        },
        setTimeTypeVal (state, payload) {
          state.timeTypeVal = payload
        },
        setCounter (state) {
          state.counterTimer = true
        }
      }
    },
    favorite: {
      strict: true,
      namespaced: true,
      state: {
        favoritesLists: [],
        hasFavorite: false
      },
      mutations: {
        set (state, payload) {
          state.favoritesLists = payload.favoritesLists
          state.hasFavorite = payload.hasFavorite
        }
      }
    },
    orderDetail: {
      strict: true,
      namespaced: true,
      state: {
        items: null
      },
      mutations: {
        set (state, payload) {
          state.items = payload
        }
      }
    },
    buyInfo: {
      strict: true,
      namespaced: true,
      state: {
        items: {}
      },
      mutations: {
        set (state, payload) {
          state.items = payload
        }
      }
    },
    activity: { // 活动未开始或结束时关闭窗口
      strict: true,
      namespaced: true,
      state: {
        isFinished: false,
        errmsg: ''
      },
      mutations: {
        close (state, payload) {
          state.isFinished = true
          state.errmsg = payload
        }
      }
    }
  }
}
