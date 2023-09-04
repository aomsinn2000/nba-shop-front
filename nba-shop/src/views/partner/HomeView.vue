<template>
  <div>
    <h1 class="text-center">ระบบจัดการร้านของ Partner NBA </h1>
    <div class="grid">
        <div class="col-12 lg:col-3">
           <Wallet />
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <TableShop/>
        </div>
    </div>
  </div>
</template>

<script>
import TableShop from '@/components/partner/dashboard/TableShop.vue'
import axios from 'axios'
import Wallet from '@/components/partner/wallet/Wallet.vue'
export default {
    components:{
        TableShop,
        Wallet,
    },
    async created(){
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers : {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err)=>{
            if(err.response.status===408){
                localStorage.clear();
                window.location.reload();
            }
        })
        document.title = "ยินดีต้อนรับเข้าสู่ NBA One Stop Shop"
    },
    async mounted(){
        await axios.get(`${process.env.VUE_APP_SHOP}partner/${localStorage.getItem('partner_id')}`, {
            headers:{
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res)=>{
            this.partner_wallet = res.data.data.partner_wallet;
        }).catch((err)=>{
            if(err.response.status === 408){
                window.location.reload();
            }
        })
    },
    data : ()=>({
        partner_wallet : 0,
    }),
    methods:{
        numberFormat(item){
            return item.toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
        }
    }
}
</script>

<style>

</style>