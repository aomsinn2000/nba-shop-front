<template>
    <Button icon="pi pi-list" class="w-full" label="รายละเอียด" @click="detail()" />
    <Sidebar v-model:visible="sidebar" class="p-sidebar-md" position="right">
        <div v-if="order != null">
            <div class="grid mb-2">
                <div class="col-12 text-center">
                    <h2 class="p-0 m-0">รายละเอียด</h2>
                    <p class="p-0 m-0"><strong>เลขที่ใบเสร็จ : </strong> {{ order.invoice }}</p>
                    <p class="p-0 m-0" v-if="order.company==='NBA'"><strong>เลขที่ทำรายการ NBA : </strong> {{ order.detail.orderid }}</p>
                    <p class="p-0 m-0" v-if="order.company==='SOT'"><strong>เลขที่ทำรายการ SOT : </strong> {{ order.detail.orderid }}</p>
                    <p class="p-0 m-0"><small>{{ datetimeFormat(order.timestamp) }}</small></p>
                </div>
            </div>
            <div class="grid">
                <div class="col-12 text-center" v-if="order.detail.productid">
                    <img :src="getImage(order.detail.productid)" width="100" />
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <Divider align="center" type="dashed">
                        <Chip :label="order.detail.productname" />
                    </Divider>
                </div>
                <div class="col-12">
                    <h2 class="p-0 m-0"><small>ยอดชำระ : </small> {{ numberFormat(order.price) }} <small>บาท</small></h2>
                    <p><strong>ค่าธรรมเนียม + บริการ : </strong> {{ numberFormat(order.charge) }}</p>
                    <p><strong>เลขอ้างอิง 1 (ref 1) : </strong> {{ order.detail.ref1 }}</p>
                    <p><strong>เลขอ้างอิง 2 (ref 2) : </strong> {{ order.detail.ref2 }}</p>
                </div>
                <div class="col-12">
                    <PrintReceipt :order_cs="order_cs" />
                </div>
            </div>
        </div>
    </Sidebar>
</template>

<script>
import dayjs from 'dayjs'
import PrintReceipt from './PrintReceipt.vue'
export default {
    components: {
        PrintReceipt
    },
    props: {
        order_cs: Object
    },
    data: () => ({
        isLoading: false,
        sidebar: false,
        order: null,
    }),
    methods: {
        detail() {
            this.order = this.order_cs
            this.sidebar = true
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        datetimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
        getImage(item) {
            try {
                return require('@/assets/img/counter_service/' + item + '.png');
            } catch {
                return 'https://promotions.co.th/wp-content/uploads/2019/03/06.jpg';
            }
        }
    }
}
</script>

<style>

</style>