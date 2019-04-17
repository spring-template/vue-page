import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/layout'
import Login from '@/components/login/login'
import Register from '@/components/register/register'
import Film from '@/components/film/film'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'',
      name:'layout',
      component:Layout,
      children:[
        {
          path:'/register',
          name:'register',
          component:Register
        },
        {
          path:'/login',
          name:'login',
          component:Login
        }
      ]
    },
    {
      path:'/film',
      name:'film',
      component: Film
    }
  ]
})
