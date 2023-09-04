<template>
    <Card class="bg-yellow-300 text-back">
        <template #content>
            <div class="grid pb-0 mb-0">
                <div class="col-12 mb-0">
                    <h1 class="p-0 m-0" style="text-align: center;">
                        <i class="pi pi-dollar"></i>&nbsp;<small style="font-size: 20px;">เงินคืน <small class="mt-0" style="font-size: 16px;">(กรณียกเลิกรายการ)</small>
                        &nbsp; : &nbsp; {{ thisDay }}</small>
                        <br>
                        <div>
                            &nbsp; 0 <small style="font-size: 20px;">&nbsp;บาท</small>
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

            if (this.id !== "") {
                this.item_service1 = order.filter(
                    (item) => item.shopid === this.id
                );

                if (this.thisDay !== "") {
                    this.item_service = this.item_service1.filter(
                        (item) => func.dateFormat(item.timestamp) === this.thisDay
                    );
                }
            }

            else {
                this.item_service = order.reverse();
            }

            this.total_service = this.item_service.reduce((sum, el) => sum + el.totalprice, 0);

        })

        // ออกแบบสื่อสิ่งพิมพ์
        await axios.get(`${process.env.VUE_APP_SHOP}artwork/preorder/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_artwork = res.data.data;
            this.loading = false;

            if (this.id !== "") {
                this.item_artwork1 = order_artwork.filter(
                    (item) => item.shop_id === this.id
                );

                if (this.thisDay !== "") {
                    this.item_artwork = this.item_artwork1.filter(
                        (item) => func.dateFormat(item.timestamp) === this.thisDay
                    );
                }
            }

            else {
                this.item_artwork = order_artwork.reverse();
            }

            this.total_artwork = this.item_artwork.reduce((sum, el) => sum + el.total, 0);
        })

        // counter service
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            const order_service = res.data.data;
            this.loading = false;

            if (this.id !== "") {
                this.item_counter_service1 = order_service.filter(
                    (item) => item.shop_id === this.id
                );

                if (this.thisDay !== "") {
                    this.item_counter_service = this.item_counter_service1.filter(
                        (item) => func.dateFormat(item.timestamp) === this.thisDay
                    );
                }
            }

            else {
                this.item_counter_service = order_service.reverse();
            }

            this.total_counter_service = this.item_counter_service.reduce((sum, el) => sum + el.receive, 0);
        })

        this.total = this.total_artwork + this.total_service + this.total_counter_service;
    },

    data: () => ({
        amount: 0,
        amount_artwork: 0,
        order_list: [],
        order_service: 0,
        loading: false,
        total_service: 0,
        total_artwork: 0,
        total_counter_service: 0,
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
        }
    }

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

div {
    padding-bottom: 0px;
}
</style>