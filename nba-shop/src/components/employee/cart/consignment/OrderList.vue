<template>
    <div class="grid">
        <div class="col-12 lg:col-4">
            <Card class="border-1 shadow-none border-red-300 bg-red-400 text-white">
                <template #content>
                    <p class="text-center p-0 m-0" style="font-size: 14px">ต้นทุน/สินเชื่อ: </p>
                    <h2 class="text-center p-0 m-0"> {{ numberDigitFormat($store.getters.order_consignment_total) }}</h2>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-4">
            <Card class="border-1 shadow-none border-green-300 bg-green-400 text-white">
                <template #content>
                    <p class="text-center p-0 m-0" style="font-size: 14px">กำไรเมื่อสินค้าถูกขาย: </p>
                    <h2 class="text-center p-0 m-0"> {{ numberDigitFormat($store.getters.order_consignment_profit) }}</h2>
                </template>
            </Card>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <DataTable :value="$store.getters.order_consignment" :rows="10" :paginator="true">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่มีรายการสั่งสินค้า--</em></p>
                </template>
                <Column header="#" style="width: 5%">
                    <template #body="item">{{ numberFormat(item.index + 1) }}</template>
                </Column>
                <Column header="รายการ" style="width: 30%">
                    <template #body="item">{{ item.data.productNBA_name }}</template>
                </Column>
                <Column header="ราคา/หน่วย" style="width: 10%">
                    <template #body="item">
                        {{ numberDigitFormat(item.data.productNBA_cost) }}
                    </template>
                </Column>
                <Column header="จำนวน" style="width: 5%">
                    <template #body="item">
                        {{ numberFormat(item.data.amount) }}
                    </template>
                </Column>
                <Column header="รวม" style="width: 10%">
                    <template #body="item">
                        {{ numberDigitFormat(item.data.total) }}
                    </template>
                </Column>
                <Column header="ตัวเลือก" style="width: 20%">
                    <template #body="item">
                        <Button class="p-button-sm mr-2" @click="openDialog(item.data)">
                            <i class="pi pi-pencil"></i>
                        </Button>
                        <Button @click="delCart(item.data)" class="p-button-danger p-button-sm">
                            <i class="pi pi-trash"></i>
                        </Button>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="col-12">
            <Button @click="confirm()" class="w-full" label="สั่งสินค้าตอนนี้ (Order Now)" icon="pi pi-send"
                v-if="$store.getters.order_consignment.length !== 0" />
        </div>
    </div>
    <!--Dialog Edit Amount-->
    <Dialog header="แก้ไขจำนวน" v-model:visible="dialogEdit" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '15vw' }">
        <div class="grid">
            <div class="col-12">
                <div class="field">
                    <InputNumber v-model="amount" :step="1" showButtons class="font" inputClass="w-full"
                        placeholder="กรอกจำนวน" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-text p-button-danger" @click="dialogEdit = false" />
            <Button label="ตกลง" @click="updateAmount()" />
        </template>
    </Dialog>
</template>

<script>
import func from '@/service/function'
import axios from 'axios';
import dayjs from 'dayjs';
export default {
    setup() {
        return func
    },
    data: () => ({
        product: null,
        amount: 1,
        dialogEdit: false,
    }),
    methods: {
        delCart(item) {
            this.$confirm.require({
                message: 'ต้องการลบสินค้านี้ออกจากรายการสั่ง?',
                header: 'ลบสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: () => {
                    this.$store.commit('delConsignment', item._id);
                    this.$toast.add({ severity: 'success', summary: 'ลบสำเร็จ', detail: 'ลบออกจากรายการสั่งเรียบร้อยแล้ว', life: 3000 });
                },
            });

        },
        openDialog(item) {
            this.product = item;
            this.amount = item.amount;
            this.dialogEdit = true;
        },
        updateAmount() {
            const data = {
                ...this.product,
                amount: this.amount,
                total: this.product.productNBA_cost * this.amount
            }
            this.$store.commit('updateConsignment', data);
            this.$toast.add({ severity: 'success', summary: 'อัพเดตสำเร็จ', detail: 'แก้ไขจำนวนรายการสั่งเรียบร้อยแล้ว', life: 3000 });
            this.dialogEdit = false;
        },
        confirm() {
            this.$confirm.require({
                message: 'ยืนยันการสั่งสินค้าฝากขาย',
                header: 'สั่งสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    //callback to execute when user confirms the action
                    this.$store.commit('setLoading', true);
                    const data = {
                        shop_id: this.$store.getters.shop._id,
                        detail: this.$store.getters.order_consignment,
                        status: [
                            { name: 'รอตรวจสอบ', timestamp: dayjs(Date.now()).format() }
                        ],
                        timestamp: dayjs(Date.now()).format()
                    }
                    await axios.post(`${process.env.VUE_APP_SHOP}preorder/consignment`, data, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then(() => {
                        this.$store.commit('setLoading', false);
                        this.$store.commit('clearConsignment');
                        this.$confirm.require({
                            message: 'สามารถตรวจสอบสถานะสั่งสินค้าฝากขายได้ที่ "รายการสั่งซื้อ"',
                            header: 'สั่งสินค้าสำเร็จ',
                            icon: 'pi pi-check',
                            acceptLabel:'ไปที่รายการสั่งซื้อ',
                            rejectLabel: 'สั่งสินค้าต่อ',
                            accept: () => {
                               this.$router.push('/cart/order/consignment')
                            },
                        });

                    }).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        this.$store.commit('setLoading', false);
                        this.$router.push('/');
                    })
                },
            });
        }
    }
}
</script>

<style></style>