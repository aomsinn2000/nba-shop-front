<template>
  <div>
    <div class="grid">
        <div class="col-12">
            <h1>เกี่ยวกับร้านค้า</h1>
        </div>
        <div class="col-12">
            <AboutShop :shop="this.shop" />
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AboutShop from '@/components/partner/shop/AboutShop.vue'
export default {
    components:{
        AboutShop
    },
    async mounted(){
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`,{
            headers:{
                'auth-token' : `Bearer ${this.$store.getters.token}`
            }
        }).then((res)=>{
            this.shop = res.data.data
        }).catch((err)=>{
            if(err.response.status===408){
                window.location.reload();
            }else{
                this.$toast.add({severity:'error', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000})
                this.$router.push('/');
            }
        })
    },
    data:()=>({
        shop:{
            shop_name: "",
            shop_number: "",
            shop_logo : "",
        }
    })
}
</script>

<style>

</style>