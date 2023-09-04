import {createRouter, createWebHistory} from "vue-router";

let routes = [];
routes = [
  {
    path : "/",
    name : "home",
    component : ()=>import("../views/employee/HomeView.vue")
  },
  {
    path : "/pos",
    name : "pos",
    component: ()=>import('../views/employee/pos/PosView.vue')
  },
  {
    path : "/pos/shop",
    name : "pos-shop",
    component : ()=>import('../views/employee/pos/ShopView.vue')
  },
  {
    path: "/pos/artwork",
    name : 'pos-artwork',
    component : ()=>import('../views/employee/pos/ArtworkView.vue')
  },
  {
    path : "/pos/express",
    name : "pos-express",
    component : ()=>import('../views/employee/pos/ExpressView.vue')
  },
  {
    path : "/pos/counter_service",
    name : "pos-counter-service",
    component : ()=>import('../views/employee/pos/CouterServiceView.vue')
  },
  {
    path : "/pos/mobile_topup",
    name : "pos-mobile-topup",
    component : ()=>import('../views/employee/pos/MobileTopupView.vue')
  },
  {
    path : "/pos/program",
    name : "pos-program",
    component : ()=>import('../views/employee/pos/ProgrgamView.vue')
  },
  {
    path : "/pos/media_service",
    name : "pos-media-service",
    component : ()=>import('../views/employee/pos/MediaView.vue')
  },
  {
    path : "/pos/act_service",
    name : "pos-act-service",
    component : ()=>import('../views/employee/pos/ActView.vue')
  },
  {
    path : "/pos/Tax_service",
    name : "pos-tax-service",
    component : ()=>import('../views/employee/pos/TaxView.vue')
  },
  {
    path : "/pos/insurance_service",
    name : "pos-insurance-service",
    component : ()=>import('../views/employee/pos/InsuranceView.vue')
  },
  {
    path : "/pos/accounting",
    name : "pos-accounting-service",
    component : ()=>import('../views/employee/pos/AccountingView.vue')
  },
  {
    path : "/pos/itsupport",
    name : "pos-itsupport-service",
    component : ()=>import('../views/employee/pos/ITSupportView.vue')
  },
  {
    path : "/pos/customerdisplay",
    name : "pos-customerdisplay",
    component : ()=>import('../views/employee/pos/CustomerView.vue')
  },
  {
    path: "/report/shop/history",
    name : 'report-product-history',
    component: ()=>import('../views/employee/report/shop/HistoryView.vue')
  },
  {
    path : "/report/express/history",
    name : "report-express-history",
    component : ()=>import('../views/employee/report/express/HistoryView.vue')
  },
  {
    path : "/report/counter_service/history",
    name : "report-counter_service-history",
    component : ()=> import('../views/employee/report/counter_service/HistoryView.vue')
  },
  {
    path : "/report/media_service/history",
    name : "report-media-history",
    component : ()=>import('../views/employee/report/media_service/HistoryView.vue')
  },
  {
    path : '/report/mobile_topup/history',
    name : "report-mobile_topup-history",
    component : ()=> import('../views/employee/report/mobile_topup/HistoryView.vue')
  },
  {
    path : "/report/shop/reciept/:poshop_id",
    name : "report-shop-reciept",
    component : ()=>import('../views/employee/report/shop/RecieptView.vue')
  },
  {
    path : '/report/shop/tax_invoice/:poshop_id',
    name : 'report-shop-tax-invoice',
    component : ()=>import('../views/employee/report/shop/TaxInvoiceView.vue')
  },
  {
    path : "/cart/product",
    name : "cart-product",
    component : ()=>import("../views/employee/cart/ProductView.vue")
  },
  {
    path: '/cart/product/consignment',
    name : 'card-product-consignment',
    component :()=>import('../views/employee/cart/ConsignmentProduct.vue')
  },
  {
    path : "/cart/order",
    name : "cart-order",
    component : ()=>import("../views/employee/cart/OrderView.vue")
  },
  {
    path : "/cart/order/consignment",
    name : 'cart-order-consignment',
    component : ()=>import('../views/employee/cart/OrderConsignmentView.vue')
  },
  {
    path : "/product",
    name : "product",
    component : ()=>import('../views/employee/product/ProductView.vue')
  },
  {
    path : "/product/change_stock",
    name : "product-change-stock",
    component : ()=>import('../views/employee/product/ChangeStock.vue')
  },
  {
    path : "/product/import",
    name : "product-nba-import",
    component : ()=>import('../views/employee/product/ImportView.vue')
  },
  {
    path : "/product/request/add",
    name : "product-request-add",
    component : ()=>import('../views/employee/product/AddRequestView.vue')
  },
  {
    path : "/product/request",
    name : "product-shop-request",
    component : ()=> import('../views/employee/product/RequestView.vue')
  },
  {
    path : "/shop/closeshop",
    name : "shop-closeshop",
    component : ()=> import('../views/employee/shop/CloseShopView.vue')
  },
  {
    path :"/shop/invoice",
    name : "shop-invoice",
    component : ()=>import('../views/employee/shop/InvoiceView.vue')
  },
  {
    path : "/shop/employee",
    name : "shop-employee",
    component : ()=>import('../views/employee/shop/EmployeeView.vue')
  },
  {
    path : "/shop/product_express",
    name : "shop-productexpress",
    component : ()=> import("../views/employee/shop/ProductExpressView.vue")
  },
  {
    path : "/shop/about",
    name : "shop-about",
    component : ()=>import('../views/employee/shop/AboutView.vue')
  },
  {
    path: "/profile",
    name : "profile",
    component : ()=>import('../views/employee/ProfileView.vue')
  },
  {
    path : "/login",
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