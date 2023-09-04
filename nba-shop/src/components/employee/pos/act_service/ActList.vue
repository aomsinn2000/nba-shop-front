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
            <DataView :value="item_act" paginator :rows="12">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card" @click="choosePrice(item.data)">
                            <div class="card-img">
                                <img :src="getImage(item.data.picture)" />
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
                        <div class="card" @click="chooseAct(item.data)">
                            <div class="card-img">
                                <img :src="getImage(item.data.picture)" />
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

    <Dialog v-model:visible="dialogAct" header="ส่วนบุคคล / ส่วนรับจ้าง" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
        <div class="grid">
            <div class="col-12 sm:col-4">
                <div class="card" @click="dialogPersonal = true">
                    <img src="@/assets/img/icon_menu/act2.png" style="width: 100%" />
                </div>
            </div>
            <div class="col-12 sm:col-4">
                <div class="card" @click="dialogEngage = true">
                    <img src="@/assets/img/icon_menu/tax.png" style="width: 100%" />
                </div>
            </div>
        </div>
    </Dialog>

    <!-- Dialog Choose ส่วนรับจ้าง -->
    <Dialog v-model:visible="dialogEngage" header="รายการสื่อสิ่งพิมพ์" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_act" paginator :rows="12">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <template #list="item">
                        <div class="col-12 lg:col-3 md:col-4 sm:col-6" v-if="item.data.type === 'ส่วนรับจ้าง'">
                            <div class="card" @click="choosePrice(item.data)">
                                <div class="card-img">
                                    <img :src="getImage(item.data.picture)" />
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

    <!-- Dialog Choose ส่วนบุคคล -->
    <Dialog v-model:visible="dialogPersonal" header="รายการสื่อสิ่งพิมพ์" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_act" paginator :rows="12">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <template #list="item">
                        <div class="col-12 lg:col-3 md:col-4 sm:col-6" v-if="item.data.type === 'ส่วนบุคคล'">
                            <div class="card" @click="choosePrice(item.data)">
                                <div class="card-img">
                                    <img :src="getImage(item.data.picture)" />
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

    <!--  Dialog Choose Price -->
    <Dialog v-model:visible="dialogChoose" header="รายละเอียด" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <p class="mb-0 mt-0">ชื่อ : {{ category_name }} - {{ data.name }}</p>
        <p class="mb-0 mt-2">รหัส : {{ data.code }} ({{ data.detail }})</p>
        <p class="mb-0 mt-2">ราคา : {{ numberDigitFormat(data.price) }} บาท</p>
        <div class="grid">
            <div class="col-12 mt-3">
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
            <div class="col-12 mt-5 text-right">
                <Button label="ยกเลิก" class="p-button-text p-button-danger" @click="dialogChoose = false" />
                <Button label="คำนวณราคา" @click="calFinal()" />
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
        await axios.get(`${process.env.VUE_APP_SHOP}actlegalservice/category/list`, {
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

        await axios.get(`${process.env.VUE_APP_SHOP}actlegalservice/package/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.act = res.data.data;
            this.item_act = this.act.reverse();
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
        category_name: '',
        act: '',
        item_act: '',
        dialogEngage: false,
        dialogPersonal: false,
        dialogChoose: false,
        dialogPrice: false,
        dialogAct: false,
        data: '',
        detail: '',
        act_order: null,
        act_detail: null,
        amount: 1,
        total: 0,
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

        async chooseAct(item) {
            // console.log('ประเภท :',item);
            this.category = item._id;
            this.category_name = item.name;
            this.dialogAct = true;

            if (this.category !== "") {
                this.item_act = this.act.filter(
                    (item) => item.categoryid === this.category
                );
            }
        },

        async choosePrice(item) {
            // console.log('ประเภท :',item);
            this.data = item;
            this.dialogEngage = false;
            this.dialogPersonal = false;
            this.dialogChoose = true;
        },

        searchData() {
            if (this.search === "") {
                this.item_act = this.act;
            } else {
                this.item_act = this.act.filter(
                    (el) =>
                        el.name.search(this.search) !== -1
                );
            }
        },

        async calFinal() {
            this.$store.commit('setLoading', false);
            this.total = this.data.price * this.amount;

            const act_order = {
                packageid: this.data._id,
                quantity: this.amount,
            }

            const act_detail = {
                price: this.data.price,
                category: this.data.categoryid,
                category_name: this.category_name,
                name: this.data.name,
                amount: this.amount,
                total: this.total,
                detail: this.detail,
                code_act: this.data.code,
                type_act: this.data.detail,
            }


            this.act_order = act_order;
            this.act_detail = act_detail;
            this.dialogPrice = true;

        },

        async addCart() {
            this.$store.dispatch('addActOrder', this.act_order);
            this.$store.dispatch('addActDetail', this.act_detail);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเรียบร้อยแล้ว', life: 3000 });
            this.dialogPrice = false;
            this.dialogChoose = false;
            this.dialogChooseAct = false;
        },

    }
}
</script>

<style></style>