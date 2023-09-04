<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-bookmark"></i>
                </span>
                <InputText v-model="searchData" placeholder="ค้นหาเลขใบสั่งซื้อสินค้าฝากขาย" class="font" @keyup.enter="search()"/>
                <Button @click="search()" icon="pi pi-search"/>
                <Button @click="searchData='', clearSearch()" icon="pi pi-times" class="p-button-danger" v-if="searchData!==''"/>
            </div>
        </div>
        <div class="col-12 lg:col-6">
            <div class="grid">
                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            จาก
                        </span>
                        <Calendar :manualInput="false" v-model="datestart" class="w-full" inputClass="font" placeholder="เลือกวันที่เริ่มต้น" showButtonBar/>
                        <span class="p-inputgroup-addon">
                            ถึง
                        </span>
                        <Calendar :manualInput="false" v-model="dateend" class="w-full" inputClass="font" placeholder="เลือกวันที่สิ้นสุด" showButtonBar/>

                        <Button icon="pi pi-search" @click="searchByDate()" class="pl-4 pr-4"/>
                        <Button icon="pi pi-times" @click="clearSearch()" class="p-button-danger pl-4 pr-4" v-if="datestart!=='' && dateend!==''"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <DataTable :value="item_order" :rows="20" :paginator="true">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่พบรายการสั่งสินค้า--</em></p>
                </template>
                <Column header="#" style="width: 5%">
                    <template #body="item">
                        {{ numberFormat(item.index + 1) }}
                    </template>
                </Column>
                <Column header="เลขที่" style="width: 15%">
                    <template #body="item">
                        <Chip :label="item.data.invoice" />
                    </template>
                </Column>
                <Column header="จำนวน/รายการ" style="width: 15%">
                    <template #body="item">
                        {{ numberFormat(item.data.detail.length) }}
                    </template>
                </Column>
                <Column header="สถานะ" style="width: 15%">
                    <template #body="item">
                        <Chip :label="getLastStatusName(item.data.status)"
                            :class="getColorStatus(getLastStatusName(item.data.status))" />
                    </template>
                </Column>
                <Column header="วันเวลาสั่งซื้อ" style="width: 20%">
                    <template #body="item">
                        {{ datetimeFormat(item.data.timestamp) }}
                    </template>
                </Column>
                <Column header="ตัวเลือก">
                    <template #body="item">
                        <OrderDetail :detail="item.data.detail"
                            v-if="getLastStatusName(item.data.status) === 'รอตรวจสอบ' || getLastStatusName(item.data.status)==='ยืนยันการตรวจสอบ'" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
<script>
import func from '@/service/function';
import OrderDetail from '@/components/employee/cart/consignment/OrderDetail.vue';
import axios from 'axios'
export default {
    components: {
        OrderDetail
    },
    setup() {
        return func
    },
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/consignment/shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.orders = res.data.data;
            this.item_order = this.orders.reverse();
        }).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
        this.$store.commit('setLoading', false);
    },
    data: () => ({
        orders: [],
        item_order: [],
        searchData : '',
        datestart : '',
        dateend : ''
    }),
    methods: {
        getLastStatusName(item) {
            return item[item.length - 1].name;
        },
        getColorStatus(item) {
            switch (item) {
                case 'รอตรวจสอบ':
                    return 'bg-yellow-500 text-white';
                case 'ยืนยันการตรวจสอบ':
                    return 'bg-green-600 text-white';
                default:
                    return 'bg-red-500 text-white';
            }
        },
        search(){
            if(this.searchData===''){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณากรอกเลขใบสั่งซื้อที่ต้องการค้นหา', life: 3000});
                return false;
            }
            this.item_order = this.orders.filter((el)=>el.invoice.search(this.searchData)!==-1)
        },
        searchByDate(){
            if(this.datestart==='' || this.dateend===''){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาเลือกช่วงเวลาที่ต้องการค้นหา', life: 3000});
                return false;
            }
            this.item_order = this.orders.filter((el)=>this.dateFormat(el.timestamp) >= this.dateFormat(this.datestart) && this.dateFormat(el.timestamp)<=this.dateFormat(this.dateend));
        },
        clearSearch(){
            this.datestart = '';
            this.dateend = '';
            this.searchData = '';
            this.item_order = this.orders;
        }
    }
}
</script>

<style></style>