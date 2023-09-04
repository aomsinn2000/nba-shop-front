<template>
  <div class="grid">
    <div class="col-12">
      <Panel>
        <template #header><i class="pi pi-shopping-cart"></i>ตะกร้าของฉัน</template>
        <div class="grid">
          <div class="col-12 lg:col-4">
            <Card class="border-1 shadow-none border-red-300 bg-red-400 text-white">
              <template #content>
                <p class="text-center p-0 m-0" style="font-size: 14px">หักเครดิตสุทธิ/บาท: </p>
                <h2 class="text-center p-0 m-0"> {{ numberFormat($store.getters.cart_total) }}</h2>

              </template>
            </Card>
          </div>
          <div class="col-12 lg:col-4">
            <Card class="border-1 shadow-none border-green-300 bg-green-400 text-white">
              <template #content>
                <p class="text-center p-0 m-0" style="font-size: 14px">สินค้า/รายการ: </p>
                <h2 class="text-center p-0 m-0"> {{ numberFormat($store.getters.cart_product.length) }}</h2>
              </template>
            </Card>
          </div>
          <div class="col-12 lg:col-4">
            <Card class="border-1 shadow-none border-purple-300 bg-purple-400 text-white">
              <template #content>
                <p class="text-center p-0 m-0" style="font-size: 14px">เครดิตที่มี/บาท: </p>
                <h2 class="text-center p-0 m-0"> {{ numberFormat(this.$store.getters.shop.shop_credit) }}</h2>
              </template>
            </Card>
          </div>
        </div>
        <div class="grid">
          <div class="col-12">
            <DataTable :value="this.$store.getters.cart_product" :paginator="true" :rows="5" :loading="isLoading">
              <template #empty>
                <p class="text-center"><em>ไม่มีสินค้าในตะกร้า</em></p>
              </template>
              <Column header="รายการ" style="width :50%">
                <template #body="item">
                  {{ item.data.productNBA_name }}
                </template>
              </Column>
              <Column header="จำนวน" style="width: 15%">
                <template #body="item">
                  {{ numberFormat(item.data.amount) }}
                </template>
              </Column>
              <Column header="รวม" style="width: 15%">
                <template #body="item">
                  {{ numberFormat(item.data.total) }}
                </template>
              </Column>
              <Column header="ตัวเลือก" style="width: 20%">
                <template #body="item">
                  <Button class="p-button-sm mr-1" @click="openDialogAmount(item.data)">
                    <i class="pi pi-pencil"></i>
                  </Button>
                  <Button class="p-button-sm p-button-danger" @click="delProduct(item.data)">
                    <i class="pi pi-trash"></i>
                  </Button>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <Button class="w-full" icon="pi pi-send" label="ส่งรายการสั่งซื้อ (Pre-Order)"
          v-if="this.$store.getters.cart_product.length !== 0" @click="confirmPreOrder()" :loading="isLoading" />
      </Panel>
    </div>
    <!--Dialog Amount-->
    <Dialog header="แก้ไขจำนวนสั่งซื้อ " v-model:visible="dialogAmount" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '20vw' }">
      <div class="grid">
        <div class="col-12 m-2">
          <InputNumber class="font" inputClass="w-full" v-model="amount" mode="decimal" showButtons :min="1" :max="stock"
            placeholder="กรอกจำนวนที่สั่งซื้อ" />
        </div>
      </div>
      <template #footer>
        <Button label="ยกเลิก" @click="dialogAmount = false" class="p-button-text" />
        <Button label="อัพเดต" @click="updateCart()" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
export default {
  data: () => ({
    dialogAmount: false,
    isLoading: false,
    amount: 0,
    stock: 0,
    cart: null,
  }),
  methods: {
    confirmPreOrder() {
      if (this.$store.getters.shop_credit < 0) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ยอดเครดิตของร้านค้าไม่พอที่จะสั่งสินค้านี้เข้าสต๊อก",
          life: 3000,
        });
        return false;
      }
      if (this.$store.getters.shop_shop_credit < this.$store.getters.cart_total) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ยอดเครดิตของร้านค้าไม่พอที่จะสั่งสินค้านี้เข้าสต๊อก",
          life: 3000,
        });
        return false;
      }
      this.$confirm.require({
        message: "ต้องการส่งรายการสั่งซื้อนี้?",
        header: "สั่งซื้อสินค้า",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          this.isLoading = true;
          //ดึงเอาเลขใบ PO
          const po = await axios
            .post(
              `${process.env.VUE_APP_SHOP}invoice-tax/nba/preorder`,
              {
                date: dayjs(Date.now()).format(),
              },
              {
                headers: {
                  "auth-token": `Bearer ${this.$store.getters.token}`,
                },
              }
            )
            .catch((err) => {
              this.isLoading = false;
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$toast.add({
                severity: "error",
                summary: "ผิดพลาด",
                detail: err.response.data.message,
                life: 3000,
              });
            });
          //pre order data

          const order = {
            ponba_shop_id: localStorage.getItem("shop_id"),
            ponba_number: po.data.invoice_preorder_nba,
            ponba_detail: this.$store.getters.cart_product,
            ponba_total: this.$store.getters.cart_total,
            ponba_status: "รอตรวจสอบ",
            ponba_timestamp: [
              {
                name: "รอตรวจสอบ",
                timestamp: dayjs(Date.now()).format(),
              },
            ],
          };
          //เพิ่มข้อมูลลงฐานข้อมูล
          const preorder = await axios
            .post(`${process.env.VUE_APP_SHOP}preorder/nba`, order, {
              headers: {
                "auth-token": `Bearer ${this.$store.getters.token}`,
              },
            })
            .catch((err) => {
              this.isLoading = false;
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$toast.add({
                severity: "error",
                summary: "ผิดพลาด",
                detail: err.response.data.message,
                life: 3000,
              });
            });
          //อัพเดตเครดิต
          if (preorder) {
            const new_credit = this.$store.getters.shop.shop_credit - this.$store.getters.cart_total;
            const credit = await axios
              .put(
                `${process.env.VUE_APP_SHOP}shop/${localStorage.getItem(
                  "shop_id"
                )}`,
                {
                  shop_credit: new_credit,
                },
                {
                  headers: {
                    "auth-token": `Bearer ${this.$store.getters.token}`,
                  },
                }
              )
              .catch((err) => {
                this.$toast.add({
                  severity: "error",
                  summary: "ผิดพลาด",
                  detail: err.response.data.message,
                  life: 3000,
                });
              });

            await axios.post(`${process.env.VUE_APP_SHOP}more/credit_history`, {
              shop_id: this.$store.getters.shop._id,
              name: `สั่งซื้อสินค้าเข้าร้านค้า ใบสั่งซื้อเลขที่ ${po.data.invoice_preorder_nba}`,
              type: 'เครดิตออก',
              amount: order.ponba_total,
              detail: 'ไม่มี',
              timestamp: dayjs(Date.now()).format()
            }, {
              headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
              }
            })
            if (credit) {
              //แจ้งเตือนไลน์
              const message = {
                token: process.env.VUE_APP_LINE_TOKEN,
                message: `
**สั่งซื้อสินค้า NBA **
รหัสสาขา : ${this.$store.getters.shop.shop_number}
ชื่อร้าน : ${this.$store.getters.shop.shop_name}
เลขใบสั่งซื้อ : ${order.ponba_number}
ทั้งหมด : ${this.numberFormat(order.ponba_detail.length)} รายการ
ยอดรวมหักเครดิตร้านค้า : ${this.numberFormat(order.ponba_total)} บาท
                `,
              };
              await axios
                .post(`${process.env.VUE_APP_SHOP}line-notify`, message, {
                  headers: {
                    "auth-token": `Bearer ${this.$store.getters.token}`,
                  },
                })
                .catch((err) => {
                  this.$toast.add({
                    severity: "error",
                    summary: "ผิดพลาด",
                    detail: err.response.data.message,
                    life: 3000,
                  });
                });
              this.$store.commit("setDefaultCart");
              this.$router.push('/cart/order');
              this.$toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ทำการสั่งซื้อสำเร็จ",
                life: 3000,
              });
            }
          } else {
            this.$toast.add({
              severity: "error",
              summary: "ผิดพลาด",
              detail: "ปรับเครดิตไม่สำเร็จ",
              life: 3000,
            });
          }
          this.isLoading = false;
        },
      });
      this.isLoading = false;
    },
    openDialogAmount(item) {
      this.cart = item;
      this.stock = item.productNBA_stock;
      this.amount = item.amount;
      this.dialogAmount = true;
    },
    updateCart() {
      //check empty
      if (this.amount < 0 || this.amount === null) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ขั้นต่ำการสั่งซื้อ 1 ชิ้น ขึ้นไป",
          life: 3000,
        });
        return false;
      }
      //check amount stock enough or not?
      if (this.cart.productNBA_stock < this.amount) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "สินค้าในคลังไม่เพียงพอ",
          life: 3000,
        });
        return false;
      }
      const new_data = {
        ...this.cart,
        amount: this.amount,
        total: this.cart.productNBA_cost * this.amount,
      };
      this.$store.commit("updateCart", new_data);
      this.amount = 0;
      this.dialogAmount = false;
    },
    delProduct(item) {
      this.$confirm.require({
        message: "ต้องการลบสินค้านี้ออกจากตะกร้า?",
        header: "ลบสินค้า",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: () => {
          this.$store.commit("delProductCart", item);
          this.$toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "ลบสินค้าออกจากตะกร้าสินค้าเรียบร้อย",
            life: 3000,
          });
        },
      });
    },
    numberFormat(num) {
      if (num) {
        return num.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        });
      }else{
        return 0
      }

    },
  },
};
</script>

<style></style>