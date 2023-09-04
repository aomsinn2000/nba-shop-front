<template>
  <div>
    <DataTable :value="$store.getters.order_topup" :paginator="true" :rows="3">
        <template #empty>
            <p class="p-0 m-0 text-center"><em>--ไม่มีรายการ--</em></p>
        </template>
        <Column header="ชื่อรายการ">
            <template #body="item">
                {{ item.data.name }}
            </template>
        </Column>
        <Column header="ราคา" style="width: 10%">
            <template #body="item">
                {{ numberFormat(item.data.total) }}
            </template>
        </Column>
        <Column header="ตัวเลือก" style="width: 10%">
            <template #body="item">
                <Button @click="delList()" icon="pi pi-trash" class="p-button-danger p-button-outlined" v-if="item.data.service!==null"/>
            </template>
        </Column>
    </DataTable>
  </div>
</template>

<script>
export default {
    methods: {
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        delList(){
            this.$confirm.require({
                message: 'ต้องการลบรายการสินค้านี้?',
                header: 'ลบรายการสินค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel : 'ตกลง',
                rejectLabel : 'ยกเลิก',
                accept: () => {
                    this.$store.commit('setOrderTopup', []);
                }
            });
        }
    }
}
</script>

<style>

</style>