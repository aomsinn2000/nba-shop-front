<template>
    <Button @click="detail()" label="รายละเอียด" icon="pi pi-list" :loading="isLoading" />
    <Sidebar v-model:visible="sidebarDetail" class="p-sidebar-lg" position="right">
        <div class="grid">
            <div class="col-12 text-center">
                <h2><strong>ใบเสร็จเลขที่ </strong>{{ order.invoice }}</h2>
            </div>
        </div>
        
        <div class="grid">
            <div class="col-12" v-if="print_receipt.parcel.length !== 0">
                <Divider align="center" type="dashed">
                    <Chip label="รายการพัสดุ"></Chip>
                </Divider>
                <DataTable :value="print_receipt.parcel" :paginator="true" :rows="10">
                    <template #empty>
                        <p class="m-0 p-0"><em>--ไม่มีรายการพัสดุ--</em></p>
                    </template>
                    <Column header="ขนส่ง" style="width: 50px;">
                        <template #body="item">
                            <img :src="getCourierImg(item.data.courier_code)" width="50" />
                        </template>
                    </Column>
                    <Column header="เลขพัสดุ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.courier_tracking_code" />
                        </template>
                    </Column>
                    <Column header="ผู้รับ">
                        <template #body="item">
                            <p class="m-0 p-0">{{ item.data.to.name }}<br />
                                <small><em>{{ item.data.to.address }}, {{ item.data.to.province }} {{
                                    item.data.to.postcode
                                }}</em></small>
                            </p>
                        </template>
                    </Column>
                    <Column header="ราคา">
                        <template #body="item">
                            {{ numberFormat(item.data.price) }}
                        </template>
                    </Column>
                    <Column header="สถานะ">
                        <template #body="item">
                            <Chip :label="getStatusName(item.data.order_status)"
                                :class="getStatusClass(item.data.order_status)" />
                        </template>
                    </Column>
                    <Column header="ตัวเลือก">
                        <template #body="item">
                            <parcel-dialog :parcel="item.data.parcel" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12" v-if="print_receipt.product.length !== 0">
                <Divider align="center" type="dashed">
                    <Chip label="รายการสินค้า"></Chip>
                </Divider>
                <DataTable :value="print_receipt.product" :paginator="true" :rows="10">
                    <template #empty>
                        <p class="m-0 p-0"><em>--ไม่มีรายการพัสดุ--</em></p>
                    </template>
                    <Column header="รายการ">
                        <template #body="item">
                            {{ item.data.detail.name }}
                        </template>
                    </Column>
                    <Column header="ราคา/หน่วย" style="width: 15%">
                        <template #body="item">
                            {{ numberFormat(item.data.detail.price) }}
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 15%">
                        <template #body="item">
                            {{ numberFormat(item.data.amount) }}
                        </template>
                    </Column>
                    <Column header="รวม" style="width: 15%">
                        <template #body="item">
                            {{ numberFormat(item.data.total) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="grid">
            <div class="col-12 md:col-4" v-if="getLastStatusName(order.status) === 'ชำระเงิน'">
                <ExpressReceipt :print_receipt="print_receipt" />
            </div>
            <div class="col-12 md:col-4"
                v-if="getLastStatusName(order.status) === 'ชำระเงิน' && print_receipt.parcel.length !== 0">
                <ExpressLabel :order="label_html" />
            </div>
        </div>
    </Sidebar>
</template>

<script>
import axios from 'axios';
import ExpressReceipt from '@/components/employee/pos/print/ExpressReceipt.vue';
import dayjs from 'dayjs';
import ParcelDialog from './details/ParcelDialog.vue';
import ExpressLabel from '../print/ExpressLabel.vue';
export default {
    props: {
        order: Object
    },
    components: {
        ExpressReceipt,
        ParcelDialog,
        ExpressLabel
    },
    data: () => ({
        isLoading: false,
        sidebarDetail: false,
        parcel: [],
        print_receipt: null,
        label_html: "",
    }),
    methods: {
        getStatusName(status) {
            switch (status) {
                case 'booking':
                    return 'บุ๊คกิ้ง';
                case 'confirm':
                    return 'ยืนยันการบุ๊ค';
                case 'cancel':
                    return 'ยกเลิก';
                case 'shipping':
                    return 'ระหว่างจัดส่ง';
                case 'complete':
                    return 'จัดส่งสำเร็จ';
                case 'return':
                    return 'ตีกลับต้นทาง';
                case 'pending_transfer':
                    return 'เตรียมโอนเงินคืน';
                case 'transferred':
                    return 'โอนเรียบร้อย';
                case 'cancel_transfer':
                    return 'ยกเลิกการโอนคืน'
                default:
                    return status;
            }
        },
        getStatusClass(status) {
            switch (status) {
                case 'booking':
                    return 'bg-yellow-500 text-white';
                case 'confirm':
                    return 'bg-green-500 text-white';
                case 'cancel':
                    return 'bg-red-400 text-white';
                case 'shipping':
                    return 'bg-purple-400 text-white';
                case 'complete':
                    return 'bg-green-500 text-white';
                case 'return':
                    return 'bg-gray-400 text-white';
                case 'pending_transfer':
                    return 'bg-yallow-500 text-white';
                case 'transferred':
                    return 'bg-purple-800 text-white';
                case 'cancel_transfer':
                    return 'bg-red-500 text-white'
                default:
                    return 'bg-red-500 text-white';
            }
        },
        getCourierImg(courier_code) {
            switch (courier_code) {
                case 'FLE':
                    return require('@/assets/img/icon_courier/FLE.png')
                case 'ARM':
                    return require('@/assets/img/icon_courier/ARM.png')
                case 'BEST':
                    return require('@/assets/img/icon_courier/BEST.png')
                case 'DHL':
                    return require('@/assets/img/icon_courier/DHL.png')
                case 'ECP':
                    return require('@/assets/img/icon_courier/ECP.png')
                case 'EMST':
                    return require('@/assets/img/icon_courier/EMST.png')
                case 'KRYS':
                    return require('@/assets/img/icon_courier/KRY.png')
                case 'NJV':
                    return require('@/assets/img/icon_courier/NJV.png')
                case 'SCG':
                    return require('@/assets/img/icon_courier/SCG.png')
                case 'SCGF':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'SCGC':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'SPX':
                    return require('@/assets/img/icon_courier/SPX.png')
                case 'TP2':
                    return require('@/assets/img/icon_courier/TP2.png')
                default:
                    return require('@/assets/img/icon_courier/NONE.png')
            }
        },
        async detail() {
            this.isLoading = true;
            if (this.order.purchase_id !== 'ไม่มี') {
                await axios.post(`${process.env.VUE_APP_SHOP}express/order/purchase_id/`, {
                    shop_id: this.order.shop_id,
                    purchase_id: this.order.purchase_id
                }, {
                    headers: {
                        'auth-token': `Bearer ${this.$store.getters.token}`
                    }
                }).then((res) => {
                    this.parcel = res.data.data
                }).catch((err) => {
                    if (err.response.status === 408) {
                        window.location.reload();
                    }
                })

                await axios.post(`${process.env.VUE_APP_SHOP}express/label`, {
                    shop_id: this.order.shop_id,
                    purchase_id: this.order.purchase_id
                }, {
                    headers: {
                        'auth-token': `Bearer ${this.$store.getters.token}`
                    }
                }).then((res) => {
                    this.label_html = res.data.html
                }).catch((err) => {
                    this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                })
            }
            this.print_receipt = { ...this.order, parcel: this.parcel }
            this.sidebarDetail = true;
            this.isLoading = false;
        },
        getLastStatusName(item) {
            const status = item[item.length - 1].name;
            return status;
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
        },
        dateTimeFormat(item) {
            return dayjs(item).format('DD/MM/YYYY เวลา HH:mm:ss')
        }
    }
}
</script>

<style>

</style>