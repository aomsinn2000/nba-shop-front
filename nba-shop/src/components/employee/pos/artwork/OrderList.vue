<template>
  <div>
    <Panel>
        <template #header>
            <p class="p-0 m-0"><strong>ทั้งหมด : </strong> {{ $store.getters.order_artwork_detail.length }} รายการ</p>
        </template>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="$store.getters.order_artwork_detail" :rows="5" :paginator="true">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>-- ไม่มีรายการสั่ง --</em></p>
                    </template>
                    <Column header="รายการ">
                        <template #body="item">
                            <p class="p-0 m-0">{{ item.data.name }}</p>
                            <p class="p-0 m-0 text-gray-400" v-if="item.data.type==='ราคาต่อตารางเมตร'"><small><em><strong>ขนาด :</strong> {{ item.data.size }} ({{ item.data.width }}x{{ item.data.height }} ซม.)</em></small></p>
                        </template>
                    </Column>
                    <Column header="ราคา/หน่วย" style="width: 15%">
                        <template #body="item">
                            <div v-if="item.data.code==='artwork'">
                                {{ item.data.price }}
                            </div>
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 15%">
                        <template #body="item">
                            {{ item.data.amount }}
                        </template>
                    </Column>
                    <Column header="ราคา" style="width: 15%">
                        <template #body="item">
                            {{ numberDigitFormat(item.data.total) }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 15%">
                        <template #body="item">
                            <EditDetailVinyl :artwork="{position: item.index, ...item.data }" v-if="item.data.code==='artwork'"/>
                            <Button class="p-button-danger p-button-outlined p-button-sm" icon="pi pi-trash" @click="delArt(item.index)" v-if="item.data.code==='artwork'"/>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Panel>
  </div>
</template>

<script>
import EditDetailVinyl from './Vinyl/EditDetail.vue';
import func from '@/service/function'
export default {
    components:{
        EditDetailVinyl
    },
    setup(){
        return func;
    },
    methods: {
        delArt(position){
            this.$confirm.require({
                message: 'ต้องการลบรายการออกแบบสื่อสิ่งพิมพ์รายการนี้?',
                header: 'ลบรายการ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel : 'ยกเลิก',
                accept: () => {
                    this.$store.dispatch('delArtwork', position);
                }
            });
        }
    },
}
</script>

<style>

</style>