<template>
    <Button class="w-full" icon="pi pi-print" label="พิมพ์ใบเสร็จ" @click="print()" />

    <!-- Print -->
    <div id="printMe" style="display : none;">
        <div>
            <div style="margin: 0; padding: 0;">
                <LogoImg :width="150" style="text-align: center;" />
                <p class="print-p"
                    style="font-weight:bold; text-align:center; margin:0; padding-bottom: 10px; padding-top:10px">
                    ใบเสร็จรับเงิน (ชั่วคราว) แบบย่อ</p>
                <p class="print-p" style="margin:0; text-align: center;">
                    บจก. เอ็นบีเอ ดิจิตอล เซอร์วิส เซ็นเตอร์ <br />
                    เลขผู้เสียภาษี 0505565006177 <br />
                    298/1 หมู่ 3 ต.สันผักหวาน อ.หางดง จ.เชียงใหม่ (สำนักงานใหญ่)
                </p>

                <br />
                <p class="print-p" style="text-align: center;">ใบเสร็จเลขที่ {{ this.order_topup.invoice }}</p>
                <p class="print-p" style="text-align: center;">ตัวแทน : {{ this.$store.getters.shop.shop_name }}</p>
                <p class="print-p" style="text-align: center;">เจ้าหน้าที่ : {{ this.$store.getters.name }} </p>
                <p class="print-p" style="text-align: center;">วันที่ {{
                    datetimeFormat(this.order_topup.timestamp)
                }}</p>
            </div>
            <div>
                <br />
                <table border="0" style="width: 100%;" class="print-table">
                    <tr>
                        <th style="text-align:right;" colspan="2">ราคา</th>
                    </tr>
                </table>
                <table border="0" style="width: 100%;" class="print-table">
                    <tr>
                        <td>
                            {{ order_topup.detail.productname }} (เบอร์โทร : {{ order_topup.mobile }})
                        </td>
                        <td style="text-align:right;">{{ numberFormat(order_topup.price) }}</td>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <td style="text-align:left">ราคาก่อนหักภาษี :</td>
                        <td style="text-align:right">{{ numberFormat(order_topup.price - (order_topup.price * 0 / 107)) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left">VAT:0.00%</td>
                        <td style="text-align:right;">{{ numberFormat((order_topup.price * 0)/ 107) }}</td>
                    </tr>
                    <tr>
                        <th style="text-align:left">ราคารวมภาษี :</th>
                        <th style="text-align:right">{{ (order_topup.price) }}</th>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width: 100%;" class="print-table">
                    <tr>
                        <td>ค่าธรรมเนียม+บริการ</td>
                        <td style="text-align:right;">{{ numberFormat(order_topup.charge) }}</td>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <td style="text-align:left">ราคาก่อนหักภาษี :</td>
                        <td style="text-align:right">{{ numberFormat(order_topup.charge - (order_topup.charge * 7 / 107)) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left">VAT:7.00%</td>
                        <td style="text-align:right;">{{ numberFormat((order_topup.charge * 7)/ 107) }}</td>
                    </tr>
                    <tr>
                        <th style="text-align:left">ราคารวมภาษี :</th>
                        <th style="text-align:right">{{ (order_topup.charge) }}</th>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <th style="text-align:left">ยอดสุทธิ :</th>
                        <th style="text-align:right">{{ numberFormat(order_topup.price + order_topup.charge) }}
                        </th>
                    </tr>
                    <tr>
                        <td style="text-align:left">รับเงิน :</td>
                        <td style="text-align:right">{{ numberFormat(order_topup.receive) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left">เงินทอน :</td>
                        <td style="text-align:right">{{
                            numberFormat(order_topup.receive - (order_topup.price +
                                order_topup.charge))
                        }}
                        </td>
                    </tr>
                </table>
            </div>

            <div>
                <br />
                <p class="print-p"><em><small><strong>หมายเหตุ : </strong>
                        </small> รายการหากถูกชำระเรียบร้อยแล้ว จะได้รับ SMS แจ้งเตือนตามเบอร์ที่แจ้งไว้
                        สอบถามเพิ่มเติมได้ที่ Line Official: @nbacs @nbasmart @nbadigital โทรสอบถามที่ 098-8321888
                        หรือติดต่อร้านค้าที่ท่านทำรายการ</em></p>
                <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">
                    ***ขอบพระคุณที่ให้บริการ***</p>
                <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">
                    <em>ทุกการซื้อ/บริการ....คือการแบ่งปัน</em></p>
                <br />

                <EndOfReceipt />
            </div>
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
        order_topup: Object
    },
    methods: {
        print() {
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
            a.document.write(`<title>ใบเสร็จเลขที่ ${this.order_topup.invoice}</title>`)
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
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        datetimeFormat(date) {
            return dayjs(date).format('DD/MM/YYYY เวลา H:m:s')
        }
    }
}
</script>

<style>

</style>