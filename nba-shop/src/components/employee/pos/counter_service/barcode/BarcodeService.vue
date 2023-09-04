<template>
    <div v-if="$store.getters.order_cs.length === 0">
        <div class="grid" v-if="$store.getters.order_cs.length !== 0">
            <div class="col-12">
                <div class="grid">
                    <div class="col-12">
                        <Divider type="dashed" align="center">
                            <Chip :label="getServiceName($store.getters.order_cs[0].service.productid)" />
                        </Divider>
                    </div>
                    <div class="col-12 text-center">
                        <Image :src="getImage($store.getters.order_cs[0].service.productid)" width="150" />
                    </div>
                </div>

                <div class="grid mt-2">
                    <div class="col-12 lg:col-6">
                        <table>
                            <tr v-for="i in $store.getters.order_cs[0].ref.data.length" :key="i">
                                <th>{{ $store.getters.order_cs[0].ref.data[i] }}</th>
                                <td>{{ $store.getters.order_cs[0].ref.data_value[i] }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-12 lg:col-6">
                        <table>
                            <tr v-for="i in $store.getters.order_cs[0].ref.display.length" :key="i">
                                <th>{{ $store.getters.order_cs[0].ref.display[i] }}</th>
                                <td>{{ $store.getters.order_cs[0].ref.display_value[i] }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="grid" v-if="$store.getters.order_cs.length === 0 && service===null">
            <div class="col-12">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-phone"></i>
                    </span>
                    <InputMask v-model="mobile" :disabled="isDisabled" mask="999-9999999"
                        placeholder="กรุณากรอกหมายเลขโทรศัพท์" class="w-full font" />
                </div>
            </div>
            <div class="col-12">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-qrcode"></i>
                    </span>
                    <Textarea v-model="barcode" :disabled="isDisabled" placeholder="แสกนบาร์โค้ดในช่องนี้" :rows="1" style="resize: none;"
                        class="w-full font" />
                </div>
            </div>
            <div class="col-12">
                <Button label="ตรวจสอบใบแจ้งหนี้" icon="pi pi-search" @click="checkService()" />
            </div>
        </div>
        <div v-if="service !== null">
            <div class="grid">
                <div class="col-12">
                    <Divider type="dashed" align="center">
                        <Chip :label="getServiceName(service.productid)" />
                    </Divider>
                </div>
                <div class="col-12 text-center">
                    <Image :src="getImage(service.productid)" width="150" @error="imgError(event)" />
                </div>
            </div>
            <div class="grid ">
                <div class="col-12">
                    <Panel header="ยอดชำระ">
                        <InputNumber v-model="service.amount" :min="100" v-if="service.partial" class="w-full"
                            inputClass="font" inputStyle="font-size: 22px; font-weight: bold" mode="decimal"
                            :minFractionDigits="2" :maxFractionDigits="2" />
                        <h2 class="m-0 p-0" v-if="!service.partial">{{ numberFormat(service.amount) }}
                            <small>บาท</small>
                        </h2>
                    </Panel>
                </div>
                <div class="col-12" v-if="service.amount!==0 || service.amount!==null">
                    <Button class="p-button-success mr-2" label="ยืนยันการชำระ" icon="pi pi-check"
                        @click="confirmService()" />
                    <Button class="p-button-danger" label="ยกเลิก" icon="pi pi-times" @click="clearService()" />
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <Divider align="center" type="dashed">
                        <Chip label="รายละเอียด" />
                    </Divider>
                </div>
            </div>
            <div class="grid mt-2">
                <div class="col-12 m-0 p-0" v-if="service.alert_message!==''">
                    <Message class="m-0 p-0" severity="error">{{ service.alert_message }}</Message>
                </div>
                <div class="col-12 m-0 p-0" v-if="service.warning_message!==''">
                    <Message class="m-0 p-0 mt-2" severity="warn">{{ service.alert_message }}</Message>
                </div>
                <div class="col-12 lg:col-6">
                    <table>
                        <tr v-for="i in service.data.length" :key="i">
                            <th>{{ service.data[i-1] }}</th>
                            <td>{{ service.data_value[i-1] }}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-12 lg:col-6">
                    <table>
                        <tr v-for="i in service.display.length" :key="i">
                            <th>{{ service.display[i-1] }}</th>
                            <td>{{ service.display_value[i-1] }}</td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/service/barcode`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.services = res.data.data;
        }).catch(() => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถโหลดข้อมูลบริการได้', life: 3000 });
            this.$router.push('/')
        })
        this.$store.commit('setLoading', false);
        // console.log(this.services);
    },
    data: () => ({
        services: [],
        service: null, //service และบริการที่เลือก
        barcode: '',
        mobile: '',
        isDisabled: false,
    }),
    methods: {
        getImage(item) {
            try{
                const img =  require('@/assets/img/counter_service/'+item+'.png')
                return img
            }catch(err){
                return 'https://promotions.co.th/wp-content/uploads/2019/03/06.jpg';
            }
        },
        getServiceName(productid) {
            if (productid) {
                const product = this.services.find((el) => el.productid === productid);
                if (product) {
                    return product.productname;
                } else {
                    return 'ไม่มีบริการ'
                }
            }
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        clearService() {
            this.barcode = '';
            this.mobile = null;
            this.service = null;
            this.isDisabled = false;
        },
        async checkService() {
            if (this.mobile === '' || this.mobile === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกหมายเลขโทรศัพท์', life: 5000 });
                return false;
            }
            if (this.barcode === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกหรือสแกนรหัสบาร์โค้ด', life: 5000 });
                return false;
            }

            this.$store.commit('setLoading', true);
            await axios.post(`${process.env.VUE_APP_SHOP}counter_service/barcode/check`, {
                mobile: this.mobile.replace(/-/g, ''),
                barcode: this.barcode
            }, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                this.$store.commit('setLoading', false);
                const service = this.services.find((el) => el.productid === res.data.productid);
                if (service) {
                    this.service = { ...res.data };
                    console.log(this.service);
                    this.isDisabled = true;
                } else {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: res.data.error_text, life: 5000 });
                    this.barcode = '';
                    this.service = null;
                    this.isDisabled = false;
                    return false;
                }
            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
                if (err.response.data.error_text) {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.error_text, life: 5000 });
                } else {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 5000 });
                }
                this.barcode = '';
                this.service = null;
                this.isDisabled = false;
                this.$store.commit('setLoading', false);
            })
        },
        confirmService() {
            this.$confirm.require({
                message: `ต้องการชำระใบแจ้งหนี้ ${this.getServiceName(this.service.productid)} จำนวน ${this.numberFormat(this.service.amount)} บาท นี้?`,
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
                        price: this.service.amount,
                        data1: this.service.data_value[0],
                        data2: this.service.data_value[1],
                        data3: this.service.data_value[2],
                        data4: this.service.data_value[3],
                        data5: this.service.data_value[4]
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}counter_service/barcode/verify`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        // console.log(res)
                        if (res.data.error_code === 'E00') {
                            const data_order = [];
                            const order = {
                                name: this.getServiceName(res.data.productid),
                                mobile: this.mobile.replace(/-/g, ''),
                                type : 'sot',
                                service: { ...res.data },
                                service_code : 'barcode',
                                ref : {...this.service},
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
                            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มในรายการชำระเรียบร้อยแล้ว', life: 5000 });
                            localStorage.setItem('order_total', this.$store.getters.order_cs_total)
                            this.clearService();
                        } else {
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: res.data.error_text, life: 5000 });
                            this.$store.commit('setLoading', false);
                        }
                    }).catch((err) => {
                        if(err.response.status === 408){
                            window.location.reload();
                        }
                        // console.log(err);
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 5000 });
                        this.$store.commit('setLoading', false);
                    })
                },
            });
        }
    }
}
</script>

<style scoped>
table {
    width: 100%;
    border: solid 1px rgb(194, 194, 194);
    border-radius: 5px;
    padding-top: 5px;
    padding-bottom: 3px;
    padding-left: 5px
}

td,
th {
    padding-top: 5px;
    padding-bottom: 3px;
    padding-left: 5px
}

th {
    text-align: left;
}
</style>