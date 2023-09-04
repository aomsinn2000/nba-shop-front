<template>
    <div class="grid">
        <div class="col-12">
            <div class="grid">
                <!-- <div class="col-12 lg:col-6">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-bookmark"></i>
                        </span>
                        <InputText placeholder="ค้นหาเลขที่ใบเสร็จ" class="font w-full" v-model="search"
                            @keyup.enter="findReceipt()" />
                        <Button icon="pi pi-search" @click="findReceipt()" />
                        <Button icon="pi pi-times" @click="clearReceipt()" class="p-button-danger"
                            v-if="search !== ''" />
                    </div>
                </div> -->
                <div class="col-12 lg:col-6">
                    <div class="grid">
                        <div class="col-12 lg:col-5">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-calendar"></i> จาก
                                </span>
                                <Calendar placeholder="วันที่เริ่มต้น" :manualInput="false" showButtonBar class="w-full"
                                    inputClass="font" v-model="datestart" />
                            </div>
                        </div>
                        <div class="col-12 lg:col-5">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-calendar"></i> ถึง
                                </span>
                                <Calendar placeholder="วันที่เริ่มสิ้นสุด" :manualInput="false" showButtonBar class="w-full"
                                    inputClass="font" v-model="dateend" />
                            </div>
                        </div>
                        <div class="col-12 lg:col-2">
                            <Button icon="pi pi-search" @click="searchByDate()" class="mr-2" />
                            <Button icon="pi pi-times" @click="clearDate()" class="p-button-danger"
                                v-if="datestart !== null && dateend !== null" />
                        </div>
                    </div>
                </div>
                <div class="col-12 lg:col-6">
                    <div class="grid">
                        <div class="col-12 lg:col-9">

                        </div>
                        <div class="col-12 lg:col-3">
                            <Button icon="pi pi-file-export" label="Download" @click="export_data" class="mr-2"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <DataTable :value="item_history" :paginator="true" :rows="20">
            <template #empty>
                <p class="p-0 m-0 text-center"><em>--ไม่พบประวัติ--</em></p>
            </template>
            <Column header="#" style="width: 3%">
                <template #body="item">
                    {{ item.index + 1 }}
                </template>
            </Column>
            <Column header="รายการ" style="width: 25%">
                <template #body="item">
                    {{ item.data.name }}
                </template>
            </Column>
            <Column header="ร้านค้า" style="width: 20%">
                <template #body="item">
                    {{ getShopName(item.data.shop_id) }}
                </template>
            </Column>
            <Column header="ประเภท" style="width: 17%">
                <template #body="item">
                    <Badge :value="item.data.type"
                        :class="(item.data.type === 'เงินออก' ? 'bg-red-500' : 'bg-green-600')" />
                </template>
            </Column>
            <Column header="จำนวน" style="width: 10%">
                <template #body="item">
                    <p :class="getColor(item.data.type)"><i :class="getIcon(item.data.type)"></i>{{
                        numberFormat(item.data.amount)
                    }} </p>
                </template>
            </Column>
            <Column header="วันเวลาทำรายการ" style="width: 15%">
                <template #body="item">
                    {{ datetimeFormat(item.data.timestamp) }}
                </template>
            </Column>
            <Column header="เพิ่มเติม" style="width: 10%">
                <template #body="item">
                    <div v-if="item.data.detail !== 'ไม่มี'">
                        <Button @click="detail(item.data.detail)" icon="pi pi-info-circle"
                            class="p-button-sm p-button-outlined" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!--- Dialog Detail-->
        <Dialog :modal="true" header="เพิ่มเติม" v-model:visible="dialogDetail"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
            <div class="grid">
                <div class="col-12">
                    <p>{{ msg }}</p>
                </div>
            </div>
        </Dialog>

    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs';
export default {
    async mounted() {
        this.$store.commit('setLoading', true);

        //ข้อมูลร้านค้า
        await axios
            .get(
                `${process.env.VUE_APP_SHOP}shop/partner/${this.$store.getters.id}`,
                {
                    headers: {
                        "auth-token": `Bearer ${this.$store.getters.token}`,
                    },
                }
            )
            .then((res) => {
                this.shop = res.data.data;
            })
            .catch((err) => {
                if (err.response.status === 408) {
                    window.location.reload();
                }
            });

        //ข้อมูลประวัติรายเงินเข้าออก

        await axios.get(`${process.env.VUE_APP_SHOP}wallethistory/listbypid/${this.$store.getters.id}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.history = res.data.data;
            this.item_history = this.history.reverse();
        }).catch(() => {
            this.$store.commit('setLoading', false);
            this.$router.push('/');
        })

        this.$store.commit('setLoading', false);
    },
    data: () => ({
        dialogDetail: false,
        msg: "",
        item_history: [],
        history: [],
        shop: [],
        datestart: null,
        dateend: null,
    }),
    methods: {
        detail(item) {
            this.msg = item
            this.dialogDetail = true;
        },
        clearDate() {
            this.datestart = null;
            this.dateend = null;
            this.item_history = this.history;
        },
        searchByDate() {
            if (this.datestart === null && this.dateend === null) {
                this.item_history = this.history
                return false
            }
            if (this.datestart === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่เริ่มต้น', life: 3000 });
                return false;
            }
            if (this.dateend === null) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาเลือกวันที่สิ้นสุด', life: 3000 });
                return false;
            }
            this.item_history = this.history.filter((el) => dayjs(el.timestamp).format('YYYY/MM/DD') >= dayjs(this.datestart).format('YYYY/MM/DD') &&
                dayjs(el.timestamp).format('YYYY/MM/DD') <= dayjs(this.dateend).format('YYYY/MM/DD')
            )
        },
        datetimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
        getShopName(item) {
            if (item !== '' && item !== 'ไม่มี') {
                const shop = this.shop.find((el) => el._id === item);
                if (shop) {
                    return shop.shop_name;
                } else {
                    return 'ร้านค้าที่ปิดหรือลบออกจากฐานข้อมูลระบบแล้ว'
                }
            } else {
                return '-';
            }

        },

        
        getIcon(item) {
            if (item === 'เงินออก') {
                return 'pi pi-caret-down'
            } else {
                return 'pi pi-caret-up'
            }
        },
        getColor(item) {
            if (item === 'เงินออก') {
                return 'p-0 m-0 text-red-500'
            } else {
                return 'p-0 m-0 text-green-600'
            }
        },
        numberFormat(item) {
            return item.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })
        }
    }
}
</script>

<style></style>