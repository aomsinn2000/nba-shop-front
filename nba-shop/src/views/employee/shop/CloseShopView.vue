<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1 class="mb-2">ปิดงานรายการขายประจำวัน</h1>
                <p class="m-0 p-0 text-gray-600">
                    <em>ปิดงานร้านค้าเพื่อส่งยอดและแจ้งชำระเงินต้นทุนภายในแต่ละวันหลังปิดร้าน</em>
                </p>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <Button label="ปิดรายการขายประจำวัน" @click="closeShop()" icon="pi pi-fw pi-upload" />
            </div>
        </div>
        <div class="grid">
            <div class="col-12 mt-2">
                <DataTable :value="items" :paginator="true" :rows="20" :loading="isLoading">
                    <template #header>
                        <p class="mb-0 mt-0">ราคาต้นทุนที่ต้องส่ง : {{ numberFormat(totalCost())}} บาท</p>
                        <p class="mb-0 mt-2">รายการสินค้าที่ถูกขาย : {{ numberFormat(items.length) }} รายการ</p>
                        <p class="mb-0 mt-2">รายการขาย (ที่ไม่ถูกยกเลิกใบเสร็จ) : {{ numberFormat(poshop.length) }}
                            ใบเสร็จ</p>
                    </template>
                    <template #empty>
                        <p class="m-0 p-0 text-center"><em>--ไม่มีรายการขายสินค้าที่ค้างชำระต้นทุน--</em></p>
                    </template>
                    <Column header="#" style="width: 5%">
                        <template #body="item">
                            {{ numberFormat(item.index + 1) }}
                        </template>
                    </Column>
                    <Column header="บาร์โค้ด" style="width: 10%">
                        <template #body="item">
                            <Chip :label="item.data.productShop_barcode" />
                        </template>
                    </Column>
                    <Column header="สินค้า" field="name"></Column>
                    <Column header="ต้นทุน/หน่วย" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.cost) }}
                        </template>
                    </Column>
                    <Column header="จำนวน" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.amount) }}
                        </template>
                    </Column>
                    <Column header="ต้นทุนรวม" style="width: 10%">
                        <template #body="item">
                            {{ numberFormat(item.data.summary) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- dialog loading-->
        <Dialog class="border-0 shadow-none " :draggable="false" v-model:visible="dialogLoading" :closable="false"
            :modal="true">
            <ProgressSpinner style="width:80px;height:80px" strokeWidth="5" fill="var(--surface-ground)"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </Dialog>

    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs';
export default {
    async created() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
        document.title = "ปิดรายการขายประจำวัน"
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`,{
            headers: {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res)=>{
            this.shop = res.data.data;
        })
        const pos = await this.shop.shop_function.find((el) => el.name === 'pos');
        if (pos) {
            if (!pos.status) {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/');
            }
        } else {
            this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
            this.$router.push('/')
        }

        this.isLoading = true;
        if (this.$store.getters.position !== "manager") {
            this.$router.push('/');
        }

        await this.getPreoder();
        await this.setItem();
        this.isLoading = false;
        this.dialogLoading = false;
    },
    data: () => ({
        isLoading: false,
        shop : null,
        poshop: [], //รายการขายทั้่งหมด ที่ยังไม่ได้ เฉพาะบิลที่ยังไม่ได้ส่งต้นทุน
        items: [], //รายการปิดการขายสินค้าวันนี้
        dialogLoading: true,
    }),
    methods: {
        async closeShop() {
            if (this.items.length === 0) {
                this.$toast.add({ severity: 'warn', summary: "ไม่พบรายการขายสินค้า", life: 2000 });
                return false;
            }
            this.$confirm.require({
                message: 'ยืนยันการปิดการขายและสร้างใบแจ้งหนี้เพื่อส่งยอดต้นทุนนี้?',
                header: 'ปิดการขายประจำวัน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.dialogLoading = true;
                    const config = {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }

                    const data_invoice = {
                        invoice_ref: this.$store.getters.shop.shop_number + dayjs(Date.now()).format('YYMMDDHHmmss'),
                        invoice_shop_id: this.$store.getters.shop._id,
                        invoice_detail: this.items,
                        invoice_timestamp: dayjs(Date.now()).format(),
                        invoice_poshop: this.poshop
                    }

                    const invoice = await axios.post(`${process.env.VUE_APP_SHOP}invoice/shop`, data_invoice, config).catch((err) => {
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                        this.$toast.add({ severity: 'error', summary: err.response.data.message, life: 5000 });
                        this.dialogLoading = false;
                    })
                    if (invoice) {
                        for (let i = 0; i < this.poshop.length; i++) {
                            await axios.put(`${process.env.VUE_APP_SHOP}preorder/shop/${this.poshop[i]._id}`, {
                                poshop_cutoff: true,
                            }, config);
                        }

                        await this.getPreoder();
                        await this.setItem();
                        this.dialogLoading = false;
                        this.$toast.add({ severity: 'success', summary: 'ปิดการขายสำเร็จ', detail: 'ปิดการขายเรียบร้อยแล้ว กรุณาไปที่ใบแจ้งหนี้เพื่อชำระยอดต้นทุนสินค้า', life: 5000 });
                    } else {
                        this.dialogLoading = false;
                        this.$toast.add({ severity: 'error', summary: 'มีบางอย่างผิดพลาด', life: 5000 });
                    }

                    this.dialogLoading = false;
                }
            });
        },
        totalCost() {
            return this.items.reduce((sum, item) => sum + item.summary, 0);
        },
        async getPreoder() {
            await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/shop-id/${localStorage.getItem('shop_id')}`, {
                headers: {
                    'auth-token': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                this.poshop = res.data.data.filter((el) => el.poshop_status === true && el.poshop_cutoff === false);
            })
        },
        async setItem() {
            const item = [];
            let value = null;
            this.poshop.forEach(el => {
                el.poshop_detail.forEach(i => {
                    //ตรวจสอบว่าไม่ใช่สินค้าของ ร้านค้าเอง
                    if (i.product_ref.productNBA_shop_id === 'ไม่มี') {
                        const check_item = item.find((it) => it.productNBA_id === i.productShop_nba_id);
                        // console.log(i);
                        // console.log(check_item);
                        if (check_item) {
                            const position = item.findIndex((t) => t.productNBA_id === i.productShop_nba_id);
                            // console.log(position);
                            // console.log('--มีแล้ว--')
                            value = {
                                ...check_item,
                                amount: check_item.amount + i.amount,
                                summary: check_item.summary + (i.amount * i.product_ref.productNBA_cost),
                            }
                            item.splice(position, 1, value);
                        } else {
                            // console.log('--ยังไม่มี--')
                            value = {
                                productShop_barcode: i.productShop_barcode,
                                productNBA_id: i.productShop_nba_id,
                                name: i.product_ref.productNBA_name,
                                amount: i.amount,
                                cost: i.product_ref.productNBA_cost,
                                summary: i.product_ref.productNBA_cost * i.amount
                            }
                            item.push(value);
                        }
                    }
                });

            });
            this.items = item;
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