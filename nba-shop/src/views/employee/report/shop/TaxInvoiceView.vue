<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1>ใบกำกับภาษี</h1>
                <p>เลขที่ : {{ poshopf.poshopf_ref_full }}</p>
            </div>
        </div>
        <div class="grid">
            <div class="col-6">
                <Button label="ย้อนกลับ" class="p-button-secondary" icon="pi pi-angle-left" @click="back()" />
            </div>
            <div class="col-6 text-right">
                <Button @click="print()" label="พิมพ์" class="p-button-secondary p-button-outlined"
                    icon="pi pi-print" />
            </div>
        </div>

        <div class="grid">
            <div class="col-12 lg:col-6">
                <Panel header="เกี่ยวกับลูกค้า">
                    <p class="mt-0 mb-2"><strong>ลูกค้า <small>/Customer</small> : </strong>{{
                            poshopf.poshopf_customer_name
                    }}</p>
                    <p class="mt-0 mb-2"><strong>ที่อยู่ <small>/Address</small> : </strong>{{
                            poshopf.poshopf_customer_address
                    }}</p>
                    <p class="mt-0 mb-2"><strong>เลขผู้เสียภาษี <small>/Tax ID</small> : </strong>{{
                            poshopf.poshopf_customer_number
                    }}</p>
                    <p class="mt-0 mb-2"><strong>เบอร์โทร <small>/Tel</small> : </strong>{{
                            poshopf.poshopf_customer_phone
                    }}</p>
                    <Button label="แก้ไขข้อมูลลูกค้า" icon="pi pi-pencil" class="p-button-sm" @click="editCustomer()" />
                </Panel>
            </div>
            <div class="col-12 lg:col-6">
                <Panel header="ข้อมูลอ้างอิง">
                    <p class="mt-0 mb-2"><strong>เลขที่ <small>/No.</small> : </strong>{{ poshopf.poshopf_ref_full }}
                    </p>
                    <p class="mt-0 mb-2"><strong>วันที่ออก <small>/Issue</small> :</strong> {{ dateFormat(Date.now()) }}
                    </p>
                    <p class="mt-0 mb-2"><strong>อ้างอิง <small>/Ref.</small> : </strong> {{ poshopf.poshopf_ref_short
                    }}</p>
                    <p class="mt-0 mb-2 text-gray-500"><small><em><strong>วันที่สร้าง/แก้ไขล่าสุด :
                                </strong>{{ dateTimeFormat(poshopf.poshopf_timestamp) }}</em></small></p>
                    <p class="mt-0 mb-2 text-gray-500"><small><em><strong>พนักงานทำรายการล่าสุด :
                                </strong>{{ poshopf.poshopf_employee }}</em></small></p>
                </Panel>
            </div>
            <div class="col-12">
                <Panel header="รายละเอียดสั่งซื้อ">
                    <DataTable :value="poshopf.poshopf_detail">
                        <Column header="รายการ">
                            <template #body="item">
                                {{ item.data.product_ref.productNBA_name }}
                            </template>
                        </Column>
                        <Column header="ราคา/หน่วย" style="width:10%">
                            <template #body="item">
                                {{ numberFormatDigit(item.data.product_ref.productNBA_price) }}
                            </template>
                        </Column>

                        <Column header="จำนวน" style="width: 10%">
                            <template #body="item">
                                {{ numberFormat(item.data.amount) }}
                            </template>
                        </Column>
                        <Column header="ภาษีมูลค่าเพิ่ม (7%)" style="width: 15%;">
                            <template #body="item">
                                {{ numberFormat(checkVat(item.data)) }}
                            </template>
                        </Column>
                        <Column header="รวม" style="width: 15%">
                            <template #body="item">
                                {{ numberFormatDigit(item.data.total) }} {{ (checkVat(item.data) === 0 ? 'N' : '') }}
                            </template>
                        </Column>
                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="มูลค่าสินค้ารวม" :colspan="4" class="text-right"></Column>
                                <Column :footer="numberFormat(poshopf.poshopf_total)"></Column>
                            </Row>
                            <Row>
                                <Column footer="ส่วนลดทั้งหมด" :colspan="4" class="text-right" />
                                <Column :footer="numberFormatDigit(poshopf.poshopf_discount)" />
                            </Row>
                            <Row>
                                <Column footer="มูลค่าสินค้ารวมไม่เสียภาษี" :colspan="4" class="text-right" />
                                <Column :footer="numberFormatDigit(total_non_vat)" />
                            </Row>
                            <Row>
                                <Column footer="มูลค่าสินค้ารวมเสียภาษี" :colspan="4" class="text-right" />
                                <Column
                                    :footer="numberFormatDigit(total_vat)" />
                            </Row>
                            <Row>
                                <Column footer="มูลค่าสินค้าก่อนหักภาษีมูลค่าเพิ่ม" :colspan="4" class="text-right"></Column>
                                <Column :footer="numberFormatDigit((((poshopf.poshopf_total-total_non_vat)-poshopf.poshopf_discount)*100)/107)"></Column>
                            </Row>
                            <Row>
                                <Column footer="ภาษีมูลค่าเพิ่ม (7%)" :colspan="4" class="text-right" />
                                <Column :footer="numberFormatDigit((((((poshopf.poshopf_total-total_non_vat)-poshopf.poshopf_discount)*100)/107)*7)/100)" />
                            </Row>
                            <Row>
                                <Column footer="ยอดเงินที่ชำระ" :colspan="4" class="text-right" />
                                <Column :footer="numberFormatDigit(poshopf.poshopf_total)" />
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </Panel>
            </div>
        </div>
        <!-- FOR PRINT-->
        <section id="pdf-content" style="display: none;" v-if="poshopf !== null">
            <TaxInvoice :shop="shop" :poshopf="poshopf" :total_vat="total_vat" />
        </section>

        <!--dialog Customer Information-->
        <Dialog header="ข้อมูลออกใบกำกับภาษี" v-model:visible="dialogCus" :modal="true" :closable="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '35vw' }">
            <div class="grid">
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <label>นามที่ออก :</label>
                        <InputText v-model="customer.poshopf_customer_name" placeholder="ออกในนาม"
                            class="font w-full" />
                    </div>
                </div>
                <div class="col-12 lg:col-6">
                    <div class="field">
                        <label>เบอร์โทร : </label>
                        <InputText v-model="customer.poshopf_customer_phone" placeholder="เบอร์โทร" class="font w-full"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label>เลขผู้เสียภาษี :</label>
                        <InputText v-model="customer.poshopf_customer_number" placeholder="กรอกเลขผู้เสียภาษี"
                            class="font w-full"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label>ที่อยู่ :</label>
                        <Textarea v-model="customer.poshopf_customer_address" placeholder="กรอกที่อยู่"
                            class="font w-full" />
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="ยกเลิก" class="p-button-text mr-2" @click="dialogCus = false" v-if="action === 'edit'" />
                <Button label="ย้อนกลับ" class="p-button-text mr-2" icon="pi pi-angle-left" @click="back()"
                    v-if="action === 'add'" />
                <Button label="ตกลง" @click="confirmCustomer()" :loading="isLoading" v-if="action === 'add'" />
                <Button label="ตกลง" @click="updateCustomer()" :loading="isLoading" v-if="action === 'edit'" />
            </template>
        </Dialog>

        <!-- alert message-->
        <Dialog header="แจ้งเตือน" v-model:visible="dialogAlert" :modal="true" :closable="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '35vw' }">
            <div class="grid">
                <div class="col-12 text-center">
                    <p>เนื่องจากใบสั่งซื้อนี้ ถูกยกเลิกไปแล้วจึงไม่สามารถออกหรือพิมพ์ใบกำกับภาษีได้อีก</p>
                </div>
                <div class="col-12 text-center mb-0">
                    <Button @click="$router.push('/report/shop/history')" label="ตกลง" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import TaxInvoice from '@/components/employee/print/shop/TaxInvoice.vue'
import dayjs from 'dayjs'
export default {
    components: {
        TaxInvoice
    },
    async mounted() {
        const config = {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, config).then((res) => {
            this.shop = res.data.data;
            if (res.data.data.shop_status_tax !== 'จดทะเบียนภาษี') {
                this.$toast.add({ severity: 'warn', summary: 'ไม่สามารถออกใบกำกับภาษีได้', detail: 'ร้านนี้ไม่สามารถออกใบกำกับภาษีได้ เนื่องจากไม่ได้จดทะเบียนภาษี', life: 3000 });
                this.$router.push('/report/shop/history');
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/report/shop/history');
        })

        //รายการสั่งซื้อ
        const poshop = await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/${this.$route.params.poshop_id}`, config).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/report/shop/history');
        })
        this.poshop = poshop.data.data;
        if (!this.poshop.poshop_status) {
            this.dialogAlert = true;
        }

        if (poshop.data.data.poshop_ref_full !== 'ไม่มี') {
            await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop-full/shop-id/${localStorage.getItem('shop_id')}`, config).then(async (res) => {
                this.poshopf = res.data.data.find((el) => el.poshopf_ref_full === this.poshop.poshop_ref_full);
                await this.poshopf.poshopf_detail.forEach((el) => {
                    if (el.product_ref.productNBA_vat_status) {
                        this.total_vat = this.total_vat + el.total
                    }else{
                        this.total_non_vat = this.total_non_vat + el.total;
                    }
                });
                this.poshopf = {...this.poshopf, total_vat: this.total_vat, total_non_vat : this.total_non_vat};
            }).catch((err) => {
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                this.$router.push('/report/shop/history');
            })
        } else {
            this.dialogCus = true;
            this.action = 'add';
        }
        //check สถานะใบกำกับภาษีกรณีออกไปแล้ว และถูกยกเลิกใบเสร็จจึงไม่สามารถปริ้นอันเดิมได้
        document.title = "ใบกำกับภาษี " + this.poshopf.poshopf_ref_full
    },
    data: () => ({
        total_vat: 0,
        total_non_vat : 0,
        dialogAlert: false,
        dialogCus: false,
        action: 'add',
        isLoading: false,
        poshopf: [],
        poshop: [],
        shop: [],
        customer: {
            poshopf_customer_name: "",
            poshopf_customer_number: "",
            poshopf_customer_phone: "",
            poshopf_customer_address: "",
        }
    }),
    methods: {
        back() {
            window.history.back();
        },
        checkVat(item) {
            let vat = 0;
            if (item.product_ref.productNBA_vat_status) {
                vat = (item.total * 7) / 107
            } else {
                vat = 0;
            }
            return vat;
        },
        async totalVat() {
            await this.poshopf.poshopf_detail.forEach((el) => {
                if (el.product_ref.productNBA_vat_status) {
                    this.total_vat = this.total_vat + ((el.total * 7) / 107)
                }
            });
            return this.total_vat;
        },
        editCustomer() {
            this.action = 'edit';
            this.customer = {
                poshopf_customer_name: this.poshopf.poshopf_customer_name,
                poshopf_customer_number: this.poshopf.poshopf_customer_number,
                poshopf_customer_phone: this.poshopf.poshopf_customer_phone,
                poshopf_customer_address: this.poshopf.poshopf_customer_address
            }
            this.dialogCus = true;
        },
        updateCustomer() {
            if (this.customer.poshopf_customer_name === "" || this.customer.poshopf_customer_number === "" || this.customer.poshopf_customer_address === "" || this.customer.poshopf_customer_phone === "") {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลออกใบกำกับภาษีให้ครบถ้วน', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการข้อมูลลูกค้าออกใบกำกับภาษีนี้?',
                header: 'แก้ไขข้อมูลลูกค้า',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    const config = {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }
                    //data poshopf
                    const poshopf = {
                        ...this.customer,
                        poshopf_employee: this.$store.getters.name,
                        poshopf_timestamp: dayjs(Date.now()).format()
                    }
                    await axios.put(`${process.env.VUE_APP_SHOP}preorder/shop-full/${this.poshopf._id}`, poshopf, config).then(() => {
                        this.isLoading = false;
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'สร้างใบกำกับภาษีเรียบร้อยแล้ว', life: 3000 });
                        this.dialogCus = false;
                        this.poshopf = { ...this.poshopf, ...this.customer };
                    }).catch((err) => {
                        if (err.response.VUE_APP_SHOP === 408) {
                            window.location.reload();
                        }
                    })
                }
            });
        },
        confirmCustomer() {
            if (this.customer.poshopf_customer_name === "" || this.customer.poshopf_customer_number === "" || this.customer.poshopf_customer_address === "" || this.customer.poshopf_customer_phone === "") {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลออกใบกำกับภาษีให้ครบถ้วน', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการสร้างใบกับภาษีของรายการนี้?',
                header: 'สร้างใบกำกับภาษี',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    const config = {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }
                    const tax = await axios.post(`${process.env.VUE_APP_SHOP}invoice-tax/shop/full`, {
                        shop_id: this.shop._id,
                        Date: dayjs(Date.now()).format()
                    }, config)

                    //data poshopf
                    const poshopf = {
                        ...this.customer,
                        poshopf_ref_full: tax.data.invoice_full,
                        poshopf_ref_short: this.poshop.poshop_ref_short,
                        poshopf_shop_id: this.poshop.poshop_shop_id,
                        poshopf_detail: this.poshop.poshop_detail,
                        poshopf_total: this.poshop.poshop_total,
                        poshopf_type_price: this.poshop.poshop_type_price,
                        poshopf_discount: this.poshop.poshop_discount,
                        poshopf_employee: this.$store.getters.name,
                        poshopf_timestamp: dayjs(Date.now()).format()
                    }
                    const create_poshopf = await axios.post(`${process.env.VUE_APP_SHOP}preorder/shop-full`, poshopf, config).catch((err) => {
                        this.isLoading = false;
                        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                    });
                    if (create_poshopf) {
                        this.isLoading = false;
                        this.poshopf = create_poshopf.data.ponba;
                        //update poshop
                        await axios.put(`${process.env.VUE_APP_SHOP}preorder/shop/${this.poshop._id}`, {
                            poshop_ref_full: create_poshopf.data.ponba.poshopf_ref_full
                        }, config).then(() => {
                            this.isLoading = false;
                            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'สร้างใบกำกับภาษีเรียบร้อยแล้ว', life: 3000 });
                            this.dialogCus = false;
                        }).catch((err) => {
                            console.log(err);
                            this.isLoading = false;
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
                        })
                    }
                }
            });
        },
        dateFormat(date) {
            return dayjs(date).format('DD/MM/YYYY');
        },
        dateTimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss')
        },
        numberFormat(num) {
            if (num !== undefined) {
                return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

            }
        },
        numberFormatDigit(num) {
            if (num !== undefined) {
                return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

            }
        },
        print() {
            var divContents = document.getElementById("pdf-content").innerHTML;
            var a = window.open('', '', 'height=793.71, width=1122.52');
            const css = `
            <style scoped>
            .tax-invoice{
                font-family: "Sarabun";
                font-size : 14px;
            }
            @page {
            size: A4;
            margin: 0;
            }
            @media print {
                html, body {
                    width: 210mm;
                    height: 297mm;
                }
                .page {
                    margin: 0;
                    border: initial;
                    border-radius: initial;
                    width: initial;
                    min-height: initial;
                    box-shadow: initial;
                    background: initial;
                    page-break-after: always;
                }
                .table,tr, th, td{
                    margin: 0;
                    padding: 0;
                }
                
            }
            </style>
            `;

            a.document.write('<html>');
            a.document.write("<link href='https://fonts.googleapis.com/css?family=Sarabun' rel='stylesheet'>")
            a.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">')
            a.document.write(`<title>ใบเสร็จเลขที่ ${this.poshop.poshop_ref_short}</title>`)
            a.document.write(css)
            a.document.write('<body style="padding:0.3in;">');
            a.document.write(divContents);
            a.document.write('</body></html>');
            a.document.close();
            // setTimeout(() => {
            //     a.print();
            //     a.close();
            // }, 3000)
        },
    }
}
</script>

<style scoped>

</style>