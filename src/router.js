import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/piano",
      name: "piano",
      component: () => import(/* webpackChunkName: "piano" */ "./views/Piano.vue")
    },
    {
      path: "/circle",
      name: "circle",
      component: () => import(/* webpackChunkName: "circle" */ "./views/Circle.vue")
    }
  ]
})
