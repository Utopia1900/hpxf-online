// 打包优化 Vue、 Vuex、 vue-router 通过cdn在index.html页面引入
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import VueOnsen from 'vue-onsenui/esm'
import router from './router'
import App from './App'
import store from './store.js'
import VueCookie from 'vue-cookie'
import CustomToolbar from './components/CustomToolbar.vue'

// 打包优化 onsenui.min.css 和 onsen-css-components.min.css 通过cdn在index.html页面引入
// import 'onsenui/css/onsenui.min.css'
import 'onsenui/css/onsenui-core.min.css' // 使用onsenui-core.css可以替换掉onsenui默认自带的三种图标库（fontawesome， ioco, md）
import 'onsenui/css/onsen-css-components.min.css'

Vue.use(VueOnsen)

import VOnsToolbar from 'vue-onsenui/esm/components/VOnsToolbar'
import VOnsBackButton from 'vue-onsenui/esm/components/VOnsBackButton'
import VOnsList from 'vue-onsenui/esm/components/VOnsList'
import VOnsListItem from 'vue-onsenui/esm/components/VOnsListItem'
import VOnsCheckbox from 'vue-onsenui/esm/components/VOnsCheckbox'
import VOnsPage from 'vue-onsenui/esm/components/VOnsPage'
import VOnsToolbarButton from 'vue-onsenui/esm/components/VOnsToolbarButton'
import VOnsIcon from 'vue-onsenui/esm/components/VOnsIcon'
import VOnsTabbar from 'vue-onsenui/esm/components/VOnsTabbar'
import VOnsButton from 'vue-onsenui/esm/components/VOnsButton'
import VOnsToast from 'vue-onsenui/esm/components/VOnsToast'
import VOnsAlertDialog from 'vue-onsenui/esm/components/VOnsAlertDialog'
import VOnsAlertDialogButton from 'vue-onsenui/esm/components/VOnsAlertDialogButton'
import VOnsTab from 'vue-onsenui/esm/components/VOnsTab'
import VOnsBottomToolbar from 'vue-onsenui/esm/components/VOnsBottomToolbar'
import VOnsCard from 'vue-onsenui/esm/components/VOnsCard'

Vue.component(VOnsToolbar.name, VOnsToolbar)
Vue.component(VOnsToolbarButton.name, VOnsToolbarButton)
Vue.component(VOnsBackButton.name, VOnsBackButton)
Vue.component(VOnsIcon.name, VOnsIcon)
Vue.component(VOnsCheckbox.name, VOnsCheckbox)
Vue.component(VOnsListItem.name, VOnsListItem)
Vue.component(VOnsTabbar.name, VOnsTabbar)
Vue.component(VOnsPage.name, VOnsPage)
Vue.component(VOnsList.name, VOnsList)
Vue.component(VOnsButton.name, VOnsButton)
Vue.component(VOnsToast.name, VOnsToast)
Vue.component(VOnsAlertDialog.name, VOnsAlertDialog)
Vue.component(VOnsAlertDialogButton.name, VOnsAlertDialogButton)
Vue.component(VOnsTab.name, VOnsTab)
Vue.component(VOnsBottomToolbar.name, VOnsBottomToolbar)
Vue.component(VOnsCard.name, VOnsCard)

import './custom.css'
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(Vuex)
Vue.use(VueCookie)
Vue.use(VueRouter)

Vue.component('custom-toolbar', CustomToolbar) // Common toolbar

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: new VueRouter(router),
  store: new Vuex.Store(store),
  components: { App },
  template: '<App/>'
})
