<template>
  <div>
    <Panel>
        <template #header>
            <p class="p-0 m-0"><strong>ทั้งหมด : </strong> {{ $store.getters.order_tax_detail.length }} รายการ</p>
        </template>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="$store.getters.order_tax_detail" :rows="5" :paginator="true">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>-- ไม่มีรายการสั่ง --</em></p>
                    </template>
                    <Column header="รายการ">
                        <template #body="item">
                            <p class="p-0 m-0">{{ item.data.name }}</p>
                        </template>
                    </Column>
                    <Column header="ราคา/หน่วย" style="width: 15%">
                        <template #body="item">
                            {{ item.data.price }}
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 15%">
                        <template #body="item">
                            {{ item.data.amount }}
                        </template>
                    </Column>
                    <Column header="ราคา" style="width: 15%">
                        <template #body="item">
                            {{ item.data.total }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 15%">
                        <template #body="item">
                            <Button class="p-button-danger p-button-outlined p-button-sm" icon="pi pi-trash"
                             @click="delTax(item.index)" v-if="item.data.code==='tax_service'"/>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Panel>
  </div>
</template>

<script>
import func from '@/service/function';
export default {
    components:{
       
    },
    setup(){
        return func;
    },
    methods: {
        delTax(position){
            this.$confirm.require({
                message: 'ต้องการลบรายการนี้?',
                header: 'ลบรายการ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel : 'ยกเลิก',
                accept: () => {
                    this.$store.dispatch('delTaxService', position);
                }
            });
        }
    },
}
</script>

<style>

</style>