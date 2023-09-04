<template>
    <div class="grid">
        <div class="col-12">
            <DataView :value="tax" paginator :rows="12">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card" @click="chooseTax(item.data)">
                            <div class="card-img">
                                <img :src="getImage(item.data.picture)" />
                            </div>
                            <div class="card-head">
                                <p class="mb-0 mt-0 text-center">{{ item.data.categoryid }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>

    <!--  Dialog Choose Price -->
    <Dialog v-model:visible="dialogChoose" header="รายละเอียด" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <p class="mb-0 mt-0">ชื่อ : {{ data.name }}</p>
        <p class="mb-0 mt-0">ประเภท : {{ data.categoryid }}</p>
        <p class="mb-0 mt-0">ราคา : เสนอราคา</p>
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
        await axios.get(`${process.env.VUE_APP_SHOP}taxservice/package/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.tax = res.data.data;
            this.$store.commit('setLoading', false);
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })

    },
    data: () => ({
        tax: [],
        dialogChoose: false,
        dialogPrice: false,

        data: '',

        tax_order: null,
        tax_detail: null,
        amount: 1,
        total: 0,
        search: '',
    }),
    methods: {
        getImage(item) {
            return "https://drive.google.com/uc?export=view&id=" + item;
        },

        async chooseTax(item) {
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
            }


            this.tax_order = order;
            this.tax_detail = detail;
            this.dialogPrice = true;

            console.log(detail)
        },

        async addCart() {
            this.$store.dispatch('addTaxOrder', this.tax_order);
            this.$store.dispatch('addTaxDetail', this.tax_detail);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเรียบร้อยแล้ว', life: 3000 });
            this.dialogPrice = false;
            this.dialogChoose = false;
        },

    }
}
</script>

<style></style>