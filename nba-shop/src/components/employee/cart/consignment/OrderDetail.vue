<template>
    <Button label="รายละเอียด" icon="pi pi-list" @click="openSidebar()" />

    <!-- Sidebar -->
    <Sidebar v-model:visible="sidebar" position="right" class="p-sidebar-lg">
        <div class="grid">
            <div class="col-12 text-center">
                <h2>รายละเอียดสินค้า</h2>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="detail" :rows="10" :paginator="true">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการสินค้า--</em></p>
                    </template>
                    <Column header="#" style="width: 5%">
                        <template #body="item">
                            {{ numberFormat(item.index + 1) }}
                        </template>
                    </Column>
                    <Column header="ชื่อสินค้า">
                        <template #body="item">
                            {{ item.data.productNBA_name }}
                        </template>
                    </Column>
                    <Column header="ราคา/ชิ้น" style="width: 15%">
                        <template #body="item">
                            {{ numberDigitFormat(item.data.productNBA_cost) }}
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.amount) }}
                        </template>
                    </Column>
                    <Column header="รวม" style="width: 15%">
                        <template #body="item">
                            {{ numberDigitFormat(item.data.total) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Sidebar>
</template>

<script>
import func from '@/service/function';

export default {
    setup() {
        return func
    },
    props: {
        detail: Array
    },
    data: () => ({
        sidebar: false
    }),
    methods: {
        openSidebar() {
            this.sidebar = true;
        }
    }
}
</script>

<style></style>