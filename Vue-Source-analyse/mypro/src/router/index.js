import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import B from '@/components/B'
import M from '@/components/M'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: HelloWorld
    },
    {
      path: '/b',
      component: B,
      children: [
        {
          path: 'db',
          name: 'db',
          component: M
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('before exec')
  console.log(router)
  next()
})

export default router
