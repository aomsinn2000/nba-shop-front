<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-search" />
                </span>
                <InputText v-model="search" class="w-full font"
                    placeholder="ค้นหาตาม, เลขติดตาม, เลขใบสั่งซื้อ, SP Tracking, ผู้ส่ง, ผู้รับ เป็นต้น"
                    @keyup.enter="searchData()" />
                <Button @click="searchData()"><i class="pi pi-search"></i></Button>
                <Button class="p-button-danger" @click="clearItem()" v-if="this.search !== ''"><i
                        class="pi pi-times"></i></Button>
            </div>
        </div>
        <div class="col-12 lg:col-5">
            <div class="grid">
                <div class="col-12 lg:col-5">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i> จาก
                        </span>
                        <Calendar v-model="datestart" inputClass="font" class="w-full" placeholder="วันที่เริ่มต้น"
                            :showButtonBar="true" :manualInput="false" />
                    </div>
                </div>
                <div class="col-12 lg:col-5">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i> ถึง
                        </span>
                        <Calendar v-model="dateend" inputClass="font" class="w-full" placeholder="วันที่สิ้นสุด"
                            :showButtonBar="true" :manualInput="false" />
                    </div>
                </div>
                <div class="col-12 lg:col-2">
                    <Button icon="pi pi-search" class="mr-1" @click="searchByDate()" />
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-1 text-right">
            <Button title="รีโหลด" class="p-button-outlined" icon="pi pi-refresh" @click="startPage()" />
        </div>
    </div>
    <div class="grid">

        <div class="col-12">
            <DataTable :value="item_booking" :paginator="true" :rows="25">
                <template #empty>
                    <p class="m-0 p-0 text-center"><em>--ไม่มีรายการ--</em></p>
                </template>
                <Column header="ขนส่ง" style="width: 60px">
                    <template #body="item">
                        <div class="text-center">
                            <img :src="getCourierImg(item.data.courier_code)" style="width: 50px" />
                        </div>
                    </template>
                </Column>
                <Column header="เลขติดตามพัสดุ" style="width:5%">
                    <template #body="item">
                        <Chip :label="item.data.courier_tracking_code" />
                    </template>
                </Column>
                <Column header="เลขใบสั่งซื้อ" style="width: 5%">
                    <template #body="item">
                        <Chip :label="item.data.purchase_id" class="bg-purple-500 text-white" />
                    </template>
                </Column>
                <Column header="SP Tracking" style="width: 10%">
                    <template #body="item">
                        <Chip :label="item.data.tracking_code" class="bg-blue-300 text-white" />
                    </template>
                </Column>
                <Column header="ผู้ส่ง">
                    <template #body="item">
                        {{ item.data.origin.name }}
                    </template>
                </Column>
                <Column header="ผู้รับ">
                    <template #body="item">
                        {{ item.data.to.name }}
                    </template>
                </Column>
                <Column header="COD" style="width: 5%">
                    <template #body="item">
                        {{ numberFormat(item.data.cod_amount) }}
                    </template>
                </Column>
                <Column header="ค่าบริการ" style="width: 5%">
                    <template #body="item">
                        {{ numberFormat(item.data.price) }}
                    </template>
                </Column>
                <Column header="วันที่บุ๊คกิ้ง">
                    <template #body="item">
                        {{ dateTimeFormat(item.data.timestamp) }}
                    </template>
                </Column>
                <Column header="สถานะ" style="width: 10%">
                    <template #body="item">
                        <Chip :label="getStatusName(item.data.order_status)"
                            :class="getStatusClass(item.data.order_status)" />
                    </template>
                </Column>
                <Column header="ตัวเลือก" style="width: 20%">
                    <template #body="item">
                        <ParcelDialog :parcel="item.data.parcel" />

                        <FromDialog :from="item.data.origin" />

                        <ToDialog :to="item.data.to" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import ParcelDialog from './details/ParcelDialog.vue';
import FromDialog from './details/FromDialog.vue';
import ToDialog from './details/ToDialog.vue';
export default {
    components: {
        ParcelDialog, FromDialog, ToDialog
    },
    async mounted() {
        await this.startPage();
    },
    data: () => ({
        item_booking: [],
        bookings: [],
        search: "",
        datestart : null,
        dateend : null
    }),
    methods: {
        async startPage() {
            await axios.get(`${process.env.VUE_APP_SHOP}express/booking/${localStorage.getItem('shop_id')}`, {
                headers: {
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                this.bookings = res.data.data;
                this.item_booking = this.bookings.reverse();
            }).catch((err) => {
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            })
        },
        clearItem() {
            this.search = "";
            this.item_booking = this.bookings;
        },
        searchData() {
            this.item_booking = this.bookings.filter((el) => el.purchase_id.search(this.search) !== -1 || el.courier_tracking_code.search(this.search) !== -1
                || el.tracking_code.search(this.search) !== -1 || el.origin.name.search(this.search) !== -1
                || el.to.name.search(this.search) !== -1)
        },
        searchByDate(){
            if (this.datestart === null && this.dateend === null) {
                this.item_booking = this.bookings;
                return false;
            }

            if (this.datestart === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่เริ่มต้น', life: 3000 });
                return false
            }

            if (this.dateend === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่สิ้นสุด', life: 3000 });
                return false;
            }

            this.item_booking = this.bookings.filter((el) => dayjs(el.timestamp).format('YYYY/MM/DD') >= dayjs(this.datestart).format('YYYY/MM/DD') &&
                dayjs(el.timestamp).format('YYYY/MM/DD') <= dayjs(this.dateend).format('YYYY/MM/DD')
            )
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
        },
        dateTimeFormat(item) {
            return dayjs(item).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
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
                case 'package_detail':
                    return 'อัพเดตพัสดุ';
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
                case 'package_detail':
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
    }
}
</script>

<style></style>