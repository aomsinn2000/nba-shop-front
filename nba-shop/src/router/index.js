import {createRouter, createWebHistory} from "vue-router";

let routes = [];
routes = [
  {
    path : "/",
    name : "login",
    component : ()=>import("../views/LoginView.vue")
  },
  {
    path : "/login",
    name : "login",
    component : ()=>import("../views/LoginView.vue")
  },{
    name:"NotFound",
    path:"/:pathMatch(.*)*",
    component :()=>import("../views/Error404.vue")
  }
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
