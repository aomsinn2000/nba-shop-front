<template>
    <div class="grid">
        <div class="col-12">
            <Button icon="pi pi-plus" label="เพิ่มสินค้า" @click="openProduct()" />
        </div>
        <div class="col-12">
            <DataTable :value="item_product" responsiveLayout="scroll" :paginator="true" :rows="20">
                <template #empty>
                    <p class="text-center mb-0 mt-0"><em>--ไม่พบรายการสินค้า--</em></p>
                </template>
                <Column header="ชื่อรายการ">
                    <template #body="item">
                        {{ item.data.name }}
                    </template>
                </Column>
                <Column header="ต้นทุน" style="width: 20%">
                    <template #body="item">
                        {{ numberFormat(item.data.cost) }}
                    </template>
                </Column>
                <Column header="ราคา" style="width: 20%">
                    <template #body="item">
                        {{ numberFormat(item.data.price) }}
                    </template>
                </Column>
                <Column header="ตัวเลือก" style="width: 15%">
                    <template #body="item">
                        <Button class="p-button-outlined p-button-sm m-1" icon="pi pi-pencil"
                            @click="editProduct(item.data)" />
                        <Button class="p-button-danger p-button-sm m-1" icon="pi pi-trash" @click="deleteProduct(item.data)"/>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <!-- Dialog From Product-->
    <Dialog v-model:visible="dialogProduct" :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '30vw' }" :modal="true" :header="action">
        <div class="grid">
            <div class="col-12">
                <div class="field">
                    <label>ชื่อสินค้า : </label>
                    <InputText v-model="product.name" class="w-full font" placeholder="กรอกชื่อสินค้า" />
                </div>
            </div>
            <div class="col-12 lg:col-6 md:col-6">
                <div class="field">
                    <label>ต้นทุน <small>(บาท)</small> :</label>
                    <InputNumber v-model="product.cost" :min=0 mode="decimal" :minFractionDigits="0" :maxFractionDigits="2" class="w-full" inputClass="font w-full"
                        placeholder="กรอกราคาต้นทุน" />
                </div>
            </div>
            <div class="col-12 lg:col-6 md:col-6">
                <div class="field">
                    <label>ราคาขาย <small>(บาท)</small> :</label>
                    <InputNumber v-model="product.price" :min=0 class="w-full" inputClass="font w-full"
                        mode="decimal" :minFractionDigits="0" :maxFractionDigits="2"
                        placeholder="กรอกราคาขายหน้าร้าน" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="dialogProduct = false" />
            <Button label="บันทึก" :loading="isLoading" v-if="action === 'แก้ไขสินค้า'" icon="pi pi-save"
                @click="updateProduct()" />
            <Button label="ตกลง" :loading="isLoading" v-if="action === 'เพิ่มสินค้า'" icon="pi pi-check"
                @click="addProduct()" />
        </template>
    </Dialog>

</template>

<script>
import axios from 'axios'
export default {
    async created() {
        await axios.get(`${process.env.VUE_APP_SHOP}express/product/shop_id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.products = res.data.data;
            this.item_product = this.products.reverse();
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    data: () => ({
        isLoading: false,
        products: [],
        item_product: [],
        dialogProduct: false,
        action: "เพิ่มสินค้า",
        product_id: "",
        product: {
            name: "",
            cost: null,
            price: null
        },

    }),
    methods: {
        addProduct() {
            if (this.product.name === "" || this.product.cost === null || this.product.price === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการเพิ่มสินค้านี้เข้าสู่ระบบ?',
                header: 'เพิ่มสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    const data = {
                        shop_id: this.$store.getters.shop._id,
                        ...this.product
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}express/product`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.isLoading = false;
                        const item = res.data.result;
                        this.products.push(item);
                        this.item_product = this.products.reverse();
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: "เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว", life: 3000 });
                        this.clearForm();
                        this.dialogProduct = false;
                    }).catch((err) => {
                        this.isLoading = false;
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })

                }
            });
        },
        updateProduct() {
            if (this.product.name === "" || this.product.cost === null || this.product.price === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน', life: 3000 });
                return false;
            }

            this.$confirm.require({
                message: 'ต้องการการแก้ไขสินค้ารายการนี้?',
                header: 'แก้ไขสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    const data = {
                        name: this.product.name,
                        cost: this.product.cost,
                        price: this.product.price
                    }
                    const position = this.item_product.findIndex((el) => el._id === this.product_id);
                    await axios.put(`${process.env.VUE_APP_SHOP}express/product/${this.product_id}`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        this.isLoading = false;
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว', life: 3000 });
                        this.item_product.splice(position, 1, res.data.result);
                        this.dialogProduct = false;
                    }).catch((err) => {
                        this.isLoading = false;
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })

                }
            });

        },
        deleteProduct(item) {
            this.$confirm.require({
                message: `ต้องการลบข้อมูล ${item.name}`,
                header: 'ลบสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    const position = this.item_product.findIndex((el) => el._id === item._id);
                    await axios.delete(`${process.env.VUE_APP_SHOP}express/product/${item._id}`, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then(() => {
                        this.item_product.splice(position, 1);
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบข้อมูลเรียบร้อย', life: 3000 });
                    }).catch((err) => {
                        this.isLoading = false;
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })
                }
            });
        },
        editProduct(item) {
            this.product_id = item._id;
            this.product.name = item.name;
            this.product.cost = item.cost;
            this.product.price = item.price;
            this.action = "แก้ไขสินค้า"
            this.dialogProduct = true;
        },
        openProduct() {
            this.clearForm();
            this.action = "เพิ่มสินค้า"
            this.dialogProduct = true;
        },
        clearForm() {
            this.product_id = ""
            this.product.name = ""
            this.product.cost = null
            this.product.price = null
        },
        numberFormat(num) {
            return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        }
    }
}
</script>

<style>

</style>