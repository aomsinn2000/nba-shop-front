<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1 class="mb-0">Counter Service</h1>
            <p><em>จ่ายบิลสาธารณูปโภค</em></p>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-5">
            <TabView>
                <TabPanel header="สาธารณูปโภค" :disabled="checkOrder()">
                    <Panel header="ตรวจสอบรายการ" v-if="!checkOrder()">
                        <div class="grid">
                            <div class="col-12">
                                <BarcodeList />
                            </div>
                            <div class="col-12">
                                <BarcodeService />
                            </div>
                        </div>
                    </Panel>
                    <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
                    </Message>
                </TabPanel>
                <TabPanel header="โทรศัพท์ & อินเทอร์เน็ต" :disabled="checkOrder()">
                    <Panel header="รายการ" v-if="!checkOrder()">
                        <MobileBillService />
                    </Panel>
                    <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
                    </Message>
                </TabPanel>
                <TabPanel header="ฝากจ่าย NBA" :disabled="checkOrder()">
                    <Panel header="รายการ" v-if="!checkOrder()">
                        <NbaService />
                    </Panel>
                    <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
                    </Message>
                </TabPanel>
            </TabView>
        </div>
        <div class="col-12 lg:col-7">
            <div class="grid">
                <div class="col-12 mt-2">
                    <Checkout />
                </div>
            </div>
            <Panel>
                <template #header>
                    <p class="p-0 m-0">สินค้าทั้งหมด <strong>{{
                        numberFormat($store.getters.order_cs.length)
                    }}</strong> รายการ</p>
                </template>
                <OrderList />
            </Panel>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import BarcodeService from '@/components/employee/pos/counter_service/barcode/BarcodeService.vue';
import OrderList from '@/components/employee/pos/counter_service/OrderList.vue'
import Checkout from '@/components/employee/pos/counter_service/Checkout.vue';
import MobileBillService from '@/components/employee/pos/counter_service/mobile_bill/MobileBillService.vue';
import BarcodeList from '@/components/employee/pos/counter_service/barcode/BarcodeList.vue';
import NbaService from '@/components/employee/pos/counter_service/nba/NbaService.vue';
export default {
    components: {
        BarcodeService, OrderList, Checkout, MobileBillService, BarcodeList, NbaService,
    },
    async created() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                "auth-token": `Bearer ${localStorage.getItem("token")}`,
            },
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    async mounted() {
        //check function
        try {
            const counter_service = await this.$store.getters.shop.shop_function.find((el) => el.name === 'counter_service');
            if (counter_service) {
                if (!counter_service.status) {
                    this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                    this.$router.push('/pos');
                }
            } else {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/pos')
            }
            document.title = "เคาน์เซอร์วิสและฝากจ่ายบิล"
        } catch (err) {
            this.$router.push('/pos')
        }
        localStorage.setItem('order_total', this.$store.getters.order_cs_total);
    },
    methods: {
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        checkOrder() {
            if (this.$store.getters.order_cs.length !== 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style>

</style>