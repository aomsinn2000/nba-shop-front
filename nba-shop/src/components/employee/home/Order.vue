<template>
    <Panel>
        <template #header>
            <p class="p-0 m-0">
                <i class="pi pi-align-justify" style="font-size: 1rem"></i><strong>&nbsp;&nbsp;&nbsp; รายการประจำวัน {{
                    thisDay }} :
                    {{ amount_total }} รายการ</strong>
            </p>
        </template>
        <h2 class="p-0 m-0"><i class="pi pi-car" style="font-size: 1rem"></i>
            <small>&nbsp;&nbsp;&nbsp; บริการส่งพัสดุ </small>&nbsp;&nbsp;{{ numberFormat(amount_express) }}
            &nbsp;&nbsp;<small>รายการ</small>
        </h2>
        <h2 class="p-0 m-0"><i class="pi pi-phone" style="font-size: 1rem"></i>
            <small>&nbsp;&nbsp;&nbsp; บริการเติมเงินมือถือ </small>&nbsp;&nbsp; {{ numberFormat(amount_mobile) }}
            &nbsp;&nbsp;<small>รายการ</small>
        </h2>
        <h2 class="p-0 m-0"><i class="pi pi-shopping-bag" style="font-size: 1rem"></i>
            <small>&nbsp;&nbsp;&nbsp; บริการเคาน์เตอร์เซอร์วิส </small>&nbsp;&nbsp; {{
                numberFormat(amount_counter_service) }}
            &nbsp;&nbsp;<small>รายการ</small>
        </h2>
        <h2 class="p-0 m-0"><i class="pi pi-align-justify" style="font-size: 1rem"></i>
            <small>&nbsp;&nbsp;&nbsp; บริการอื่น ๆ </small>&nbsp;&nbsp;{{ numberFormat(amount_service) }}
            &nbsp;&nbsp;<small>รายการ</small>
        </h2>
    </Panel>
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
        //service
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
            this.amount_service = this.item_service.length;
        })

        //mobile_topup
        await axios.get(`${process.env.VUE_APP_SHOP}mobile_topup/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_mobile = res.data.data;
            this.loading = false;

            this.item_mobil = order_mobile.filter(
                (item) => func.dateFormat(item.timestamp) === this.thisDay
            )

            this.amount_mobile = this.item_mobil.length;
        })

        //counter_service
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

            this.amount_counter_service = this.item_counter_service.length;

        })

        //express
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

            this.amount_express = this.item_express.length;
        })
    },

    data: () => ({
        amount_mobile: 0, // บริการเติมเงิน
        amount_counter_service: 0, // บริการเคาน์เตอร์เซอร์วิส
        amount_service: 0, // บริการอื่นๆ
        amount_express: 0, // บริการขนส่ง
        loading: false,

        id: `${localStorage.getItem('shop_id')}`,

        item_service: [],
        item_artwork: [],
        item_counter_service: [],

        thisDay: func.dateFormat(Date.now()),

        amount_total: 0,

    }),

    methods: {
        getStatusTime(item) {
            return this.getLastStatus(item).timestamp
        },
        getLastStatus(item) {
            return item[item.length - 1];
        },
    },

}
</script>

<style scoped>
.shop-invoice {
    background: linear-gradient(135deg, red, indigo);
    border: 1px solid red;
}

small {
    font-size: 16px;
}

div {
    padding-bottom: 0px;
}
</style>