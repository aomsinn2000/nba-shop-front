<template>
  <div class="grid">
    <div class="col-12">
        <h1>จัดการสินค้าและบริการสำหรับระบบขนส่ง</h1>
        <p class="mt-0 text-gray-500"><em>จัดการสินค้าสำหรับแสดงในรายส่งพัสดุเป็นตัวเลือกช่วยในการขาย</em></p>
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
        <ProductExpress/>
    </div>
  </div>
</template>

<script>
import ProductExpress from '@/components/employee/shop/ProductExpress.vue';
import axios from 'axios';
export default {
    components: {
        ProductExpress
    },
    async created(){
        //call me
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null ,{
            headers : {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err)=>{
            if(err.response.status === 408){
                localStorage.clear();
                window.location.assign('/login');
            }
        });
        //check position 
        if(this.$store.getters.position!=="manager"){
            this.$router.push('/');
        }
        //title set
        document.title = "จัดการสินค้า & บริการสำหรับระบบขนส่ง"
    },
}
</script>

<style>

</style>