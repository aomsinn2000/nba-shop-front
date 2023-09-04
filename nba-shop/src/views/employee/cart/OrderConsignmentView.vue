<template>
  <div>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>รายการสั่งสินค้าฝากขาย</h1>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <TableOrder/>
        </div>
    </div>
  </div>
</template>

<script>
import TableOrder from '@/components/employee/cart/consignment/TableOrder.vue'
import callme from '@/service/callme';
export default {
    components:{
        TableOrder
    },
    async created() {
        await callme(localStorage.getItem('token'));
        document.title = "สินค้าฝากขายจาก NBA";
    },
    async mounted() {
        //only manager can user this page;
        if (this.$store.getters.position !== "manager") {
            this.$router.push("/");
        }

        //check function
        try {
            const func = await this.$store.getters.shop.shop_function.find((el) => el.name === 'pos');
            if (func) {
                if (!func.status) {
                    this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                    this.$router.push('/pos');
                }
            } else {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/pos')
            }
        } catch (err) {
            this.$router.push('/pos')
        }
    },
}
</script>

<style>

</style>