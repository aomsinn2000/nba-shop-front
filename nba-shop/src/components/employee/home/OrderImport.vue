<template>
  <!--จำนวนใบรับสินค้าที่ยังไม่นำเข้าสต๊อก/หรือรอเข้าสต๊อก-->
  <div>
    <div v-if="loading">
        <Skeleton height="3rem" borderRadius="16px"></Skeleton>
    </div>
    <div v-else>
        <div v-if="amount === 0">
            <Card class="bg-yellow-400">
                <template #content>
                    <div class="grid pb-0 mb-0">
                        <div class="col-12 mb-0" v-if="$store.getters.position==='manager'">
                            <h1 class="p-0 m-0"><i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
                                <small>&nbsp;รอรับใบนำเข้าสินค้า </small>&nbsp;&nbsp; {{ numberFormat(amount) }}
                                &nbsp;&nbsp;<small>รายการ</small>
                            </h1>
                            <!-- <Button label="ดูใบแจ้งหนี้" class="p-button-danger mb-0 p-button-sm" @click="$router.push('/shop/invoice')"/> -->
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
  </div>
</template>

<script>
import func from '@/service/function'
import axios from 'axios'
export default {
    setup() {
        return func
    },
    async mounted() {
        this.loading = true;
        await axios.get(`${process.env.VUE_APP_SHOP}order_consignment/shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const amount_order_con = res.data.data.filter((el)=>el.status[el.status.length-1].name === 'ระหว่างจัดส่ง' || el.status[el.status.length-1].name === 'จัดส่งสำเร็จ');
            this.amount_order_con = amount_order_con.length;
        })

        await axios.get(`${process.env.VUE_APP_SHOP}order/shop-id/${localStorage.getItem('shop_id')}`,{
            headers : {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res)=>{
            const amount_order = res.data.data.filter((el)=>el.status[el.status.length-1].name === 'ระหว่างจัดส่ง' ||  el.status[el.status.length-1].name === 'จัดส่งสำเร็จ');
            this.amount_order = amount_order.length;
        })
        this.amount = this.amount_order+ this.amount_order_con;

        this.loading = false;
    },
    data: () => ({
        amount: 0,
        amount_order: 0,
        amount_order_con : 0,
        loading : true
    })
}
</script>

<style scoped>
.shop-invoice {
    background: linear-gradient(135deg, red, indigo);
    border: 1px solid red;
}

small {
    font-size: 20px;
}
div{
    padding-bottom: 0px;
}
</style>