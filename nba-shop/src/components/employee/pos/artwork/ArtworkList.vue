<template>
    <div class="col-12">
        <div class="field">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-search"></i>
                </span>
                <InputText v-model="search" @keyup="searchData()" class="w-full font"
                    placeholder="ค้นหาบริการ เช่น ชื่อสินค้า" />
            </div>
        </div>
    </div>
    <div class="grid" v-if="search !== ''">
        <div class="col-12">
            <DataView :value="artworks" paginator :rows="12">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card" @click="choosePrice(item.data)">
                            <div class="card-img">
                                <img :src="getImage(item.data.img_url)" />
                            </div>
                            <div class="card-head">
                                <p class="mb-0 mt-0 text-center">{{ item.data.name }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
    <div class="grid" v-if="search === ''">
        <div class="col-12">
            <DataView :value="categorys" paginator :rows="12">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card" @click="chooseArtwork(item.data._id)">
                            <div class="card-img">
                                <img :src="getImage(item.data.img_url)" />
                            </div>
                            <div class="card-head">
                                <p class="mb-0 mt-0 text-center">{{ item.data.name }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>

    <Dialog v-model:visible="dialogChooseArtwork" header="รายการสื่อสิ่งพิมพ์" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid">
            <div class="col-12">
                <DataView :value="artworks" paginator :rows="12">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <template #list="item">
                        <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                            <div class="card" @click="choosePrice(item.data)">
                                <div class="card-img">
                                    <img :src="getImage(item.data.imgUrl)" />
                                </div>
                                <div class="card-head">
                                    <p class="mb-0 mt-0 text-center">{{ item.data.name }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="dialogChoosePrice" header="ราคาสื่อสิ่งพิมพ์" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div v-if="prices.detail === 'ราคาต่อชิ้น'">
            <div class="grid">
                <div class="col-12">
                    <DataView :value="price" paginator :rows="12">
                        <template #empty>
                            <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                        </template>
                        <template #list="item">
                            <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                                <div class="card" @click="choose(item.data)">
                                    <div class="card-img">
                                        <img src="@/assets/img/icon_price/1.png" style="width: 100%" />
                                    </div>
                                    <div class="card-head">
                                        <p class="mb-0 mt-0 text-center">ราคา : {{ item.data.price }} บาท</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DataView>
                </div>
            </div>
        </div>
        <div v-if="prices.detail === 'ราคาต่อชุด'">
            <div class="grid">
                <div class="col-12">
                    <DataView :value="price" paginator :rows="12">
                        <template #empty>
                            <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                        </template>
                        <template #list="item">
                            <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                                <div class="card" @click="choose(item.data)">
                                    <div class="card-img" v-if="item.data.minimun === 1">
                                        <img src="@/assets/img/icon_price/1.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 50">
                                        <img src="@/assets/img/icon_price/50.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 100">
                                        <img src="@/assets/img/icon_price/100.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 200">
                                        <img src="@/assets/img/icon_price/200.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 300">
                                        <img src="@/assets/img/icon_price/300.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 500">
                                        <img src="@/assets/img/icon_price/500.png" style="width: 100%" />
                                    </div>
                                    <div class="card-img" v-if="item.data.minimun === 1000">
                                        <img src="@/assets/img/icon_price/1000.png" style="width: 100%" />
                                    </div>
                                    <div class="card-head">
                                        <p class="mb-0 mt-0 text-center">ราคา : {{ item.data.price }}</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DataView>
                </div>
            </div>
        </div>
        <div v-if="prices.detail === 'ราคาต่อตารางเมตร'">
            <div class="grid">
                <div class="col-12">
                    <DataView :value="price" paginator :rows="12">
                        <template #empty>
                            <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                        </template>
                        <template #list="item">
                            <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                                <div class="card" @click="choose(item.data)">
                                    <div class="card-img">
                                        <img src="@/assets/img/icon_price/squaremeter.png" style="width: 100%" />
                                    </div>
                                    <div class="card-head">
                                        <p class="mb-0 mt-0 text-center">ราคา : {{ item.data.price }} บาท</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DataView>
                </div>
            </div>
        </div>
    </Dialog>

    <!--  Dialog Choose Price -->
    <Dialog v-model:visible="dialogChoose" header="สั่งซื้อสื่อสิ่งพิมพ์" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div v-if="prices.detail === 'ราคาต่อชิ้น' || prices.detail === 'ราคาต่อชุด'">
            <p class="mb-2 mt-0">{{ prices.name }}</p>
            <p class="mb-2 mt-0">จำนวน : {{ data.minimun }} ชิ้น</p>
            <p class="mb-5 mt-0">ราคา : {{ data.price }}</p>
            <div class="grid">
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <span class="p-float-label">
                            <InputNumber v-model="amount" mode="decimal" showButtons :min="1" inputClass="font w-full"
                                class="w-full" />
                            <label>จำนวน/ชิ้น</label>
                        </span>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <label>รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                        <Editor v-model="detail" editorStyle="height: 200px">
                            <template #toolbar>
                                <span class="ql-formats">
                                    <button class="ql-bold"></button>
                                    <button class="ql-italic"></button>
                                    <button class="ql-underline"></button>
                                </span>
                            </template>
                        </Editor>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="col-12 text-right">
                    <Button label="ยกเลิก" class="p-button-danger p-button-text" @click="dialogChoose = false" />
                    <Button label="คำนวนราคา" @click="calFinal1()" />
                </div>
            </div>
        </div>
        <div v-if="prices.detail === 'ราคาต่อตารางเมตร'">
            <div class="grid">
                <div class="col-12">
                    <marquee-text class="text-slide" :repeat="5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กรณีชิ้นงานไม่ถึง 1 ตารางเมตร จะขอคิดราคาเต็ม&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</marquee-text>
                </div>
            </div>
            <p class="mb-2 mt-0">{{ prices.name }}</p>
            <p class="mb-3 mt-0">ราคา : {{ data.price }} ต่อ {{ data.quantity_per_pack }} ตารางเมตร</p>
            <div class="grid">
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <span class="p-float-label">
                            <InputNumber v-model="width" mode="decimal" :maxFractionDigits="2" :min="1"
                                inputClass="font w-full" class="w-full" />
                            <label>ความกว้าง (ซม.)</label>
                        </span>
                    </div>
                </div>
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <span class="p-float-label">
                            <InputNumber v-model="height" mode="decimal" :maxFractionDigits="2" :min="1"
                                inputClass="font w-full" class="w-full" />
                            <label>ความยาว (ซม.)</label>
                        </span>
                    </div>
                </div>
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <span class="p-float-label">
                            <InputNumber v-model="amount" mode="decimal" showButtons :min="1" inputClass="font w-full"
                                class="w-full" />
                            <label>จำนวน/ชิ้น</label>
                        </span>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <label>รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                        <Editor v-model="detail" editorStyle="height: 200px">
                            <template #toolbar>
                                <span class="ql-formats">
                                    <button class="ql-bold"></button>
                                    <button class="ql-italic"></button>
                                    <button class="ql-underline"></button>
                                </span>
                            </template>
                        </Editor>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="col-12 text-right">
                    <Button label="ยกเลิก" class="p-button-danger p-button-text"
                        @click="dialogChoose = false, dialogChoosePrice = false" />
                    <Button label="คำนวนราคา" @click="calFinal2()" />
                    <!-- <Button label="คำนวนราคา" @click="calVinyl()" v-if="artwork.name === 'ตรายาง'" /> -->
                </div>
            </div>
        </div>
    </Dialog>

    <!--แสดงราคาสุทธิก่อนเพิ่มในตะกร้าสินค้า-->
    <Dialog v-model:visible="dialogPrice" header="ราคาสินค้า" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div class="grid">
            <div class="col-12">
                <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
                    <template #content>
                        <h1 class="text-right pb-0 mb-0" style="margin: 0; font-size: 40px">
                            {{ numberDigitFormat(total) }}
                        </h1>
                    </template>
                </Card>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-text p-button-danger" @click="dialogPrice = false" />
            <Button label="เพิ่มรายการ" @click="addCart()" />
        </template>
    </Dialog>
</template>

<script>
import func from '@/service/function'
import axios from 'axios'
export default {
    setup() {
        return func;
    },
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}artwork/product-graphic/category`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.categorys = res.data.data;
            this.$store.commit('setLoading', false);
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })

        await axios.get(`${process.env.VUE_APP_SHOP}artwork/product-graphic`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.artwork = res.data.data;
            this.artworks = this.artwork.reverse();
            this.$store.commit('setLoading', false);
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })


    },
    data: () => ({
        categorys: '',
        category: '',
        artwork: '',
        artworks: '',
        prices: '',
        price: '',
        price_id: '',
        dialogChooseArtwork: false,
        dialogChoosePrice: false,
        dialogChoose: false,
        dialogPrice: false,
        // artwork: null,
        data: '',
        height: null,
        width: null,
        square_metter: null,
        cost_nba: null,
        detail: '',
        artwork_order: null,
        artwork_detail: null,
        amount: 1,
        total: 0,
        total1: 0,
        search: '',
    }),
    methods: {
        imgType(item) {
            switch (item) {
                case 'vinyl':
                    return require('@/assets/img/icon_artwork/' + item + '.png');
                default:
                    return 'https://cdn-icons-png.flaticon.com/128/2970/2970785.png'
            }
        },

        getImage(item) {
            return "https://drive.google.com/uc?export=view&id=" + item;
        },

        getPrice(id) {
            const price = this.prices.find((el) => el._id === id);
            return price
        },

        searchData() {
            if (this.search === "") {
                this.artworks = this.artwork;
            } else {
                this.artworks = this.artwork.filter(
                    (el) =>
                        el.name.search(this.search) !== -1
                );
            }
        },

        async chooseArtwork(item) {
            // console.log('ประเภท :',item);
            this.category = item;
            this.dialogChooseArtwork = true;

            if (this.category !== "") {
                this.artworks = this.artwork.filter(
                    (item) => item.category === this.category
                );
            } else {
                this.item_artwork = this.artwork;
            }
        },

        async choosePrice(item) {
            // console.log('ประเภท :',item);
            this.prices = item;
            this.price_id = item._id;
            this.dialogChoosePrice = true;

            //GET artwork
            await axios //artwork
                .get(`${process.env.VUE_APP_SHOP}artwork/product-graphic/price/${this.price_id}`, {
                    headers: {
                        "auth-token": this.$store.getters.token,
                    },
                })
                .then((res) => {
                    this.price = res.data.data;

                })
                .catch((err) => {
                    console.log(err);
                });
        },

        async choose(item) {
            this.data = item;
            this.dialogChoose = true;
        },

        async calFinal1() {
            this.$store.commit('setLoading', false);
            this.total = this.data.price * this.amount;

            const artwork_order = {
                packageid: this.data._id,
                quantity: this.amount,
                width: this.width,
                hight: this.height,
                detail: this.detail,
            }

            const artwork_detail = {
                type: this.prices.detail,
                category: this.category,
                size: '',
                width: this.width,
                height: this.height,
                square_metter: this.square_metter,
                cost_nba: this.data.cost_NBA + this.data.profit_NBA,
                price: this.data.price,
                name: this.prices.name,
                freight: this.data.freight,
                amount: this.amount,
                total: this.total,
                detail: this.detail
            }

            this.artwork_order = artwork_order;
            this.artwork_detail = artwork_detail;
            this.dialogPrice = true;

        },

        async calFinal2() {
            if (this.height === null || this.width === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลความกว้างและความยาวให้ครบถ้วน', life: 3000 });
                return false;
            }
            this.$store.commit('setLoading', false);
            this.square_metter = ((this.width / 100) * (this.height / 100));
            if (this.square_metter < 1) {
                this.total1 = this.data.price * 1;
            }
            if (this.square_metter >= 1) {
                this.total1 = this.data.price * this.square_metter;
            }
            this.total = this.total1 * this.amount;

            const artwork_order = {
                packageid: this.data._id,
                quantity: this.amount,
                width: this.width,
                hight: this.height,
                detail: this.detail,
            }

            const artwork_detail = {
                type: this.prices.detail,
                category: this.category,
                size: 'กำหนดเอง',
                width: this.width,
                height: this.height,
                square_metter: this.square_metter,
                cost_nba: this.data.cost_NBA + this.data.profit_NBA,
                price: this.data.price,
                name: this.prices.name,
                freight: this.data.freight,
                amount: this.amount,
                total: this.total,
                detail: this.detail
            }

            this.artwork_order = artwork_order;
            this.artwork_detail = artwork_detail;
            this.dialogPrice = true;
        },

        async addCart() {
            this.$store.dispatch('addOrderArt', this.artwork_order);
            this.$store.dispatch('addOrderDetail', this.artwork_detail);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเรียบร้อยแล้ว', life: 3000 });
            this.dialogPrice = false;
            this.dialogChoose = false;
            this.dialogChooseArtwork = false;
            this.dialogChoosePrice = false;
        },

    }
}
</script>

<style>

.text-slide {
  background-color: red;
  color: white;
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
}

</style>