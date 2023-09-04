<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Panel>
                <template #header><i class="pi pi-list"></i>ยอดรวมสุทธิ (บาท)</template>
                <h1 class="text-total text-right">
                    {{ numberFormat($store.getters.order_express_total) }}
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
            <div class="grid">
                <!-- <div class="col-8">
                    <Button @click="openPhone()" label="HAPPY POINS" class="w-full p-button-success" />
                </div> -->
                <!-- <div class="col-4">
                        <Button label="ส่วนลด" class="w-full p-button-secondary" :disabled="true" @click="openDiscount()" />
                </div> -->
            </div>
            <div class="grid">
                <div class="col-12 lg:col-12">
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
                    <Dropdown v-model="order.payment_type" placeholder="เลือกประเภทการชำระ" class="w-full"
                        inputClass="font" :options="['เงินสด', 'โอนเงิน', 'บัตรเครดิต', 'อื่นๆ']"
                        @change="checkPaymentType()" />
                </div>
            </div>
            <div class="col-12">
                <div class="field">
                    <InputNumber v-model="receive" placeholder="กรอกเงินที่รับมา" class="w-full" inputClass="font input-receive w-full" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2"
                        @keyup.enter="checkout()" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <Button label="รับเงิน (Enter)" class="p-button-lg w-full" @click="checkout()"
                            :loading="isLoading" />

                        <Button label="ยกเลิก" class="p-button-danger w-full p-button-text mt-2" @click="cancel()"
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
                <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
                    <template #content>
                        <h1 class="text-right" style="margin: 0; font-size: 40px">
                            {{ numberFormat(change) }}
                        </h1>
                    </template>
                </Card>
                <div class="grid mb-0 pb-0">
                    <div class="col-12 lg:col-6 mt-2">
                        <ExpressLabel :order="label_html" v-if="print_label === true" />
                    </div>
                    <div class="col-12 lg:col-6 mt-2">
                        <ExpressReceipt :print_receipt="print_receipt" />
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <Button label="ทำรายการต่อ" icon="pi pi-sync"
                            class="p-button-secondary p-button-outlined w-full" @click="again()" />
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
import dayjs from "dayjs";
import axios from "axios";
import ExpressReceipt from '@/components/employee/pos/print/ExpressReceipt.vue';
import ExpressLabel from '@/components/employee/pos/print/ExpressLabel.vue';
import callme from '@/service/callme';
export default {
    components: {
        ExpressLabel, ExpressReceipt
    },
    async mounted() {
        localStorage.setItem('order_change', -1);
    },
    data: () => ({
        shopPrint: false,
        dialogCheckout: false,
        dialogChange: false,
        dialogDiscount: false,
        isLoading: false,
        show_phone: "",
        phone: "",
        resp_order: null,
        order: {
            total: 0,
            total_cost: 0,
            payment_type: "เงินสด",
            purchase_id: "ไม่มี"
        },
        receive: null,
        change: 0,
        print_receipt: null,
        print_label: false,
        label_html: "",
        
    }),
    methods: {
        reload() {
            window.location.reload();
        },
        cancel() {
            this.$confirm.require({
                message: 'รายการจะถูกบันทึกไว้ เพื่อรอชำระเงิน ต้องการยกเลิกการชำระเงิน?',
                header: 'ยกเลิกการชำระเงิน',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: "ยกเลิก",
                acceptLabel: "ตกลง",
                accept: () => {
                    //callback to execute when user confirms the action
                    this.again();
                },
            });
        },
        again() {
            this.$store.dispatch('setDefaultExpress');
            this.dialogChange = false;
            this.dialogCheckout = false;
            this.order.total = 0;
            this.order.total_cost = 0;
            this.receive = null;
            this.order.payment_type = 'เงินสด';
            this.order.purchase_id = "ไม่มี";
        },
        async confirmPhone() {
            if (this.phone === "") {
                this.dialogPhone = false;
                this.show_phone = "";
            } else {
                this.isLoading = true;
                await axios
                    .get(
                        `${process.env.VUE_APP_HP}recived_point/phone/${this.phone.replace(
                            /-/g,
                            ""
                        )}`,
                        {
                            headers: {
                                "auth-token": `Bearer ${process.env.VUE_APP_HP_TOKEN}`,
                            },
                        }
                    )
                    .then(() => {
                        this.dialogPhone = false;
                        this.isLoading = false;
                        this.show_phone = this.phone;
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.$toast.add({
                            severity: "warn",
                            summary: "ไม่พบเบอร์โทร",
                            detail: "ไม่พบเบอร์ Happy Point นี้",
                            life: 3000,
                        });
                    });
            }
        },
        checkPaymentType() {
            if (this.order.payment_type === "โอนเงิน" || this.order.payment_type === "บัตรเครดิต") {
                this.receive = this.$store.getters.order_express_total;
            } else {
                this.receive = null;
            }
        },
        async openCheckout() {
            if (this.$store.getters.order_express_total === 0) {
                this.$toast.add({
                    severity: "warn",
                    summary: "แจ้งเตือน",
                    detail: "ไม่มีสินค้าให้ชำระเงิน",
                    life: 3000,
                });
                return false;
            }

            this.$confirm.require({
                message: 'ข้อมูลจะถูก Booking และบันทึกลงฐานข้อมูล ยืนยันการทำรายการ?',
                header: 'ยืนยันการทำราย',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    await callme(localStorage.getItem('token'));
                    const parcel = this.$store.getters.order_express.filter((el) => el.type === 'parcel');
                    const product = this.$store.getters.order_express.filter((el) => el.type === 'product');
                    const data = {
                        shop_id: this.$store.getters.shop._id,
                        origin: (parcel.length !== 0) ? parcel[0].detail.origin : null,
                        parcel: parcel,
                        timestamp : dayjs(Date.now()).format()
                    }

                    if (parcel.length !== 0) {
                        const cost = parcel.reduce((sum, order) => sum + order.pricelist.cost, 0)
                        if (this.$store.getters.partner.partner_wallet < cost) {
                            this.$toast.add({
                                severity: "warn",
                                summary: "แจ้งเตือน",
                                detail: "ยอดเงินในกระเป๋าไม่เพียงพอสำหรับการทำรายการนี้ กรุณาแจ้งทางเจ้าของร้านเติมเงินเข้าระบบ",
                                life: 4000,
                            });
                            this.isLoading = false;
                            return false;
                        }
                        await axios.post(`${process.env.VUE_APP_SHOP}express/booking`, data, {
                            headers: {
                                'auth-token': `Bearer ${this.$store.getters.token}`
                            }
                        }).then(async (res) => {
                            //ดึงข้อมูล partner
                            const partner = await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.partner._id}`, {
                                headers: {
                                    'auth-token': `Bearer ${this.$store.getters.token}`
                                }
                            }).catch((err) => {
                                this.isLoading = false;
                                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                            })
                            const new_credit = partner.data.data.partner_wallet - res.data.total_cost;
            
                            await axios.put(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.partner._id}`, {
                                partner_wallet: new_credit
                            }, {
                                headers: {
                                    'auth-token': `Bearer ${this.$store.getters.token}`
                                }
                            }).then(() => {
                                this.$store.dispatch('updateWalletPartner', new_credit);
                            })

                            //บันทึกลงประวัติเงินเข้าเงินออก
                            const money_history = {
                                shop_id : this.$store.getters.shop._id,
                                partner_id : this.$store.getters.partner._id,
                                name : `ส่งพัสดุ ใบสั่งซื้อเลขที่ ${res.data.purchase_id}`,
                                type : "เงินออก",
                                amount : res.data.total_cost,
                                timestamp : dayjs(Date.now()).format()
                            }
                            await axios.post(`${process.env.VUE_APP_SHOP}wallethistory/create`,money_history ,{
                                headers: {
                                    'auth-token' : `Bearer ${this.$store.getters.token}`
                                }
                            })
                            this.order.total_cost = res.data.total_cost;
                            this.order.purchase_id = res.data.purchase_id;
                        }).catch((err) => {
                            this.isLoading = false;
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        });
                    }

                    //คำนวณบวกเลข
                    const order_data = {
                        ...this.order,
                        product: product,
                        total: this.$store.getters.order_express_total,
                        shop_id: this.$store.getters.shop._id,
                        employee: this.$store.getters.name,
                        status: [{ name: "รอชำระเงิน", timestamp: dayjs(Date.now()).format() }]
                    }
                    const order = await axios.post(`${process.env.VUE_APP_SHOP}express/order`, order_data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).catch((err) => {
                        this.isLoading = false;
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })
                    //console.log(order);
                    if (order) {
                        this.resp_order = order.data.result;
                        this.isLoading = false;
                        this.dialogCheckout = true;
                    } else {
                        this.isLoading = false;
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: "มีบางอย่างผิดพลาด", life: 3000 });
                        return false
                    }
                },
            });

        },
        async setPrintReceipt() {
            let parcel = null;
            let order = null;
            await axios.get(`${process.env.VUE_APP_SHOP}express/order/${this.resp_order._id}`, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                order = res.data.data;
            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                this.$toast.add({
                    severity: "error",
                    summary: "ผิดพลาด",
                    detail: err.response.data.message,
                    life: 3000,
                });
            })

            if (this.resp_order.purchase_id !== 'ไม่มี') {
                await axios.post(`${process.env.VUE_APP_SHOP}express/order/purchase_id`, {
                    shop_id: this.$store.getters.shop._id,
                    purchase_id: this.resp_order.purchase_id
                }, {
                    headers: {
                        'auth-token': `Bearer ${this.$store.getters.token}`
                    }
                }).then((res) => {
                    parcel = res.data.data;
                }).catch((err) => {
                    this.$toast.add({
                        severity: "error",
                        summary: "ผิดพลาด",
                        detail: err.response.data.message,
                        life: 3000,
                    });
                })
            } else {
                parcel = [];
            }
            this.print_receipt = {
                ...order, receive: this.receive, parcel: parcel
            }
        },
        async setPrintLabel() {
            let order = null;
            await axios.get(`${process.env.VUE_APP_SHOP}express/order/${this.resp_order._id}`, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                order = res.data.data;
            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                this.$toast.add({
                    severity: "error",
                    summary: "ผิดพลาด",
                    detail: err.response.data.message,
                    life: 3000,
                });
            })
            if (order.purchase_id !== "ไม่มี") {
                this.print_label = true;
                const res_order = await axios.post(`${process.env.VUE_APP_SHOP}express/label`, {
                    shop_id: order.shop_id,
                    purchase_id: order.purchase_id
                }, {
                    headers: {
                        'auth-token': `Bearer ${this.$store.getters.token}`
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$toast.add({
                        severity: "error",
                        summary: "ผิดพลาด",
                        detail: err.response.data.message,
                        life: 3000,
                    });
                });
                this.label_html = res_order.data.html;
            } else {
                this.label_html = "";
                this.print_label = false;
            }
        },
        checkout() {
            if (this.receive === null) {
                this.$toast.add({
                    severity: "warn",
                    summary: "แจ้งเตือน",
                    detail: "กรุณากรอกจำนวนเงินที่รับมา",
                    life: 3000,
                });
                return false;
            }

            if (this.receive < this.$store.getters.order_express_total) {
                this.$toast.add({
                    severity: "warn",
                    summary: "แจ้งเตือน",
                    detail: "ยอดเงินที่รับน้อยว่ายอดสุทธิ",
                    life: 3000,
                });
                return false;
            }

            this.$confirm.require({
                message: "รับเงินเรียบร้อย ยืนยันการชำระเงิน และบันทึกข้อมูล?",
                header: "ยืนยันชำระเงิน",
                icon: "pi pi-exclamation-triangle",
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    this.resp_order.status.push({ name: "ชำระเงิน", timestamp: dayjs(Date.now()).format() })
                    const data = {
                        payment_type: this.order.payment_type,
                        receive: this.receive,
                        status: this.resp_order.status
                    }
                    await axios.put(`${process.env.VUE_APP_SHOP}express/order/${this.resp_order._id}`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then(async () => {
                        this.change = this.receive - this.$store.getters.order_express_total;
                        localStorage.setItem('order_change', this.change);
                        //ยืนยันใบสั่งซื้อกรณีมีเลขพัสดุ
                        if (this.resp_order.purchase_id !== 'ไม่มี') {
                            await axios.post(`${process.env.VUE_APP_SHOP}express/confirm`, {
                                purchase_id: this.resp_order.purchase_id,
                                shop_id: this.$store.getters.shop._id
                            }, {
                                headers: {
                                    'auth-token': `Bearer ${this.$store.getters.token}`
                                }
                            })
                        }
                        await this.setPrintReceipt();
                        await this.setPrintLabel();
                        this.isLoading = false;
                        this.dialogChange = true;
                        this.$toast.add({
                            severity: "success",
                            summary: "สำเร็จ",
                            detail: "บันทึกข้อมูลและคำนวณเงินทอนสำเร็จ",
                            life: 3000,
                            autoZIndex: false,
                            baseZIndex : 9999
                        });
                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({
                            severity: "error",
                            summary: "ผิดพลาด",
                            detail: err.response.data.message,
                            life: 3000,
                        });
                    })

                }
            })
        },
        openPhone() {
            if (this.$store.getters.order_total === 0) {
                this.$toast.add({
                    severity: "warn",
                    summary: "แจ้งเตือน",
                    detail: "ไม่มีสินค้าให้ชำระเงิน",
                    life: 3000,
                });
                return false;
            } else {
                this.dialogPhone = true;
            }
        },
        customerDisplay() {
            const url = "/pos/customerdisplay";
            const windowName = "Customer Display";
            window.open(url, windowName, "location=no,height=720,width=1280");
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
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