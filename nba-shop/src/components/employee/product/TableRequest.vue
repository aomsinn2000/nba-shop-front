<template>
    <div class="grid">
        <div class="col-12">
            <DataTable :value="item_request" :paginator="true" :rows="50">
                <template #empty>
                    <p class="text-center m-0"><em>--ไม่มีรายการส่งตรวจสอบ--</em></p>
                </template>
                <Column header="รหัสสินค้า">
                    <template #body="item">
                        <Chip :label="item.data.productReq_barcode"/>
                    </template>
                </Column>
                <Column field="productReq_name" header="ชื่อสินค้า" style="width: 25%"></Column>
                <Column header="ราคาต้นทุนที่ส่งบริษัท">
                    <template #body="item">
                        {{numberFormat(item.data.productReq_cost)}}
                    </template>
                </Column>
                <Column header="ราคาขายหน้าร้าน">
                    <template #body="item">
                        {{numberFormat(item.data.productReq_price)}}
                    </template>
                </Column>
                <Column header="วันเวลาที่ส่งตรวจสอบ">
                    <template #body="item">
                            {{datetimeFormat(dateReq(item.data.productReq_timestamp))}}
                    </template>
                </Column>
                <Column header="สถานะ">
                    <template #body="item">
                        <Chip :label="statusName(item.data.productReq_status)" :class="colorStatus(item.data.productReq_status)"/>
                    </template>
                </Column>
                <Column header="ตัวเลือก">
                    <template #body="item">
                        <Button @click="detailReq(item.data)" icon="pi pi-list" class="p-button-sm" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Sidebar v-model:visible="sidebarDetail" class="p-sidebar-md" position="right" v-if="product!==null">
        <div class="grid">
            <div class="col-12 text-center">
                <Image :src="getImage(product.productReq_image)" :preview="true" width="200" />
            </div>
            <div class="col-12 text-center">
                <h3>{{product.productReq_name}}</h3>
            </div>
            <div class="col-12">
                <Panel header="เกี่ยวกับสินค้า">
                    <p class="mb-0 mt-0"><strong>สถานะ : </strong> <Chip :label="product.productReq_status" :class="colorStatus(product.productReq_status)"/></p>
                    <p class="mb-0"><strong>ราคาต้นทุนที่ส่งบริษัท : </strong> {{numberFormat(product.productReq_cost)}} บาท</p>
                    <p class="mb-0"><strong>ราคาขายหน้าร้าน : </strong> {{numberFormat(product.productReq_price)}} บาท</p>
                </Panel>
            </div>
        </div>
    </Sidebar>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
    async mounted() {
        try {
            await axios.get(`${process.env.VUE_APP_SHOP}product/request`, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                this.requests = res.data.data;
                this.item_request = this.requests.reverse();
            }).catch((err) => {
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            });
        } catch (err) {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.message, life: 3000 });
        }
    },
    data: () => ({
        sidebarDetail : false,
        requests: [],
        item_request: [],
        product : null
    }),
    methods: {
        statusName(status) {
            if (status) {
                return 'ผ่านการตรวจสอบ';
            } else {
                return 'ไม่ผ่านการตรวจสอบ';
            }
        },
        colorStatus(status) {
            if (status) {
                return 'bg-green-600 text-white';
            } else {
                return 'bg-red-600 text-white';
            }
        },
        dateReq(item){
            const timestamp = item.find((el)=>el.name==='ส่งตรวจสอบ')
            if(timestamp){
                return timestamp.timestamp;
            }
        },
        datetimeFormat(date){
            return dayjs(date).format('DD/MM/YYYY เวลา H:mm:ss')
        },
        numberFormat(num){
            return num.toFixed();
        },
        getImage(img){
            return 'https://drive.google.com/uc?export=view&id='+img
        },
        detail(item){
            this.product = item;
        },
        detailReq(item){
            this.detail(item);
            this.sidebarDetail = true;
        }        
    }
}
</script>