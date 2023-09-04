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
                        <PrintReceipt :order="res" :price="item_price" className="w-full" />
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

    <!-- dialog_img แนบรูป -->
    <Dialog v-model:visible="dialog_img" header="แนบรูปภาพ/แนบเอกสาร" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
        <div class="col-12">
            <h3>แนบภาพถ่ายหนังสือจดทะเบียน (เล่มเขียว/เล่มฟ้า)</h3>
            <label v-if="!img_preview1" class="file-input-label">
                <span>แนบรูป</span>
                <input type="file" class="input-image" @change="SetImage1" />
            </label>
            <Image v-if="img_preview1" :src="img_preview1" width="150" height="150" preview />
        </div>
        <h3>ภาพถ่าย พ.ร.บ. เดิม หรือภาพถ่ายป้าย พ.ร.บ.เดิม</h3>
        <div class="col-12">
            <label v-if="!img_preview2" class="file-input-label">
                <span>แนบรูป</span>
                <input type="file" class="input-image" @change="SetImage2" />
            </label>
            <Image v-if="img_preview2" :src="img_preview2" width="150" height="150" preview />
        </div>
        <div class="col-12 text-right">
            <Button v-if="img_preview2 != null && img_preview1 != null" label="เปลียนรูป" @click="ResetImage"
                class="mr-2" />
            <Button v-if="img_preview2 != null && img_preview1 != null" @click="postimg()" label="ยืนยัน" />
        </div>
    </Dialog>
</template>
<script>
import func from '@/service/function'
// import dayjs from 'dayjs';
import axios from 'axios';
import PrintReceipt from '@/components/employee/pos/act_service/PrintReceipt.vue'
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
        item_price: null,
        share: null,
        partner: [],
        partner_wallet: 0,

        img_upload1: null,
        img_upload2: null,
        img_size: null,
        img_preview1: null,
        img_preview2: null,
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
            if (this.$store.getters.order_act_total === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่มีรายการชำระเงิน', life: 3000 });
                return false;
            }

            if (this.$store.getters.act_cus.name === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลข้อมูลรายละเอียดลูกค้าและยืนยันข้อมูล', life: 5000 });
                return false;
            }

            if (this.$store.getters.order_act_total > this.partner_wallet) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยอดเงินในกระเป๋าไม่พอชำระ กรุณาเติมเงิน', life: 3000 });
                return false;
            }

            this.dialogRecieve = true;
        },

        checkPaymentType() {
            console.log(this.payment_type);
            if (this.payment_type === 'เงินโอน' || this.payment_type === 'บัตรเครดิต') {
                this.receive = this.$store.getters.order_act_total;
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

            if (this.receive < this.$store.getters.order_act_total) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'จำนวนเงินที่รับมาไม่เพียงพอ', life: 5000 });
                return false;
            }

            this.$confirm.require({
                message: 'รับเงินมาครบถ้วน ต้องการบันทึกข้อมูล?',
                header: 'ยืนยันการจ่ายเงิน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    let address = 'ไม่มี';
                    if (this.$store.getters.act_cus.address !== '') {
                        address = this.$store.getters.act_cus.address;
                    }
                    this.change = this.receive - this.$store.getters.order_act_total;
                    const data = {
                        customer_tel: this.$store.getters.act_cus.tel_platform,
                        customer_name: this.$store.getters.act_cus.name,
                        customer_contact: this.$store.getters.act_cus.tel,
                        customer_address: address,
                        people_id: this.$store.getters.act_cus.people_id,
                        line_id: this.$store.getters.act_cus.line_id,
                        product_detail: this.$store.getters.order_act,
                        paymenttype: this.payment_type,
                        moneyreceive: this.receive,
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}actlegalservice/order`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.$store.commit('setLoading', false);
                        localStorage.setItem('order_change', this.change);
                        this.res = res.data.data;
                        this.item_price = this.$store.getters.order_act_detail;
                        this.dialogRecieve = false;
                        this.receive = null;
                        // this.dialogChange = true;
                        this.dialog_img = true;
                        this.$toast.add({
                            severity: "success",
                            summary: "สำเร็จ",
                            detail: "ทำรายการสำเร็จ",
                            life: 3000,
                        });
                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$store.commit('setLoading', false);
                        this.$toast.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: err.response.data.message, life: 3000 });
                        this.$router.push('/');
                    })
                },
            });
        },

        async postimg() {
            console.log(this.res)
            this.$store.commit('setLoading', false);

            const formData = new FormData();
            formData.append("imgCollection", this.img_upload1[0]),
            formData.append("imgCollection", this.img_upload2[0]),

                await axios.put(`${process.env.VUE_APP_SHOP}actlegalservice/order/updatepicture/${this.res._id}`, formData, {
                    headers: {
                        'auth-token': `Bearer ${this.$store.getters.token}`
                    }
                }).then(() => {
                    this.$store.commit('setLoading', false);
                    this.dialog_img = false;
                    this.dialogChange = true;
                    this.$toast.add({
                        severity: "success",
                        summary: "สำเร็จ",
                        detail: "แนบรูปภาพสำเร็จ",
                        life: 3000,
                    })
                })
        },

        again() {
            const cus = {
                cus_name: '',
                cus_tel: '',
                cus_address: '',
                people_id: '',
                line_id: '',
            }

            this.$store.commit('setActCus', cus);
            window.location.reload();
        },

        SetImage1(e) {
            const file = e.target.files;
            if (file) {
                this.img_size = file[0].size;

                const fileReader = new FileReader();
                fileReader.readAsDataURL(file[0]);
                fileReader.addEventListener("load", (event) => {
                    this.img_preview1 = event.target.result;
                })
                this.img_upload1 = file;
            }
        },

        SetImage2(e) {
            const file = e.target.files;
            if (file) {
                this.img_size = file[0].size;

                const fileReader = new FileReader();
                fileReader.readAsDataURL(file[0]);
                fileReader.addEventListener("load", (event) => {
                    this.img_preview2 = event.target.result;
                })
                this.img_upload2 = file;
            }
        },

        ResetImage() {
            this.img_preview1 = null;
            this.img_preview2 = null;
            this.img_upload1 = null;
            this.img_upload2 = null;
        },
    }
}
</script>

<style></style>