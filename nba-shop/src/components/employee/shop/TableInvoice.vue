<template>
  <div>
    <div class="grid">
      <div class="col-12 md:col-6">
        <Panel header="ค้นหาตามวันที่ออกใบแจ้งหนี้">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        จาก
                    </span>
                    <Calendar :showButtonBar="true"  inputClass="font" class="w-full" v-model="datestart" placeholder="เลือกวันที่เริ่มต้น" autocomplete="off" />
                </div>
                
              </div>
              <div class="col-12 md:col-6">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        ถึง
                    </span>
                    <Calendar :showButtonBar="true"  inputClass="font" class="w-full" v-model="dateend" placeholder="เลือกวันที่สิ้นสุด" autocomplete="off" />
                </div>
              </div>
              <div class="col-12">
                <Button label="ค้นหา" icon="pi pi-search" @click="searchDate()" />
              </div>
            </div>
        </Panel>
      </div>
    </div>
    <div class="grid">
      <div class="col-12 mt-2">
        <DataTable :value="item_invoice" :paginator="true" :rows="10" :loading="isLoading">
          <template #empty>
            <p class="m-0 p-0 text-center"><em>--ไม่พบใบแจ้งนี้ค้างชำระ--</em></p>
          </template>
          <Column header="เลขที่ใบแจ้งหนี้" style="width: 20%">
            <template #body="item">
              <Chip :label="item.data.invoice_ref" />
            </template>
          </Column>
          <Column header="รายการ">
            <template #body="item">{{ numberFormat(item.data.invoice_detail.length) }} รายการ</template>
          </Column>
          <Column header="ยอดชำระ">
            <template #body="item">{{ numberFormat(calTotal(item.data.invoice_detail)) }}</template>
          </Column>
          <Column header="วันที่ออกใบแจ้งหนี้">
            <template #body="item">{{ dateFormat(item.data.invoice_timestamp) }}</template>
          </Column>
          <Column header="สถานะ">
            <template #body="item">
              <Chip :label="item.data.invoice_status" :class="colorStatus(item.data.invoice_status)" />
            </template>
          </Column>
          <Column header="เพิ่มเติม">
            <template #body="item">
              <InvoiceDetail :invoice="item.data" /> &nbsp;
              <Button label="แจ้งชำระเงิน" icon="pi pi-upload" @click="openDialogPayment(item.data)" v-if="item.data.invoice_status === 'ค้างชำระ'" />
              <Button label="แจ้งชำระเงินอีกครั้ง" icon="pi pi-upload" class="p-button-outlined" @click="openDialogPayment(item.data)" v-if="item.data.invoice_status==='ยกเลิก'" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Dialog -->
    <Dialog header="อัพโหลดรูปหลักฐานการชำระเงิน" :draggable="false" :modal="true" v-model:visible="dialogUpload"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">

      <div class="grid">
        <div class="col-12 text-center">
          <div class="field" v-if="img === null">
            <Image :src="img_preview" width="150" /><br />
            <FileUpload mode="basic" :customUpload="true" :auto="true" chooseLabel="เลือกรูปภาพ" @uploader="chooseImage"
              accept="image/*" />
          </div>
          <div class="field" v-else>
            <Image :src="img_preview" width="200" :preview="true" /><br />
            <Button icon="pi pi-fw pi-trash" label="ลบ" @click="removeImage" class="p-button-danger"
              :disabled="isDisabled" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text"
          @click="dialogUpload = false, img = null, removeImage()" />
        <Button label="ตกลง" icon="pi pi-check" @click="confirmPayment()" />
      </template>
    </Dialog>

    <!-- dialog loading-->
    <Dialog class="border-0 shadow-none " :draggable="false" v-model:visible="dialogLoading" :closable="false"
      :modal="true">
      <ProgressSpinner style="width:80px;height:80px" strokeWidth="5" fill="var(--surface-ground)"
        animationDuration=".5s" aria-label="Custom ProgressSpinner" /><br />
    </Dialog>

  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import InvoiceDetail from './invoice/InvoiceDetail.vue';
export default {
  components: {
    InvoiceDetail
  },
  async mounted() {
    this.isLoading = true;
    await axios.get(`${process.env.VUE_APP_SHOP}invoice/shop/shop-id/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      this.invoices = res.data.data;
      this.item_invoice = this.invoices.reverse();
    })
    this.isLoading = false;
  },
  data: () => ({
    isLoading: false,
    invoices: [],
    item_invoice: [],
    invoice: null,
    dialogUpload: false,
    dialogLoading: false,
    isDisabled: false,
    img: null,
    img_preview: 'https://cdn-icons-png.flaticon.com/512/126/126477.png',
    img_mockup: 'https://cdn-icons-png.flaticon.com/512/126/126477.png',
    datestart :null,
    dateend : null
  }),
  methods: {
    searchDate(){
      if(this.datestart===null && this.dateend===null){
        this.item_invoice = this.invoices;
      }else{
        if(this.datestart === null || this.dateend ===null){
          this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาเลือกวันที่เริ่มต้นและวันที่สุดในการค้นหา', life: 3000});
          return false;
        }
        this.item_invoice = this.invoices.filter((el)=> this.dateFormat(el.invoice_timestamp) >= this.dateFormat(this.datestart) && this.dateFormat(el.invoice_timestamp)<=this.dateFormat(this.dateend));
      }
    },
    numberFormat(num) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    dateFormat(date) {
      return dayjs(date).format('DD/MM/YYYY');
    },
    calTotal(data) {
      const total = data.reduce((sum, d) => sum + d.summary, 0);
      return total;
    },
    colorStatus(status) {
      switch (status) {
        case 'ชำระสำเร็จ':
          return 'bg-green-600 text-white';
        case 'รอตรวจสอบ':
          return 'bg-purple-600 text-white';
        case 'ค้างชำระ':
          return 'bg-yellow-600 text-white';
        default:
          return 'bg-red-600 text-white';
      }
    },
    openDialogPayment(data) {
      this.invoice = data;
      this.dialogUpload = true;
    },
    chooseImage(event) {
      this.img = event.files[0];
      this.img_preview = event.files[0].objectURL;
    },
    removeImage() {
      this.img = null;
      this.img_preview = this.img_mockup;
    },
    confirmPayment() {
      if (this.img === null) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาแนบรูปภาพหลักฐานการชำระเงิน', life: 3000 });
        return false;
      }
      this.$confirm.require({
        message: `ยืนยันการแจ้งชำระเงินต้นทุนตามใบแจ้งหนี้เลขที่ ${this.invoice.invoice_ref} ? `,
        header: 'แจ้งชำระเงินต้นทุน',
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          this.dialogLoading = true;
          const formData = new FormData();
          formData.append('invoice_image', this.img);
          formData.append('invoice_status', 'รอตรวจสอบ');
          const pay_invoice = await axios.put(`${process.env.VUE_APP_SHOP}invoice/shop/${this.invoice._id}`, formData, {
            headers: {
              'auth-token': `Bearer ${this.$store.getters.token}`
            }
          }).catch((err) => {
            this.dialogLoading = false;
            if (err.response.status === 408) {
              window.location.reload();
            }
          });

          if (pay_invoice) {
            //แจ้งเตือนไลน์
            const line_data = {
              token: `${process.env.VUE_APP_LINE_TOKEN}`,
              message: `
แจ้งเตือนชำระเงินต้นทุน ของร้านค้า :
จากร้าน : ${this.$store.getters.shop.shop_name}
รหัสสาขา : ${this.$store.getters.shop.shop_number}
***เกี่ยวกับใบแจ้งหนี้***
เลขที่ : ${this.invoice.invoice_ref}
ราคาต้นทุน : ${this.numberFormat(this.calTotal(this.invoice.invoice_detail))}  บาท                            
                            `
            }

            await axios.post(`${process.env.VUE_APP_SHOP}line-notify`, line_data).catch((err) => {
              console.log(err);
            })
            //เรียกข้อมูลใหม่เพื่อแทนที่
            await axios.get(`${process.env.VUE_APP_SHOP}invoice/shop/${this.invoice._id}`, {
              headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
              }
            }).then((res) => {
              console.log(res);
              const position = this.item_invoice.findIndex((el) => el._id === this.invoice._id);
              this.item_invoice.splice(position, 1, res.data.data);
            })

            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แจ้งชำระเงินต้นทุนเรียบร้อยแล้ว รอการตรวจสอบจากส่วนกลาง', life: 3000 });
            this.dialogLoading = false;
            this.img = null;
            this.removeImage();
            this.dialogUpload = false;
          }
        }
      });
    }
  }

}
</script>

<style>

</style>