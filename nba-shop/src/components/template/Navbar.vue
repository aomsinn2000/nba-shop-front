<template>
  <div>
    <Menubar :model="item_menu">
      <template #start>
        <Button @click="openSideber()" label="เมนู" icon="pi pi-bars"
          class="mr-2 bg-gray-200 border-gray-400 text-gray-900" />
      </template>
      <template #end>
        <Button class="p-button-danger" label="ออกจากระบบ" icon="pi pi-power-off" @click="logout()" />
      </template>
    </Menubar>
    <div class="grid" v-if="textSlide !== ''">
      <div class="col-12">
        <marquee-text class="text-slide" :repeat="1">{{ textSlide }}</marquee-text>
      </div>
    </div>

    <Sidebar v-model:visible="sidebar">
      <div class="grid">
        <div class="col-12 text-center">
          <img alt="logo" src="@/assets/one_stop_logo.png" height="100" class="mr-2" />
        </div>
      </div>
      <PanelMenu :model="item_sidebar"></PanelMenu>
    </Sidebar>

    <!-- Dialog Block-->
    <Dialog v-model:visible="dialogBlock" :closable="false" :modal="true" :draggable="false"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '20vw' }">
      <div class="grid">
        <div class="col-12 text-center">
          <i class="pi pi-lock" style="font-size: 4rem"></i>
        </div>
        <div class="col-12 text-center">
          <h2>ร้านค้าถูกระงับ!</h2>
          <p class="m-0 p-0 mt-3">ร้านค้าถูกระบบชั่วคราว กรุณาติดต่อส่วนกลาง</p>
        </div>
      </div>
      <template #footer>
        <Button label="ออกจากระบบ" class="p-button-danger w-full" @click="logout()" />
      </template>
    </Dialog>

  </div>
</template>

<script>
import Menubar from "primevue/menubar";
import axios from 'axios';
import MarqueeText from "vue-marquee-text-component";
export default {
  components: {
    Menubar,
    MarqueeText
  },
  async mounted() {
    await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      this.shop = res.data.data;
      if (!res.data.data.shop_status) {
        this.dialogBlock = true;
      }
    })

    await axios.get(`${process.env.VUE_APP_SHOP}more/function_more/function/declare_text_slide`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      if (res.data.data.func_detail.length !== 0) {
        for (let i = 0; i < res.data.data.func_detail.length; i++) {
          this.textSlide = this.textSlide + ' | ' + res.data.data.func_detail[i]
        }
      }
    })
    this.setItemMenu();
    this.setItemSidebar();
  },
  data: () => ({
    shop: null,
    sidebar: false,
    dialogBlock: false,
    textSlide: "",
    item_menu: [],
    item_sidebar: [],
  }),
  methods: {
    checkPosition(position) {
      if (this.$store.getters.position === position) {
        return true;
      } else {
        return false;
      }
    },
    checkFunction(item, position) {
      const func = this.shop.shop_function.find((el) => el.name === item);
      if (func) {
        if (func.status) {
          if (position) {
            return this.checkPosition(position)
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    setItemSidebar() {
      this.item_sidebar = [{
        label: "เมนูหลัก",
        icon: 'pi pi-th-large',
        to: '/pos'
      },
      {
        label: "บริการ",
        items: [
          {
            label: "ขายสินค้า",
            to: "/pos/shop",
            icon: "pi pi-circle",
            visible: this.checkFunction('pos'),
          },
          {
            label: "เติมเงินมือถือ",
            to: "/pos/mobile_topup",
            icon: "pi pi-circle",
            visible: this.checkFunction('mobile_topup'),
          },
          {
            label: "ส่งพัสดุ",
            to: "/pos/express",
            icon: "pi pi-circle",
            visible: this.checkFunction('express'),
          }, {
            label: "ฝากจ่ายเคาน์เซอร์วิส",
            to: "/pos/counter_service",
            icon: "pi pi-circle",
            visible: this.checkFunction('counter_service'),
          },
          {
            label: "บริการอื่นๆ",
            to: "/pos/media_service",
            icon: "pi pi-circle",
            visible: this.checkFunction('media_service'),
          },
          {
            label: "รับฝากโอน",
            to: "/pos/transfer",
            icon: "pi pi-circle",
            visible: this.checkFunction('transfer'),
          }, 
          
        ]
      },
      {
        label: "ประวัติ",
        items: [
          { label: "ประวัติการขายสินค้า", icon: "pi pi-circle", to: "/report/shop/history", visible: this.checkFunction('pos') },
          { label: "ประวัติการเติมเงินมือถือ", icon: "pi pi-circle", to: "/report/mobile_topup/history", visible: this.checkFunction('mobile_topup') },
          { label: "ประวัติการส่งพัสดุ", icon: "pi pi-circle", to: "/report/express/history", visible: this.checkFunction('express') },
          { label: "ประวัติฝากจ่ายเคาน์เตอร์เซอร์วิส", icon: "pi pi-circle", to: "/report/counter_service/history", visible: this.checkFunction('counter_service'), },
          { label : "ประวัติสั่งงานบริการอื่นๆ", icon: "pi pi-circle", to: "/report/media_service/history", visible : this.checkFunction('media_service')},
        ]
      },]
    },
    setItemMenu() {
      this.item_menu = [{
        label: "หน้าแรก",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "ตะกร้าสินค้า",
        icon: "pi pi-fw pi-shopping-cart",
        visible: this.checkFunction('pos', 'manager'),
        items: [
          {
            label: "สั่งสินค้า",
            icon: "pi pi-fw pi-circle",
            items: [
              {
                label: "สินค้าซื้อด้วยเครดิต",
                to: "/cart/product"
              },
              {
                label: "สินค้าฝากขาย",
                to: "/cart/product/consignment"
              }
            ]
          },
          {
            label: "รายการสั่งซื้อ",
            icon: "pi pi-fw pi-circle",
            items: [
              {
                label: 'เครดิต',
                to: '/cart/order'
              },
              {
                label : 'ฝากขาย',
                to: '/cart/order/consignment'
              }
            ]
          },
        ],
      },
      {
        label: "สต๊อกสินค้า",
        icon: "pi pi-fw pi-database",
        visible: this.checkFunction('pos'),
        items: [
          {
            label: "สินค้าทั้งหมด",
            icon: "pi pi-fw pi-circle",
            to: "/product",
          },
          {
            label: "ปรับสต๊อกสินค้า",
            icon: "pi pi-fw pi-sync",
            to: "/product/change_stock",
          },
          {
            label: "นำเข้าสินค้า",
            icon: "pi pi-fw pi-download",
            to: '/product/import',
            visible: this.checkPosition('manager')
          }
        ],
      },
      {
        label: "เกี่ยวกับร้านค้า",
        icon: "pi pi-fw pi-briefcase",
        items: [
          {
            label: "ปิดขายประจำวัน",
            icon: 'pi pi-fw pi-times',
            to: "/shop/closeshop",
            visible: this.checkFunction('pos', 'manager'),
          },
          {
            label: "ใบแจ้งหนี้",
            icon: "pi pi-fw pi-file",
            to: "/shop/invoice",
            visible: this.checkFunction('pos', 'manager'),
          },
          {
            label: "จัดการพนักงาน",
            icon: "pi pi-fw pi-users",
            to: "/shop/employee",
          },
          {
            label: "สินค้าระบบขนส่ง",
            icon: "pi pi-fw pi-box",
            to: "/shop/product_express",
            visible: this.checkFunction('express', 'manager'),
          },
          {
            label: "เกี่ยวกับร้านค้า",
            icon: "pi pi-fw pi-info-circle",
            to: "/shop/about",
          },
        ],
      },
      {
        label: "ตั้งค่าโปรไฟล์",
        icon: "pi pi-fw pi-cog",
        to: "/profile",
      }]
    },
    openSideber() {
      this.sidebar = true;
    },
    logout() {
      this.$confirm.require({
        message: "ต้องการออกจากระบบนี้?",
        header: "ออกจากระบบ",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        acceptLabel: "ออกจากระบบ",
        rejectLabel: "ยกเลิก",
        accept: () => {
          localStorage.clear();
          window.location.reload();
        },
      });
    },
  },
};
</script>

<style scoped>
.text-slide {
  color: white;
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
  background: linear-gradient(110deg, #7c3aed 60%, #8b5cf6 60%);
}

</style>