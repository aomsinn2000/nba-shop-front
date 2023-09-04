<template>
    <div class="grid">
        <div class="col-12 lg:col-6">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-bookmark"></i>
                </span>
                <InputText v-model="search" class="w-full font" placeholder="ค้นหาเลขที่ใบเสร็จ"
                    @keyup.enter="searchInvoice()" />
                <Button @click="searchInvoice()"><i class="pi pi-search"></i></Button>
                <Button @click="search = '', item_order = orders" class="p-button-danger" v-if="search !== ''"><i
                        class="pi pi-times"></i></Button>
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
    <div class="grid">
        <div class="col-12">
            <DataTable :value="item_order" :paginator="true" :rows="20">
                <template #empty>
                    <p class="p-0 m-0 text-center"><em>--ไม่มีพบข้อมูล--</em></p>
                </template>
                <Column header="เลขที่สั่งซื้อ" style="width: 12%">
                    <template #body="item">
                        <Chip :label="item.data.receiptnumber" />
                    </template>
                </Column>
                <Column header="ประเภท Service" style="width: 10%">
                    <template #body="item">
                        <Chip :label="service_type(item.data.servicename)" class="bg-purple-700 text-white" />
                    </template>
                </Column>
                <Column header="รายการ" style="width: 5%">
                    <template #body="item">
                        {{ (item.data.product_detail.length) }}
                    </template>
                </Column>
                <Column header="การชำระเงิน" style="width: 7%">
                    <template #body="item">
                        <Chip :label="item.data.paymenttype" />
                    </template>
                </Column>
                <Column header="ยอดรวม" style="width: 10%">
                    <template #body="item">
                        {{ func.numberDigitFormat(item.data.totalprice) }}
                    </template>
                </Column>
                <Column header="เจ้าหน้าที่" style="width: 10%">
                    <template #body="item">
                        <Badge :value="item.data.branch_name" class="bg-pink-600 text-white" />
                    </template>
                </Column>
                <Column header="สถานะ" style="width: 10%">
                    <template #body="item">
                        <Chip :label="item.data.status" :class="getColorStatus(item.data.status)" />
                    </template>
                </Column>
                <Column header="วันที่ทำรายการ">
                    <template #body="item">
                        {{ func.dateFormat(item.data.timestamp) }}
                    </template>
                </Column>
                <Column header="ตัวเลือก">
                    <template #body="item">
                        <DetailOrder :order="item.data" />
                        <!-- <PrintArtwork :order="item.data" v-if="item.data.servicename === 'Artwork'"/> -->
                        <PrintReceipt :order="item.data" v-if="item.data.servicename !== 'Artwork'"/>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import service_type from '@/service/service_type';
import func from '@/service/function';
import DetailOrder from '@/components/employee/pos/media_service/DetailOrder.vue'
import PrintReceipt from '@/components/employee/pos/media_service/PrintReceipt.vue'
// import PrintArtwork from '@/components/employee/pos/artwork/PrintReceipt.vue'
export default {
    components: {
        DetailOrder,
        PrintReceipt,
        // PrintArtwork,
    },
    setup() {
        return { service_type, func }
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}orderservice/list`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.orders = res.data.data;
            this.item_order = this.orders.reverse();
            this.id = `${localStorage.getItem('shop_id')}`

            if (this.id !== "") {
                this.item_order = this.orders.filter(
                    (item) => item.shopid === this.id
                );
            } else {
                this.item_order = this.orders.reverse();
            }
        })
    },
    data: () => ({
        search: '',
        datestart: null,
        dateend: null,
        orders: [],
        item_order: [],
        id: '',
    }),
    methods: {
        searchByDate() {
            console.log('ค้นหาโดยวันที่')
        },
        searchInvoice() {
            if (this.search === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกเลขใบเสร็จที่ต้องการค้นหา', life: 3000 });
                return false;
            }

            this.item_order = this.orders.filter((el) => el.invoice.search(this.search) !== -1);
            if (this.item_order.length > 0) {
                this.$toast.add({ severity: 'success', summary: 'ค้นหาสำเร็จ', detail: `พบรายการทั้งหมด ${func.numberFormat(this.item_order.length)} รายการ`, life: 3000 });
            } else {
                this.$toast.add({ severity: 'warn', summary: 'ไม่พบรายการ', detail: 'ไม่พบรายการที่ค้นหา', life: 3000 });
            }

        },

        getLastStatus(item) {
            const status = item[item.length - 1].name;
            return status;
        },
        getColorStatus(item) {
            switch (item) {
                case 'รอการตรวจสอบ':
                    return 'bg-yellow-500 text-white';
                case 'กำลังดำเนินการ':
                    return 'bg-blue-500 text-white';
                case 'รับงานแล้ว':
                    return 'bg-pink-500 text-white';
                case 'เรียบร้อย':
                    return 'bg-green-500 text-white';
                default:
                    return 'bg-red-500 text-white'
            }
        },
    }
}
</script>

<style></style>