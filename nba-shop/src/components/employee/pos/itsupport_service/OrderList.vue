<template>
    <div>
        <Panel>
            <template #header>
                <p class="p-0 m-0"><strong>ทั้งหมด : </strong> {{ $store.getters.order_itsupport_detail.length }} รายการ</p>
            </template>
            <div class="grid">
                <div class="col-12">
                    <DataTable :value="$store.getters.order_itsupport_detail" :rows="5" :paginator="true">
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
                                {{ item.data.amount }}
                            </template>
                        </Column>
                        <Column header="จำนวน" style="width: 15%">
                            <template #body>
                                <p class="p-0 m-0"> 1 </p>
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
                                    @click="delitsupport(item.index)" v-if="item.data.code === 'itsupport_service'" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script>
import func from '@/service/function'
export default {
    components: {

    },
    setup() {
        return func;
    },
    methods: {
        delitsupport(position) {
            this.$confirm.require({
                message: 'ต้องการลบรายการออกแบบสื่อสิ่งพิมพ์รายการนี้?',
                header: 'ลบรายการ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: () => {
                    this.$store.dispatch('delitsupportService', position);
                }
            });
        }
    },
}
</script>

<style></style>