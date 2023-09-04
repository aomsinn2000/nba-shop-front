<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1 class="mb-0">ส่งพัสดุ NBA Express</h1>
            <p><em>ครบเครื่อง เรื่องขนส่ง</em></p>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-5">
            <Panel header="บริการและสินค้า">
                <TabView ref="tabview">
                    <TabPanel header="พัสดุ">
                        <KeyParcel />
                    </TabPanel>
                    <!-- <TabPanel header="เลือกตามบริการขนส่ง">
                        <CourierList />
                        
                    </TabPanel> -->
                    <TabPanel header="สินค้า">
                        <ProductList/>
                    </TabPanel>
                </TabView>  
            </Panel>
        </div>
        <div class="col-12 lg:col-7">
            <div class="grid">
                <div class="col-12">
                    <Checkout />
                </div>
                <div class="col-12">
                    <OrderList />
                </div>
            </div>

        </div>
    </div>
</template>
<script>
// import CourierList from "@/components/employee/pos/express/CourierList.vue"
import KeyParcel from "@/components/employee/pos/express/KeyParcel.vue";
import OrderList from "@/components/employee/pos/express/OrderList.vue";
import Checkout from "@/components/employee/pos/express/Checkout.vue";
import ProductList from "@/components/employee/pos/express/ProductList.vue"
import axios from 'axios';
export default {
    name: "pos-express",
    components: {
        OrderList, Checkout, ProductList, KeyParcel,
        //  CourierList
    },
    async created(){
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
          headers: {
            "auth-token": `Bearer ${localStorage.getItem("token")}`,
          },
        }).catch((err)=>{
            if(err.response.status===408){
                window.location.reload();
            }
        })
    },
    async mounted() {
        //check function ขนส่ง
        try {
            const express = await this.$store.getters.shop.shop_function.find((el) => el.name === 'express');
            if (express) {
                if (!express.status) {
                    this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                    this.$router.push('/pos');
                }
            } else {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/pos')
            }
            document.title = "ส่งพัสดุ NBA Express"
        } catch (err) {
            this.$router.push('/pos')
        }
        localStorage.setItem('order_total', this.$store.getters.order_express_total);
        localStorage.setItem('order_amount', 0);

    },
}
</script>

<style>

</style>