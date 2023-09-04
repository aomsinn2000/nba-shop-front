<template>
  <Button icon="pi pi-list" class="p-button-outlined" @click="openProduct()" />

  <!--  Dialog Product List-->
  <Dialog v-model:visible="dialogProduct" header="รายการสินค้า" :modal="true">
    <DataTable :value="products">
        <Column header="#" style="width: 5%">
            <template #body="item">
                {{ item.index+1 }}
            </template>
        </Column>
        <Column header="รายการ" field="productNBA_name"></Column>
        <Column header="ราคา/หน่วย">
            <template #body="item">
                {{ numberFormat(item.data.productNBA_cost) }}
            </template>
        </Column>
        <Column header="จำนวน">
            <template #body="item">
                {{ numberFormat(item.data.amount) }}
            </template>
        </Column>
        <Column header="รวม/บาท">
            <template #body="item">
                {{ numberFormat(item.data.total) }}
            </template>
        </Column>
        
    </DataTable>
  <template #footer>
    <Button label="ตกลง" @click="dialogProduct = false" />
  </template>
  </Dialog>
</template>

<script>
export default {
    props :{
        products :Array
    },
    data: ()=>({
        dialogProduct : false
    }),
    methods: {
        openProduct(){
            this.dialogProduct = true;
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
    }
}
</script>

<style>

</style>