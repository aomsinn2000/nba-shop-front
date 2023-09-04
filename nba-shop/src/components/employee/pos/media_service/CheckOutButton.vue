<template>
    <Button label="ชำระเงิน" icon="pi pi-check" class="w-full p-button-lg" @click="checkout()" />

    <!-- Dialog กรอกยอดเงิน-->
    <Dialog v-model:visible="dialogRecieve" header="ประเภทการจ่าย & ชำระเงิน" :modal="true" :style="{ width: '25vw' }"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :closable="false">
        <div class="grid">
            <div class="col-12">
                <div class="field">
                    <Dropdown v-model="payment_type" placeholder="เลือกประเภทการชำระ" class="w-full" inputClass="font"
                        :options="['เงินสด', 'เงินโอน', 'บัตรเครดิต', 'อื่นๆ']" @change="checkPaymentType()" />

                </div>
            </div>
            <div class="col-12">
                <div class="field">
                    <InputNumber v-model="receive" placeholder="กรอกเงินที่รับมา" inputClass="font input-receive w-full"
                        class="w-full" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2"
                        @keyup.enter="check()" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <Button label="รับเงิน (Enter)" class="p-button-lg w-full" @click="check()" />
                        <Button label="ยกเลิก" class="p-button-danger w-full p-button-text mt-2"
                            @click="dialogRecieve = false, receive = null" />
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
                <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
                    <template #content>
                        <h1 class="text-right" style="margin: 0; font-size: 40px">
                            {{ numberFormat(change) }}
                        </h1>
                    </template>
                </Card>
                <div class="grid mb-0 pb-0">
                    <div class="col-12 mt-2">
                        <PrintReceipt :order="res" className="w-full" />
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <Button label="ทำรายการต่อ" icon="pi pi-sync" class="p-button-secondary p-button-outlined w-full"
                            @click="again()" />
                    </div>
                    <div class="col-12 lg:col-6">
                        <Button label="หน้าหลัก" class="p-button-outlined w-full" icon="pi pi-home"
                            @click="$router.push('/')" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
<script>
import func from '@/service/function'
import dayjs from 'dayjs';
import axios from 'axios';
import PrintReceipt from '@/components/employee/pos/media_service/PrintReceipt.vue'
export default {
    components: {
        PrintReceipt
    },
    setup() {
        return func;
    },
    data: () => ({
        dialogRecieve: false,
        dialogChange: false,
        payment_type: 'เงินสด',
        receive: null,
        change: 0,
        res: null,
        partner: [],
        partner_wallet: 0,
    }),
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.shop = res.data.data
        })
        await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.shop.shop_partner_id}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.partner = res.data.data;
            this.partner_wallet = res.data.data.partner_wallet;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    methods: {
        async checkout() {
            if (this.$store.getters.order_media_total === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่มีรายการชำระเงิน', life: 3000 });
                return false;
            }

            if (this.$store.getters.media_cus.name === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลข้อมูลรายละเอียดลูกค้าและยืนยันข้อมูล', life: 5000 });
                return false;
            }

            if (this.$store.getters.order_media_total > this.partner_wallet) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยอดเงินในกระเป๋าไม่พอชำระ กรุณาเติมเงิน', life: 3000 });
                return false;
            }

            this.dialogRecieve = true;
        },
        checkPaymentType() {
            console.log(this.payment_type);
            if (this.payment_type === 'เงินโอน' || this.payment_type === 'บัตรเครดิต') {
                this.receive = this.$store.getters.order_media_total;
            } else {
                this.receive = null;
            }
        },
        check() {
            console.log('รับเงินทอน')
            if (this.receive === null || this.receive === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกจำนวนเงินที่รับมา', life: 5000 });
                return false;
            }

            if (this.receive < this.$store.getters.order_media_total) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'จำนวนเงินที่รับมาไม่เพียงพอ', life: 5000 });
                return false;
            }

            const config = {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }

            this.$confirm.require({
                message: 'รับเงินมาครบถ้วน ต้องการบันทึกข้อมูล?',
                header: 'ยืนยันการจ่ายเงิน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    //check address
                    let address = 'ไม่มี';
                    const num = Number(this.$store.getters.order_media_total);
                    const del_wallet = this.partner_wallet - num;
                    const _id = this.partner._id;
                    this.change = this.receive - this.$store.getters.order_media_total;
                    if (this.$store.getters.media_cus.address !== '') {
                        address = this.$store.getters.media_cus.address;
                    }
                    const data = {
                        customer_tel: this.$store.getters.media_cus.tel_platform,
                        customer_name: this.$store.getters.media_cus.name,
                        customer_contact: this.$store.getters.media_cus.tel,
                        customer_address: address,
                        customer_iden_id: this.$store.getters.media_cus.people_id,
                        customer_line: this.$store.getters.media_cus.line_id,
                        product_detail: this.$store.getters.order_media,
                        paymenttype: this.payment_type,
                        moneyreceive: this.receive,
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}facebookservice/order`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.$store.commit('setLoading', false);
                        localStorage.setItem('order_change', this.change);
                        this.res = res.data.data;
                        this.dialogRecieve = false;
                        this.receive = null;
                        this.dialogChange = true;
                        this.$toast.add({
                            severity: "success",
                            summary: "สำเร็จ",
                            detail: "รายการสำเร็จ",
                            life: 3000,
                        });
                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        console.log(err)
                        this.$store.commit('setLoading', false);
                        this.$toast.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: err.response.data.message, life: 3000 });
                        this.$router.push('/');
                    })
                    await axios
                        .put(
                            `${process.env.VUE_APP_SHOP}partner/${_id}`,
                            { partner_wallet: del_wallet },
                            {
                                headers: {
                                    "auth-token": `Bearer ${this.$store.getters.token}`,
                                },
                            }
                        )
                        .then(() => {
                            this.partner_wallet = del_wallet;
                        })
                    const history = {
                        shop_id: this.$store.getters.shop._id,
                        partner_id: this.$store.getters.partner._id,
                        name: `บริการส่งเสริมการตลาดออนไลน์ ใบเสร็จ เลขที่ ${this.res.receiptnumber}`,
                        type: 'เงินออก',
                        amount: this.$store.getters.order_media_total,
                        timestamp: dayjs(Date.now()).format()
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}more/money_history`, history, config).catch((err) => {
                        this.$store.commit('setLoading', false);
                        this.$toast.add({ severity: 'error', summary: 'บันทึกประวัติการเงินไม่สำเร็จ', detail: err.response.data.message, life: 3000 })
                    })
                },
            });
        },
        again() {
            const cus = {
                cus_name: '',
                cus_tel: '',
                cus_address: '',
                people_id: '',
                line_id: '',
                tel_platform: '',
            }
            this.$store.commit('setMediaCus', cus);
            window.location.reload();
        }
    }
}
</script>

<style></style>