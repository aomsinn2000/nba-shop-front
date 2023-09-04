<template>
    <div v-if="loading">
        <Skeleton height="3rem" borderRadius="16px"></Skeleton>
    </div>
    <div v-else>
        <div v-if="amount === 0">
            <Card class="bg-red-400 text-white">
                <template #content>
                    <div class="grid pb-0 mb-0">
                        <div class="col-12 mb-0" v-if="$store.getters.position==='manager'">
                            <h1 class="p-0 m-0"><i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
                                <small>&nbsp; ใบแจ้งหนี้ </small>&nbsp;&nbsp; {{ numberFormat(amount) }}
                                &nbsp;&nbsp;<small>รายการ</small>
                            </h1>
                            <!-- <Button label="ดูใบแจ้งหนี้" class="p-button-danger mb-0 p-button-sm" @click="$router.push('/shop/invoice')"/> -->
                        </div>
                        <div class="col-12 mb-0" v-else>
                            <h2 class="p-0 m-0"><i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
                                ร้านนี้มีใบแจ้งหนี้ที่ต้องชำระ
                            </h2>
                        </div>
                    </div>
                </template>
            </Card>
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
        await axios.get(`${process.env.VUE_APP_SHOP}invoice/shop/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const invoice = res.data.data.filter((el)=>el.invoice_status!=='ชำระสำเร็จ');
            this.amount = invoice.length;
            this.loading = false;
        })
    },
    data: () => ({
        amount: 0,
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