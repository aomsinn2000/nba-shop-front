<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>ส่งสินค้าขายในช็อป</h1>
            <p class="text-gray-700"><em>มาร่วมเป็นผู้แบ่งปันกับเรา
                    โดยส่งสินค้าของร้านค้าเข้าในโปรแกรมร้านค้าของคุณ</em></p>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-2 lg:col-offset-5 text-center">
            <Card class="border-1 shadow-none border-gray-400">
                <template #content>
                    <div v-if="productReq_image === null">
                        <Image :src="img_preview" width="150" :preview="true" /><br />
                        <FileUpload mode="basic" :customUpload="true" :auto="true" chooseLabel="เลือกรูปภาพสินค้า"
                            @uploader="chooseImage" accept="image/*" />
                    </div>
                    <div v-else>
                        <Image :src="img_preview" width="200" /><br />
                        <Button icon="pi pi-fw pi-trash" label="ลบ" @click="removeImage" class="p-button-danger"
                            :disabled="isDisabled" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-6 lg:col-offset-3">
            <Panel header="เกี่ยวกับสินค้า">
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <label>รหัสสินค้า (Barcode) :</label>
                            <InputText v-model="productReq_barcode" class="font w-full" :disabled="isDisabled"
                                placeholder="กรอกรหัสสินค้า (ถ้ามี)"
                                oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                            <small><em><strong>หมายเหตุ : </strong> หากเว้นว่างระบบจะทำการสร้างอัตโนมัติ</em></small>
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <label>ชื่อสินค้า : </label>
                            <InputText v-model="productReq_name" placeholder="กรอกชื่อสินค้า" class="w-full font"
                                :disabled="isDisabled" />
                        </div>
                    </div>
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <label>ราคาต้นทุนที่ส่ง :</label>
                            <InputNumber v-model="productReq_cost" placeholder="กรอกราคาต้นทุน" class="w-full"
                                inputClass="font" :disabled="isDisabled" />
                            <small><em><strong>หมายเหตุ :
                                    </strong>ราคาต้นทุนนี้จะต้องเป็นราคาที่รวมกำไรของทางร้านค้าเรียบร้อยแล้ว</em></small>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <label>ราคาที่ขายหน้าร้าน :</label>
                            <InputNumber v-model="productReq_price" placeholder="กรอกราคาขายหน้าร้าน" class="w-full"
                                inputClass="font" :disabled="isDisabled" />
                            <small><em><strong>หมายเหตุ : </strong> ราคาที่จะขายในระบบขายสินค้าหน้าร้าน</em></small>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6">
                        <div class="field">
                            <label>ภาษีมูลค่าเพิ่ม :</label>
                            <Dropdown v-model="productReq_vat_status" :options="item_vat" optionValue="value"
                                optionLabel="name" class="w-full" inputClass="font" :disabled="isDisabled"></Dropdown>
                        </div>
                    </div>
                </div>
            </Panel>
            <Button label="ส่งข้อมูล" icon="pi pi-send" class="mt-2" @click="confirmReq()" :loading="isLoading" />
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
    created() {
        document.title = "ส่งสินค้าเพื่อนำขายในระบบหน้าร้าน NBA SHOP"
    },
    async mounted() {
        //check function
        try {
            const func = await this.$store.getters.shop.shop_function.find((el) => el.name === 'pos');
            if (func) {
                if (!func.status) {
                    this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                    this.$router.push('/pos');
                }
            } else {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/pos')
            }
        } catch (err) {
            this.$router.push('/pos')
        }

        if (this.$store.getters.position !== 'manager') {
            this.$router.push('/')
        }
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.shop = res.data.data;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        });
        //get product nba
        await axios.get(`${process.env.VUE_APP_SHOP}product/nba`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.product_nba = res.data.data.filter((el) => el.productNBA_status === true);
        })
    },
    data: () => ({
        isLoading: false,
        isDisabled: false,
        item_vat: [
            { name: 'มี Vat', value: true },
            { name: 'ไม่มี Vat', value: false }
        ],
        img_preview: 'https://cdn-icons-png.flaticon.com/512/126/126477.png',
        img_mockup: 'https://cdn-icons-png.flaticon.com/512/126/126477.png',
        product_nba: [],
        productReq_shop_id: localStorage.getItem('shop_id'),
        productReq_barcode: "",
        productReq_name: "",
        productReq_image: null,
        productReq_cost: null,
        productReq_price: null,
        productReq_profit: null,
        productReq_vat_status: false,
        shop: []
    }),
    methods: {
        chooseImage(event) {
            this.productReq_image = event.files[0];
            this.img_preview = event.files[0].objectURL;
        },
        removeImage() {
            this.productReq_image = null;
            this.img_preview = this.img_mockup;
        },
        confirmReq() {
            if (this.productReq_name === "" || this.productReq_image === null || this.productReq_cost === null
                || this.productReq_price === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลและแนบรูปภาพให้ครบถ้วน', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการส่งสินค้าเพื่อตรวจสอบเข้าระบบ?',
                header: 'ส่งข้อมูล',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    //check barcode
                    if (this.productReq_barcode === "") {
                        //create barcode
                        this.productReq_barcode = `${this.shop.shop_number}${dayjs(Date.now()).format('YYMMDDHm')}`
                    } else {
                        const check_barcode = this.product_nba.find((el) => el.productNBA_barcode === this.productReq_barcode);
                        if (check_barcode) {
                            this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'รหัสสินค้าหรือบาร์โค้ดถูกใช้งานแล้ว', life: 3000 });
                            return false;
                        }
                    }
                    this.isDisabled = true;
                    this.isLoading = true;
                    const formData = new FormData();
                    formData.append('productReq_barcode', this.productReq_barcode);
                    formData.append('productReq_shop_id', this.productReq_shop_id);
                    formData.append('productReq_name', this.productReq_name);
                    formData.append('productReq_image', this.productReq_image);
                    formData.append('productReq_cost', this.productReq_cost);
                    formData.append('productReq_price', this.productReq_price);
                    formData.append('productReq_vat_status', this.productReq_vat_status);
                    formData.append('productReq_timestamp[0][name]', 'ส่งตรวจสอบ');
                    formData.append('productReq_timestamp[0][timestamp]', dayjs(Date.now()).format())
                    const product_res = await axios.post(`${process.env.VUE_APP_SHOP}product/request`, formData, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                    })

                    if (product_res) {
                        //แจ้งเตือนไลน์
                        const line_data = {
                            token: `${process.env.VUE_APP_LINE_TOKEN}`,
                            message: `
แจ้งเตือนจากร้านสาขา ส่งสินค้าเพื่อตรวจสอบ :
จากร้าน : ${this.shop.shop_name}
รหัสสาขา : ${this.shop.shop_number}
***เกี่ยวกับสินค้า***
ชื่อสินค้า : ${this.productReq_name}
ราคาต้นทุน : ${this.productReq_cost}
ราคาขายหน้าร้าน : ${this.productReq_price}                            
                            `
                        }
                        await axios.post(`${process.env.VUE_APP_SHOP}line-notify`, line_data).catch((err) => {
                            console.log(err);
                        })
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ส่งข้อมูลสินค้าเพื่อตรวจสอบเรียบร้อย รอการตรวจสอบจากส่วนกลาง', life: 3000 });
                        this.$router.push('/product/request');
                    }
                    this.isDisabled = false;
                    this.isLoading = false;
                },
            });

        }
    }
}
</script>

<style>

</style>