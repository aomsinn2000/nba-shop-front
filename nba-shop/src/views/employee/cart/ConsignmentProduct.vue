<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1 class="mb-0">สั่งรายการสินค้าฝากขาย</h1>
        </div>
        <div class="col-12">
            <Message severity="info">
                <p class="m-0 p-0"><strong>สำคัญ :</strong> ร้านค้าสามารถสั่งสินค้าฝากขายจากบริษัท
                    ลงขายที่หน้าร้านได้โดยไม่หักเครดิตสั่งซื้อ แต่รายการจะอยู่ในใบแจ้งหนี้ชำระต้นทุน
                    เมื่อมีการขายสินค้านั้นได้ </p>
                <p class="m-0 p-0"><strong>เพิ่มเติม :
                    </strong>การพิจารณาจำนวนสินค้าหรือการอนุมัติขึ้นอยู่กับบริษัทเห็นสมควร และเปลี่ยนแปลงใบออเดอร์สินค้าได้
                </p>
            </Message>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 lg:col-5">
            <Panel header="รายการสั่ง">
                <OrderList />
            </Panel>

        </div>
        <div class="col-12 lg:col-7">
            <TableProductConsignment />
        </div>
    </div>
</template>

<script>
import TableProductConsignment from '@/components/employee/cart/TableProductConsignment.vue';
import OrderList from '@/components/employee/cart/consignment/OrderList.vue';
import callme from '@/service/callme';
export default {
    components: {
        TableProductConsignment, OrderList
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

<style></style>