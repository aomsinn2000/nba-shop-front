<template>
    <Button :loading="isLoading" label="พิมพ์บาร์โค้ดทั้งหมด"
        :badge="products.length !== 0 ? numberFormat(products.length) : ''" @click="print()" icon="pi pi-print" />
    <div id="printMe" style="display : none;" v-if="products.length !== 0">
        <div style="width: 210mm; height: 297mm;">
            <div v-for="item in products" :key="item" style="display: inline-block;padding: 1px;">
                <div style="width: 5cm;height:3.5cm; border:1px solid indigo; margin-top: 5px ;position: relative;">
                    <div style="background-color: indigo; padding:5px;">
                        <p style="color: white; padding: 0; margin: 0px"><strong>{{
                            shortName(item.product_ref.productNBA_name)
                        }}</strong></p>
                    </div>
                    <div style="margin-top: 10px;">
                        <div>
                            <div style="width: 50%; display: inline-block;">
                                <div style="padding: 5px; margin-top: 5px;">
                                    <img :src="genBarcode(item.product_ref.productNBA_barcode)"
                                        style="max-height: 55px;width: 100%" />
                                </div>
                            </div>
                            <div style="width: 50%; display: inline-block;">
                                <div style="padding:5px;">
                                    <p style="text-align: right;margin: 0px; padding: 0px;"><small>ราคา (บาท)</small>
                                    </p>
                                    <h2 style="text-align: right;margin: 0px; padding: 0px;">{{
                                        numberFormat(item.product_ref.productNBA_price)
                                    }} <small>.-</small></h2>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        products: Array
    },
    data: () => ({
        //products: [],
        isLoading: false
    }),
    methods: {
        shortName(item) {
            return item.substring(0, 20) + (item.length > 20 ? '...' : '');
        },
        genBarcode(item) {
            return 'http://bwipjs-api.metafloor.com/?bcid=code128&text=' + item + '&includetext'
        },
        numberFormat(num) {
            if (num) {
                return num.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                });
            }
        },
        async print() {

            this.$confirm.require({
                message: 'เลื่อนลงข้างล่างสุดของหน้า และให้บาร์โค้ดแสดงทั้งหมดก่อน แล้วถึงจะสามารถสั่งพิมพ์ได้',
                header: 'คำแนะนำ',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'ตกลง',
                rejectLabel: 'ยกเลิก',
                accept: () => {
                    this.isLoading = true;
                    if (this.products.length === 0) {
                        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่มีสินค้าในการพิมพ์', life: 3000 });
                        this.isLoading = false;
                        return false;
                    }
                    this.isLoading = false;
                    const divContents = document.getElementById("printMe").innerHTML;
                    const a = window.open();
                    const css = `<style>
                *{font-family:"Kanit";}
            </style>`;
                    window.scrollTo(0, a.document.body.scrollHeight);
                    a.document.write('<html>');
                    a.document.write("<link href='https://fonts.googleapis.com/css?family=Kanit' rel='stylesheet'>")
                    a.document.write(css)
                    a.document.write(`<title>บาร์โค้ดสินค้าทั้งหมด</title>`)
                    a.document.write('<body>');
                    a.document.write('<div class="page">');
                    a.document.write(divContents);
                    a.document.write('</div>')
                    a.document.write('</body></html>');
                    a.document.close();
                }
            });

        },
    }
}
</script>