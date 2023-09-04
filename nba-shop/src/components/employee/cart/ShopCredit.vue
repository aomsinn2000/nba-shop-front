<template>
  <div>
    <div class="grid">
        <div class="col-12">
            <Panel>
                <template #header><i class="pi pi-wallet"></i>เครดิตร้านค้า</template>
                <h2 class="text-center">{{numberFormat(this.$store.getters.shop_credit)}} <small>บาท</small></h2>
            </Panel>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted(){
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`,{
            headers:{
                'auth-token':`Bearer ${this.$store.getters.token}`
            }
        }).then((res)=>{
            this.$store.commit('setShopCredit', res.data.data.shop_credit);
        }).catch((err)=>{
            if(err.response.status===408){
                window.location.reload();
            }
        })
    },
    methods:{
        numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    }
}
</script>

<style>

</style>