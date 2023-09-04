<template>
  <Button  label="พิมพ์ใบเสร็จ" icon="pi pi-print" @click="print()" :class="className"/>
    
  <!-- Print -->
  <div id="printMe" style="display : none;">
        <div>

            <!-- หัวกระดาษ -->
            <div style="margin: 0; padding: 0;">
                <LogoImg :width="120" style="text-align: center;" />
                <p class="print-p"
                    style="font-weight:bold; text-align:center; margin:0; padding-bottom: 10px; padding-top:10px">
                    ใบเสร็จรับเงิน/ใบกำกับภาษี (ชั่วคราว) แบบย่อ</p>
                <p class="print-p" style="margin:0; text-align: center;">
                    บจก. เอ็นบีเอ ดิจิตอล เซอร์วิส เซ็นเตอร์ <br />
                    เลขผู้เสียภาษี 0505565006177 <br />
                    298/1 หมู่ 3 ต.สันผักหวาน อ.หางดง จ.เชียงใหม่ (สำนักงานใหญ่)
                </p>

                <br />
                <p class="print-p" style="text-align: center;">ใบเสร็จเลขที่ {{ this.order.receiptnumber }}</p>
                <p class="print-p" style="text-align: center;">ตัวแทน : {{ this.$store.getters.shop.shop_name }}</p>
                <p class="print-p" style="text-align: center;">เจ้าหน้าที่ : {{ this.$store.getters.name }} </p>
                <p class="print-p" style="text-align: center;">วันที่ {{func.datetimeFormat(this.order.timestamp)}}</p>
            </div>

            <div width="500">
                <!-- รายการ -->
                <br />
                <table border="0" style="width: 100%;" class="print-table">
                    <tr>
                        <th style="text-align:right;">ราคา</th>
                    </tr>
                </table>
                <table border="0" style="width: 100%;" class="print-table">
                    <tr v-for="item in order.product_detail" :key="item">
                        <td>x{{ item.quantity }}</td>
                        <td>
                            <p>
                                {{ item.packagename }}
                            </p>
                        </td>
                        <td style="text-align:right;">{{ func.numberDigitFormat(item.price) }}</td>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <td style="text-align:left">ราคาก่อนหักภาษี :</td>
                        <td style="text-align:right">{{ func.numberDigitFormat(order.totalprice - (order.totalprice * 7 / 107)) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left">VAT:7.00%</td>
                        <td style="text-align:right;">{{ func.numberDigitFormat((order.totalprice * 7)/ 107) }}</td>
                    </tr>
                    <tr>
                        <th style="text-align:left">ราคารวมภาษี :</th>
                        <th style="text-align:right">{{ func.numberDigitFormat(order.totalprice) }}</th>
                    </tr>
                </table>
                <!-- ยอดสุดธิ  -->
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <th style="text-align:left">ยอดสุทธิ :</th>
                        <th style="text-align:right">
                            {{ func.numberDigitFormat(order.totalprice) }}
                        </th>
                    </tr>
                    <tr>
                        <td style="text-align:left">รับเงิน :</td>
                        <td style="text-align:right">{{ func.numberDigitFormat(order.moneyreceive) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left">เงินทอน :</td>
                        <td style="text-align:right">
                            {{ func.numberDigitFormat(order.moneyreceive - order.totalprice) }}
                        </td>
                    </tr>
                </table>
                <hr class="print-hr" />
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <td style="text-align:left">Allsale :</td>
                        <td style="text-align:right"> {{ (order.totalprice) }} </td>
                    </tr>
                    <tr>
                        <td style="text-align:left">HappyPoint : </td>
                        <td style="text-align:right;"> {{ (order.totalprice) }} </td>
                    </tr>
                </table>
            </div>

            <!-- ท้ายกระดาษ -->
            <div>
                <br />
                <p class="print-p"><em><small><strong>หมายเหตุ : </strong>
                        </small>เจ้าหน้าที่ส่วนกลางจะติดต่อ เพื่อขอข้อมูลและส่งแบบเพื่อยืนยันหลังจากชิ้นงานเสร็จ
                        สอบถามเพิ่มเติมได้ที่ Line Official: @nbacs @nbasmart @nbadigital โทรสอบถามที่ 098-8321888
                        หรือติดต่อร้านค้าที่ท่านทำรายการ</em></p>
                <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">
                    ***ขอบพระคุณที่ใช้บริการ***</p>
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
import func from '@/service/function'
export default {
    setup(){
        return {func}
    },
    components: {
        LogoImg,
        EndOfReceipt
    },
    props: {
        order: Object,
        className: String
    },
    methods : {
        print() {
            const divContents = document.getElementById("printMe").innerHTML;
            const a = window.open();
            const css = `<style>
      *{font-family:"Sarabun";}
      .print-h{font-size: 14px}
      .print-p{font-size : 10px; margin: 0; padding: 0;}
      .print-table{font-size: 10px;}
      .print-hr{border:0.2px solid lightgray}
      </style>`;
            a.document.write('<html>');
            a.document.write("<link href='https://fonts.googleapis.com/css?family=Sarabun' rel='stylesheet'>")
            a.document.write(css)
            a.document.write(`<title>ใบเสร็จเลขที่ ${this.order.receiptnumber}</title>`)
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
    }

}
</script>

<style>

</style>