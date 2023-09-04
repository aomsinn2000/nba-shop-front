<template>
    <div>
        <div class="grid">
            <div class="col-12 lg:col-6 lg:col-offset-3">
                <Panel header="ค้นหา">
                    <Divider type="dashed" align="center" class="mt-0"><Chip label="เลขที่ใบเสร็จ"/></Divider>
                    <InputText v-model="search_reciept" @keyup="searchReciept()" placeholder="ค้นหาเลขที่ใบเสร็จ"
                        class="w-full font" />
                    <Divider type="dashed" align="center"><Chip label="ตามช่วงวันที่"/></Divider>
                    <div class="grid">
                        <div class="col-12 lg:col-6">
                            <Calendar v-model="date.start" :manualInput="false" :showIcon="true" class="w-full" inputClass="font" placeholder="วันที่เริ่มต้น"/>
                        </div>
                        <div class="col-12 lg:col-6">
                            <Calendar v-model="date.end" :manualInput="false" :showIcon="true" class="w-full" inputClass="font" placeholder="วันที่สิ้นสุด"/>
                        </div>
                        <div class="col-12">
                            <Button @click="searchDate()" label="ค้นหา" icon="pi pi-fw pi-search" />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <DataTable :value="item_poshop" :paginator="true" :rows="20">
                    <ColumnGroup type="header">
                        <Row>
                            <Column :header="'ทั้งหมด : ' + numberFormat(item_poshop.length) + ' รายการ'"
                                :colspan="8" />
                        </Row>
                        <Row>
                            <Column
                                :header="'ยอดขายรวม : ' + numberFormat(item_poshop.reduce((sum, po) => sum + po.poshop_total, 0)) + ' บาท'"
                                :colspan="8" />
                        </Row>
                        <Row>
                            <Column header="เลขที่ใบเสร็จ" />
                            <Column header="รายการ" />
                            <Column header="ยอดรวม" />
                            <Column header="การชำระเงิน" />
                            <Column header="เจ้าหน้าที่" />
                            <Column header="วันเวลา" />
                            <Column header="สถานะ" />
                            <Column header="ตัวเลือก" />
                        </Row>
                    </ColumnGroup>
                    <template #empty>
                        <p class="text-center"><em>-- ไม่พบรายการขาย --</em></p>
                    </template>
                    <Column header="เลขที่ใบเสร็จ" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.poshop_ref_short" />
                        </template>
                    </Column>
                    <Column header="จำนวนรายการ" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.poshop_detail.length) }} <small>รายการ</small>
                        </template>
                    </Column>
                    <Column header="ยอดรวมในใบเสร็จ" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.poshop_total - item.data.poshop_discount) }} <small>บาท</small>
                        </template>
                    </Column>
                    <Column header="ประเภทการจ่าย" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.poshop_type_price" />
                        </template>
                    </Column>
                    <Column header="เจ้าหน้าที่ทำรายการ" style="width: 10%">
                        <template #body="item">
                            <Badge class="p-badge-secondary">{{ item.data.poshop_employee }}</Badge>
                        </template>
                    </Column>
                    <Column header="วันเวลาทำรายการ" style="width: 20%">
                        <template #body="item">
                            {{ dateTimeFormat(item.data.poshop_timestamp) }}
                        </template>
                    </Column>
                    <Column header="สถานะ" style="5%">
                        <template #body="item">
                            <Chip :label="textStatus(item.data.poshop_status)"
                                :class="colorStatus(item.data.poshop_status)" />
                        </template>
                    </Column>
                    <Column style="width: 30%">
                        <template #body="item">
                            <Button class="p-button-sm mt-1 mr-2" icon="pi pi-list" @click="detail(item.data)" />
                            <Button class="p-button-sm mt-1 p-button-outlined mr-2" icon="pi pi-print"
                                label="ใบเสร็จแบบย่อ" @click="$router.push(`/report/shop/reciept/${item.data._id}`)"
                                v-if="item.data.poshop_status === true" />
                            <Button class="p-button-sm mt-1 mr-2 p-button-outlined" icon="pi pi-print"
                                @click="$router.push(`/report/shop/tax_invoice/${item.data._id}`)" label="ใบกำกับภาษี"
                                v-if="shop.shop_status_tax === 'จดทะเบียนภาษี' && item.data.poshop_status === true && checkDateTax(item.data.poshop_timestamp) === true" />
                            <Button class="p-button-sm mt-1 p-button-outlined p-button-danger" icon="pi pi-times"
                                label="ยกเลิกใบเสร็จ" @click="cancelOrder(item.data)"
                                v-if="item.data.poshop_status === true && checkInvoice(item.data.poshop_timestamp) === true" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!--  Sidebar Detail Poshop-->
        <Sidebar v-model:visible="sidebarDetail" class="p-sidebar-md" position="right">
            <div class="grid">
                <div class="col-12 text-center">
                    <h2>
                        เลขที่ใบเสร็จ {{ poshop.poshop_ref_short }}
                    </h2>
                    <p>เวลาสั่งซื้อ {{ dateTimeFormat(poshop.poshop_timestamp) }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col-12">
                    <DataTable :value="poshop.poshop_detail">
                        <Column header="รายการ">
                            <template #body="item">
                                {{ item.data.product_ref.productNBA_name }}
                            </template>
                        </Column>
                        <Column header="ราคา/หน่วย" style="width: 20%">
                            <template #body="item">
                                {{ numberFormat(item.data.product_ref.productNBA_price) }}
                            </template>
                        </Column>
                        <Column header="จำนวน" style="width: 15%">
                            <template #body="item">
                                {{ numberFormat(item.data.amount) }}
                            </template>
                        </Column>
                        <Column header="รวม" style="width: 20%">
                            <template #body="item">
                                {{ numberFormat(item.data.total) }}
                            </template>
                        </Column>
                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="ส่วนลด:" :colspan="3" />
                                <Column :footer="numberFormat(poshop.poshop_discount) + ' บาท'" />
                            </Row>
                            <Row>
                                <Column footer="ยอดสุทธิ:" :colspan="3" />
                                <Column :footer="numberFormat(poshop.poshop_total) + ' บาท'" />
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </div>
            </div>
        </Sidebar>

        <!-- ยกเลิกใบเสร็จ-->
        <Dialog v-model:visible="dialogCancel" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
            :style="{ width: '25vw' }">
            <template #header>ยืนยันการยกเลิกใบเสร็จโดยผู้จัดการสาขา</template>
            <div class="grid">
                <div class="col-12">
                    <div class="field">
                        <label>ชื่อผู้ใช้งาน : </label>
                        <InputText v-model="manager.username" placeholder="กรอกชื่อผู้ใช้งานสำหรับผู้จัดการสาขา"
                            class="w-full font" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label>รหัสผ่าน :</label>
                        <InputText type="password" v-model="manager.password" placeholder="กรอกรหัสผ่าน"
                            class="w-full font" />
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="ยกเลิก" class="p-button-text" @click="this.dialogCancel = false" />
                <Button label="ตกลง" @click="checkManager()" />
            </template>
        </Dialog>
    </div>
</template>

<script>

import axios from 'axios'
import dayjs from 'dayjs';
export default {
    created() {
        document.title = "ประวัติการขายสินค้า"
    },
    async mounted() {
        //get about shop
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.shop = res.data.data;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$router.push('/');
        })
        //โหลดรายการสั่งซื้อ
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.poshops = res.data.data;
            this.item_poshop = this.poshops.reverse();
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$router.push('/');
        })

        //โหลดสินค้าของร้านค้า
        await axios.get(`${process.env.VUE_APP_SHOP}product/shop/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.product_shop = res.data.data;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })

        //โหลดใบกำกับภาษีแบบเต็มของร้านค้า
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop-full/shop-id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.poshopf = res.data.data;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })

    },
    data: () => ({
        dialogCancel: false,
        shop: [],
        sidebarDetail: false,
        show_print: true,
        poshops: [],
        poshopf: [], //ใบกำกับภาษีแบบเต็มข้องร้านค้าทั้งหมด
        item_poshop: [],
        poshop: [],
        product_shop: [],
        happy_point: [],
        point: {
            hp: 0,
            platform: 0,
        },
        search_reciept: "",
        date : {
            start : null,
            end : null
        },
        manager: {
            username: "",
            password: ""
        }
    }),
    methods: {
        getTotal(item) {
            if (item) {
                return item.reduce((sum, po) => sum + po.poshop_total, 0);
            }
        },
        searchDate() {
            if(this.date.start === null || this.date.end === null){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาเลือกช่วงวันที่ต้องการค้นหา', life: 3000});
                return false;
            }
           this.item_poshop = this.poshops.filter((el)=>dayjs(el.poshop_timestamp).format('DD/MM/YYYY')>=dayjs(this.date.start).format('DD/MM/YYYY') &&
           dayjs(el.poshop_timestamp).format('DD/MM/YYYY')<=dayjs(this.date.end).format('DD/MM/YYYY'));
        },
        confirmCancel() {
            const config = {
                headers: {
                    'auth-token': `${this.$store.getters.token}`
                }
            }
            this.$confirm.require({
                message: `ต้องการยกเลิกใบสั่งซื้อสินค้าเลขที่ ${this.poshop.poshop_ref_short} นี้?`,
                header: `ยกเลิกใบสั่งซื้อ ${this.poshop.poshop_ref_short}`,
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    //คืนสินค้าจำนวนสินค้าค้าสต๊อก
                    let new_stock = null;
                    this.poshop.poshop_detail.forEach(async (el) => {
                        const product = this.product_shop.find((el) => el._id === el._id);
                        new_stock = {
                            productShop_stock: product.productShop_stock + el.amount
                        }

                        await axios.put(`${process.env.VUE_APP_SHOP}product/shop/${el._id}`, new_stock, config).catch((err) => {
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        });

                    })

                    //ตรวจสอบกรณีออกใบกำกับภาษีไปแล้ว
                    const poshopf = this.poshopf.find((el) => el.poshop_ref_short === this.poshop.poshop_ref_short);
                    // console.log(poshopf);
                    if (poshopf) {
                        await axios.put(`${process.env.VUE_APP_SHOP}preorder/shop-full/${poshopf._id}`, {
                            poshopf_status: false
                        }, config).catch((err) => {
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        })
                    }

                    // อัพเดตสถานะใบสั่งซื้อ
                    const position = this.item_poshop.findIndex((el) => el._id === this.poshop._id);
                    // console.log('position : '+position);
                    const new_data = {
                        poshop_status: false,
                        poshop_employee: this.$store.getters.name
                    }
                    await axios.put(`${process.env.VUE_APP_SHOP}preorder/shop/${this.poshop._id}`, new_data, config).then(() => {
                        this.item_poshop.splice(position, 1, {
                            ...this.poshop, ...new_data
                        })
                        this.$toast.add({ severity: 'success', summary: 'ยกเลิกสำเร็จ', detail: 'ยกเลิกใบสั่งซื้อเรียบร้อยแล้ว', life: 3000 });
                        this.dialogCancel = false;
                    }).catch((err) => {
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    })
                }
            });
        },
        cancelOrder(item) {
            this.poshop = item;
            if (this.$store.getters.position !== 'manager') {
                this.dialogCancel = true;
            } else {
                this.confirmCancel();
            }
        },
        async checkManager() {
            if (this.manager.username === "" || this.manager.password === "") {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกชือผู้ใช้งานและรหัสผ่าน', life: 3000 });
                return false;
            }
            const checklogin = await axios.post(`${process.env.VUE_APP_SHOP}login`, this.manager).catch(() => {
                this.$toast.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง', life: 3000 });
            })
            console.log(checklogin);
            if (checklogin) {
                if (checklogin.data.position === 'manager') {
                    this.confirmCancel();
                } else {
                    this.$toast.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: 'ชื่อผู้ใช้และรหัสผ่านไม่ถูกต้อง', life: 3000 });
                    return false;
                }
            }
        },
        searchReciept() {
            if (this.search_reciept === "") {
                this.item_poshop = this.poshops;
            } else {
                this.item_poshop = this.poshops.filter((el) => el.poshop_ref_short.search(this.search_reciept) !== -1);
            }
        },
        detail(item) {
            this.poshop = item;
            this.sidebarDetail = true;
        },
        checkInvoice(item) {
            const date_invoice = dayjs(item).format('DD/MM/YYYY');
            const today = dayjs(Date.now()).format('DD/MM/YYYY');
            if (date_invoice === today) {
                return true;
            } else {
                return false;
            }
        },
        checkDateTax(item){
            if(dayjs(Date.now()).format() < dayjs(item).add(7, 'day').format()){
                return true;
            }else{
                return false;
            }
        },
        textStatus(item) {
            if (item) {
                return 'ปกติ';
            } else {
                return 'ยกเลิก'
            }
        },
        colorStatus(item) {
            if (item) {
                return 'bg-green-500 text-white';
            } else {
                return 'bg-red-500 text-white';
            }
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
        },
        dateTimeFormat(item) {
            return dayjs(item).format('DD/MM/YYYY เวลา HH:mm:ss')
        }
    }
}
</script>

<style>

</style>