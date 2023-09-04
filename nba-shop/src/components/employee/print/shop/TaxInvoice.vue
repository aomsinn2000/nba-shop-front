<template>
    <div class="tax-invoice">
        <table class="table table-borderless">
            <tr>
                <td>
                    <img :src="'https://drive.google.com/uc?export=view&id=' + this.shop.shop_logo" width="80" />
                </td>
                <td style="text-align: right;">
                    <p class="m-0">(ต้นฉบับ)</p>
                    <h2 class="m-0">ใบเสร็จรับเงิน/ใบกำกับภาษี</h2>
                </td>
            </tr>
        </table>

        <div class="container">
            <div class="row">
                <div class="col-7">
                    <table class="table table-sm table-borderless">
                        <tr>
                            <th>ผู้ออก /Issuer : </th>
                            <td>{{ shop.shop_tax_name }}</td>
                        </tr>
                        <tr>
                            <th class="left">ที่อยู่ /Address :</th>
                            <td>{{ shop.shop_tax_address }}</td>
                        </tr>
                        <tr>
                            <th>เลขที่ภาษี /Tax ID :</th>
                            <td>{{ removeDash(shop.shop_tax_number) }}</td>
                        </tr>
                    </table>
                    <hr>
                    <table class="table table-sm table-borderless" style="width: 100%">
                        <tr>
                            <th style="width: 30%">ลูกค้า /Customer : </th>
                            <td>{{ poshopf.poshopf_customer_name }}</td>
                        </tr>
                        <tr>
                            <th class="left">ที่อยู่ /Address :</th>
                            <td>{{ poshopf.poshopf_customer_address }}</td>
                        </tr>
                        <tr>
                            <th>เลขที่ภาษี/ Tax ID :</th>
                            <td>{{ poshopf.poshopf_customer_number }}</td>
                        </tr>
                        <tr>
                            <th>เบอร์โทร /Tel. :</th>
                            <td>{{ poshopf.poshopf_customer_phone }}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-5">
                    <div class="card pt-2 pl-2">
                        <table class="table table-sm table-borderless">
                            <tr>
                                <th>เลขที่ /Ref. :</th>
                                <td>{{ poshopf.poshopf_ref_full }}</td>
                            </tr>
                            <tr>
                                <th>วันที่ออกเอกสาร /Issue :</th>
                                <td>{{ dateNow(Date.now()) }}</td>
                            </tr>
                            <tr>
                                <th>อ้างอิง /Ref :</th>
                                <td>{{ poshopf.poshopf_ref_short }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <table class="table table-sm table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width:7%">#</th>
                                <th class="text-center">รายการ</th>
                                <th class="text-center" style="width:15%">ราคา/หน่วย</th>
                                <th class="text-center" style="width:10%">จำนวน</th>
                                <th class="text-center" style="width:10%">Vat 7%</th>
                                <th class="text-center" style="width:20%">รวม<small> (บาท)</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, index in poshopf.poshopf_detail" :key="item._id">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td>{{ item.product_ref.productNBA_name }}</td>
                                <td class="text-center">{{ numberFormatDigit(item.product_ref.productNBA_price) }}</td>
                                <td class="text-center">{{ numberFormat(item.amount) }}</td>
                                <td class="text-center">{{ numberFormat(checkVat(item)) }}</td>
                                <td class="text-right">{{ numberFormatDigit(item.total) }} {{ (checkVat(item) === 0 ?
                                        'N'
                                        : '')
                                }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="5" class="text-right">มูลค่าสินค้ารวม</th>
                                <td class="text-right">{{ numberFormatDigit(poshopf.poshopf_total) }}</td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-right">ส่วนลดทั้งหมด</th>
                                <td class="text-right">{{ numberFormatDigit(poshopf.poshopf_discount) }}</td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-right">มูลค่าสินค้ารวมไม่เสียภาษี</th>
                                <td class="text-right">{{ numberFormatDigit(poshopf.total_non_vat) }}</td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-right">มูลค่าสินค้ารวมเสียภาษี</th>
                                <td class="text-right">
                                    {{ numberFormat(total_vat) }}
                                </td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-right">มูลค่าสินค้าก่อนหักภาษีมูลค่าเพิ่ม</th>
                                <td class="text-right">
                                    {{ numberFormatDigit((((poshopf.poshopf_total - poshopf.total_non_vat) -
                                            poshopf.poshopf_discount) * 100) / 107)
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-right">ภาษีมูลค่าเพิ่ม (7%)</th>
                                <td class="text-right">
                                    {{ numberFormatDigit((((((poshopf.poshopf_total - poshopf.total_non_vat) -
                                            poshopf.poshopf_discount) * 100) / 107) * 7) / 100)
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>{{ thaiBath(poshopf.poshopf_total) }}</em></td>
                                <th colspan="2" class="text-right">ยอดเงินที่ชำระ <small></small></th>
                                <th class="text-right">{{ numberFormatDigit(poshopf.poshopf_total) }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        <div class="container">
            <br />
            <div class="row">
                <div class="col-7" style="border: 1px solid lightgray; padding:10px; border-radius: 5px;">
                    <p class="mb-1"><strong>ชำระด้วย :</strong></p>
                    <input type="checkbox" /> เงินสด (Cash) &nbsp;&nbsp;&nbsp; <input type="checkbox" /> เงินโอน
                    (Transfer)
                    &nbsp;&nbsp;&nbsp;<input type="checkbox" /> เช็ค (Cheque) &nbsp;&nbsp;&nbsp; <input
                        type="checkbox" /> บัตรเครดิต (Credit Card)
                    <br />
                    <br />
                    <p class="mb-1"><strong>ธนาคาร/สาขา :
                        </strong>...........................................................................................................................
                    </p>
                    <p class="mb-1"><strong>เลขที่ :
                        </strong>........................................................................<strong>วันที่
                        </strong>.......................................................</p>
                    <p class="text-center mb-1"><small>(กรณีจ่ายเป็นเช็ค
                            ใบเสร็จรับเงินจะสมบูรณ์ต่อเมื่อเก็บเงินตามเช็คได้แล้ว)</small></p>
                    <p class="mb-1"><strong>ลงชื่อ :
                        </strong>........................................................ผู้รับเงิน/เช็ค</p>
                    <p class="mb-1"><strong>วันที่ : </strong>..........................................................
                    </p>
                </div>
                <div class="col-5 text-center">
                    <p>{{ shop.shop_tax_name }}</p>
                    <br />
                    <p>.........................................................................</p>
                    <p>ผู้มีอำนาจ /Authorized Signature</p>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-12">
                    <em>
                        <p class="mb-0"><strong>หมายเหตุ : </strong></p>
                        <p class="mb-0">1. N คือ สินค้าที่ได้รับการยกเว้นภาษีมูลค่าเพิ่ม</p>
                        <p class="mb-0">2. หากพ้นกำหนดเวลา 7 วันนับจากวันที่สั่งซื้อ ทางบริษัทขอสงวนสิทธิ์ในการเปลี่ยนแลงหรือแก้ไข</p>
                    </em>
                    
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import dayjs from 'dayjs';
import THBText from 'thai-baht-text';
export default {
    props: {
        shop: Object,
        poshopf: Object,
        total_vat: Number
    },
    async mounted() {
        this.logo = "https://drive.google.com/uc?export=view&id=" + this.shop.shop_logo;
    },
    data: () => ({
        logo: "",
    }),
    methods: {
        checkVat(item) {
            let vat = 0;
            if (item.product_ref.productNBA_vat_status) {
                vat = (item.total * 7) / 107
            } else {
                vat = 0;
            }
            return vat;
        },
        thaiBath(num) {
            if (num !== undefined) {
                return THBText(num);
            }
        },
        dateNow(date) {
            return dayjs(date).format('DD/MM/YYYY')
        },
        removeDash(text) {
            if (text !== undefined) {
                return text.replace(/-/g, '');
            }
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

    }

}
</script>

<style scoped>
.tax-invoice {
    font-family: "Sarabun";
    font-size: 14px;
    width: 210mm;
}
</style>