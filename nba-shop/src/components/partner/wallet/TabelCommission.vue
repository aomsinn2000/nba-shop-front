<template>
    <!-- ค่าคอมมิชชั่นทั้งหมด -->
    <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
            <div
                class="surface-card shadow-2 p-3 border-round border-round border-purple-500 surface-overlay border-left-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-left">ค่าคอมมิชชั่นทั้งหมด</span>
                        <div class="text-900 font-medium text-xl">{{ numberFormat(commission) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-purple-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
            <div
                class="surface-card shadow-2 p-3 border-round border-round border-purple-500 surface-overlay border-left-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-left">Allsale</span>
                        <div class="text-900 font-medium text-xl">{{ numberFormat(allsale) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-purple-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
            <div
                class="surface-card shadow-2 p-3 border-round border-round border-purple-500 surface-overlay border-left-3">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-left">Happypoint</span>
                        <div class="text-900 font-medium text-xl">{{ numberFormat(happypoint) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-purple-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ค้นหา -->
    <!-- <div class="grid mt-2">
        <div class="col-12">
            <div class="grid">
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
            </div>
        </div>
    </div> -->
    <div class="mt-2">
        <DataTable :value="item_commission" :paginator="true" :rows="20">
            <template #empty>
                <p class="p-0 m-0 text-center"><em>--ไม่พบประวัติ--</em></p>
            </template>
            <Column style="width: 4%;">
            </Column>
            <Column header="#" style="width: 4%;">
                <template #body="item">
                    {{ item.index + 1 }}
                </template>
            </Column>
            <Column header="รายการ" style="width: 5%;">
                <template #body="item">
                    <Chip :class="getStatusColor(item.data)" label="เงินเข้า" />
                </template>
            </Column> 
            <Column header="ค่าคอมมิชชั่น" style="width: 5%;">
                <template #body="item">
                    {{ numberFormat(item.data.commission_amount) }} บาท
                </template>
            </Column>
            <Column header="ภาษี" style="width: 5%;">
                <template #body="item">
                    <p :class="getColorVet()"><i :class="getIconVet()"></i>{{ numberFormat(item.data.vat3percent) }}</p>
                </template>
            </Column>
            <Column header="รายได้" style="width: 5%;">
                <template #body="item">
                    <p :class="getColor()"><i :class="getIcon()"></i>{{ numberFormat(item.data.remainding_commission) }}</p>
                </template>
            </Column>
            <Column header="วันที่ทำรายการ" style="width: 5%">
                <template #body="item">
                    {{ datetimeFormat(item.data.timestamp) }}
                </template>
            </Column>
            <Column header="เพิ่มเติม" style="width: 5%">
                <template #body="item">
                    <div>
                        <Button @click="detail(item.data.orderid)" icon="pi pi-search"
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
                    <p>ใบเสร็จเลขที่ : {{ order_detail.receiptnumber }}</p>
                    <!-- <img src="../../../assets/logo.png"> -->
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
        await axios.get(`${process.env.VUE_APP_SHOP}shop/partner/${this.$store.getters.id}`, {
            headers: {
                "auth-token": `Bearer ${this.$store.getters.token}`,
            },
        }).then((res) => {
            this.shop = res.data.data;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        });

        await axios.get(`${process.env.VUE_APP_SHOP}commission/listcommission`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            const com = res.data.data;
            this.item_commission = com.reverse();
        }).catch(() => {
            this.$store.commit('setLoading', false);
            this.$router.push('/');
        })

        await axios.get(`${process.env.VUE_APP_SHOP}commission/totalcommission`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            const com = res.data.data;
            this.commission = com[0].totalRemainingCommission;
        }).catch(() => {
            this.$store.commit('setLoading', false);
            this.$router.push('/');
        })

        await axios.get(`${process.env.VUE_APP_SHOP}commission/totalallsalebytel`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            const allsale = res.data;
            this.allsale = allsale.totalAllSale;
        }).catch(() => {
            this.$store.commit('setLoading', false);
            this.$router.push('/');
        })

        await axios.get(`${process.env.VUE_APP_SHOP}commission/happypoint`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            const point = res.data;
            this.happypoint = point.happyPoint;
        }).catch(() => {
            this.$store.commit('setLoading', false);
            this.$router.push('/');
        })

        this.$store.commit('setLoading', false);
    },
    data: () => ({
        dialogDetail: false,
        item_history: [],
        history: [],
        shop: [],
        datestart: null,
        dateend: null,

        order_detail: '',
        item_commission: '',

        commission: '',
        allsale: '',
        happypoint: '',
    }),
    methods: {
        async detail(id) {
            this.dialogDetail = true;
            await axios //artwork
                .get(`${process.env.VUE_APP_SHOP}orderservice/list/${id}`, {
                    headers: {
                        "auth-token": this.$store.getters.token,
                    },
                })
                .then((res) => {
                    this.order_detail = res.data.data;

                })
                .catch((err) => {
                    console.log(err);
                });
        },

        async getPackage(id) {
            await axios.get(`${process.env.VUE_APP_SHOP}shop/partner/${id}`, {
                headers: {
                    "auth-token": `Bearer ${this.$store.getters.token}`,
                },
            }).then((res) => {
                this.order = res.data.data;
            })
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
        getIcon(item) {
            if (item !== '') {
                return 'pi pi-caret-up'
            } 
        },
        getIconVet(item) {
            if (item !== '') {
                return 'pi pi-caret-down'
            } 
        },
        getColor(item) {
            if (item !== '') {
                return 'p-0 m-0 text-green-500'
            } 
        },
        getStatusColor(item) {
            if (item !== '') {
                return 'bg-green-500 text-white';
            }
        },
        getColorVet(item) {
            if (item !== '') {
                return 'p-0 m-0 text-red-500'
            } 
        },
        getStatusColorVet(item) {
            if (item !== '') {
                return 'bg-red-500 text-white';
            }
        },
        numberFormat(item) {
            return item.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })
        },

        colorService(name) {
            switch (name) {
                case 'Artwork':
                    return 'bg-purple-300 text-white';
                case 'Facebook Service':
                    return 'bg-blue-500 text-white';
                case 'Website Service':
                    return 'bg-purple-500 text-white';
                case 'Account Service':
                    return 'bg-pink-400 text-white';
                case 'IT Support Service':
                    return 'bg-blue-300 text-white';
                case 'Act of legislation Service(พรบ.)':
                    return 'bg-brown-500 text-white';
                case 'Insurance Service(ประกัน)':
                    return 'bg-green-500 text-white';
                default:
                    return name;
            }
        },

        calcommission(item) {
            const total = total + item;
        }
    }
}
</script>

<style></style>