<template>
    <div class="grid">
        <div class="col-12">
            <Button label="พิมพ์ใบเสร็จ" icon="pi pi-print" class="w-full" @click="print()" />
        </div>
    </div>

    <!-- Print -->
    <div id="printMe" style="display : none;">
        <div style="margin: 0; padding: 0;">
            <LogoImg :width="90" style="text-align: center;" />
            <p class="print-p"
                style="font-weight:bold; text-align:center; margin:0; padding-bottom: 10px; padding-top:10px">
                ใบเสร็จรับเงิน/ใบกำกับภาษี (ชั่วคราว) แบบย่อ</p>
            <p class="print-p" style="margin:0; text-align: center;">
                บจก. เอ็นบีเอ ดิจิตอล เซอร์วิส เซ็นเตอร์ <br />
                เลขผู้เสียภาษี 0505565006177 <br />
                298/1 หมู่ 3 ต.สันผักหวาน อ.หางดง จ.เชียงใหม่ (สำนักงานใหญ่)
            </p>

            <br />
            <p class="print-p" style="text-align: center;">ใบเสร็จเลขที่ {{ this.print_receipt.invoice }}</p>
            <p class="print-p" style="text-align: center;">ตัวแทน : {{ this.$store.getters.shop.shop_name }}</p>
            <p class="print-p" style="text-align: center;">เจ้าหน้าที่ : {{ this.$store.getters.name }}</p>
            <p class="print-p" style="text-align: center;">วันที่ {{ datetimeFormat(this.print_receipt.status[1].timestamp)
            }}</p>
        </div>
        <div>
            <br />
            <table border="0" style="width: 100%;" class="print-table">
                <tr>
                    <th style="text-align:right;" colspan="2">ราคา</th>
                </tr>
            </table>
            <table border="0" style="width: 100%;" class="print-table" v-if="print_receipt.parcel.length !== 0">
                <tr v-for="item in print_receipt.parcel" :key="item">
                    <td>
                        ({{ item.courier_code }})<br />
                        {{ (item.courier_tracking_code !== "") ? item.courier_tracking_code : item.tracking_code }}<br />
                        <small>({{ item.to.name }}|{{ item.to.province }} {{ item.to.postcode
                        }})</small>
                    </td>
                    <td style="text-align:right;">{{ numberFormat(item.price) }}</td>
                </tr>
            </table>

            <table border="0" style="width: 100%;" class="print-table" v-if="print_receipt.product.length !== 0">
                <tr v-for="item in print_receipt.product" :key="item">
                    <td>
                        {{ item.detail.name }}<br />
                        <small>({{ numberFormat(item.detail.price) }} x {{ numberFormat(item.amount) }})</small>
                    </td>
                    <td style="text-align:right;">{{ numberFormat(item.total) }}</td>
                </tr>
            </table>

            <hr class="print-hr" />
            <table border="0" style="width:100%" class="print-table">
                <tr>
                    <th style="text-align:left">ยอดสุทธิ :</th>
                    <th style="text-align:right">{{ numberFormat(print_receipt.total) }}
                    </th>
                </tr>
                <tr>
                    <td style="text-align:left">รับเงิน :</td>
                    <td style="text-align:right">{{ numberFormat(print_receipt.receive) }}</td>
                </tr>
                <tr>
                    <td style="text-align:left">เงินทอน :</td>
                    <td style="text-align:right">{{ numberFormat(print_receipt.receive - print_receipt.total) }}
                    </td>
                </tr>
            </table>
        </div>

        <div>
            <p class="print-p"><em><small><strong>หมายเหตุ : </strong> ใบเสร็จรับเงินนี้ไม่สามารถใช้แทนใบกำกับภาษีได้
                        หากต้องการใบเสร็จเต็มรูปแบบ กรุณาติดต่อ ... Line Official: @nbacs @nbasmart @nbadigital โทรสอบถามที่
                        098-8321888
                        หรือติดต่อร้านค้าที่ท่านทำรายการ</small></em></p>
            <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">***ขอบพระคุณที่ให้บริการ***
            </p>
            <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">
                <em>ทุกการซื้อ/บริการ....คือการแบ่งปัน</em></p>
            <br />
            <EndOfReceipt />
        </div>

    </div>
</template>

<script>
import LogoImg from '@/components/LogoBlack.vue';
import EndOfReceipt from '@/components/employee/pos/print/EndOfReceipt.vue'
import dayjs from 'dayjs';
export default {
    components: {
        LogoImg,
        EndOfReceipt
    },
    props: {
        print_receipt: Object
    },
    methods: {
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        async print() {
            const divContents = document.getElementById("printMe").innerHTML;
            const a = window.open();
            const css = `<style>
            *{font-family:"Sarabun";}
      .print-h{font-size: 16px}
      .print-p{font-size : 12px; margin: 0; padding: 0;}
      .print-table{font-size: 12px;}
      .print-hr{border:0.2px solid lightgray}
      </style>`;
            a.document.write('<html>');
            a.document.write("<link href='https://fonts.googleapis.com/css?family=Sarabun' rel='stylesheet'>")
            a.document.write(css)
            a.document.write(`<title>ใบเสร็จเลขที่ ${this.print_receipt.invoice}</title>`)
            a.document.write('<body>');
            a.document.write('<div class="page">');
            a.document.write(divContents);
            a.document.write('</div>')
            a.document.write('</body></html>');
            a.document.close();
            setTimeout(() => {
                a.print();
                a.close();
            }, 2500)
        },
        datetimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา H:m:s')
        }
    }
}
</script>

<style></style>