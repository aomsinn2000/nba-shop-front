<template>
    <Card class="card-background-color-income text-white">
        <template #content>
            <div class="grid pb-0 mb-0">
                <div class="col-12 mb-0">
                    <h1 class="p-0 m-0" style="text-align: center;">
                        <i class="pi pi-dollar"></i>&nbsp;&nbsp;<small style="font-size: 20px;">ยอดขายประจำวัน &nbsp; :
                            &nbsp; {{ thisDay }}</small>
                        <br>
                        <div>
                            &nbsp;{{ numberFormat(total) }} <small style="font-size: 20px;">&nbsp;บาท</small>
                        </div>
                    </h1>
                </div>
            </div>
        </template>
    </Card>
</template>

<script>
import func from '@/service/function'
import axios from 'axios'
import dayjs from 'dayjs'
export default {
    setup() {
        return func
    },
    async mounted() {
        this.loading = true;

        // service อื่นๆ
        await axios.get(`${process.env.VUE_APP_SHOP}orderservice/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order = res.data.data;
            this.loading = false;

            this.item_service1 = order.filter(
                (item) => item.shopid === this.id
            );

            this.item_service = this.item_service1.filter(
                (item) => func.dateFormat(item.timestamp) === this.thisDay
            );

            this.total_service = this.item_service.reduce((sum, el) => sum + el.totalprice, 0);

        })

        // counter service
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_service = res.data.data;
            this.loading = false;

            this.item_counter_service = order_service.filter(
                (item) => func.dateFormat(item.timestamp) === this.thisDay
            );

            this.total_counter_service = this.item_counter_service.reduce((sum, el) => sum + el.receive, 0);
        })

        // counter service
        await axios.get(`${process.env.VUE_APP_SHOP}mobile_topup/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_mobile = res.data.data;
            this.loading = false;

            this.item_mobile = order_mobile.filter(
                (item) => func.dateFormat(item.timestamp) === this.thisDay
            );

            this.total_mobile = this.item_mobile.reduce((sum, el) => sum + el.price, 0);
        })

        //express service
        await axios.get(`${process.env.VUE_APP_SHOP}express/order/shop_id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_express = res.data.data;
            this.isLoading = false;

            this.item_express = order_express.filter(
                (item) => func.dateFormat(this.getStatusTime(this.getLastStatus(item.status))) === this.thisDay
            )

            this.total_express = this.item_express.reduce((sum, el) => sum + el.total, 0);
        })

        this.total = this.total_service + this.total_counter_service + this.total_mobile + this.total_express;
    },

    data: () => ({
        loading: false,
        total_service: 0, //เซอร์วิสอื่นๆ artwork facebook website บัญชี IT
        total_counter_service: 0, //เคาน์เตอร์เซอร์วิส บริการฝากจ่าย
        total_mobile: 0, //บริการเติมเงินมือถือ เติมวอลเล็ต บัตรเติมเกม
        total_express: 0, //บริการขนส่ง
        total: 0,

        id: `${localStorage.getItem('shop_id')}`,

        thisDay: dayjs(Date.now()).format('DD/MM/YYYY'),
    }),

    methods: {
        numberFormat(item) {
            return item.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })
        },
        getStatusTime(item) {
            return this.getLastStatus(item).timestamp
        },
        getLastStatus(item) {
            return item[item.length - 1];
        },
    }

}
</script>

<style scoped>
.shop-invoice {
    background: linear-gradient(135deg, red, indigo);
    border: 1px solid red;
}
.card-background-color-income{
    background: linear-gradient(110deg, #fdcd3b 60%, #ffed4b 60%);
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

small {
    font-size: 20px;
}

div {
    padding-bottom: 0px;
}

</style>