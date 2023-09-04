<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_service" :paginator="true" :rows="12">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <template #list="item">
                        <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                            <div class="card" @click="chooseService(item.data)">
                                <div class="card-img">
                                    <img :src="getImage(item.data.productid)">
                                </div>
                                <div class="card-head">
                                    <p class="mb-0 mt-0 text-center">{{ item.data.productname }}</p>
                                </div>
                                <div style="padding: 5px;" class="text-center">
                                    <Badge :value="item.data.productid" class="bg-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>

        <!-- dialog ส่งข้อมูลตรวจสอบ-->
        <Dialog header="รายละเอียดข้อมูล" v-model:visible="dialogService" :modal="true"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
            <div v-if="service !== null">
                <div class="grid">
                    <div class="col-12 text-center">
                        <img :src="getImage(service.productid)" width="100" />
                    </div>
                    <div class="col-12">
                        <Divider align="center" type="dashed">
                            <Chip :label="service.productname" />
                        </Divider>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12">
                        <span class="p-float-label">
                            <InputMask v-model="mobile" mask="999-9999999" class="w-full font" @keyup.enter="check()"/>
                            <label>เบอร์โทร</label>
                        </span>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button @click="mobile = '', service = null, dialogService = false"
                    class="p-button-danger p-button-text" label="ยกเลิก" />
                <Button label="ตรวจสอบ" icon="pi pi-search" @click="check()" />
            </template>
        </Dialog>


        <!-- dialog service response -->
        <Dialog header="ข้อมูลการชำระ" v-model:visible="dialogPreview"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }" :modal="true">
            <div class="grid" v-if="verify !== null">
                <div class="col-12">
                    <Panel header="ยอดชำระ">
                        <h2 class="m-0 p-0" v-if="verify.partial === 'FALSE'">{{ numberFormat(verify.amount) }}
                            <small>บาท</small>
                        </h2>
                        <InputNumber v-model="verify.amount" :min="0" v-if="verify.partial === 'TRUE'" class="w-full"
                            inputClass="font" inputStyle="font-size: 22px; font-weight: bold" mode="decimal"
                            :minFractionDigits="2" :maxFractionDigits="2" @keyup.enter="confirm()"/>
                    </Panel>
                </div>
            </div>
            <template #footer>
                <Button label="ยกเลิก" class="p-button-danger" @click="dialogPreview = false" />
                <Button label="ยืนยันการชำระ" class="p-button-success" icon="pi pi-check" @click="confirm()" />
            </template>
        </Dialog>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/service/mobile_bill`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.services = res.data.data
            this.item_service = this.services;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
    },
    data: () => ({
        dialogService: false,
        service: null,
        services: [],
        item_service: [],
        mobile: '',
        dialogPreview: false,
        verify: null,
    }),
    methods: {
        getImage(item) {
            try {
                const img = require('@/assets/img/counter_service/' + item + '.png')
                return img
            } catch (err) {
                return 'https://promotions.co.th/wp-content/uploads/2019/03/06.jpg';
            }
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        chooseService(item) {
            this.service = item;
            this.dialogService = true;
        },
        clearService() {
            this.verify = null;
            this.dialogPreview = false;
            this.dialogService = false;
        },
        async check() {
            if (this.mobile === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกเบอร์โทรศัพท์', life: 3000 });
                return false;
            }
            if (this.service === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกบริการ', life: 3000 });
                return false;
            }
            this.$store.commit('setLoading', true);
            const data = {
                mobile: this.mobile.replace(/-/g, ''),
                productid: this.service.productid
            }

            await axios.post(`${process.env.VUE_APP_SHOP}counter_service/mobile_bill/check`, data, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                this.verify = res.data;
                this.$store.commit('setLoading', false);
                this.dialogPreview = true;
            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                if (err.response.status === 400) {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.error_text, life: 5000 });
                } else {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 5000 });
                }
                this.$store.commit('setLoading', false);
            })
        },
        confirm() {
            if (this.verify.amount === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่มียอดชำระ', life: 5000 });
                return false;
            }
            if (this.verify.amount === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกยอดชำระ', life: 5000 });
                return false;
            }

            this.$confirm.require({
                message: `ต้องการชำระใบแจ้งหนี้ ${this.service.productname} จำนวน ${this.numberFormat(this.verify.amount)} บาท นี้?`,
                header: 'ยืนยันใบแจ้งหนี้',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    //callback to execute when user confirms the action
                    this.$store.commit('setLoading', true);
                    const data = {
                        productid: this.service.productid,
                        mobile: this.mobile.replace(/-/g, ''),
                        price: this.verify.amount,
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}counter_service/mobile_bill/verify`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        // console.log(res)
                        if (res.data.error_code === 'E00') {
                            const data_order = [];
                            const order = {
                                name: this.service.productname,
                                mobile: this.mobile.replace(/-/g, ''),
                                type: 'sot',
                                service_code : 'mobile_bill',
                                service: { ...res.data },
                                ref: { ...this.service },
                                total: res.data.price
                            };
                            const charge = {
                                name: 'ค่าธรรมเนียม+บริการ',
                                type: null,
                                service: null,
                                ref: null,
                                total: res.data.charge
                            }
                            data_order.push(order);
                            data_order.push(charge);
                            this.$store.commit('setOrderCS', data_order);
                            this.$store.commit('setLoading', false);
                            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มในรายการชำระเรียบร้อยแล้ว', life: 3000 });
                            localStorage.setItem('order_total', this.$store.getters.order_cs_total)
                            this.clearService();
                        } else {
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: res.data.error_text, life: 3000 });
                            this.$store.commit('setLoading', false);
                        }
                    }).catch((err) => {
                        console.log(err);
                        if (err.response.status === 408) {
                            window.location.reload();
                        }

                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        this.$store.commit('setLoading', false);
                    })
                },
            });

        }
    }
}
</script>

<style>

</style>