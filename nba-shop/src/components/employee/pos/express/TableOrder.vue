<template>
    <div>
        <div class="grid">
            <div class="col-12 lg:col-6 md:col-6">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-bookmark"></i>
                    </span>
                    <InputText v-model="data_search" class="w-full font" placeholder="ค้นหาตามเลขที่ใบเสร็จ"
                        @keyup.enter="search()" />
                    <Button icon="pi pi-search" @click="search()" />
                    <Button icon="pi pi-times" @click="clearData()" class="p-button-danger" v-if="data_search !== ''" />
                </div>
            </div>
            <div class="col-12 lg:col-6 md:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-5">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i> จาก
                            </span>
                            <Calendar v-model="datestart" inputClass="font" class="w-full" placeholder="วันที่เริ่มต้น"
                                :showButtonBar="true" :manualInput="false" />
                        </div>
                    </div>
                    <div class="col-12 lg:col-5">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i> ถึง
                            </span>
                            <Calendar v-model="dateend" inputClass="font" class="w-full" placeholder="วันที่สิ้นสุด"
                                :showButtonBar="true" :manualInput="false" />
                        </div>
                    </div>
                    <div class="col-12 lg:col-2">
                        <Button icon="pi pi-search" class="mr-1" @click="searchByDate()" />
                    </div>
                </div>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="item_order" :loading="isLoading" :paginator="true" :rows="25">
                    <template #empty>
                        <p class="m-0 p-0 text-center"><em>--ไม่มีรายการ--</em></p>
                    </template>
                    <Column header="เลขที่ใบเสร็จ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.invoice" />
                        </template>
                    </Column>
                    <Column header="เลขที่ใบสั่งซื้อ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.purchase_id" class="bg-purple-500 text-white" />
                        </template>
                    </Column>
                    <Column header="ยอดรวม (บาท)" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.total) }}
                        </template>
                    </Column>
                    <Column header="การชำระเงิน" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.payment_type" />
                        </template>
                    </Column>
                    <Column header="สถานะ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="getStatusName(item.data.status)" :class="getColorStatus(item.data.status)" />
                        </template>
                    </Column>
                    <Column header="เจ้าหน้าที่" style="width: 10%">
                        <template #body="item">
                            <Badge :value="item.data.employee" class="bg-pink-500 text-white" />
                        </template>
                    </Column>
                    <Column header="วันที่ทำรายการ">
                        <template #body="item">
                            {{ dateTimeFormat(item.data.status[0].timestamp) }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก">
                        <template #body="item">
                            <Button @click="openCheckout(item.data)" label="ชำระเงิน" icon="pi pi-check"
                                v-if="getStatusName(item.data.status) === 'รอชำระเงิน'" class="p-button-outlined mr-1" />

                            <Detail :order="item.data" />

                            <Button @click="cancel(item.data)" :loading="isLoading" label="ยกเลิก" icon="pi pi-times"
                                class="ml-1 p-button-danger p-button-outlined"
                                v-if="getStatusName(item.data.status) !== 'ยกเลิก' && $store.getters.position === 'manager'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!--dialog Checkout-->
        <Dialog v-model:visible="dialogCheckout" header="ประเภทการจ่าย & ชำระเงิน" :modal="true" :style="{ width: '25vw' }"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
            <div class="grid">
                <div class="col-12">
                    <p class="m-0 p-0"><strong>เลขที่ใบเสร็จ : </strong> {{ order.invoice }}</p>
                </div>
                <div class="col-12">
                    <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
                        <template #content>
                            <h1 class="text-right" style="margin: 0; font-size: 40px">
                                {{ numberFormat(order.total) }}
                            </h1>
                        </template>
                    </Card>
                </div>
                <div class="col-12">
                    <Dropdown v-model="payment_type" placeholder="เลือกประเภทการชำระ" class="w-full" inputClass="font"
                        :options="['เงินสด', 'โอนเงิน', 'บัตรเครดิต', 'อื่นๆ']" @change="checkPaymentType()" />
                </div>
                <div class="col-12">
                    <InputNumber v-model="receive" placeholder="กรอกเงินที่รับมา" inputClass="font input-receive"
                        class="w-full" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2"
                        :disabled="disablePayment" @keyup.enter="checkout()" />
                </div>
            </div>
            <template #footer>
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <Button label="รับเงิน (Enter)" class="p-button-lg w-full" @click="checkout()"
                                :loading="isLoading" />
                        </div>
                    </div>
                </div>
            </template>
        </Dialog>

        <!--dialog แสดงเงินทอน-->
        <Dialog :aria-current="true" v-model:visible="dialogChange" header="เงินทอน" :modal="true" :closable="false"
            :style="{ width: '25vw' }" :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
            <div class="grid">
                <div class="col-12">
                    <p class="m-0 p-0"><strong>เลขที่ใบเสร็จ : </strong> {{ order.invoice }}</p>
                </div>
                <div class="col-12">
                    <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
                        <template #content>
                            <h1 class="text-right" style="margin: 0; font-size: 40px">
                                {{ numberFormat(change) }}
                            </h1>
                        </template>
                    </Card>
                    <div class="grid">
                        <div class="col-12 mt-3">
                            <Button label="ตกลง" icon="pi pi-check" class="w-full" @click="dialogChange = false;" />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- dialog loading-->
        <Dialog class="border-0 shadow-none " :draggable="false" v-model:visible="dialogLoading" :closable="false"
            :modal="true">
            <ProgressSpinner style="width:80px;height:80px" strokeWidth="5" fill="var(--surface-ground)"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import Detail from '@/components/employee/pos/express/Detail.vue'
export default {
    components: {
        Detail
    },
    async created() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}express/order/shop_id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.orders = res.data.data;
            this.item_order = this.orders.reverse();
            this.isLoading = false;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        });


    },
    data: () => ({
        data_search: "",
        isLoading: true,
        dialogLoading: false,
        item_order: [],
        orders: [],
        dialogCheckout: false,
        dialogChange: false,
        disablePayment: false,
        payment_type: "เงินสด",
        isLoadingButton: false,
        receive: null,
        change: null,
        order: null,
        print_receipt: {
            employee: "",
            invoice: "",
            invoice_full: "",
            parcel: [],
            payment_type: "",
            product: [],
            purchase_id: "",
            receive: "",
            shop_id: "",
            status: [],
            total: 0,
            total_cost: 0
        },
        datestart: null,
        dateend: null,
    }),
    methods: {
        searchByDate() {
            if (this.datestart === null && this.dateend === null) {
                this.item_order = this.orders;
                return false;
            }

            if (this.datestart === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่เริ่มต้น', life: 3000 });
                return false
            }

            if (this.dateend === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่สิ้นสุด', life: 3000 });
                return false;
            }

            this.item_order = this.orders.filter((el) => dayjs(el.status[0].timestamp).format('YYYY/MM/DD') >= dayjs(this.datestart).format('YYYY/MM/DD') &&
                dayjs(el.status[0].timestamp).format('YYYY/MM/DD') <= dayjs(this.dateend).format('YYYY/MM/DD')
            )
        },
        async search() {
            this.isLoading = true;
            if (this.data_search !== "") {
                this.item_order = this.orders.filter((el) => el.invoice.search(this.data_search) !== -1);
            } else {
                this.item_order = this.orders;
            }
            this.isLoading = false;
        },
        clearData() {
            this.data_search = '';
            this.item_order = this.orders;
        },
        openCheckout(item) {
            this.order = item;
            this.dialogCheckout = true;
        },
        checkout() {
            if (this.receive === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกจำนวนเงินที่รับมา', life: 3000 });
                return false;
            }

            if (this.receive < this.order.total) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'จำนวนเงินที่รับไม่พอกับยอดสุทธิ', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: `ยืนยันการชำระเงินใบเสร็จเลขที่ ${this.order.invoice} ยืนยันการบุ๊คกิ้งพัสดุ(กรณีมีพัสดุ)`,
                header: 'ยืนยันชำระเงิน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    //confirm booking
                    if (this.order.purchase_id !== 'ไม่มี') {
                        await axios.post(`${process.env.VUE_APP_SHOP}express/confirm`, {
                            shop_id: this.$store.getters.shop._id,
                            purchase_id: this.order.purchase_id
                        }, {
                            headers: {
                                'auth-token': `Bearer ${this.$store.getters.token}`
                            }
                        }).catch((err) => {
                            if (err.response.status === 408) {
                                window.location.reload();
                            }
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        })
                    }
                    const status = []
                    status.push(this.order.status[0]);
                    const new_timestamp = {
                        name: "ชำระเงิน",
                        timestamp: dayjs(Date.now()).format()
                    }
                    status.push(new_timestamp)

                    //อัพเดตข้อมูลในใบเสร็จ
                    const order_data = {
                        receive: this.receive,
                        payment_type: this.payment_type,
                        status: status
                    }
                    const checkout = await axios.put(`${process.env.VUE_APP_SHOP}express/order/${this.order._id}`, order_data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).catch((err) => {
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })

                    if (checkout) {
                        //get ข้อมูลมูลมาเพิ่มอัพเดต
                        const new_data = await axios.get(`${process.env.VUE_APP_SHOP}express/order/${this.order._id}`, {
                            headers: {
                                'auth-token': `Bearer ${this.$store.getters.token}`
                            }
                        })
                        const position = this.item_order.findIndex((el) => el._id === this.order._id);
                        this.item_order.splice(position, 1, new_data.data.data);
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ชำระเงินเรียบร้อยแล้ว', life: 3000 });

                        this.isLoading = false;
                        this.dialogCheckout = false;
                        this.change = this.receive - this.order.total;
                        this.dialogChange = true;
                    }
                },
            });
        },
        checkPaymentType() {
            if (this.payment_type === "โอนเงิน" || this.payment_type === "บัตรเครดิต") {
                this.receive = this.order.total;
                this.disablePayment = true;
            } else {
                this.receive = null;
                this.disablePayment = false;
            }
        },
        getStatusName(item) {
            const status = item[item.length - 1].name;
            return status;
        },
        getColorStatus(item) {
            const status = this.getStatusName(item);
            switch (status) {
                case 'รอชำระเงิน':
                    return 'bg-yellow-500 text-white'
                case 'ชำระเงิน':
                    return 'bg-green-600 text-white'
                default:
                    return 'bg-red-500 text-white'
            }
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
        },
        dateTimeFormat(item) {
            return dayjs(item).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
        async cancel(item) {
            this.$confirm.require({
                message: 'ต้องการยกเลิกรายการนี้?',
                header: 'ยกเลิกรายการ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                        this.$store.commit('setLoading', true);
                        await axios.post(`${process.env.VUE_APP_SHOP}express/cancel`, {
                            shop_id: this.$store.getters.shop._id,
                            purchase_id: item.purchase_id
                        }, {
                            headers: {
                                'auth-token': `Bearer ${this.$store.getters.token}`
                            }
                        }).then(async () => {
                            const new_order = await axios.get(`${process.env.VUE_APP_SHOP}express/order/${item._id}`,{
                                headers : {
                                    'auth-token' : `Bearer ${localStorage.getItem('token')}`
                                }
                            }).catch((err)=>{
                                this.$store.commit('setLoading', false);
                                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                            });
                            const position_item =  this.item_order.findIndex((el)=>el._id === item._id);
                            const position_order = this.orders.findIndex((el)=>el._id === item._id);

                            this.orders.splice(position_order, 1,new_order.data.data);
                            this.item_order.splice(position_item,1, new_order.data.data);
                            this.$store.commit('setLoading', false);
                            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: "ยกเลิกพัสดุเรียบร้อยแล้ว", life: 3000 });

                        }).catch((err) => {
                            this.$store.commit('setLoading', false);
                            if (err.response.status === 408) {
                                window.location.reload();
                            }
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        })
                    
                    
                }
            });
        },
        dateFormat(date) {
            return dayjs(date).format('YYYY/MM/DD');
        },
        dateLastStatus(status) {
            return status[status.length - 1].name;
        },
        checkCancel(status) {
            if (dayjs(status[0].timestamp).format('YYYY/MM/DD') === dayjs(Date.now()).format('YYYY/MM/DD')) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style>
.text-total {
    font-size: 50px;
    margin: 0px;
}

.input-receive {
    font-size: 25px;
    text-align: right;
    font-weight: bold;
}
</style>