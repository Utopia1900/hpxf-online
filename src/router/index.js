const Form = r => require.ensure([], () => r(require('@/components/Form')), 'Form')
const Navigator = r => require.ensure([], () => r(require('@/components/Navigator')), 'Navigator')
const Home = r => require.ensure([], () => r(require('@/components/Home')), 'Home')
const RoomDetail = r => require.ensure([], () => r(require('@/components/RoomDetail')), 'RoomDetail')
const OrderDetail = r => require.ensure([], () => r(require('@/components/OrderDetail')), 'OrderDetail')
const BuySuccess = r => require.ensure([], () => r(require('@/components/BuySuccess')), 'BuySuccess')
const router = {
  routes: [
    {
      path: '/',
      name: 'Form',
      component: Form
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/navigator',
      name: 'Navigator',
      component: Navigator
    },
    {
      path: '/roomDetail',
      name: 'RoomDetail',
      component: RoomDetail
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/buySuccess',
      name: 'BuySuccess',
      component: BuySuccess
    }
  ]
}

export default router
