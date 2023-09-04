<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1 class="mb-0">เติมเงินเข้ากระเป๋า</h1>
                <p class="mt-0"><strong>ประเภท :</strong> คิวอาร์โค้ด</p>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <Message severity="warn"><strong>สำคัญ : </strong> การเติมเงินเข้ากระเป๋าอิเล็กทรอนิกส์โดย QR Code เงินจะเข้ากระเป๋าทันที (จะมีค่าธรรมเนียมบริการ 2% ของยอดที่เติม) และ<strong style="font-size: 20px;"><u><em>ไม่ต้องแจ้งหรือแนบสลิป</em></u></strong>หลักฐานการโอนเงิน</Message>
            </div>
        </div>
        <div class="grid">
            <!-- step 1-->
            <div class="col-12 lg:col-3 md:col-4">
                <Panel header="STEP 1 : กรอกจำนวนเงิน & รับ QR Code">
                    <div class="grid">
                        <div class="col-12 m-0 p-0">
                            <Message>ยอดขั้นตำในการเติมเงิน 100 บาท ขึ้นไป และมีค่าธรรมเนียม 2 % ของจำนวนที่เติม
                            </Message>
                        </div>
                        <div class="col-12">
                            <span class="p-float-label">
                                <InputNumber :disabled="isDisabled" :min="100" v-model="amount" class="w-full"
                                    inputClass="font" :maxFractionDigits="0"
                                    placeholder="กรอกจำนวน ขั้นต่ำ 100 บาท ขึ้นไป" />
                                <label>จำนวน</label>
                            </span>
                        </div>
                        <div class="col-12">
                            <Button label="รับ QR Code" class="w-full" @click="getQrCode()" v-if="res_data === null" />
                        </div>
                    </div>
                </Panel>
            </div>

            <div class="col-12 lg:col-3">
                <Panel header="STEP 2 : แจ้งรายละเอียด">
                    <div v-if="res_data !== null">
                        <div class="grid">
                            <div class="col-6">
                                <p class="m-0"><strong>ยอดจ่ายสุทธิ : </strong></p>
                            </div>
                            <div class="col-6 text-right">
                                <p class="m-0">{{ numberDigitFormat(res_data.amount) }} <small>บาท</small></p>
                            </div>
                        </div>
                        <div class="grid">
                            <div class="col-6">
                                <p class="m-0"><strong>ค่าธรรมเนียม : </strong></p>
                            </div>
                            <div class="col-6 text-right">
                                <p class="m-0">{{ numberDigitFormat(res_data.charge) }} <small>บาท</small></p>
                            </div>
                        </div>
                        <div class="grid">
                            <div class="col-6">
                                <h2 class="m-0"><strong>ยอดเข้ากระเป๋า : </strong></h2>
                            </div>
                            <div class="col-6 text-right">
                                <h2 class="m-0"><strong>{{ numberDigitFormat(res_data.total) }}</strong>
                                    <small>บาท</small>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="grid">
                        <div class="col-12 text-center">
                            <p><em>--รอทำรายการตามขึ้นตอน--</em></p>
                        </div>
                    </div>
                    </div>
                </Panel>
            </div>

            <div class="col-12 lg:col-3">
                <Panel header="STEP 3 : สแกนจ่ายผ่าน QR Code">
                    <div class="grid" v-if="img_preview !== null">
                        <div class="col-12 p-0">
                            <Message severity="info">หลังจากสแกนจ่ายเรียบร้อยแล้ว ให้กด "ตรวจสอบรายการ" </Message>
                        </div>
                        <div class="col-12">
                            <Image :src="img_preview" imageClass="w-full" :preview="true" />
                        </div>
                    </div>
                    <div class="grid" v-else>
                        <div class="col-12 text-center">
                            <p><em>--รอทำรายการตามขึ้นตอน--</em></p>
                        </div>
                    </div>
                </Panel>
            </div>

            <div class="col-12 lg:col-3">
                <Panel header="STEP 4 : ตรวจสอบรายการ">
                    <div class="grid" v-if="res_data!==null">
                        <div class="col-12 lg:col-8">
                            <Button label="ตรวจสอบรายการ" icon="pi pi-check" @click="checkStatus()" class="w-full" />
                        </div>
                        <div class="col-12 lg:col-4">
                            <Button label="ยกเลิก"
                                @click="res_data = null, img_preview = null, amount = null, isDisabled = false"
                                class="w-full p-button-danger" />
                        </div>
                    </div>
                    <div class="grid" v-else>
                        <div class="col-12 text-center">
                            <p><em>--รอทำรายการตามขึ้นตอน--</em></p>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>


        <!-- Dialog Success-->
        <Dialog v-model:visible="dialogSuccess" :modal="true" :closable="false" :draggable="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '15vw' }">
            <div class="grid">
                <div class="col-12 text-center">
                    <h2>ทำรายการสำเร็จ</h2>
                </div>
                <div class="col-12 text-center">
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/success-green-check-mark-icon.png"
                        style="max-width: 150px;" />
                </div>

                <div class="col-12">
                    <Button @click="$router.push('/wallet/topup')" label="ตกลง" class="w-full" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import func from '@/service/function'
import axios from 'axios'
export default {
    setup() {
        return func
    },
    created() {
        document.title = "เติมเงินเข้าระบบด้วย QR Code"
    },
    data: () => ({
        dialogSuccess: false,
        amount: null,
        img_preview: null,
        res_data: null,
        isDisabled: false,
    }),
    methods: {
        getQrCode() {
            if (this.amount === null) {
                this.$toast.add({ severity: 'warn', summary: 'กรอกจำนวนเงิน', detail: 'กรุณากรอกจำนวนเงินที่ต้องการเติม', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการรับ QR Code เพื่อเติมเงินเข้าระบบ?',
                header: 'ยืนยันรับ QR Code',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    await axios.post(`${process.env.VUE_APP_SHOP}partner/wallet_topup/qrcode/gb/verify`, {
                        partner_id: this.$store.getters.id,
                        amount: this.amount,
                        timestamp: Date.now()
                    }, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.isDisabled = true;
                        this.$store.commit('setLoading', false);
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'รับ QR Code เพื่อสแกนจ่าย กรุณาสแกนจ่าย', life: 3000 });
                        this.res_data = res.data;
                        this.img_preview = res.data.image;
                    }).catch((err) => {
                        this.$store.commit('setLoading', false);
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                    })
                },
            });
        },
        async checkStatus() {
            if (this.res_data === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยังไม่ได้รับบาร์โค้ด เพื่อสแกน กรุณาตรวจสอบให้ถูกต้อง', life: 3000 });
                return false;
            }
            this.$store.commit('setLoading', true);
            const data = {
                partner_id: this.res_data.merchantDefined1,
                referenceNo: this.res_data.referenceNo
            }
            await axios.post(`${process.env.VUE_APP_SHOP}partner/wallet_topup/qrcode/gb/check`, data, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then(() => {
                this.$store.commit('setLoading', false);
                this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ได้รับยอดชำระเรียบร้อยแล้ว', life: 3000 });
                this.dialogSuccess = true;
            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                this.$store.commit('setLoading', false);
                this.$toast.add({ severity: 'warn', summary: 'ยังไม่ได้ชำระ', detail: 'ยังไม่ได้ชำระเงินหรือสแกนจ่าย กรุณาทำรายการและตรวจสอบอีกครั้ง', life: 3000 });
            })
        }
    }
}
</script>

<style>

</style>