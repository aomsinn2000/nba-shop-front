import {createRouter, createWebHistory} from "vue-router";

let routes = [];
routes = [
  {
    path : "/",
    name : "dashboard",
    component : ()=>import("../views/partner/HomeView.vue")
  },
  {
    path : '/profile', 
    name : 'profile',
    component : ()=>import('../views/partner/ProfileView.vue')
  },
  {
    path : '/wallet/history',
    name : 'money-history',
    component : ()=>import('../views/partner/wallet/HistoryView.vue')
  },
  {
    path : '/wallet/topup',
    name : 'wallet-topup',
    component : ()=>import('../views/partner/wallet/TopupView.vue')
  },
  {
    path : '/wallet/topup/slip',
    name : 'wallet-topup-slip',
    component : ()=>import('../views/partner/wallet/SlipTopupView.vue')
  },
  {
    path : '/wallet/topup/qrcode',
    name : 'wallet-topup-qrcode',
    component : ()=>import('../views/partner/wallet/QrCodeView.vue')
  },
  {
    path : '/wallet/commission',
    name : 'wallet-commission',
    component : ()=>import('../views/partner/wallet/Commission.vue')
  },
  {
    path : "/shop/:shop_id",
    name : "shop",
    component : ()=>import('../views/partner/ShopView.vue')
  },
  {
    path : '/login',
    name : "login",
    component : ()=>import('../views/LoginView.vue')
  },
  {
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