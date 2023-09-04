<template>
  <div class="grid">
    <div class="col-12 lg:col-6">
      <Panel>
        <template #header><i class="pi pi-list"></i>ยอดรวมสุทธิ (บาท)</template>
        <h1 class="text-total text-right">
          {{ numberFormat($store.getters.order_total) }}
        </h1>
        <div class="grid">
          <div class="col-12 lg:col-6">
            <p style="margin: 0" class="text-gray-500" v-if="show_phone !== ''">
              เบอร์โทร : {{ show_phone }}
            </p>
          </div>
          <div class="col-12 lg:col-6">
            <p style="margin: 0" class="text-right text-gray-500" v-if="this.$store.getters.order_discount !== 0">
              ส่วนลด : {{ numberFormat($store.getters.order_discount) }}
            </p>
          </div>
        </div>
      </Panel>
    </div>
    <div class="col-12 lg:col-6">
      <div class="grid">
        <div class="col-8">
          <Button @click="openPhone()" label="NBA PLATFORM" class="w-full p-button-success" />
        </div>
        <!-- <div class="col-4">
          <Button label="ส่วนลด" class="w-full p-button-secondary" :disabled="true" @click="openDiscount()" />
        </div> -->
      </div>
      <div class="grid">
        <div class="col-12 lg:col-12">
          <Button class="w-full p-button-lg" icon="pi pi-check" label="ชำระเงิน" @click="openCheckout()">
          </Button>
        </div>
      </div>

      <div class="grid">
        <div class="col-12">
          <Button label="หน้าจอสำหรับลูกค้า" icon="pi pi-external-link" class="p-button-outlined"
            @click="customerDisplay()" />
        </div>
      </div>
    </div>

    <!--dialog Phone-->
    <Dialog v-model:visible="dialogPhone" :closable="false" :modal="true" :style="{ width: '25vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
      <template #header>เบอร์โทร NBA Platform</template>
      <InputMask v-model="phone" mask="999-9999999" class="font w-full p-inputmask-lg"
        placeholder="กรอกเบอร์โทร 10 หลัก" style="font-size: 20px" />
      <template #footer>
        <Button label="ยกเลิก" class="p-button-text" @click="(dialogPhone = false), (this.phone = '')" />
        <Button label="ตกลง" @click="confirmPhone()" :loading="isLoading" />
      </template>
    </Dialog>

    <!--dialog ส่วนลด-->
    <Dialog v-model:visible="dialogDiscount" header="รหัสส่วนลด" :modal="true" :style="{ width: '20vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
      <InputText class="w-full font" placeholder="สแกนรหัสส่วนลด" />
      <template #footer>
        <Button label="ตกลง" class="w-full" />
      </template>
    </Dialog>

    <!--dialog Checkout-->
    <Dialog v-model:visible="dialogCheckout" header="ประเภทการจ่าย & ชำระเงิน" :modal="true" :style="{ width: '25vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <Dropdown v-model="poshop_type_price" placeholder="เลือกประเภทการชำระ" class="w-full" inputClass="font"
              :options="['เงินสด', 'โอนเงิน', 'บัตรเครดิต', 'อื่นๆ']" />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <InputNumber v-model="poshop_total_price" placeholder="กรอกเงินที่รับมา" inputClass="font input-recieve"
              class="w-full" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" @keyup.enter="checkout()" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <Button label="รับเงิน (Enter)" class="p-button-lg w-full" @click="checkout()" :loading="isLoading" />
            </div>
          </div>
        </div>
      </template>
    </Dialog>

    <!--dialog แสดงเงินทอน-->
    <Dialog :aria-current="true" v-model:visible="dialogChange" header="เงินทอน" :modal="true" :closable="false"
      :style="{ width: '25vw' }" :breakpoints="{ '960px': '75vw', '640px': '100vw' }">
      <div class="grid">
        <div class="col-12">
          <Card class="border-1 shadow-none border-gray-400" style="padding: 0">
            <template #content>
              <h1 class="text-right" style="margin: 0; font-size: 40px">
                {{ numberFormat(recieve.change) }}
              </h1>
            </template>
          </Card>
          <Button class="mt-3 w-full" label="พิมพ์ใบเสร็จ" icon="pi pi-print" @click="print()" />
          <div class="grid">
            <div class="col-12 lg:col-6 mt-2">
              <Button label="ทำรายการต่อ" icon="pi pi-sync" class="p-button-secondary p-button-outlined w-full"
                @click="reload()" />
            </div>
            <div class="col-12 lg:col-6 mt-2">
              <Button label="หน้าหลัก" class="p-button-outlined w-full" icon="pi pi-home"
                @click="closeChange(), $router.push('/')" />
            </div>
          </div>
        </div>
      </div>
    </Dialog>


    <!-- ใบเสร็จ-->
    <div id="print" style="display:none; margin: 0; padding:0;">
      <ShopReceipt :poshop="poshop" :platform="platform" :point="point" />
    </div>

  </div>
</template>

<script>

import ShopReceipt from '@/components/employee/pos/print/ShopReceipt.vue'
import axios from "axios";
import dayjs from 'dayjs';
export default {
  components: {
    ShopReceipt,
  },
  async mounted() {

    localStorage.setItem('order_change', -1);
    //product nba 
    await axios.get(`${process.env.VUE_APP_SHOP}product/nba`, {
      headers: {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).then((res) => {
      this.product_nba = res.data.data;
    }).catch((err) => {
      console.log(err);
    })
  },
  data: () => ({
    config: {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    },
    shopPrint: false,
    dialogCheckout: false,
    dialogPhone: false,
    dialogChange: false,
    dialogDiscount: false,
    isLoading: false,
    show_phone: "",
    phone: "",
    poshop_type_price: "เงินสด",
    poshop_total_price: null,
    product_nba: [],
    recieve: {
      change: 0,
    },

    //callback
    poshop: null,
    platform: null,
    point: {
      platform: 0,
      hp: 0
    }
  }),
  methods: {
    reload() {
      window.location.reload();
    },
    getPoint() {
      this.poshop.poshop_detail.forEach((el) => {
        if (el.productShop_type) {
          //สินค้าเอ็นบีเอ
          const point = this.product_nba.find((p) => p._id === el.productShop_nba_id).productNBA_profit.platform.level_owner; //ยอดคะแนนสะสม
          this.point.hp = this.point.hp + point;
        } else {
          // สินค้าของทางร้านค้าเอง
          console.log('ของร้านค้าเอง');
        }
      });
    },
    closeChange() {
      localStorage.setItem('order_change', -1)
      this.dialogChange = false;
      this.show_phone = "";
      this.phone = "";
      this.poshop_total_price = null;
      this.poshop_type_price = "เงินสด";
      this.dialogCheckout = false;
      this.$store.commit('setDefaultOrder');
    },
    openCheckout() {
      if (this.$store.getters.order_total === 0) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ไม่มีสินค้าให้ชำระเงิน",
          life: 3000,
        });
        return false;
      } else {
        this.dialogCheckout = true;
      }
    },
    openPhone() {
      if (this.$store.getters.order_total === 0) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ไม่มีสินค้าให้ชำระเงิน",
          life: 3000,
        });
        return false;
      } else {
        this.dialogPhone = true;
      }
    },
    openDiscount() {
      if (this.$store.getters.order_total === 0) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ไม่มีสินค้าให้ชำระเงิน",
          life: 3000,
        });
        return false;
      } else {
        this.dialogPhone = true;
      }
    },
    async getInvoice() {
      const invoice = await axios.post(`${process.env.VUE_APP_SHOP}invoice-tax/shop/short`, {
        'shop_id': localStorage.getItem('shop_id'),
        'data': dayjs(Date.now()).format()
      }, this.config).catch((err) => {
        this.$toast.add({ severity: 'erorr', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
      })
      if (invoice) {
        return invoice.data.invoice_short;
      } else {
        return '';
      }
    },
    async getProductNBA(id) {
      const product = this.product_nba.find((el) => el._id === id);
      return product;
    },
    checkout() {
      if (this.poshop_total_price === null) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกจำนวนเงินที่รับมา",
          life: 3000,
        });
        return false;
      }
      if (this.poshop_total_price < this.$store.getters.order_total) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ยอดเงินที่รับน้อยว่ายอดสุทธิ",
          life: 3000,
        });
        return false;
      }

      this.$confirm.require({
        message: "รับเงินเรียบร้อย ยืนยันการชำระเงิน และบันทึกข้อมูล?",
        header: "ยืนยันชำระเงิน",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          this.isLoading = true;
          //เอาเลขที่ใบเสร็จ invoice.data.invoice_short
          const invoice = await this.getInvoice();
          //หาอัตราส่วนแบ่งในแต่ละชั้น
          let poshop_detail = this.$store.getters.order_product;

          let phone_number = "ไม่มี";
          if (this.show_phone !== "") {
            phone_number = this.show_phone.replace(/-/g, '');
          }
          //เพิ่มในฐานข้อมูล
          const data_product = {
            poshop_ref_short: invoice,
            poshop_shop_id: localStorage.getItem('shop_id'),
            poshop_detail: poshop_detail,
            poshop_total: this.$store.getters.order_total,
            poshop_type_price: this.poshop_type_price,
            poshop_total_price: this.poshop_total_price,
            poshop_discount: this.$store.getters.order_discount,
            poshop_timestamp: dayjs(Date.now()).format(),
            poshop_employee: this.$store.getters.name,
            poshop_phone: phone_number
          }

          // console.log(data_product);
          const checkout = await axios.post(`${process.env.VUE_APP_SHOP}preorder/shop`, data_product, this.config).catch((err) => {
            if (err.response.status === 408) {
              window.location.reload();
            }
            this.isLoading = false;
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
          })

          if (checkout) {
            //แก้ปรับสต๊อกสินค้า
            data_product.poshop_detail.forEach(async (el) => {
              let value = "";
              value = {
                ...el,
                productShop_stock: el.productShop_stock - el.amount
              }
              await axios.put(`${process.env.VUE_APP_SHOP}product/shop/${el._id}`, value, this.config).catch((err) => {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
              })
            });
            this.recieve.change = this.poshop_total_price - this.$store.getters.order_total;

            //set เงินทอนเข้า localStorage เพื่อแสดงฝั่งลูกค้า
            localStorage.setItem('order_total', 0);
            localStorage.setItem('order_change', this.recieve.change);
            if (this.show_phone !== "") {
              await axios.get(`${process.env.VUE_APP_SHOP}more/platform/member/${this.show_phone.replace(/-/g, '')}`, {
                headers: {
                  'auth-token': `${localStorage.getItem('token')}`
                }
              }).then((res) => {
                this.platform = res.data.data;
              }).catch((err) => {
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
              })
            }
            this.poshop = checkout.data.poshop;
            this.getPoint();
            this.isLoading = false;
            this.dialogChange = true;
          } else {
            this.$toast.add({ severity: 'error', summary: 'ปิดการขายไม่สำเร็จ', detail: 'เนื่องจากระบบอาจขัดข้อง กรุณาติดต่อส่วนกลาง', life: 4000 });
          }
        },
      });
    },
    async confirmPhone() {
      if (this.phone === "") {
        this.dialogPhone = false;
        this.show_phone = "";
      } else {
        this.isLoading = true;
        const tel = this.phone.replace(/-/g,'');
        await axios
          .get(
            `${process.env.VUE_APP_SHOP}more/platform/member/${tel}`,
            {
              headers: {
                "auth-token": `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          .then(() => {
            this.dialogPhone = false;
            this.isLoading = false;
            this.show_phone = this.phone;
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
            this.$toast.add({
              severity: "warn",
              summary: "ไม่พบเบอร์โทร",
              detail: "ไม่พบเบอร์ Platoform นี้",
              life: 3000,
            });
          });
      }
    },
    customerDisplay() {
      const url = "/pos/customerdisplay";
      const windowName = "Customer Display";
      window.open(url, windowName, "location=no,height=720,width=1280");
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    print() {
      var divContents = document.getElementById("print").innerHTML;
      var a = window.open('', '', 'height=720, width=800');
      const css = `<style>
      *{font-family:"Sarabun"; padding-right: 5px;}
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
      }, 3000)
    }
  },
};
</script>
<style scoped>
.text-total {
  font-size: 50px;
  margin: 0px;
}

.input-recieve {
  font-size: 25px;
  text-align: right;
  font-weight: bold;
}
</style>