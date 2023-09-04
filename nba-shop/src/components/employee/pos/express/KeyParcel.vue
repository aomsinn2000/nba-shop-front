<template>
    <div class="grid">
        <div class="col-12">
            <Fieldset legend="ผู้ส่ง" :toggleable="true">
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <address-book-sender @choose-address="chooseSender" v-if="!checkDisableFrom()" />
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText :disabled="checkDisableFrom()" v-model="booking.origin.name"
                                    placeholder="กรอกชื่อผู้ส่ง" class="w-full font" />
                                <label>ชื่อ-นามสกุล</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputMask :disabled="checkDisableFrom()" mask="999-9999999" v-model="booking.origin.tel"
                                    class="w-full font" />
                                <label>เบอร์โทร</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText :disabled="checkDisableFrom()" v-model="booking.origin.address"
                                    class="w-full font" placeholder="บ้านเลขที่, หมู่ที่ , ถนน , ซอย เป็นต้น" />
                                <label>ที่อยู่</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown :disabled="checkDisableFrom()" showClear v-model="from_province"
                                    :options="item_from_province" option-label="name_th" :filter="true" class="w-full"
                                    inputClass="font" @change="chooseFromProvince" />
                                <label>จังหวัด</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown :disabled="checkDisableFrom()" showClear v-model="from_state"
                                    :options="item_from_state" :filter="true" option-label="name_th" class="w-full"
                                    inputClass="font" @change="chooseFromState" />
                                <label>เขต/อำเภอ</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown :disabled="checkDisableFrom()" v-model="from_district"
                                    :options="item_from_district" option-label="name_th" class="w-full" inputClass="font"
                                    @change="chooseFromDistrict" />
                                <label>แขวง/ตำบล</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText :disabled="checkDisableFrom()" v-model="booking.origin.postcode"
                                    class="font w-full" />
                                <label>รหัสไปรษณีย์</label>
                            </span>
                        </div>
                    </div>
                </div>
            </Fieldset>
            <Fieldset legend="ผู้รับ" :toggleable="true" class="mt-2">
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <address-book-recipient @choose-address="chooseRecipient" />
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="booking.to.name" placeholder="กรอกชื่อผู้ส่ง" class="w-full font" />
                                <label>ชื่อ-นามสกุล</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputMask mask="999-9999999" v-model="booking.to.tel" class="w-full font" />
                                <label>เบอร์โทร</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="booking.to.address" class="w-full font"
                                    placeholder="บ้านเลขที่, หมู่ที่ , ถนน , ซอย เป็นต้น" />
                                <label>ที่อยู่</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown showClear v-model="to_province" :options="item_to_province" option-label="name_th"
                                    :filter="true" class="w-full" inputClass="font" @change="chooseToProvince" />
                                <label>จังหวัด</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown showClear v-model="to_state" :options="item_to_state" :filter="true"
                                    option-label="name_th" class="w-full" inputClass="font" @change="chooseToState" />
                                <label>เขต/อำเภอ</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <Dropdown v-model="to_district" :options="item_to_district" option-label="name_th"
                                    class="w-full" inputClass="font" @change="chooseToDistrict" />
                                <label>แขวง/ตำบล</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-6 md:col-6 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="booking.to.postcode" class="font w-full" />
                                <label>รหัสไปรษณีย์</label>
                            </span>
                        </div>
                    </div>
                </div>
            </Fieldset>
            <Fieldset legend="น้ำหนัก & ขนาด" :toggleable="true" class="mt-2">
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <Button @click="dialogBox = true" icon="pi pi-box" label="กล่อง"
                                class="p-button-outlined p-button-warning p-button-sm" />
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="lg:col-3 md:col-4 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputNumber v-model="booking.parcel.width" :minFractionDigits="0" :maxFractionDigits="2"
                                    inputClass="font w-full" />
                                <label>กว้าง (ซม.)</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-3 md:col-4 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputNumber v-model="booking.parcel.length" :minFractionDigits="0" :maxFractionDigits="2"
                                    inputClass="font w-full" />
                                <label>ยาว (ซม.)</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-3 md:col-4 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputNumber v-model="booking.parcel.height" :minFractionDigits="0" :maxFractionDigits="2"
                                    inputClass="font w-full" />
                                <label>สูง (ซม.)</label>
                            </span>
                        </div>
                    </div>
                    <div class="lg:col-3 md:col-4 sm:col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputNumber v-model="booking.parcel.weight" inputClass="w-full font" />
                                <label>น้ำหนัก(กรัม)</label>
                            </span>
                        </div>
                    </div>
                </div>
            </Fieldset>
        </div>
        <div class="col-12 pb-0">
            <div class="flex flex-wrap">
                <div class="flex align-items-center justify-content-center">
                    <Checkbox v-model="checked_rule" :binary="true" /> &nbsp;&nbsp;&nbsp;<strong> อ่านและยอมรับ </strong> <rule-document />
                </div>
            </div>

        </div>
        <div class="col-12 pt-0">
            <Button @click="calCheckPrice()" icon="pi pi-calculator" class="mt-3 w-full p-button-secondary"
                label="คำนวณราคา" />
        </div>
    </div>

    <!--Box-->
    <Dialog v-model:visible="dialogBox" header="ขนาดกล่อง" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div class="grid">
            <div class="col-12">
                <Dropdown v-model="box" :options="item_box" option-label="name" class="w-full" placeholder="เลือกขนาดกล่อง"
                    inputClass="font" :filter="true" :showClear="true"></Dropdown>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-text" @click="dialogBox = false" />
            <Button label="ตกลง" @click="chooseBox" />
        </template>
    </Dialog>

    <!-- Dialog Checkprice -->
    <Dialog v-model:visible="dialogCheckprice" header="เลือกขนส่ง" :modal="true" :draggable="false"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '80vw' }">
        <div class="grid">
            <div class="col-12">
                <DataTable :value="checkprice" :paginator="true" :rows="5" rowHover>
                    <template #empty>
                        <p class="m-0 text-center"><em><strong>-ไม่มีขนส่งให้บริการพัสดุชิ้นนี้-</strong><br />
                                <small>เนื่องจากขนาดหรือน้ำหนักเกินเกณฑ์ที่ขนส่งจะรับ</small>
                            </em></p>
                    </template>
                    <Column header="ขนส่ง" style="width: 60px">
                        <template #body="item">
                            <Image :src="getImageCourier(item.data.courier_code)" width="50" />
                        </template>
                    </Column>
                    <Column header="ชื่อขนส่ง">
                        <template #body="item">{{ item.data.courier_name }}
                        </template>
                    </Column>
                    <Column header="รายละเอียด" style="width: 25%">
                        <template #body="item">{{ item.data.estimate_time }}</template>
                    </Column>
                    <Column header="ราคา (บาท)" style="width: 15%">
                        <template #body="item">
                            {{ func.numberDigitFormat(item.data.price) }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 15%">
                        <template #body="item">
                            <Button @click="chooseCourier(item.data)" label="เลือก" icon="pi pi-check" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Dialog>
</template>

<script>
import axios from 'axios'
import func from '@/service/function'
import AddressBookRecipient from './AddressBookRecipient.vue'
import AddressBookSender from './AddressBookSender.vue'
import RuleDocument from './RuleDocument.vue'
export default {
    components: { AddressBookRecipient, AddressBookSender, RuleDocument },
    setup() {
        return { func }
    },
    async created() {
        this.$store.commit('setLoading', true);
        //เรียกขนาดกล่อง
        await axios.get(`${process.env.VUE_APP_SHOP}express/box_standard`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.item_box = res.data.data;
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })

        await axios.get(`${process.env.VUE_APP_SHOP}thailand/province`).then((res) => {
            this.$store.commit('setLoading', false);
            this.item_from_province = res.data;
            this.item_to_province = res.data;
        }).catch((err) => {
            console.log(err);
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดจังหวัดไม่สำเร็จ', life: 3000 });
            this.$router.push('/');
        })

        //check
        await this.checkOrder();
    },
    data: () => ({
        dialogBox: false,
        dialogCheckprice: false,
        item_box: [],
        box: null,
        item_from_province: [],
        item_from_state: [],
        item_from_district: [],
        item_to_province: [],
        item_to_state: [],
        item_to_district: [],
        from_province: null,
        from_state: null,  //อำเภอ
        from_district: null, // ตำบล
        to_province: null,
        to_state: null,    //อำเภอ
        to_district: null,  //ตำบล
        to_postcode: '',
        checkprice: [],
        booking: {
            branch_id: "",
            //ผู้มาส่ง
            origin: {
                name: "",
                address: "",
                district: "",
                state: "",
                province: "",
                postcode: "",
                tel: ""
            },
            //ร้านค้า
            from: {
                name: "",
                address: "",
                district: "",
                state: "",
                province: "",
                postcode: "",
                tel: ""
            },
            //ผู้รับ
            to: {
                name: "",
                address: "",
                district: "",
                state: "",
                province: "",
                postcode: "",
                tel: ""
            },
            parcel: {
                name: "กล่องกำหนดเอง",
                weight: null,
                width: null,
                length: null,
                height: null
            },
            courier_code: "",
            cod_amount: ""
        },
        origin_data: null,
        checked_rule: false,

    }),
    updated() {
        this.checkDisableFrom();
        this.checkOriginAddress();
        this.checkOrder();
    },
    methods: {
        async chooseSender(res) {
            this.booking.origin.name = res.name;
            this.booking.origin.tel = res.tel;
            this.booking.origin.address = res.address;
            const provinces = await axios.get(`${process.env.VUE_APP_SHOP}thailand/province`);
            const province = provinces.data.find((el) => el.name_th === res.province);
            if (province) {
                this.from_province = province;
                this.booking.origin.province = res.province;
            }
            const amphures = await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure/by-province-id/${province.id}`);
            this.item_from_state = amphures.data;
            const amphure = amphures.data.find((el) => el.name_th === res.state);
            if (amphure) {
                this.from_state = amphure;
                this.booking.origin.state = res.state;
            }
            const tambons = await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon/by-amphure-id/${amphure.id}`);
            this.item_from_district = tambons.data;
            const tambon = tambons.data.find((el) => el.name_th === res.district);
            if (tambon) {
                this.from_district = tambon;
                this.booking.origin.district = res.district
            }
            this.booking.origin.postcode = res.postcode;

        },
        async chooseRecipient(res) {
            this.booking.to.name = res.name;
            this.booking.to.tel = res.tel;
            this.booking.to.address = res.address;
            const provinces = await axios.get(`${process.env.VUE_APP_SHOP}thailand/province`);
            const province = provinces.data.find((el) => el.name_th === res.province);
            if (province) {
                this.to_province = province;
                this.booking.to.province = res.province;
            }
            const amphures = await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure/by-province-id/${province.id}`);
            this.item_to_state = amphures.data;
            const amphure = amphures.data.find((el) => el.name_th === res.state);
            if (amphure) {
                this.to_state = amphure;
                this.booking.to.state = res.state;
            }
            const tambons = await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon/by-amphure-id/${amphure.id}`);
            this.item_to_district = tambons.data;
            const tambon = tambons.data.find((el) => el.name_th === res.district);
            if (tambon) {
                this.to_district = tambon;
                this.booking.to.district = res.district
            }
            this.booking.to.postcode = res.postcode;
        },
        async checkOrder() {
            if (this.$store.getters.order_express.length > 0) {
                this.booking.origin.name = this.$store.getters.order_express[0].detail.origin.name;
                this.booking.origin.tel = this.$store.getters.order_express[0].detail.origin.tel;
                this.booking.origin.address = this.$store.getters.order_express[0].detail.origin.address;
                const province = await this.item_from_province.find((el) => el.name_th === this.$store.getters.order_express[0].detail.origin.province);
                this.from_province = province;
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure`).then((res) => {
                    this.item_from_state = res.data.filter((el) => el.province_id === province.id);
                })
                this.from_state = await this.item_from_state.find((el) => el.name_th === this.$store.getters.order_express[0].detail.origin.state);
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon`).then((res) => {
                    this.item_from_district = res.data.filter((el) => el.amphure_id === this.from_state.id)
                })
                this.from_district = await this.item_from_district.find((el) => el.name_th === this.$store.getters.order_express[0].detail.origin.district);
                this.booking.origin.postcode = this.$store.getters.order_express[0].detail.origin.postcode;
            }
        },
        checkDisableFrom() {
            //ถ้ามีพัสดุที่ค้างในรายการจะไม่สามารถกรอกข้อมูลผู้ส่งได้
            if (this.$store.getters.order_express.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        checkOriginAddress() {
            //เมื่อเข้าหน้านี้ ถ้ามีพัสดุอยู่แล้วจะทำการตั้งค่าเริ่มต้นของผู้ส่ง
            if (this.$store.getters.order_express.length > 0) {
                //เซตจังหวัด
                this.from_province = this.item_to_province.find((el) => el.name_th === this.$store.getters.order_express[0].detail.origin.province);
                this.booking.origin.province = this.from_province.name_th;
            }
        },
        getImageCourier(item) {
            switch (item) {
                case 'DHL':
                    return require('@/assets/img/icon_courier/DHL.png')
                case 'FLE':
                    return require('@/assets/img/icon_courier/FLE.png')
                case 'NJV':
                    return require('@/assets/img/icon_courier/NJV.png')
                case 'SCG':
                    return require('@/assets/img/icon_courier/SCG.png')
                case 'SCGC':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'SCGF':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'TP2':
                    return require('@/assets/img/icon_courier/TP2.png')
                case 'EMST':
                    return require('@/assets/img/icon_courier/EMST.png')
                case 'ECP':
                    return require('@/assets/img/icon_courier/ECP.png')
                case 'BEST':
                    return require('@/assets/img/icon_courier/BEST.png')
                case 'SPX':
                    return require('@/assets/img/icon_courier/SPX.png')
                case 'KRYS':
                    return require('@/assets/img/icon_courier/KRY.png')
                default:
                    return require('@/assets/img/icon_courier/NONE.png')
            }
        },
        chooseBox() {
            if (this.box !== null) {
                this.booking.parcel.name = this.box.name;
                this.booking.parcel.width = this.box.width;
                this.booking.parcel.length = this.box.length;
                this.booking.parcel.height = this.box.height;
            } else {
                this.box = null;
                this.booking.parcel.name = 'กล่องกำหนดเอง';
                this.booking.parcel.width = null;
                this.booking.parcel.length = null;
                this.booking.parcel.height = null;
            }
            this.dialogBox = false;
        },
        clearBox() {
            this.box = null;
            this.booking.parcel.name = 'กล่องกำหนดเอง';
            this.booking.parcel.width = null;
            this.booking.parcel.length = null;
            this.booking.parcel.height = null;
        },
        clearTo() {
            this.to_state = null;
            this.to_district = null;
            this.booking.to.province = '';
            this.booking.to.state = '';
            this.booking.to.district = '';
            this.booking.to.postcode = '';
            this.item_to_district = [];
            this.item_to_state = [];
        },
        clearToAll() {
            this.clearTo();
            this.to_province = '';
            this.booking.to.name = '';
            this.booking.to.tel = '';
            this.booking.to.address = '';
        },
        clearFrom() {
            this.from_state = null; //อำเภอ
            this.from_district = null; //ตำบล
            this.booking.origin.province = '';
            this.booking.origin.district = '';
            this.booking.origin.state = '';
            this.booking.origin.postcode = '';
            this.item_from_district = [];
            this.item_from_state = [];
        },
        clearFromAll() {
            this.clearFrom();
            this.booking.origin.name = '';
            this.booking.origin.tel = '';
            this.booking.origin.address = '';
        },
        //FROM
        async chooseFromProvince(event) {
            if (event.value !== null) {
                this.booking.origin.province = event.value.name_th;
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure`).then((res) => {
                    this.item_from_state = res.data.filter((el) => el.province_id === event.value.id);
                }).catch((err) => {
                    console.log(err);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดเขต/อำเภอ ไม่สำเร็จ', life: 3000 });
                })
            } else {
                this.clearFrom();
            }

        },
        async chooseFromState(event) {
            if (event.value !== null) {
                this.booking.origin.state = event.value.name_th;
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon`).then((res) => {
                    this.item_from_district = res.data.filter((el) => el.amphure_id === event.value.id)
                }).catch((err) => {
                    console.log(err);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดแขวง/ตำบล ไม่สำเร็จ', life: 3000 });
                })
            } else {
                this.booking.origin.state = '';
                this.booking.origin.district = '';
                this.booking.origin.postcode = '';
                this.item_from_district = []
            }
        },
        chooseFromDistrict(event) {
            this.booking.origin.district = event.value.name_th
            this.booking.origin.postcode = event.value.zip_code;
        },
        //TO
        async chooseToProvince(event) {
            if (event.value !== null) {
                this.booking.to.province = event.value.name_th;
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure`).then((res) => {
                    this.item_to_state = res.data.filter((el) => el.province_id === event.value.id);
                }).catch((err) => {
                    console.log(err);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดเขต/อำเภอ ไม่สำเร็จ', life: 3000 });
                })
            } else {
                this.clearTo();
            }
        },
        async chooseToState(event) {
            if (event.value !== null) {
                this.booking.to.state = event.value.name_th;
                await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon`).then((res) => {
                    this.item_to_district = res.data.filter((el) => el.amphure_id === event.value.id)
                }).catch((err) => {
                    console.log(err);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดแขวง/ตำบล ไม่สำเร็จ', life: 3000 });
                })
            } else {
                this.booking.to.state = '';
                this.booking.to.district = '';
                this.booking.to.postcode = '';
                this.item_to_district = []
            }
        },
        chooseToDistrict(event) {
            this.booking.to.district = event.value.name_th;
            this.booking.to.postcode = event.value.zip_code;
        },
        setFrom() {
            this.booking.from.name = this.$store.getters.shop.shop_number + this.$store.getters.shop.shop_name;
            this.booking.from.tel = this.$store.getters.partner.partner_phone;
            this.booking.from.address = this.$store.getters.shop.shop_address;
            this.booking.from.district = this.$store.getters.shop.shop_district;
            this.booking.from.state = this.$store.getters.shop.shop_state;
            this.booking.from.province = this.$store.getters.shop.shop_province;
            this.booking.from.postcode = this.$store.getters.shop.shop_postcode;
        },
        calCheckPrice() {
            //check branch_id ของร้านค้า
            if (this.$store.getters.shop.branch_id !== 'ไม่มี') {
                this.booking.branch_id = this.$store.getters.shop.shop_branch_id;
            } else {
                this.booking.branch_id = '';
            }
            //ตรวจสอบข้อมูลผู้ส่ง
            if (this.booking.origin.name === "" || this.booking.origin.tel === '' || this.booking.origin.address === ''
                || this.booking.origin.district === '' || this.booking.origin.state === '' || this.booking.origin.province === ''
                || this.booking.origin.postcode === '') {
                this.$toast.add({ severity: 'warn', summary: 'ข้อมูลผู้ส่งไม่ครบถ้วน', detail: "กรุณากรอกข้อมูลผู้ส่งให้ครบถ้วน", life: 3000 });
                return false;
            }
            //ตรวจสอบข้อมูลผู้รับ
            if (this.booking.to.name === "" || this.booking.to.tel === '' || this.booking.to.address === ''
                || this.booking.to.district === '' || this.booking.to.state === '' || this.booking.to.province === ''
                || this.booking.to.postcode === '') {
                this.$toast.add({ severity: 'warn', summary: 'ข้อมูลผู้รับไม่ครบถ้วน', detail: "กรุณากรอกข้อมูลผู้รับให้ครบถ้วน", life: 3000 });
                return false;
            }
            //ตรวจสอบน้ำหนักแหละขนาด
            if (this.booking.parcel.name === '' || this.booking.parcel.weight === null || this.booking.parcel.width === null
                || this.booking.parcel.height === null || this.booking.parcel.length === null) {
                this.$toast.add({ severity: 'warn', summary: 'ขนาดกล่อง & น้ำหนัก', detail: "กรุณากรอกข้อมูลขนาดกล่องและน้ำหนักให้ครบถ้วน", life: 3000 });
                return false;
            }
            if (this.booking.parcel.weight <= 0 || this.booking.parcel.width <= 0
                || this.booking.parcel.height <= 0 || this.booking.parcel.length <= 0) {
                this.$toast.add({ severity: 'warn', summary: 'ขนาดกล่อง & น้ำหนัก', detail: "ข้อมูลพัสดุไม่ถูกต้อง", life: 3000 });
                return false;
            }

            //ตรวจสอบการยอมรับเงื่อนไข
            if(!this.checked_rule){
                this.$toast.add({ severity: 'warn', summary: 'ยอมรับเงื่อนไข', detail: "กรุณาอ่านและยอมรับเงื่อนไขและข้อตกลง", life: 3000 });
                return false;
            }

            //น้ำหนักเป็น string
            this.booking.parcel.weight = String(this.booking.parcel.weight);
            this.booking.parcel.height = String(this.booking.parcel.height);
            this.booking.parcel.length = String(this.booking.parcel.length);
            this.booking.parcel.width = String(this.booking.parcel.width);

            //แปลงเบอร์โทร
            this.booking.origin.tel = this.booking.origin.tel.replace(/-/g, '');
            this.booking.to.tel = this.booking.to.tel.replace(/-/g, '');

            this.setFrom();
            this.$confirm.require({
                message: 'ต้องการตรวจสอบราคาและขนส่งที่ให้บริการตามข้อมูลนี้?',
                header: 'ตรวจสอบขนส่งและคำนวณราคา',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    const data = {
                        from: { ...this.booking.from },
                        to: { ...this.booking.to, tel: this.booking.to.tel.replace(/-/g, '') },
                        parcel: { ...this.booking.parcel },
                        branch_id: this.booking.branch_id
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}express/pricelist`, data, {
                        headers: {
                            'auth-token': `${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.$store.commit('setLoading', false);
                        if (this.$store.getters.order_express.length > 0) {
                            this.checkprice = res.data.data.filter((el) => el.courier_code === this.$store.getters.order_express[0].pricelist.courier_code);
                        } else {
                            this.checkprice = res.data.data;
                        }
                        this.origin_data = res.data.origin_data;
                        this.dialogCheckprice = true;
                    }).catch((err) => {
                        this.$store.commit('setLoading', false);
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })
                }
            });
        },
        chooseCourier(item) {
            this.$confirm.require({
                message: `ต้องการส่งพัสดุชิ้นนี้ด้วยขนส่ง ${item.courier_name} นี้?`,
                header: 'ยืนยันขนส่ง',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    let branch_id = '';
                    if (item.courier_code === 'KRYS') {
                        if (this.$store.getters.shop.shop_branch_id !== 'ไม่มี') {
                            branch_id = this.$store.getters.shop.shop_branch_id;
                        }
                    }
                    //แปลงเบอร์โทร
                    this.booking.origin.tel = this.booking.origin.tel.replace(/-/g, '');
                    this.booking.to.tel = this.booking.to.tel.replace(/-/g, '');

                    const data = {
                        id: String(this.$store.getters.order_express.length + 1),
                        type: "parcel",
                        detail: { ...this.origin_data, origin: { ...this.booking.origin }, courier_code: item.courier_code, branch_id: branch_id, cod_amount: "" },
                        pricelist: item,
                        amount: 1,
                        total: item.price * 1
                    }
                    await this.$store.dispatch('addOrderExpress', data);
                    this.clearToAll();
                    this.origin_data = null;
                    this.clearBox();
                    this.booking.parcel.weight = null;
                    this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการพัสดุเรียบร้อยแล้ว', life: 3000 });
                    this.dialogCheckprice = false;
                }
            });
        }
    }
}
</script>

<style></style>