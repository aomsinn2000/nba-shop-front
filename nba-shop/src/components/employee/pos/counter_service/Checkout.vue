<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Panel>
                <template #header><i class="pi pi-list"></i>ยอดรวมสุทธิ (บาท)</template>
                <h1 class="text-total text-right">
                    {{ numberFormat($store.getters.order_cs_total) }}
                </h1>
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <p style="margin: 0" class="text-gray-500" v-if="show_phone !== ''">
                            เบอร์โทร : {{ show_phone }}
                        </p>
                    </div>
                    <div class="col-12 lg:col-6">
                        <p style="margin: 0" class="text-right text-gray-500"
                            v-if="this.$store.getters.order_discount !== 0">
                            ส่วนลด : {{ numberFormat($store.getters.order_discount) }}
                        </p>
                    </div>
                </div>
            </Panel>
        </div>
        <div class="col-12 lg:col-6">
            <!-- <div class="grid">
                <div class="col-8">
                    <Button @click="openPhone()" label="HAPPY POINS" class="w-full p-button-success" />
                </div>
                <div class="col-4">
                        <Button label="ส่วนลด" class="w-full p-button-secondary" :disabled="true" @click="openDiscount()" />
                </div>
            </div> -->
            <div class="grid">
                <div class="col-12">
                    <Button class="w-full p-button-lg" icon="pi pi-check" label="ชำระเงิน" @click="openCheckout()"
                        :loading="isLoading">
                    </Button>
                </div>
            </div>

            <div class="grid">
                <div class="col-12">
                    <Button label="หน้าจอสำหรับลูกค้า" icon="pi pi-external-link" class="p-button-outlined"
                        @click="customerDisplay()" />
                </div>
            </div>
        </div>
    </div>


    <!--dialog Checkout-->
    <Dialog v-model:visible="dialogCheckout" header="ประเภทการจ่าย & ชำระเงิน" :modal="true" :style="{ width: '25vw' }"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :closable="false">
        <div class="grid">
            <div class="col-12">
                <div class="field">
                    <Dropdown v-model="payment_type" placeholder="เลือกประเภทการชำระ" class="w-full" inputClass="font"
                        :options="item_payment" @change="checkPaymentType()" />
                </div>
            </div>
            <div class="col-12">
                <div class="field">
                    <InputNumber v-model="receive" :disabled="isDisabled" placeholder="กรอกเงินที่รับมา"
                        inputClass="font input-receive" class="w-full" mode="decimal" :minFractionDigits="2"
                        :maxFractionDigits="2" @keyup.enter="checkout()" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <Button label="รับเงิน (Enter)" class="p-button-lg w-full" @click="checkout()"
                            :loading="isLoading" />

                        <Button label="ยกเลิก" class="p-button-danger w-full p-button-text mt-2"
                            @click="dialogCheckout = false" :loading="isLoading" />
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
                <div class="grid">
                    <div class="col-12">
                        <PrintReceipt :order_cs="order_cs" />
                    </div>
                    <div class="col-12 lg:col-6">
                        <Button label="ทำรายการต่อ" icon="pi pi-sync" class="p-button-secondary p-button-outlined w-full"
                            @click="again()" />
                    </div>
                    <div class="col-12 lg:col-6">
                        <Button label="หน้าหลัก" class="p-button-outlined w-full" icon="pi pi-home"
                            @click="again(), $router.push('/')" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import PrintReceipt from './PrintReceipt.vue';
export default {
    components: {
        PrintReceipt
    },
    data: () => ({
        item_payment: ['เงินสด', 'โอนเงิน', 'บัตรเครดิต', 'บัตรสวัสดิการแห่งรัฐ', 'อื่นๆ'],
        shopPrint: false,
        dialogCheckout: false,
        dialogChange: false,
        dialogDiscount: false,
        isLoading: false,
        show_phone: "",
        phone: "",
        order_cs: null,
        payment_type: "",
        receive: null,
        change: 0,
        isDisabled: false
    }),
    async mounted() {
        localStorage.setItem('order_change', -1);
    },
    methods: {
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        checkPaymentType() {
            if (this.payment_type === 'โอนเงิน' || this.payment_type === 'บัตรเครดิต' || this.payment_type === 'บัตรสวัสดีการแห่งรัฐ') {
                this.receive = this.$store.getters.order_cs_total;
                this.isDisabled = true;
            } else {
                this.receive = null;
                this.isDisabled = false;
            }
        },
        customerDisplay() {
            const url = "/pos/customerdisplay";
            const windowName = "Customer Display";
            window.open(url, windowName, "location=no,height=720,width=1280");
        },
        openCheckout() {
            if (this.$store.getters.order_cs.length === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่มีรายการชำระเงิน', life: 3000 });
                return false;
            }
            this.dialogCheckout = true;
        },
        again() {
            this.$store.commit('setOrderCS', []);
            localStorage.setItem('order_total', 0);
            localStorage.setItem('order_change', -1);
            this.receive = null;
            this.payment_type = '';
            this.change = 0;
            this.dialogChange = false;
        },
        async checkout() {
            if (this.payment_type === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกประเภทการชำระ', life: 3000 });
                return false;
            }
            if (this.receive === null || this.receive === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกจำนวนเงินที่รับมา', life: 3000 });
                return false;
            }
            if (this.receive < this.$store.getters.order_cs_total) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยอดเงินที่รับมาน้อยกว่ายอดชำระเงิน', life: 3000 });
                return false;
            }
            const config = {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }
            //check เงินในกระเป๋า partner
            const partner = await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.partner._id}`, config).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                return false;
            })
            const cut_money = this.$store.getters.order_cs[0].service.price + this.$store.getters.order_cs[0].service.cost_nba
            if (partner.data.data.partner_wallet < cut_money) {
                this.$toast.add({ severity: 'warn', summary: 'ยอดเงินกระเป๋าไม่เพียงพอ', detail: 'ยอดเงินในกระเป๋าเงินไม่เพียงพอกรุณาแจ้งเจ้าของกิจการ เพื่อเติมเงินเข้าระบบ', life: 3000 });
                return false;
            }

            this.$confirm.require({
                message: `ต้องการชำระใบแจ้งหนี้ ${this.$store.getters.order_cs[0].name} และบันทึกข้อมูลนี้?`,
                header: 'ยืนยันการรับเงิน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    //callback to execute when user confirms the action
                    this.$store.commit('setLoading', true);
                    let data = null;
                    let history = null;
                    let url = null;
                    switch (this.$store.getters.order_cs[0].type) {
                        case 'sot':
                            //check url
                            if (this.$store.getters.order_cs[0].service_code === 'barcode') {
                                url = `${process.env.VUE_APP_SHOP}counter_service/barcode/confirm`
                            } else if (this.$store.getters.order_cs[0].service_code === 'mobile_bill') {
                                url = `${process.env.VUE_APP_SHOP}counter_service/mobile_bill/confirm`
                            } else {
                                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่พบบริการหรือ Service Code', life: 3000 });
                                return false;
                            }
                            data = {
                                shop_id: this.$store.getters.shop._id,
                                mobile: this.$store.getters.order_cs[0].mobile,
                                price: this.$store.getters.order_cs[0].total,
                                charge: this.$store.getters.order_cs[0].service.charge,
                                receive: this.receive,
                                payment_type: this.payment_type,
                                transid: this.$store.getters.order_cs[0].service.transid,
                                cost_nba: this.$store.getters.order_cs[0].service.cost_nba,
                                cost_shop: this.$store.getters.order_cs[0].service.cost_shop,
                                employee: this.$store.getters.name,
                                status: [{ name: "ทำรายการ", timestamp: dayjs(Date.now()).format() }],
                                timestamp: dayjs(Date.now()).format()
                            }

                            break;
                        case 'nba':
                            url = `${process.env.VUE_APP_SHOP}counter_service/nba`
                            data = {
                                shop_id: this.$store.getters.shop._id,
                                mobile: this.$store.getters.order_cs[0].mobile,
                                price: this.$store.getters.order_cs[0].total,
                                charge: this.$store.getters.order_cs[0].service.charge,
                                receive: this.receive,
                                payment_type: this.payment_type,
                                image: this.$store.getters.order_cs[0].service.image,
                                cost_nba: this.$store.getters.order_cs[0].service.cost_nba,
                                cost_shop: this.$store.getters.order_cs[0].service.cost_shop,
                                employee: this.$store.getters.name,
                                detail: {
                                    ref1: this.$store.getters.order_cs[0].service.ref1,
                                    ref2: this.$store.getters.order_cs[0].service.ref2,
                                    note: this.$store.getters.order_cs[0].service.note
                                },
                                productid: this.$store.getters.order_cs[0].ref.productid,
                                productname: this.$store.getters.order_cs[0].ref.productname,
                                status: [{ name: "ทำรายการ", timestamp: dayjs(Date.now()).format() }],
                                timestamp: dayjs(Date.now()).format()
                            }
                            break;
                        default:
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถทำรายการนี้ได้ในขณะนี้', life: 3000 });
                            this.$store.commit('setLoading', false);
                            return false;
                    }

                    await axios.post(url, data, config).then(async (res) => {
                        // console.log(res)
                        //อัพเดตเงินในกระเป๋า
                        const new_wallet = partner.data.data.partner_wallet - cut_money;
                        await axios.put(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.partner._id}`, {
                            partner_wallet: new_wallet
                        }, config)

                        this.order_cs = res.data.data;
                        // console.log(this.order_cs);
                        //บันทึกประวัติ
                        history = {
                            shop_id: this.$store.getters.shop._id,
                            partner_id: this.$store.getters.partner._id,
                            name: `จ่ายบิลค่าสาธารณูปโภค ใบเสร็จ เลขที่ ${this.order_cs.invoice}`,
                            type: 'เงินออก',
                            amount: cut_money,
                            timestamp: dayjs(Date.now()).format()
                        }
                        await axios.post(`${process.env.VUE_APP_SHOP}wallethistory/create`, history, config)
                        if (this.$store.getters.order_cs[0].type === 'nba') {
                            //แจ้งเตือนไลน์
                            const line_data = {
                                token: `${process.env.VUE_APP_LINE_TOKEN}`,
                                message: `
                                    แจ้งเตือนฝากจ่ายเคาน์เตอร์เซอร์วิส :
                                    จากร้าน : ${this.$store.getters.shop.shop_name}
                                    รหัสสาขา : ${this.$store.getters.shop.shop_number}
                                    ***เกี่ยวกับใบแจ้งหนี้***
                                    เลขที่ : ${this.order_cs.invoice}
                                    รายการ : ${this.order_cs.detail.productname}
                                    ยอดฝากจ่าย : ${this.numberFormat(this.order_cs.price)}  บาท                            
                                `
                            }

                            await axios.post(`${process.env.VUE_APP_SHOP}line-notify`, line_data).catch((err) => {
                                console.log(err);
                            })
                        }
                        this.change = this.receive - this.$store.getters.order_cs_total;
                        localStorage.setItem('order_change', this.change);
                        this.dialogCheckout = false;
                        this.dialogChange = true;
                        this.$store.commit('setLoading', false);
                        this.isDisabled = false;
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ส่งและบันทึกข้อมูลจ่ายใบแจ้งหนี้เรียบร้อยแล้ว', life: 3000 });
                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response, life: 3000 });
                        this.$store.commit('setLoading', false);
                        return false;
                    })
                }
            });




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