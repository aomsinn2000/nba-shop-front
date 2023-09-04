<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <Card class="border-1 shadow-none border-gray-300">
                    <template #title>{{numberFormat(totalYear)}} บาท</template>
                    <template #content>ยอดขายทั้งปี {{thisYear}}</template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import axios from 'axios';
export default {
    async mounted(){
        const config = {
            headers:{
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/shop-id/${localStorage.getItem('shop_id')}`, config).then((res)=>{
            this.poshops =  res.data.data;
        }).catch((err)=>{
            this.$toast.add({severity:'error', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000});
        })
        const dataThisYear = this.poshops.filter((el)=>dayjs(el.poshop_timestamp).format('YYYY')===this.thisYear && el.poshop_status === true);
        this.totalYear = dataThisYear.reduce((sum, po)=> sum+po.poshop_total, 0);
    },
    data : ()=>({
        poshops : [],
        thisYear : dayjs(Date.now()).format('YYYY'),
        totalYear : 0,
    }),
    methods: {
        numberFormat(num) {
            return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        }
    }
}
</script>

<style>

</style>