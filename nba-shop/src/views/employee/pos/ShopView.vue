<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>ขายสินค้า (POS)</h1>
      </div>
    </div>
    <div class="grid">
      <div class="col-12 lg:col-5">
        <ProductList />
      </div>
      <div class="col-12 lg:col-7">
        <Checkout />
        <OrderList />
      </div>
    </div>

    <!-- Dialog Alert-->
    <Dialog v-model:visible="dialogAlert" :closable="false" :modal="true" :draggable="false"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '20vw' }">
      <div class="grid">
        <div class="col-12 text-center">
          <i class="pi pi-lock" style="font-size: 4rem"></i>
        </div>
        <div class="col-12 text-center">
          <h2>บล็อคการขายสินค้า!</h2>
          <p class="m-0 p-0 mt-3">เนื่องจากร้านนี้มีใบแจ้งหนี้ค้างชำระอยู่ จึงไม่สามารถให้บริการขายหน้าร้านได้</p>
        </div>
      </div>
      <div class="grid">
        <div class="col-12 md:col-6 mt-2">
          <Button label="ชำระใบแจ้งหนี้" class="w-full" @click="$router.push('/shop/invoice')" />
        </div>
        <div class="col-12 md:col-6 mt-2">
          <Button label="หน้าหลัก" @click="$router.push('/')" class="p-button-outlined w-full" />
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script>
import Checkout from "@/components/employee/pos/shop/Checkout.vue";
import ProductList from "@/components/employee/pos/shop/ProductList.vue";
import OrderList from "@/components/employee/pos/shop/OrderList.vue";
import axios from 'axios';
export default {
  components: {
    ProductList,
    OrderList,
    Checkout,
  },
  async created() {
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
    })
    document.title = "ขายสินค้าในร้าน (POS)";

    //check invoice
    await axios.get(`${process.env.VUE_APP_SHOP}invoice/shop/shop-id/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(async (res) => {
      const invoices = await res.data.data.filter((el) => el.invoice_status === 'ค้างชำระ' || el.invoice_status === 'รอตรวจสอบ')
      if (invoices.length > 1) {
        this.dialogAlert = true;
      } else {
        this.dialogAlert = false;
      }
    })
  },
  async mounted() {
    //ตรวจสอบร้านค้านี้เปิดให้บริการขายหน้าร้านไหม
    await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).then((res) => {
      const shop_function = res.data.data.shop_function;
      const check_function = shop_function.find((el) => el.name === 'pos');
      if (!check_function) {
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ไม่สามารถใช้งานฟังก์ชั่นขายสินค้าได้', life: 3000 });
        this.$router.push('/pos');
      } else {
        if (!check_function.status) {
          this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ถูกระงับการใช้งานฟังก์ชั่นขายสินค้าชั่วคราว', life: 3000 });
          this.$router.push('/pos');
        }
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
      this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
    })
    localStorage.setItem('order_total', this.$store.getters.order_total);
    localStorage.setItem('order_amount', 0);
  },
  data: () => ({
    dialogAlert: false
  })
};
</script>

<style>

</style>