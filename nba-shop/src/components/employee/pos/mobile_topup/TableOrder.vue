<template>
    <div>
        <div class="grid">
            <div class="col-12 lg:col-6">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-bookmark"></i>
                    </span>
                    <InputText placeholder="ค้นหาเลขที่ใบเสร็จ" class="font w-full" v-model="search"
                        @keyup.enter="findReceipt()" />
                    <Button icon="pi pi-search" @click="findReceipt()" />
                    <Button icon="pi pi-times" @click="clearReceipt()" class="p-button-danger" v-if="search !== ''" />
                </div>
            </div>
            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-5">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i> จาก
                            </span>
                            <Calendar placeholder="วันที่เริ่มต้น" :manualInput="false" showButtonBar class="w-full"
                                inputClass="font" v-model="datestart" />
                        </div>
                    </div>
                    <div class="col-12 lg:col-5">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i> ถึง
                            </span>
                            <Calendar placeholder="วันที่เริ่มสิ้นสุด" :manualInput="false" showButtonBar class="w-full"
                                inputClass="font" v-model="dateend" />
                        </div>
                    </div>
                    <div class="col-12 lg:col-2">
                        <Button icon="pi pi-search" @click="searchByDate()" />
                    </div>
                </div>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="item_order">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <Column header="เลขที่ใบเสร็จ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.invoice" />
                        </template>
                    </Column>
                    <Column header="รายการ" style="width: 20%">
                        <template #body="item">
                            {{ item.data.detail.productname }}
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.price) }}
                        </template>
                    </Column>
                    <Column header="ประเภทการชำระ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.payment_type" />
                        </template>
                    </Column>
                    <Column header="เจ้าหน้าที่">
                        <template #body="item">
                            <Badge :value="item.data.employee" class="bg-pink-600" />
                        </template>
                    </Column>
                    <Column header="ประเภทรายการ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.type"
                                :class="item.data.type === 'เติมเงินมือถือ' ? 'bg-purple-600 text-white' : 'bg-pink-600 text-white'" />
                        </template>
                    </Column>
                    <Column header="วันเวลาทำรายการ" style="width: 15%">
                        <template #body="item">
                            {{ datetimeFormat(item.data.timestamp) }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 20%">
                        <template #body="item">
                            <div class="grid">
                                <div class="col-12 lg:col-6">
                                    <DetailOrder :order="item.data" />
                                </div>
                                <div class="col-12 lg:col-6">
                                    <PrintReceipt :order_topup="item.data" />
                                </div>
                            </div>

                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs';
import DetailOrder from './DetailOrder.vue';
import PrintReceipt from './PrintReceipt.vue';
export default {
    components: {
        PrintReceipt,
        DetailOrder
    },
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}mobile_topup/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.orders = res.data.data;
            this.item_order = this.orders.reverse();
            this.isLoading = false;
        })
        this.$store.commit('setLoading', false);
    },
    data: () => ({
        orders: [],
        item_order: [],
        isLoading: false,
        search: '',
        datestart: null,
        dateend: null
    }),
    methods: {
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        datetimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
        dateFormat(date) {
            return dayjs(date).format('DD/MM/YYYY')
        },
        findReceipt() {
            if (this.search === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกหมายเลขใบเสร็จที่ต้องการค้นหา', life: 3000 });
                return false;
            } else {
                this.item_order = this.orders.filter((el) => el.invoice.search(this.search) !== -1);
            }

        },
        clearReceipt() {
            this.item_order = this.orders;
            this.search = '';
        },
        searchByDate() {
            if (this.datestart === null && this.dateend === null) {
                this.item_order = this.orders
                return false
            }
            if (this.datestart === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่เริ่มต้น', life: 3000 });
                return false;
            }
            if (this.dateend === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่สิ้นสุด', life: 3000 });
                return false;
            }
            this.item_order = this.orders.filter((el) => dayjs(el.timestamp).format('YYYY/MM/DD') >= dayjs(this.datestart).format('YYYY/MM/DD') &&
                dayjs(el.timestamp).format('YYYY/MM/DD') <= dayjs(this.dateend).format('YYYY/MM/DD')
            )
        }
    }
}
</script>

<style>

</style>