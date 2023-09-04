<template>
    <div class="grid mt-3">
        <div class="col-12 text-center">
            <h1>ใบเสร็จรับเงินแบบย่อ</h1>
        </div>
        <div class="col-6">
            <Button @click="back()" label="ย้อนกลับ" class="p-button-sm p-button-secondary mr-2"
                icon="pi pi-angel-left" />
        </div>
        <div class="col-6 text-right">
            <Button @click="print()" label="พิมพ์" class="p-button-sm  p-button-secondary p-button-outlined" icon="pi pi-print" />
        </div>
    </div>
    <div class="grid mt-3">
        <div class="md:col-4 md:col-offset-4 border-1">
            <div id="print" style="font-size:none;">
                <ShopReceipt :poshop="poshop" :platform="platform" :point="point" />
            </div>
        </div>
    </div>
</template>

<script>
import ShopReceipt from '@/components/employee/pos/print/ShopReceipt.vue'
import axios from 'axios';
export default {
    components: {
        ShopReceipt
    },
    async mounted() {
        const config = {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }
        await axios.get(`${process.env.VUE_APP_SHOP}product/nba`, config).then((res) => {
            this.product_nba = res.data.data;
        })
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/${this.$route.params.poshop_id}`, config).then((res) => {
            this.poshop = res.data.data;
        });
        if (this.poshop.poshop_phone !== "ไม่มี") {
            await axios.get(`${process.env.VUE_APP_SHOP}more/platform/member/${this.poshop.poshop_phone}`, {
                headers: {
                    'auth-token': `${localStorage.getItem('token')}`
                }
            }).then((res) => {
                this.platform = res.data.data;
            })
        }
        //หาคะแนน happy point และรับเงินคืน
        this.poshop.poshop_detail.forEach(el => {
            if(el.productShop_type){
                //product nba
                const product = this.product_nba.find((p)=>p._id===el.productShop_nba_id);
                if(product){
                    this.point.hp = this.point.hp + product.productNBA_profit.platform.level_owner;
                }
            }
        });
        // this.print();
    },
    data: () => ({
        poshop: null,
        platform: null,
        point: {
            hp: 0,
            platform: 0,
        },
        product_nba: [],
    }),
    methods: {
        back(){
            window.history.back();
        },
        print() {
            var divContents = document.getElementById("print").innerHTML;
            var a = window.open('', '', 'height=720, width=800');
            const css = `<style>
            *{font-family:"Sarabun"; padding-right: 10px;}
      .print-h{font-size: 16px}
      .print-p{font-size : 12px; margin: 0; padding: 0;}
      .print-table{font-size: 12px;}
      .print-hr{border:0.2px solid lightgray}
      </style>`;
            a.document.write('<html>');
            a.document.write("<link href='https://fonts.googleapis.com/css?family=Sarabun' rel='stylesheet'>")
            a.document.write(css)
            a.document.write(`<title>ใบเสร็จเลขที่ ${this.poshop.poshop_ref_short}</title>`)
            a.document.write('<body>');
            a.document.write(divContents);
            a.document.write('</body></html>');
            a.document.close();
            setTimeout(() => {
                a.print();
                a.close();
            }, 2500)
            
        }
    }
}
</script>