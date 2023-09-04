<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-bookmark"></i>
                </span>
                <InputText placeholder="ค้นหาเลขที่ใบเสร็จ" class="font w-full" v-model="search"
                    @keyup.enter="findReceipt()" />
                <Button icon="pi pi-search" @click="findReceipt()" />
                <Button icon="pi pi-times" @click="clearReceipt()" class="p-button-danger" v-if="search !== ''" />
            </div>
        </div>
        <div class="col-12 lg:col-6">
            <div class="grid">
                <div class="col-12 lg:col-5">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i> จาก
                        </span>
                        <Calendar placeholder="วันที่เริ่มต้น" :manualInput="false" showButtonBar class="w-full"
                            inputClass="font" v-model="datestart" />
                    </div>
                </div>
                <div class="col-12 lg:col-5">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i> ถึง
                        </span>
                        <Calendar placeholder="วันที่เริ่มสิ้นสุด" :manualInput="false" showButtonBar class="w-full"
                            inputClass="font" v-model="dateend" />
                    </div>
                </div>
                <div class="col-12 lg:col-2">
                    <Button icon="pi pi-search" @click="searchByDate()" />
                </div>
            </div>
        </div>
    </div>
    <div>
        <DataTable :value="item_order" :paginator="true" :rows="20">
            <template #empty>
                <p class="p-0 m-0"><em>--ไม่พบรายการเติมเงินเข้ากระเป๋า--</em></p>
            </template>
            <Column header="#" style="width :5%">
                <template #body="item">
                    {{ item.index + 1 }}
                </template>
            </Column>
            <Column header="เลขทำรายการ" style="width: 15%">
                <template #body="item">
                    <Chip :label="item.data.invoice" />
                </template>
            </Column>
            <Column header="ประเภท" style="width: 10%">
                <template #body="item">
                    <Chip :label="statusTypeName(item.data.payment_type)"
                        :class="statusTypeColor(item.data.payment_type)" />
                </template>
            </Column>
            <Column header="จำนวน" style="width: 10%">
                <template #body="item">
                    {{ numberDigitFormat(item.data.amount) }}
                </template>
            </Column>
            <Column header="ค่าธรรมเนียม" style="width: 10%">
                <template #body="item">
                    {{ numberDigitFormat(item.data.charge) }}
                </template>
            </Column>
            <Column header="ยอดเข้ากระเป๋าสุทธิ" style="width: 10%">
                <template #body="item">
                    <div v-if="item.data.status!=='ยกเลิก'">
                        <strong>{{ numberDigitFormat(item.data.amount - item.data.charge) }}</strong>
                    </div>
                    <div v-if="item.data.status==='ยกเลิก'">
                       <strong>{{ numberDigitFormat(0) }}</strong> 
                    </div>
                </template>
            </Column>
            <Column header="วันเวลาทำรายการ" style="width: 15%">
                <template #body="item">
                    {{ datetimeFormat(item.data.timestamp) }}
                </template>
            </Column>
            <Column header="สถานะ" style="width: 10%">
                <template #body="item">
                    <Chip :label="item.data.status" :class="statusColor(item.data.status)" />
                </template>
            </Column>
            <Column header="ตัวเลือก">
                <template #body="item">
                    <div v-if="item.data.payment_type === 'slip'">
                        <SlipImage :topup="item.data" />
                        <Remark v-if="item.data.status === 'ยกเลิก'" :msg="item.data.remark" />
                    </div>
                    <div v-if="item.data.payment_type === 'qrcode'">
                        <Chip :label="'อ้างอิง : '+item.data.detail.gbpReferenceNo" class="bg-pink-500 text-white"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import axios from 'axios'
import func from '@/service/function';
import SlipImage from './SlipImage.vue';
import Remark from '@/components/partner/wallet/Remark.vue'
import dayjs from 'dayjs';
export default {
    setup() {
        return func
    },
    components: {
        Remark, SlipImage
    },
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}partner/wallet_topup/partner-id/${this.$store.getters.id}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.$store.commit('setLoading', false);
            this.orders = res.data.data;
            this.item_order = this.orders.reverse();
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
    },
    data: () => ({
        orders: [],
        item_order: [],
        search: '',
        datestart: null,
        dateend: null
    }),
    methods: {
        statusTypeColor(item) {
            switch (item) {
                case 'qrcode':
                    return 'text-white bg-pink-500'
                case 'slip':
                    return 'text-white bg-purple-600'
            }
        },
        statusTypeName(item) {
            switch (item) {
                case 'qrcode':
                    return 'คิวอาร์โค้ด'
                case 'slip':
                    return 'แนบสลิป'
            }
        },
        statusColor(item) {
            switch (item) {
                case 'รอตรวจสอบ':
                    return 'text-white bg-yellow-500';
                case 'ตรวจสอบสำเร็จ':
                    return 'text-white bg-green-600';
                case 'รายการสำเร็จ':
                    return 'text-white bg-green-600';
                default:
                    return 'text-white bg-red-500';
            }
        },
        searchByDate() {
            if (this.datestart === null && this.dateend === null) {
                this.item_order = this.orders
                return false
            }
            if (this.datestart === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่เริ่มต้น', life: 3000 });
                return false;
            }
            if (this.dateend === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่สิ้นสุด', life: 3000 });
                return false;
            }
            this.item_order = this.orders.filter((el) => dayjs(el.timestamp).format('YYYY/MM/DD') >= dayjs(this.datestart).format('YYYY/MM/DD') &&
                dayjs(el.timestamp).format('YYYY/MM/DD') <= dayjs(this.dateend).format('YYYY/MM/DD')
            )
        },
        findReceipt() {
            if (this.search === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกหมายเลขใบเสร็จที่ต้องการค้นหา', life: 3000 });
                return false;
            } else {
                this.item_order = this.orders.filter((el) => el.invoice.search(this.search) !== -1);
            }

        },
        clearReceipt() {
            this.item_order = this.orders;
            this.search = '';
        },
    }
}
</script>

<style>

</style>