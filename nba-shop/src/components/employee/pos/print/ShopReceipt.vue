<template>
    <div style="margin:0; padding:0;" v-if="poshop!==null">
        <LogoImg :width="150" style="text-align: center;" />
        <p class="print-p" style="font-weight:bold; text-align:center; margin:0; padding-bottom: 10px; padding-top:10px">ใบเสร็จรับเงินแบบย่อ</p>
        <p class="print-p" style="margin:0; text-align: center;">
            บจก. เอ็นบีเอ ดิจิตอล เซอร์วิส เซ็นเตอร์ <br/>
            เลขผู้เสียภาษี 0505565006177 <br/>
            298-298/1 หมู่ 3 ต.สันผักหวาน อ.หางดง จ.เชียงใหม่ (สำนักงานใหญ่)
        </p>
        <br/>
        <p class="print-p" style="text-align: center;">ใบเสร็จเลขที่ {{ poshop.poshop_ref_short }}</p>
        <p class="print-p" style="text-align: center;">สาขา : {{ shop.shop_number }}</p>
        <p class="print-p" style="text-align: center;">พนักงาน : {{ poshop.poshop_employee }} </p>
        <div>
            <br />
            <table border="0" style="width: 100%;" class="print-table">
                <tr>
                    <th style="text-align:right;" colspan="2">ราคา</th>
                </tr>
                <tr v-for="item in poshop.poshop_detail" :key="item">
                    <td>{{ item.product_ref.productNBA_name }}<br />
                        <small>( {{ numberFormat(item.product_ref.productNBA_price) }} x {{ item.amount.toFixed() }} )</small>
                    </td>
                    <td style="text-align:right;">{{ numberFormat(item.total) }}</td>
                </tr>
                <tr v-if="poshop.poshop_discount !== 0">
                    <td>ส่วนลด :</td>
                    <td style="text-align:right;">-{{ numberFormat(Number(poshop.poshop_discount)) }}</td>
                </tr>
            </table>
            <hr class="print-hr" />
            <table border="0" style="width:100%" class="print-table">
                <tr>
                    <th style="text-align:left">ยอดสุทธิ :</th>
                    <th style="text-align:right">{{ numberFormat(Number(poshop.poshop_total - poshop.poshop_discount))
                    }}
                    </th>
                </tr>
                <tr>
                    <td style="text-align:left">รับเงิน :</td>
                    <td style="text-align:right">{{ numberFormat(Number(poshop.poshop_total_price)) }}</td>
                </tr>
                <tr>
                    <td style="text-align:left">เงินทอน :</td>
                    <td style="text-align:right">{{ numberFormat(Number(poshop.poshop_total_price -
                            poshop.poshop_total))
                    }}
                    </td>
                </tr>
            </table>
            <hr />
            <!-- Happy point-->
            <div v-if="platform !== null">
                <p class="print-p" style="text-align: center;"><small><strong>สะสม Happy Point</strong></small></p>
                <table border="0" style="width:100%" class="print-table">
                    <tr>
                        <td>{{ platform.firstname }}</td>
                        <td style="text-align:right;">{{ platform.phone }}</td>
                    </tr>
                    <tr>
                        <td>สะสมครั้งนี้</td>
                        <td style="text-align:right">{{ numberFormat(poshop.poshop_total) }}</td>
                    </tr>
                    <tr>
                        <td>คะแนนสะสม</td>
                        <td style="text-align:right">{{ numberFormat(Number(platform.happy_point)) }}</td>
                    </tr>
                    
                </table>
                <p class="print-p"><em><small><strong>หมายเหตุ : </strong> สำหรับเงินคืน ท่านสามารถตรวจสอบได้ที่แอพพลิเคชั่น Platform ด้วยตนเอง</small></em></p>
                <hr />
            </div>
            <p class="print-p"><em><small><strong>หมายเหตุ : </strong> ใบเสร็จรับเงินนี้ไม่สามารถใช้แทนใบกำกับภาษีได้</small></em></p>
            <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;">***ขอบพระคุณที่ให้บริการ***</p>
            <p class="print-p" style="text-align: center; font-weight: bold; margin-top:5px;"><em>ทุกการซื้อของคุณ....
                    คือการแบ่งปัน</em></p>
            <br />
            <EndOfReceipt />
            <br />
            <br />
            <hr />
        </div>
    </div>
</template>

<script>
import LogoImg from '@/components/LogoBlack.vue';
import EndOfReceipt from '@/components/employee/pos/print/EndOfReceipt.vue'
import axios from 'axios';
export default {
    props: {
        poshop: Object,
        platform: Object,
        point: Object,
    },
    components: {
        LogoImg,
        EndOfReceipt
    },
    async mounted() {
        //get shop
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.shop = res.data.data;
        })
    },
    data: () => ({
        shop: [],
    }),
    methods: {
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