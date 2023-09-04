<template>
    <Button label="รายละเอียด" icon="pi pi-list" @click="openSidebar()" :loading="isLoading" />

    <Sidebar v-model:visible="sidebarDetail" position="right" class="p-sidebar-lg">
        <div class="grid">
            <div class="col-12 text-center">
                <h3>เลขที่ใบสั่งซื้อ {{ ponba.ponba_number }}</h3>
                <p>
                    วันที่สั่งซื้อ
                    {{ datetimeFormat(ponba.ponba_timestamp[0].timestamp) }}
                </p>
            </div>
        </div>

        <div class="grid">
            <div class="col-12">
                <Divider align="center" type="dashed"><Chip label="รายการส่งสินค้า"/></Divider>
            </div>
            <div class="col-12">
                <DataTable :value="this.orders">
                    <template>
                        <p class="p-0 m-0"><em>--ไม่มีพบข้อมูล--</em></p>
                    </template>
                    <Column header="เลขนำเข้า">
                        <template #body="item">
                            <Chip :label="item.data.barcode"/>
                        </template>
                    </Column>
                    <Column header="จำนวน/รายการ">
                        <template #body="item">
                            {{ numberFormat(item.data.product_detail.length) }}
                        </template>
                    </Column>
                    <Column header="สถานะ">
                        <template #body="item">
                            <Chip :label="lastStatus(item.data.status)" :class="statusColor(lastStatus(item.data.status))"/>
                        </template>
                    </Column>
                    <Column heaer="ตัวเลือก">
                        <template #body="item">
                            <order-product-list :products="item.data.product_detail"/>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Sidebar>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import OrderProductList from './OrderProductList.vue';
export default {
  components: { OrderProductList },
    props: {
        ponba: Object
    },
    data: () => ({
        sidebarDetail: false,
        isLoading: false,
        orders: [],
    }),
    methods: {
        async openSidebar() {
            this.isLoading = true;
            await axios.get(`${process.env.VUE_APP_SHOP}order/ponba/${this.ponba._id}`, {
                headers: {
                    'auth-token': `Bearer ${this.$store.getters.token}`
                }
            }).then((res) => {
                this.orders = res.data.data;

            }).catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
            })
            this.isLoading = false;
            this.sidebarDetail = true;
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        datetimeFormat(date) {
            return dayjs(date).format("DD/MM/YYYY เวลา HH:mm:ss");
        },
        lastStatus(status){
            return status[status.length-1].name;
        },
        statusColor(status){
            switch(status){
                case 'ระหว่างจัดส่ง':
                    return 'bg-yellow-500 text-white';
                case 'จัดส่งสำเร็จ' :
                    return 'bg-green-500 text-white';
                case 'นำเข้าสต๊อก':
                    return 'bg-green-500 text-white';
                default :
                    return 'bg-red-500 text-white';
            }
        }
    }
}
</script>

<style>

</style>