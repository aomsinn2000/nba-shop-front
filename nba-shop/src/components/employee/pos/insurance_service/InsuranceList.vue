<template>
    <div class="grid">
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

    <!-- Dialog Choose -->
    <Dialog v-model:visible="ChooseInsurace" header="รายการประกัน (รถยนต์ - รถจักรยานยนต์)" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_insurance" paginator :rows="12">
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
    </Dialog>

    <!--  Dialog Choose Price -->
    <Dialog v-model:visible="dialogChoose" header="รายละเอียด" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <p class="mb-0 mt-0">ชื่อสินค้า : {{ data.name }}</p>
        <p class="mb-0 mt-2">ประเภท : {{ category_name }} - {{ data.type }}</p>
        <p class="mb-0 mt-2">รายละเอียด : {{ data.detail }}</p>
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
        await axios.get(`${process.env.VUE_APP_SHOP}insuranceservice/category/list`, {
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

        await axios.get(`${process.env.VUE_APP_SHOP}insuranceservice/package/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.insurance = res.data.data;
            this.item_insurance = this.insurance.reverse();
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
        insurance: '',
        item_insurance: '',
        ChooseInsurace: false,
        dialogChoose: false,
        dialogPrice: false,
        data: '',
        detail: '',
        insurance_order: null,
        insurance_detail: null,
        amount: 1,
        total: 0,
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
            this.ChooseInsurace = true;

            if (this.category !== "") {
                this.item_act = this.act.filter(
                    (item) => item.categoryid === this.category
                );
            }
        },

        async choosePrice(item) {
            // console.log('ประเภท :',item);
            this.data = item;
            this.dialogChoose = true;
        },

        async calFinal() {
            this.$store.commit('setLoading', false);
            this.total = this.data.price * this.amount;

            const insurance_order = {
                packageid: this.data._id,
                quantity: this.amount,
            }

            const insurance_detail = {
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

            this.insurance_order = insurance_order;
            this.insurance_detail = insurance_detail;
            this.dialogPrice = true;

        },

        async addCart() {
            this.$store.dispatch('addInsuranceOrder', this.insurance_order);
            this.$store.dispatch('addInsuranceDetail', this.insurance_detail)
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเรียบร้อยแล้ว', life: 3000 });
            this.dialogPrice = false;
            this.dialogChoose = false;
            this.ChooseInsurace = false;
        },

    }
}
</script>

<style>

</style>