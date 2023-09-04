<template>
    <Button @click="getAllAdress()" :loading="loading" icon="pi pi-book" label="รายชื่อผู้ส่ง"
        class="p-button-sm p-button-outlined p-button-success" />

    <Dialog header="สมุดรายชื่อผู้ส่ง" v-model:visible="dialog" modal :style="{ width: '75vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
        <div class="grid">
            <div class="col-12">
                <InputText v-model="filters['global'].value" placeholder="ค้นหาชื่อ หรือ เบอร์โทร" class="font" />
            </div>
            <div class="col-12">
                <DataTable :value="items" :paginator="true" :rows="10" v-model:filters="filters"
                    :global-filter-fields="['name', 'tel', 'address', 'district', 'state', 'province', 'postcode']"
                    :row-hover="true">
                    <template #empty>
                        <p class="text-center"><em>--ไม่พบรายชื่อผู้รับ--</em></p>
                    </template>
                    <Column field="name" header="ชื่อ" style="width: 15%"></Column>
                    <Column field="tel" header="เบอร์โทร" style="width: 10%"></Column>
                    <Column header="ที่อยู่">
                        <template #body="item">
                            <p class="mb-0 mt-0">{{ item.data.address }}, <br />
                                <small>
                                    <strong>แขวง/ตำบล: </strong>{{ item.data.district }} <strong>เขต/อำเภอ : </strong> {{
                                        item.data.state }} <strong>จังหวัด : </strong>{{ item.data.province }} {{
        item.data.postcode }}
                                </small>
                            </p>
                        </template>
                    </Column>
                    <Column header="ตัวเลือก" style="width: 20%">
                        <template #body="item">
                            <Button @click="choosAddress(item.data)"
                                class="p-button-success p-button-outlined p-button-sm mr-1" icon="pi pi-check"
                                label="เลือก" />
                            <Button @click="delAddress(item.data)" class="p-button-danger p-button-outlined p-button-sm"
                                icon="pi pi-trash" v-if="$store.getters.position === 'manager'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Dialog>
</template>
  
<script>
import axios from 'axios';
import callme from '@/service/callme';
import { FilterMatchMode } from 'primevue/api';
export default {
    emits: ['choose-address'],
    data: () => ({
        items: [],
        loading: false,
        dialog: false,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    }),
    methods: {
        async getAllAdress() {
            await callme(localStorage.getItem('token'))
            this.loading = true;
            await axios.get(`${process.env.VUE_APP_SHOP}express/address_book/sender/shop-id/${this.$store.getters.shop._id}`, {
                headers: {
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                this.loading = false;
                this.items = res.data.data;
                this.dialog = true;
            }).catch((err) => {
                this.loading = false;
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 })
            })
        },
        choosAddress(item) {
            this.$emit('choose-address', item);
            this.dialog = false;
        },
        async delAddress(item) {
            await callme(localStorage.getItem('token'))
            this.$confirm.require({
                message: `ต้องการลบข้อมูลผู้ส่ง ${item.name} ออกจากสมุดรายชื่อนี้?`,
                header: 'ลบข้อมูล',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    await axios.delete(`${process.env.VUE_APP_SHOP}express/address_book/sender/${item._id}`, {
                        headers: {
                            'auth-token': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(() => {
                        this.$store.commit('setLoading', false);
                        const position = this.items.findIndex((el) => el._id === item._id);
                        this.items.splice(position, 1);
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบข้อมูลรายชื่อสำเร็จ', life: 3000 });
                    }).catch((err) => {
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })
                }
            });
        }
    }
}
</script>
  
<style></style>