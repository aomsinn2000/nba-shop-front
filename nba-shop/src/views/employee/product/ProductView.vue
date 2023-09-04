<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>สินค้าในสต๊อกทั้งหมด</h1>
      </div>
    </div>
    <!--ตารางสินค้า-->
    <div class="grid">
      <div class="col-12">
        <ProductList />
      </div>
    </div>
  </div>
</template>

<script>
import ProductList from '@/components/employee/product/ProductList'
import axios from 'axios';
export default {
  components: {
    ProductList,
  },
  created() {
    document.title = "สินค้าในสต๊อกทั้งหมด";
  },
  async mounted(){
    //check login
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers : {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).catch((err)=>{
      if(err.response.status === 408){
        this.$router.push('/login');
      }
    });

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
  data : ()=>({
    products:[],
    item_product: [],
  })
};
</script>