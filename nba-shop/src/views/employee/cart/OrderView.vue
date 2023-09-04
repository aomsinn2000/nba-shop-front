<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>รายการสั่งซื้อสินค้าด้วยเครดิต</h1>
      </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <OrderList/>
        </div>
    </div>
  </div>
</template>

<script>
import OrderList from '@/components/employee/cart/OrderList.vue'
export default {
    components:{
        OrderList
    },
  created() {
    document.title = "รายการสั่งซื้อสินค้าด้วยเครดิต";
  },
  async mounted() {
    //only manager can user this page;
    if (this.$store.getters.position !== "manager") {
      this.$router.push("/");
    }

    //check function
    try {
      const func = await this.$store.getters.shop.shop_function.find((el) => el.name === 'pos');
      if (func) {
        if (!func.status) {
          this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
          this.$router.push('/pos');
        }
      } else {
        this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
        this.$router.push('/pos')
      }
    } catch (err) {
      this.$router.push('/pos')
    }

  },
};
</script>

<style>
</style>