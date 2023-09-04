<template>
    <div class="grid">
        <div class="col-12">
            <Button label="ตรวจสอบและเปรียบเทียบค่าส่ง" class="p-button-success p-button-outlined" @click="openDialogCheckPrice()" />
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <DataView :value="$store.getters.item_courier" :paginator="true" :rows="12" :loading="isLoading">
                <template #empty>
                    <p class="text-center"><em>--ไม่พบขนส่งในพื้นที่--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card" @click="chooseCourier(item.data)">
                            <div class="card-img">
                                <img :src="getImage(item.data.courier_code)" />
                            </div>
                            <div class="card-head">
                                <p class="mb-0 mt-0 text-center"><small>{{ item.data.courier_name }}</small></p>
                            </div>
                            <div style="padding: 5px;" class="text-center">
                                <Badge :value="item.data.estimate_time" class="bg-yellow-500" />
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>


    <!-- Dialog กรอกข้อมูลรายละเอียดขนส่ง -->
    <Dialog :header="courier.courier_name + ' (' + courier.estimate_time + ')'" v-model:visible="dialogCourier"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '60vw' }" :maximizable="true"
        :modal="true">
        <div class="grid" v-if="courier.notice">
            <div class="col-12">
                <Message severity="warn">{{ courier.notice }}</Message>
            </div>
        </div>
        <div class="grid">
            <div class="col-12 lg:col-6">
                <Fieldset legend="ผู้ส่ง">
                    <div class="grid">
                        <div class="col-12 lg:col-6">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText class="w-full" type="text" :disabled="isDisableFrom"
                                        v-model="booking.origin.name" />
                                    <label>ชื่อ :</label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-6">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputMask class="w-full" mask="9999999999" :disabled="isDisableFrom"
                                        v-model="booking.origin.tel" />
                                    <label>เบอร์โทร : </label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-12">
                            <div class="field">
                                <span class="p-float-label">
                                    <Textarea v-model="booking.origin.address" :disabled="isDisableFrom"
                                        placeholder="บ้านเลขที่ , ซอย ,ถนน เป็นต้น" class="w-full font" />
                                    <label>ที่อยู่ : </label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-12">
                            <div class="field">
                                <span class="p-float-label">
                                    <Dropdown :loading="isLoading" :disabled="isDisableFrom" v-model="from_select"
                                        class="w-full" inputClass="font" :showClear="true" :filter="true"
                                        :options="thailand" optionLabel="name" optionValue="data"
                                        placeholder="เลือกพื้นที่">
                                    </Dropdown>
                                    <label>พื้นที่บริการ : </label>
                                </span>
                            </div>
                        </div>
                    </div>
                </Fieldset>
            </div>
            <div class="col-12 lg:col-6">
                <Fieldset legend="ผู้รับ">
                    <div class="grid">
                        <div class="col-12 lg:col-6">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText class="w-full" type="text" :disabled="isDisable"
                                        v-model="booking.to.name" />
                                    <label>ชื่อ :</label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-6">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputMask class="w-full" mask="9999999999" :disabled="isDisable"
                                        v-model="booking.to.tel" />
                                    <label>เบอร์โทร : </label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-12">
                            <div class="field">
                                <span class="p-float-label">
                                    <Textarea v-model="booking.to.address" :disabled="isDisable"
                                        placeholder="บ้านเลขที่ , ซอย ,ถนน เป็นต้น" class="w-full font" />
                                    <label>ที่อยู่ : </label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-12">
                            <div class="field">
                                <span class="p-float-label">
                                    <Dropdown :loading="isLoading" :disabled="isDisable" v-model="to_select"
                                        class="w-full" inputClass="font" :showClear="true" :filter="true"
                                        :options="thailand" optionLabel="name" optionValue="data"
                                        placeholder="เลือกพื้นที่">
                                    </Dropdown>
                                    <label>พื้นที่บริการ : </label>
                                </span>
                            </div>
                        </div>
                    </div>
                </Fieldset>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <Fieldset legend="ขนาดกล่อง & น้ำหนัก">
                    <div class="grid">
                        <div class="col-12 lg:col-3">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText v-model="booking.parcel.width" :disabled="isDisable" class="w-full"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                    <label>กว้าง (ซม.) :</label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-3">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText v-model="booking.parcel.height" :disabled="isDisable" class="w-full"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                    <label>ยาว (ซม.) :</label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-3">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText v-model="booking.parcel.length" :disabled="isDisable" class="w-full"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                    <label>สูง (ซม.) :</label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-3">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText v-model="booking.parcel.weight" :disabled="isDisable" class="w-full"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                    <label>น้ำหนัก (กรัม) :</label>
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button @click="dialogBox = true" icon="pi pi-box" label="ขนาดกล่อง"
                        class="p-button-success p-button-outlined p-button-sm" />
                </Fieldset>
            </div>
        </div>
        <div class="grid" v-if="cod_status === true">
            <div class="col-12">
                <Fieldset legend="อื่นๆ">
                    <div class="grid">
                        <div class="col-12 lg:col-3">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputText v-model="booking.cod_amount" class="w-full font"
                                        placeholder="กรณีต้องการเก็บเงินปลายทาง" :disabled="isDisable" />
                                    <label>เก็บเงินปลายทาง (ถ้ามี)</label>
                                </span>
                            </div>
                        </div>
                    </div>

                </Fieldset>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="dialogCourier = false"
                :disabled="isDisable" />
            <Button label="ตกลง" icon="pi pi-check" @click="checkprice()" :loading="isLoading" />
        </template>
    </Dialog>

    <!-- BOX -->
    <Dialog v-model:visible="dialogBox" header="ขนาดกล่อง" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div class="grid">
            <div class="col-12">
                <Dropdown v-model="box" :options="item_box" option-label="name" option-value="_id" class="w-full"
                    placeholder="เลือกขนาดกล่อง" inputClass="font" :filter="true" :showClear="true"></Dropdown>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-text" @click="dialogBox = false" />
            <Button label="ตกลง" @click="chooseBox()" />
        </template>
    </Dialog>

    <!-- Dialog แสดงยอดรวม-->
    <Dialog v-model:visible="dialogTotal" header="อัตราค่าบริการ" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div v-if="pricelist !== null">
            <div class="grid" v-if="pricelist.parcel.price_fuel_surcharge">
                <div class="col-4">
                    <p>ค่าเชื้อเพลิง</p>
                </div>
                <div class="col-8 text-right">
                    <p><strong>{{ numberFormat(pricelist.parcel.price_fuel_surcharge) }}</strong> <small>บาท</small></p>
                </div>
                <Divider class="mb-0 mt-0"></Divider>
            </div>
            <div class="grid" v-if="pricelist.data.cod_amount !== ''">
                <div class="col-4">
                    <p>เก็บเงินปลายทาง</p>
                </div>
                <div class="col-8 text-right">
                    <p><strong>{{ numberFormat(pricelist.data.cod_amount) }}</strong> <small>บาท</small></p>
                </div>
                <Divider class="mb-0 mt-0"></Divider>
            </div>
            <div class="grid">
                <div class="col-4">
                    <h2><small>รวม : </small></h2>
                </div>
                <div class="col-8 text-right">
                    <h2><strong>{{ numberFormat(pricelist.parcel.price) }}</strong> <small>บาท</small></h2>
                </div>
                <Divider class="mb-0 mt-0"></Divider>
            </div>
        </div>

        <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" @click="dialogTotal = false" class="p-button-text" />
            <Button label="ตกลง" icon="pi pi-check" @click="confirmParcel()" />
        </template>
    </Dialog>

    <!-- dialog loading-->
    <!-- <Dialog class="border-0 shadow-none " :draggable="false" v-model:visible="dialogLoading" :closable="false"
        :modal="true">
        <ProgressSpinner style="width:80px;height:80px" strokeWidth="5" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </Dialog> -->


    <!-- Dialog Check Price -->
    <Dialog header="เปรียบเทียบราคา" :modal="true" v-model:visible="dialogCheckPrice"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
        <div class="grid">
            <div class="col-12">
                <Divider align="center" type="dashed">
                    <Chip label="ขนาดพัสดุ" />
                </Divider>
                <div class="grid">
                    <div class="col-12 lg:col-3">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="check.parcel.width" class="w-full"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                <label>กว้าง (ซม.) :</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12 lg:col-3">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="check.parcel.height" class="w-full"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                <label>ยาว (ซม.) :</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12 lg:col-3">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="check.parcel.length" class="w-full"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                <label>สูง (ซม.) :</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12 lg:col-3">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="check.parcel.weight" class="w-full"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                                <label>น้ำหนัก (กรัม) :</label>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12">
                        <Button label="ขนาดกล่อง" icon="pi pi-box" class="p-button-sm p-button-outlined p-button-success" @click="dialogBox=true" />
                    </div>
                </div>
            </div>
            <div class="col-12">
                <Divider align="center" type="dashed">
                    <Chip label="ปลายทาง" />
                </Divider>
                <div class="field">
                    <span class="p-float-label">
                        <Dropdown :loading="isLoading" v-model="check.to_select" class="w-full" inputClass="font"
                            :showClear="true" :filter="true" :options="thailand" optionLabel="name" optionValue="data"
                            placeholder="เลือกพื้นที่">
                        </Dropdown>
                        <label>ปลายทาง : </label>
                    </span>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-text p-button-danger" @click="dialogCheckPrice = false" />
            <CheckPrice :check="check"/>
        </template>
    </Dialog>

</template>

<script>
import axios from 'axios';
import CheckPrice from '@/components/employee/pos/express/CheckPrice.vue';
export default {
    components:{
        CheckPrice
    },
    async create() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.assign('/login')
            }
        })

    },
    async mounted() {
        this.$store.commit('setLoading', true);
        await this.checkCourier();
        await axios.post(`https://api.nbadigitalservice.com/api/nba-geo/join_nba_geo_province_amphur_district`, {
            "tokenKey": "*NBADigital9111*"
        }).then((res) => {
            let value = null;
            res.data.data.forEach(el => {
                value = {
                    name: `${el.province_name} ${el.amphur_name} ${el.district_name} ${el.post_code}`,
                    data: {
                        district: el.district_name,
                        state: el.amphur_name,
                        province: el.province_name,
                        postcode: el.post_code
                    }
                }
                this.thailand.push(value);
            });
        }).catch((err) => {
            console.log(err);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'โหลดข้อมูลประเทศไทยผิดพลาด', life: 3000 });
            this.$router.push('/pos');
        })
        //เรียกขนาดกล่อง
        await axios.get(`${process.env.VUE_APP_SHOP}express/box_standard`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.item_box = res.data.data;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })
        await this.$store.commit('checkItemCourier');
        this.isLoading = false
        this.$store.commit('setLoading', false);
    },
    data: () => ({
        dialogCheckPrice: false,
        cod_status: false,
        isLoading: true,
        isDisable: false,
        isDisableFrom: false,
        dialogCourier: false,
        dialogTotal: false,
        dialogBox: false,
        item_box: [],
        box: null,
        couriers: [],
        thailand: [],
        courier: [],
        from_select: null,
        to_select: null,
        pricelist: null,
        detail: null,
        booking: {
            branch_id: "",
            origin: {
                name: "",
                address: "",
                district: "",
                state: "",
                province: "",
                postcode: "",
                tel: ""
            },
            from: {
                name: "",
                address: "",
                district: "",
                state: "",
                province: "",
                postcode: "",
                tel: ""
            },
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
                weight: "",
                width: "",
                length: "",
                height: ""
            },
            courier_code: "",
            cod_amount: ""
        },
        check: {
            to_select: null,
            parcel: {
                name: "กล่องกำหนดเอง",
                weight: "",
                width: "",
                length: "",
                height: ""
            }
        },

    }),
    methods: {
        openDialogCheckPrice(){
            this.check.to_select = null;
            this.check.parcel.name = "กล่องกำหนดเอง";
            this.check.parcel.width = "";
            this.check.parcel.length = "";
            this.check.parcel.height = "";
            this.dialogCheckPrice =true;
        },
        async chooseBox() {
            if (this.box !== null) {
                const box = await this.item_box.find((el) => el._id === this.box);
                this.booking.parcel.name = box.name;
                this.booking.parcel.width = box.width;
                this.booking.parcel.length = box.length;
                this.booking.parcel.height = box.height;

                this.check.parcel.name = box.name;
                this.check.parcel.width = box.width;
                this.check.parcel.length = box.length;
                this.check.parcel.height = box.height;
                
            } else {
                this.booking.parcel.name = "กล่องกำหนดเอง";
                this.booking.parcel.width = "";
                this.booking.parcel.length = "";
                this.booking.parcel.height = "";

                this.check.parcel.name = "กล่องกำหนดเอง";
                this.check.parcel.width = "";
                this.check.parcel.length = "";
                this.check.parcel.height = "";
            }
            this.dialogBox = false;
        },
        async checkCourier() {
            const data = {
                from: {
                    name: `${this.$store.getters.shop.shop_number}-${this.$store.getters.shop.shop_name}`,
                    address: this.$store.getters.shop.shop_address,
                    district: this.$store.getters.shop.shop_district,
                    state: this.$store.getters.shop.shop_state,
                    province: this.$store.getters.shop.shop_province,
                    postcode: this.$store.getters.shop.shop_postcode,
                    tel: this.$store.getters.partner.partner_phone
                },
                to: {
                    name: "NBA Digital Service",
                    address: "298/1 หมู่ 3",
                    district: "สันผักหวาน",
                    state: "หางดง",
                    province: "เชียงใหม่",
                    postcode: "50230",
                    tel: "0860927352"
                },
                parcel: {
                    name: "check พื้นที่",
                    weight: "1001",
                    width: "10",
                    length: "10",
                    height: "15"
                },
                branch_id: this.$store.getters.shop.shop_branch_id
            }
            await axios.post(`${process.env.VUE_APP_SHOP}express/pricelist`, data, {
                headers: {
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                this.couriers = res.data.data;
                this.$store.commit('setItemCourier', res.data.data);
            }).catch(() => {
                this.$toast.add({ severity: 'error', summary: 'ขนส่งผิดพลาด', detail: 'เรียกข้อมูลขนส่งไม่สำเร็จ', life: 3000 });
                this.$router.push('/pos')
            })
        },
        clearForm() {
            this.booking.to.name = "";
            this.booking.to.tel = "";
            this.booking.to.address = "";
            this.booking.to.district = "";
            this.booking.to.state = "";
            this.booking.to.province = "";
            this.booking.to.postcode = "";
            this.booking.cod_amount = "";
            this.booking.parcel.name = "กล่องกำหนดเอง",
            this.booking.parcel.weight = "";
            this.booking.parcel.width = "";
            this.booking.parcel.length = "";
            this.booking.parcel.height = "";
            this.to_select = null;
        },
        clearSender() {
            this.booking.origin.name = "";
            this.booking.origin.tel = "";
            this.booking.origin.address = "";
            this.booking.origin.district = "";
            this.booking.origin.state = "";
            this.booking.origin.province = "";
            this.booking.origin.postcode = "";
            this.from_select = null;
        },
        getImage(item) {
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
        async checkParcelAmount() {
            const check_parcel = await this.$store.getters.order_express.filter((el) => el.type === 'parcel');
            if (check_parcel.length > 0) {
                this.booking.origin.name = check_parcel[0].detail.origin.name;
                this.booking.origin.tel = check_parcel[0].detail.origin.tel;
                this.booking.origin.address = check_parcel[0].detail.origin.address;
                this.booking.origin.district = check_parcel[0].detail.origin.district;
                this.booking.origin.state = check_parcel[0].detail.origin.state;
                this.booking.origin.province = check_parcel[0].detail.origin.province;
                this.booking.origin.postcode = check_parcel[0].detail.origin.postcode;

                this.from_select = {
                    district: this.booking.origin.district,
                    state: this.booking.origin.state,
                    province: this.booking.origin.province,
                    postcode: Number(this.booking.origin.postcode)
                }
                this.isDisableFrom = true;
            } else {
                this.clearForm();
                this.isDisableFrom = false;
            }
        },
        async chooseCourier(item) {
            await this.checkParcelAmount();
            const courier = item;
            this.courier = courier; //มันผูกกันตรงนี้
            this.booking.courier_code = courier.courier_code
            this.clearForm();
            if (this.courier.courier_code === 'KRYS') {
                this.booking.branch_id = this.$store.getters.shop.shop_branch_id;
            }
            this.dialogCourier = true;
        },
        async checkprice() {
            this.booking.from.name = this.$store.getters.shop.shop_number + '-' + this.$store.getters.shop.shop_name;
            this.booking.from.tel = this.$store.getters.partner.partner_phone;
            this.booking.from.address = this.$store.getters.shop.shop_address;
            this.booking.from.district = this.$store.getters.shop.shop_district;
            this.booking.from.state = this.$store.getters.shop.shop_state;
            this.booking.from.province = this.$store.getters.shop.shop_province;
            this.booking.from.postcode = this.$store.getters.shop.shop_postcode;
            if (
                this.booking.origin.name === "" || this.booking.origin.tel === "" ||
                this.booking.origin.address === "" ||
                this.booking.to.name === "" || this.booking.to.tel === "" ||
                this.booking.to.address === "" || this.booking.parcel.name === "" ||
                this.booking.parcel.weight === "" || this.booking.parcel.width === "" ||
                this.booking.parcel.length === "" || this.booking.parcel.height === "" ||
                this.booking.courier_code === ""
            ) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน', life: 3000 });
                return false;
            }
            //check พื้นที่ต้นทาง
            if (this.from_select.length === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกพื้นที่ต้นทาง', life: 2000 });
                return false;
            } else {
                this.booking.origin.district = this.from_select.district;
                this.booking.origin.state = this.from_select.state;
                this.booking.origin.province = this.from_select.province;
                this.booking.origin.postcode = String(this.from_select.postcode);
            }
            //check พื้นที่ปลายทาง
            if (this.to_select.length === 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกพื้นที่ปลายทาง', life: 2000 });
                return false;
            } else {
                this.booking.to.district = this.to_select.district;
                this.booking.to.state = this.to_select.state;
                this.booking.to.province = this.to_select.province;
                this.booking.to.postcode = String(this.to_select.postcode);
            }

            //check น้ำหนัก กว้าง ยาว สูง
            if (Number(this.booking.parcel.weight) <= 0 || Number(this.booking.parcel.width) <= 0 ||
                Number(this.booking.parcel.length) <= 0 || Number(this.booking.parcel.height) <= 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'รูปแบบน้ำหนัก หรือ กว้าง x ยาว x สูง ไม่ถูกต้อง', life: 3000 });
                return false;
            }
            //check COD
            if (this.booking.cod_amount !== '') {
                if (Number(this.booking.cod_amount < 100) || Number(this.booking.cod_amount) > 50000) {
                    this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยอดเก็บเงินปลายทางจะต้องอยู่ในระหว่าง 100-50,000 บาท เท่านั้น', life: 3000 });
                    return false;
                }
            }
            this.isDisable = true;
            this.isLoading = true;
            const data = this.booking;
            await axios.post(`${process.env.VUE_APP_SHOP}express/pricelist`, data, {
                headers: {
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                if (res.data.data.length === 0) {
                    this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ขนส่งไม่เข้ารับเนื่องจากพัสดุเกินเงื่อนไขที่กำหนด', life: 4000 });
                    this.isLoading = false;
                    this.isDisable = false;
                    return false;
                }
                this.isLoading = false;
                this.isDisable = false;
                this.pricelist = { parcel: res.data.data[0], data: res.data.origin_data };
                this.dialogTotal = true;
            }).catch((err) => {
                this.isLoading = false;
                this.isDisable = false;
                if (err.response.status === 408) {
                    window.location.assign('/login')
                }
            })
        },
        async confirmParcel() {
            const data = {
                id: String(this.$store.getters.order_express.length + 1),
                type: "parcel",
                detail: this.pricelist.data,
                pricelist: this.pricelist.parcel,
                amount: 1,
                total: this.pricelist.parcel.price * 1
            }
            this.$store.dispatch('addOrderExpress', data);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการพัสดุเรียบร้อยแล้ว', life: 3000 });
            this.clearForm();
            this.dialogTotal = false;
            this.dialogCourier = false;
            this.pricelist = null;
        },
        numberFormat(num) {
            return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        },
    }
}
</script>

<style scoped>
.card {
    position: relative;
    margin: 3px;
    border-radius: 5px;
    border: 1px solid rgb(167, 167, 167);
    cursor: pointer;
}

.card:hover {
    transform: scale(1.03);
    transition: all 0.1s ease-in-out;
}

.card-img>img {
    width: 100%;
}

.card-head {
    font-weight: bold;
    padding: 3px;
}

.card-price {
    padding: 3px;
}

.card-price>p {
    margin: 0;
}

.card-amount {
    position: absolute;
    padding: 5px;
    top: 0;
    left: 0;
    z-index: 3;
    background-color: white;
    border-radius: 3px;
}

.card-amount>p {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.card-btn {
    cursor: pointer;
    border: 1px solid red;
    border-radius: 3px;
    padding: 10px;
    background-color: white;
    color: red;
}
</style>