<template>
  <div>
    <DataTable :value="$store.getters.order_cs">
        <template #empty>
            <p class="p-0 m-0 text-center"><em>--ไม่มีรายการชำระ--</em></p>
        </template>
        <Column header="ชื่อสินค้า">
            <template #body="item">
                {{item.data.name }}           
            </template>
        </Column>
        <Column header="ราคา">
            <template #body="item">
                {{ numberFormat(item.data.total) }}
            </template>
        </Column>
        <Column header="ตัวเลือก">
            <template #body="item">
                <Button @click="delService()" icon="pi pi-trash" class="p-button-danger p-button-outlined" v-if="item.data.service!==null"/>
            </template>
        </Column>
        <template #footer>
            <p class="p-0 m-0">ยอดรวม : <strong>{{ numberFormat($store.getters.order_cs_total) }}</strong> บาท</p>
        </template>
    </DataTable>
  </div>
</template>

<script>
export default {
    methods : {
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        delService(){
            this.$confirm.require({
                message: 'ต้องการลบบริการหรือยกเลิกรายการชำระใบแจ้งหนี้นี้?',
                header: 'ยืนยันการยกเลิก',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel : 'ยกเลิก',
                acceptLabel : 'ตกลง',
                accept: () => {
                    this.$store.commit('setOrderCS', []);
                }
            });
        }
    }
}
</script>

<style>

</style>