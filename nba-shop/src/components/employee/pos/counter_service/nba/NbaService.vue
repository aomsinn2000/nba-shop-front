<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText v-model="search_data" class="font w-full" placeholder="ค้นหารายการฝากจ่าย"
                        @keyup="searchService()" />
                </div>
            </div>
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

        <!-- Dialog Service-->
        <Dialog header="ข้อมูลรายละเอียด" v-model:visible="dialogService"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }" :modal="true">
            <div v-if="service !== null">
                <div class="grid">

                    <div class="col-12 m-0 mt-3 p-0 text-center">
                        <img :src="getImage(this.service.productid)" width="120" />
                    </div>
                    <div class="col-12 m-0 p-0 mt-2">
                        <Divider align="center" type="dashed">
                            <Chip :label="this.service.productname" />
                        </Divider>
                    </div>
                    <div class="col-12 m-0 p-0 mt-2" v-if="service.alert_text !== ''">
                        <Message class="m-0 p-0" severity="error">{{ service.alert_text }}</Message>
                    </div>
                    <div class="col-12 m-0 p-0 mt-2" v-if="service.warning_text !== ''">
                        <Message class="m-0 p-0" severity="info">{{ service.warning_text }}</Message>
                    </div>

                </div>
                <div class="grid mt-2">
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <span class="p-float-label">
                                <InputMask v-model="mobile" mask="999-9999999" class="w-full font" />
                                <label>เบอร์โทร</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <span class="p-float-label">
                                <InputNumber v-model="amount" class="w-full" inputClass="font"
                                    placeholder="กรอกจำนวนฝากจ่าย" mode="decimal" :minFractionDigits="2"
                                    :maxFractionDigits="2" />
                                <label>ยอดชำระ </label>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="ref1" class="font w-full"
                                    placeholder="กรอกเลขอ้างอิง 1"  v-if="service.template1===''"/>
                                <InputMask v-model="ref1" :mask="service.template1" class="font w-full" v-else
                                    placeholder="กรอกเลขอ้างอิง 1" />
                                <label>อ้างอิง 1 (ref. 1)</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="ref2" class="font w-full" v-if="service.template2===''"
                                    placeholder="กรอกเลขอ้างอิง 2" />
                                <InputMask v-model="ref2" :mask="service.template2" class="font w-full" v-else
                                    placeholder="กรอกเลขอ้างอิง 2" />
                                <label>อ้างอิง 2 (ref. 2)</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="note" class="w-full font" placeholder="กรอกข้อมูลเพิ่มเติม (ถ้ามี)" />
                                <label>เพิ่มเติม (ถ้ามี)</label>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="grid" v-if="image_preview === null">
                    <div class="field">
                        <div class="col-12">
                            <FileUpload mode="basic" :fileLimit="1" accept="image/*"
                                invalidFileTypeMessage="ไฟล์ที่แนบจะต้องเป็นไฟล์รูปภาพเท่านั้น"
                                invalidFileSizeMessage="ขนาดไฟล์ที่แนบจะต้องไม่เกิน 6 MB" :maxFileSize="7000000"
                                uploadIcon="pi pi-paperclip" chooseLabel="แนบรูปภาพ (ถ้ามี และป้องกันความผิดพลาด)"
                                :auto="true" class="p-button-outlined" :customUpload="true" @uploader="chooseFile" />
                        </div>
                    </div>
                </div>
                <div class="grid" v-else>
                    <div class="col-12 text-center">
                        <Divider align="center" type="dashed">
                            <Chip label="รูปภาพที่แนบ" />
                        </Divider>
                        <Image :src="image_preview" width="150" :preview="true" />

                    </div>
                    <div class="col-12 text-center">
                        <Button label="ลบรูปภาพ" class="p-button-danger" icon="pi pi-trash"
                            @click="image_preview = null, cs_image = null" />
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="ยกเลิก" class="p-button-danger p-button-text"
                    @click="dialogService = false, service = null" />
                <Button label="ตกลง" @click="confirm()" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/service/nba`, {
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
        services: [],
        item_service: [],
        search_data: '',
        service: null,
        dialogService: false,
        mobile: null,
        ref1: '',
        ref2: '',
        note: '',
        cs_image: null,
        image_preview: null,
        amount: null,
    }),
    methods: {
        chooseFile(event) {
            this.image_preview = event.files[0].objectURL;
            this.cs_image = event.files
        },
        searchService() {
            if (this.search_data !== '') {
                this.item_service = this.services.filter((el) => el.productname.search(this.search_data) !== -1)
            } else {
                this.item_service = this.services
            }
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        getImage(item) {
            try {
                const img = require('@/assets/img/counter_service/' + item + '.png')
                return img
            } catch (err) {
                return 'https://promotions.co.th/wp-content/uploads/2019/03/06.jpg';
            }
        },
        clearService(){
            this.ref1 = null;
            this.ref2 =null;
            this.service= null;
            this.image_preview = null;
            this.cs_image =null;
            this.mobile = null;
            this.amount = null;
            this.dialogService = false;
        },
        chooseService(item) {
            this.service = item;
            this.dialogService = true;
            this.cs_image = null;
            this.image_preview = null;
        },
        confirm() {
            if (this.mobile === null || this.mobile === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกเบอร์โทรศัพท์', life: 3000 });
                return false;
            }
            if (this.amount === null || this.amount === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกยอดชำระ', life: 3000 });
                return false;
            }
            if (this.amount <= 0) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ยอดชำระจะต้องมากกว่า 0 ขึ้นไป', life: 3000 });
                return false;
            }
            if (this.ref1 === null || this.ref1 === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกเลขอ้างอิง 1 (ref.1)', life: 3000 });
                return false;
            }

            this.$confirm.require({
                message: `ตรวจสอบข้อมูลถูกต้องและครบถ้วน ยืนยันการฝากจ่าย ${this.service.productname} ยอดชำระ ${this.numberFormat(this.amount)} บาท?`,
                header: 'ตรวจสอบและยืนยัน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel : "ตกลง",
                rejectLabel : "ยกเลิก",
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    //อัพโหลดรูปภาพเพื่อเอาไอดีรูปภาพ
                    let imageid = "";
                    if (this.cs_image !== null) {
                        const formData = new FormData();
                        formData.append('imgCollection', this.cs_image[0]);
                        await axios.post(`${process.env.VUE_APP_SHOP}image/collection`, formData, {
                            headers: {
                                'auth-token': `Bearer ${this.$store.getters.token}`
                            }
                        }).then((res) => {
                            imageid = res.data.file[0];
                        }).catch((err) => {
                            if (err.response.status === 408) {
                                window.location.reload();
                            }
                        });
                    }
                    const order = {
                        name: this.service.productname,
                        mobile: this.mobile.replace(/-/g, ''),
                        type: 'nba',
                        service_code: null,
                        service: {
                            ref1: this.ref1,
                            ref2: this.ref2,
                            charge: this.service.charge,
                            cost_nba: this.service.cost_nba,
                            cost_shop: this.service.cost_shop,
                            note: this.note,
                            price: this.amount,
                            productid: this.service.productid,
                            image: imageid
                        },
                        ref: { ...this.service },
                        total: this.amount
                    }
                    const charge = {
                        name: 'ค่าธรรมเนียม+บริการ',
                        type: null,
                        service: null,
                        ref: null,
                        total: this.service.charge
                    }

                    const data_order = [];
                    data_order.push(order);
                    data_order.push(charge);
                    this.$store.commit('setOrderCS', data_order);
                    this.$store.commit('setLoading', false);
                    this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มในรายการชำระเรียบร้อยแล้ว', life: 3000 });
                    localStorage.setItem('order_total', this.$store.getters.order_cs_total)
                    this.clearService();
                }
            });
        }
    }
}
</script>

<style>

</style>