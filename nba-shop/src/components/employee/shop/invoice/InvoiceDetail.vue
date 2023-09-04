<template>
  <Button @click="sidebarDetail()" class="p-button-info p-button-outlined" icon="pi pi-list" />

  <!-- sidebar Detail-->
  <Sidebar v-model:visible="sidebar" position="right" class="p-sidebar-lg">
    <div class="grid">
        <div class="col-12 text-center">
            <h2>รายละเอียดใบแจ้งหนี้</h2>
            <p class="m-0 p-0 mt-2"><strong>เลขที่ : </strong> {{ invoice.invoice_ref }}</p>
        </div>
    </div>
    <div class="col-12">
        <DataTable :value="invoice.invoice_detail" :paginator="true" :rows="10" >
            <Column header="#" style="width: 5%">
                <template #body="item">{{ item.index+1 }}</template>
            </Column>
            <Column header="รายการ">
                <template #body="item">{{ item.data.name }}</template>
            </Column>
            <Column header="ต้นทุน/หน่วย" style="width: 15%">
                <template #body="item">{{ numberFormat(item.data.cost) }} บาท</template>
            </Column>
            <Column header="จำนวน" style="width: 10%">
                <template #body="item">{{ numberFormat(item.data.amount) }}</template>
            </Column>
            <Column header="รวม" style="width: 20%">
                <template #body="item">{{ numberFormat(item.data.summary) }}</template>
            </Column>
        </DataTable>
    </div>
  </Sidebar>
</template>

<script>
export default {
    props: {
        invoice : Object
    },
    data : ()=>({
        sidebar : false
    }),
    methods : {
        sidebarDetail(){
            this.sidebar  = true;
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
    }
}
</script>

<style>

</style>