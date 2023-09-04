<template>
    <div class="grid">
        <div class="col-12">
            <Panel>
                <template #header>
                    <p style="margin: 0">ทั้งหมด : <strong>{{ numberFormat(this.$store.getters.order_express.length)
                    }}</strong> รายการ</p>
                </template>
                <DataTable :value="this.$store.getters.order_express" :paginator="true" :rows="10">
                    <template #empty>
                        <p class="text-center"><em>--ไม่มีรายการ--</em></p>
                    </template>
                    <Column header="#" style="width: 5%">
                        <template #body="item">
                            <Chip :label="getNameType(item.data.type)" />
                        </template>
                    </Column>
                    <Column header="ขนส่ง" style="width:55px">
                        <template #body="item">
                            <Chip label="-" v-if="item.data.type==='product'" />
                            <Image :src="getImageCourier(item.data.detail.courier_code)"  width="50" v-if="item.data.type==='parcel'"/>
                        </template>
                    </Column>
                    <Column header="รายการ">
                        <template #body="item">
                            <div v-if="item.data.type === 'parcel'">
                                <p>{{ item.data.detail.to.name }} <br />
                                    <small class="text-gray-500"><em>{{ item.data.detail.to.address }}
                                            ,{{ item.data.detail.to.district }}, {{ item.data.detail.to.state }}, {{
                                                    item.data.detail.to.province
                                            }} {{ item.data.detail.to.postcode }}
                                        </em></small>
                                </p>
                            </div>
                            <div v-else>
                                <p>{{ item.data.detail.name }}</p>
                            </div>
                        </template>
                    </Column>
                    <Column header="COD" style="width: 10%">
                        <template #body="item">
                            <p v-if="item.data.detail.cod_amount">{{ numberFormat(item.data.detail.cod_amount) }}</p>
                            <p v-else>-</p>
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.amount) }}
                        </template>
                    </Column>
                    <Column header="รวม" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.total) }}
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 20%">
                        <template #body="item">
                            <EditProductAmount :data="item.data" v-if="item.data.type === 'product'"/>
                            <Button @click="delOrder(item.data.id)" icon="pi pi-trash" class="m-1 p-button-danger p-button-outlined p-button-sm" />
                        </template>
                    </Column>
                    <template #footer>
                       ยอดสุทธิ : {{ numberFormat($store.getters.order_express_total) }} บาท
                    </template>
                </DataTable>
            </Panel>
        </div>
    </div>
</template>

<script>
import EditProductAmount from '@/components/employee/pos/express/EditProductAmount.vue';
export default {
    components:{
        EditProductAmount
    },
    methods: {
        checkParcelAmount(){
            const parcel = this.$store.getters.order_express.filter((el)=>el.type==='parcel');
            if(parcel.length===0){
                this.$store.commit('setDefaultOrderExpress');
            }
        },
        delOrder(item){
            this.$confirm.require({
                message: 'ต้องการลบรายการนี้?',
                header: 'ลบรายการ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel : "ตกลง",
                rejectLabel : "ยกเลิก",
                accept: () => {
                    this.$store.commit('removeOrderExpress', item);
                    this.checkParcelAmount();
                },
            });
        },
        numberFormat(num) {
            return Number(num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }));
        },
        getNameType(item) {
            switch (item) {
                case 'parcel':
                    return 'พัสดุ';
                case 'product':
                    return 'สินค้า';
                default:
                    return item;
            }
        },
        getImageCourier(item) {
            switch (item) {
                case 'DHL':
                    return require('@/assets/img/icon_courier/DHL.png')
                case 'FLE':
                    return require('@/assets/img/icon_courier/FLE.png')
                case 'NJV':
                    return require('@/assets/img/icon_courier/NJV.png')
                case 'SCG':
                    return require('@/assets/img/icon_courier/SCG.png')
                case 'SCGC':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'SCGF':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'TP2':
                    return require('@/assets/img/icon_courier/TP2.png')
                case 'EMST':
                    return require('@/assets/img/icon_courier/EMST.png')
                case 'ECP':
                    return require('@/assets/img/icon_courier/ECP.png')
                case 'BEST':
                    return require('@/assets/img/icon_courier/BEST.png')
                case 'SPX':
                    return require('@/assets/img/icon_courier/SPX.png')
                case 'KRYS':
                    return require('@/assets/img/icon_courier/KRY.png')
                default:
                    return require('@/assets/img/icon_courier/NONE.png')
            }
        }
    }
}
</script>

<style>

</style>