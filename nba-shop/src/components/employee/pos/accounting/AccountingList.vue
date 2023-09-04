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
            <DataView :value="item_accounting" paginator :rows="12">
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
                        <div class="card" @click="chooseAccounting(item.data._id)">
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
    <Dialog v-model:visible="dialogAccounting" header="รายการบริการ" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_accounting" paginator :rows="12">
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
        <p class="mb-0 mt-0">บริการ : {{ data.name }}</p>
        <p class="mb-0 mt-2">ราคา : {{ numberDigitFormat(data.price) }} บาท</p>
        <div class="box">  
            <p class="mb-0 mt-2">รายละเอียด : {{ data.detail }}</p>
        </div>
        <div class="grid">
            <div class="col-12 mt-2">
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
        await axios.get(`${process.env.VUE_APP_SHOP}accountservice/category/list`, {
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

        await axios.get(`${process.env.VUE_APP_SHOP}accountservice/package/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.accounting = res.data.data;
            this.item_accounting = this.accounting.reverse();
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
        accounting: '',
        item_accounting: '',
        dialogAccounting: false,
        dialogChoose: false,
        dialogPrice: false,
        data: '',
        detail: '',
        accounting_order: null,
        accounting_detail: null,
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

        searchData() {
            if (this.search === "") {
                this.item_accounting = this.accounting;
            } else {
                this.item_accounting = this.accounting.filter(
                    (el) =>
                        el.name.search(this.search) !== -1
                );
            }
        },

        async chooseAccounting(item) {
            // console.log('ประเภท :',item);
            this.category = item;
            this.dialogAccounting = true;

            if (this.category !== "") {
                this.item_accounting = this.accounting.filter(
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

            const order = {
                packageid: this.data._id,
                quantity: this.amount,
            }

            const detail = {
                price: this.data.price,
                category: this.data.categoryid,
                name: this.data.name,
                amount: this.amount,
                total: this.total,
                detail: this.detail,
                code_act: this.data.code,
                type_act: this.data.detail,
            }

            this.accounting_order = order;
            this.accounting_detail = detail;
            this.dialogPrice = true;

        },

        async addCart() {
            this.$store.dispatch('addAccountingOrder', this.accounting_order);
            this.$store.dispatch('addAccountingDetail', this.accounting_detail);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเรียบร้อยแล้ว', life: 3000 });
            this.dialogPrice = false;
            this.dialogChoose = false;
            this.dialogAccounting = false;
        },

    }
}
</script>

<style>

.box p{
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

</style>