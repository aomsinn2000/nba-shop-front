<template>
    <Button icon="pi pi-image" class="p-button-success" @click="openDialog()" />

    <!--Dialog Image-->
    <Dialog header="บาร์โค้ด" v-model:visible="dialog" :modal="true">
        <div id="capture" style="padding:0.1cm ; width: 5.2cm;">
            <div class="page">
                <div class="g-block">
                    <div class="g-col-12" style="background-color: indigo; padding: 10px; margin-bottom: 5px;">
                        <p style="color: white;font-weight: bold;margin: 0px; padding: 0px;">{{
                            shortName(product.product_ref.productNBA_name)
                        }}</p>
                    </div>
                    <div id="show-image" class="g-col-6" style="padding: 10px 0px 10px 10px;">
                        <img :src="genBarcode(product.productShop_barcode)" style="max-height: 55px; width: 100%;" />
                    </div>
                    <div class="g-col-6" style="padding: 0px 10px 0px 0px; margin-bottom: 0px;">
                        <p style="text-align: right;margin: 0px; padding: 0px;"><small>ราคา (บาท)</small></p>
                        <h2 style="text-align: right;margin: 0px; padding: 0px;">{{
                            numberFormat(product.product_ref.productNBA_price)
                        }} <small>.-</small></h2>
                    </div>
                </div>
            </div>
        </div>


        <template #footer>
            <Button label="ยกเลิก" @click="dialog = false" class="p-button-text p-button-danger" />
            <Button label="ดาวน์โหลด" @click="download()" icon="pi pi-download" />
        </template>
    </Dialog>
</template>

<script>
import html2canvas from "html2canvas";

export default {
    props: {
        product: Object
    },
    data: () => ({
        dialog: false,
    }),
    methods: {
        shortName(item) {
            return item.substring(0, 20) + (item.length > 20 ? '...' : '');
        },
        openDialog() {
            this.dialog = true;
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
        async download() {
            let image = "";
            const option = {
                allowTaint: true,
                useCORS: true,
                imageTimeout: 3000,
                scale: 2
            }

            await html2canvas(document.querySelector("#capture"), option).then(function (
                canvas
            ) {
                image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                //console.log("data:image/png;" + image)
            });
            let a = document.createElement("a");
            a.href = image;
            a.download = `รหัสสินค้า ${this.product.productShop_barcode}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
</script>

<style scoped>
#capture{
    width: 100%;
    position: relative;
}
.page {
    width: 5.0cm;
    height: 3.5cm;
    border: 1px solid indigo;
}

.g-block>.g-col-6 {
    display: inline-block
}

.g-col-6 {
    width: 50%
}

.g-col-12 {
    width: 100%;
}
</style>