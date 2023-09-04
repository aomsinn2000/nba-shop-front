<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>นำเข้าสินค้าจากใบสั่งซื้อ</h1>
      </div>
    </div>
    <div class="grid">
      <div class="col-12 lg:col-4 lg:col-offset-4">
        <Panel>
          <template #header>นำเข้าใบสั่งซื้อ</template>
          <div class="grid">
            <div class="col-12">
              <div class="field">
                <InputText v-model="barcode" class="w-full font" placeholder="กรอกเลขใบสั่งซื้อ" :disabled="isDisabled"
                  @keyup.enter="checkOrder()"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
              </div>
              <div class="field">
                <Button label="ตรวจสอบใบสั่งซื้อ" :loading="isLoading" class="mr-2" v-if="barcode !== ''"
                  @click="checkOrder()" />
                <Button label="เคลียร์" @click="(barcode = ''), (isDisabled = false)" class="p-button-secondary"
                  v-if="barcode !== ''" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
    <Divider type="dashed" align="center">
      <Chip label="รายละเอียดรายการสั่งซื้อ" />
    </Divider>
    <div class="grid">
      <div class="col-12 lg:col-6 lg:col-offset-3" v-if="product_detail.length !== 0">
        <div class="col-12 text-center">
          <p><strong>เลขที่ใบสั่งซื้อ : </strong>{{ barcode }}</p>
          <Button @click="importOrder()" label="นำสินค้าเข้าสต๊อก" :loading="isLoading" class="mr-2 p-button-success"
            v-if="product_detail.length !== 0" />
        </div>

        <DataTable :value="product_detail">
          <template #empty>
            <p class="text-center m-0 p-0"><em>--ไม่มีรายการสินค้านำเข้า--</em></p>
          </template>
          <template #header>
            <strong>ทั้งหมด : </strong>
            {{ numberFormat(product_detail.length) }} รายการ
          </template>
          <Column field="productNBA_name" header="รายการ"></Column>
          <Column style="width: 20%" header="ราคา/หน่วย">
            <template #body="item">
              {{ numberFormat(item.data.productNBA_cost) }}
            </template>
          </Column>
          <Column style="width: 20%" header="จำนวน">
            <template #body="item">
              {{ numberFormat(item.data.amount) }}
            </template>
          </Column>
          <Column style="width: 20%" header="รวม">
            <template #body="item">
              {{ numberFormat(item.data.total) }}
            </template>
          </Column>

        </DataTable>
      </div>
      <div class="col-12 text-center" v-else>
        <p><em>--ไม่พบรายการในเลขใบสั่งซื้อ--</em></p>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import axios from "axios";
export default {
  async created() {
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch((err) => {
      if (err.respnse.status === 408) {
        window.location.reload();
      }
    })
    document.title = "นำสินค้าเข้าสต๊อกร้านค้า";
  },
  async mounted() {
    //check function
    try {
      const func = await this.$store.getters.shop.shop_function.find((el) => el.name === 'pos');
      if (func) {
        if (!func.status) {
          this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
          this.$router.push('/pos');
        }
      } else {
        this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
        this.$router.push('/pos')
      }
    } catch (err) {
      this.$router.push('/pos')
    }
    
    if (this.$store.getters.position !== "manager") {
      this.$router.push("/");
    }

    await axios
      .get(
        `${process.env.VUE_APP_SHOP}order/shop-id/${localStorage.getItem(
          "shop_id"
        )}`,
        {
          headers: {
            "auth-token": `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        this.orders = res.data.data;
      })
      .catch((err) => {
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
  },
  data: () => ({
    isLoading: false,
    isDisabled: false,
    orders: [],
    barcode: "",
    preorders: [],

    product_detail: [],
    order: [],
  }),
  methods: {
    async checkOrder() {
      if (this.barcode === "") {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกเลขใบสั่งซื้อ",
          life: 3000,
        });
        return false;
      }
      this.isLoading = true;

      const data_order = this.orders.find(
        (el) => el.barcode === this.barcode
      );

      
      if (!data_order) {
        this.$toast.add({ severity: "error", summary: "ผิดพลาด", detail: "ไม่พบหมายเลขใบสั่งซื้อนี้", life: 3000, });
        this.isLoading = false;
        return false;
      }

      const config = {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      };
      const order = await axios.get(`${process.env.VUE_APP_SHOP}order/${data_order._id}`, config).catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });

      if (this.getLastStatus(order.data.data.status) === 'นำเข้าสต๊อก') {
        this.$toast.add({ severity: "error", summary: "ผิดพลาด", detail: "สินค้านำเข้าสต๊อกเรียบร้อยแล้ว", life: 3000, });
        this.isLoading = false;
        return false;
      }

      // this.product_detail = data_order.product_detail;
      // this.order = data_order;
      this.isDisabled = true;
      this.isLoading = false;
      if (this.getLastStatus(order.data.data.status) === 'ระหว่างจัดส่ง') {
        this.product_detail = data_order.product_detail;
        this.order = data_order;
        this.isDisabled = true;
        this.isLoading = false;
      } else {
        this.$toast.add({ severity: "error", summary: "ผิดพลาด", detail: "ไม่สามารถนำเข้าได้ เนื่องจากสินค้าอยู่ระหว่างการจัดเตรียม", life: 3000, });
        this.isLoading = false;
        this.isDisabled = false;
        return false;
      }
    },

    getLastStatus(status) {
      return status[status.length - 1].name;
    },
    async importOrder() {
      this.isLoading = true;
      const config = {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      };
      const data_order = this.orders.find((el) => el.barcode === this.barcode);
      const order = await axios.get(`${process.env.VUE_APP_SHOP}order/${data_order._id}`, config).catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });
      if (this.getLastStatus(order.data.data.status) === 'นำเข้าสต๊อก') {
        this.isLoading = false;
        this.$toast.add({
          severity: "error",
          summary: "ผิดพลาด",
          detail:
            "ใบสั่งซื้อนี้ถูกนำเข้าสต๊อกเรียบร้อยแล้ว",
          life: 3000,
        });
        return false;
      }

      // if (this.getLastStatus(order.data.data.status) !== 'ระหว่างจัดส่ง') {
      //   this.$toast.add({ severity: "error", summary: "ผิดพลาด", detail: "ไม่สามารถนำเข้าได้ เนื่องจากสินค้าอยู่ระหว่างการจัดเตรียม", life: 3000, });
      //   this.isLoading = false;
      //   return false;
      // }

      // const position = this.orders.findIndex((el) => el.barcode === this.barcode);
      this.$confirm.require({
        message: `ต้องการเพิ่มสินค้าเข้าในสต๊อกจากเลขใบสั่งซื้อเลขที่ ${this.barcode} นี้?`,
        header: "นำเข้าสินค้าในสต๊อก",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          this.isLoading = true;
          //ดึงข้อมูลสินค้าทั้งหมดของ ร้านค้านี้
          const product_shop = await axios.get(`${process.env.VUE_APP_SHOP}product/shop/shop-id/${localStorage.getItem("shop_id")}`, config).catch((err) => {
            if (err.response.status === 408) {
              window.location.reload();
            }
            this.$toast.add({ severity: "error", summary: "ผิดพลาด", detail: err.response.data.message, life: 3000, });
          });

          this.product_detail.forEach(async (el) => {

            let value = "";
            const productNBA = await axios.get(`${process.env.VUE_APP_SHOP}product/nba/${el._id}`, config);
            //ตรวจสอบการขาย true เท่ากับ ขายเป็นลัง ด้วย false เท่ากับ ไม่ขายเป็นลัง
            if (productNBA.data.data.productNBA_pack_status) {
              const old_product = product_shop.data.data.find(
                (p) => p.productShop_nba_id === el._id
              );
              // console.log('--ขายเป็นลัง--')
              // console.log('Product Name : ' + el.productNBA_name);
              if (!old_product) {
                //ไม่มีสินค้านี้ในสต๊อกให้เพิ่มใหม่
                // console.log('--ยังไม่มีในสต๊อก--')
                // console.log(old_product);
                value = {
                  productShop_id: this.$store.getters.shop._id,
                  productShop_barcode: el.productNBA_barcode,
                  productShop_stock: el.amount,
                  productShop_type: true,
                  productShop_nba_id: el._id,
                };
                // console.log(value)
                await axios
                  .post(`${process.env.VUE_APP_SHOP}product/shop`, value, config)
                  .catch((err) => {
                    this.$toast.add({
                      severity: "error",
                      summary: "ผิดพลาด",
                      detail: err.response.data.message,
                      life: 3000,
                    });
                  });
              } else {
                //กรณีมีอยู่แล้วให้ทำการบวกสินค้าเพิ่มในสต๊อก
                // console.log('--มีในสต๊อก--')
                // console.log(old_product);
                value = {
                  productShop_id: this.$store.getters.shop._id,
                  productShop_stock: old_product.productShop_stock + el.amount,
                };
                // console.log(value)
                await axios
                  .put(
                    `${process.env.VUE_APP_SHOP}product/shop/${old_product._id}`,
                    value,
                    config
                  )
                  .catch((err) => {
                    this.$toast.add({
                      severity: "error",
                      summary: "ผิดพลาด",
                      detail: err.response.data.message,
                      life: 3000,
                    });
                  });
              }
            } else {

              // console.log('--ไม่ขายเป็นลัง')
              if (productNBA.data.data.productNBA_unit_ref.barcode === '') {
                // console.log('บาร์โค้ดไม่มี');
                const old_product = product_shop.data.data.find(
                  (p) => p.productShop_nba_id === productNBA.data.data._id
                );
                if (!old_product) {
                  //ไม่มีสินค้านี้ในสต๊อกให้เพิ่มใหม่
                  value = {
                    productShop_id: this.$store.getters.shop._id,
                    productShop_barcode: el.productNBA_barcode,
                    productShop_stock: el.amount,
                    productShop_type: true,
                    productShop_nba_id: el._id,
                  };
                  // console.log(value)
                  await axios
                    .post(`${process.env.VUE_APP_SHOP}product/shop`, value, config)
                    .catch((err) => {
                      this.$toast.add({
                        severity: "error",
                        summary: "ผิดพลาด",
                        detail: err.response.data.message,
                        life: 3000,
                      });
                    });
                } else {
                  //กรณีมีอยู่แล้วให้ทำการบวกสินค้าเพิ่มในสต๊อก
                  value = {
                    productShop_id: this.$store.getters.shop._id,
                    productShop_stock: old_product.productShop_stock + el.amount,
                  };
                  // console.log(value)
                  await axios
                    .put(
                      `${process.env.VUE_APP_SHOP}product/shop/${old_product._id}`,
                      value,
                      config
                    )
                    .catch((err) => {
                      this.$toast.add({
                        severity: "error",
                        summary: "ผิดพลาด",
                        detail: err.response.data.message,
                        life: 3000,
                      });
                    });
                }
              } else {
                // console.log('บาร์โค้ดมี')

                const productUnit = await axios.get(`${process.env.VUE_APP_SHOP}product/nba/barcode/${productNBA.data.data.productNBA_unit_ref.barcode}`, config);
                const old_product = product_shop.data.data.find(
                  (p) => p.productShop_nba_id === productUnit.data.data._id
                );
                if (productUnit) {
                  if (!old_product) {
                    //ไม่มีสินค้านี้ในสต๊อกให้เพิ่มใหม่ + กรณีไม่มีขายเป็นแพ็คหรือลัง
                    value = {
                      productShop_id: this.$store.getters.shop._id,
                      productShop_barcode: productNBA.data.data.productNBA_unit_ref.barcode,
                      productShop_stock: el.amount * productNBA.data.data.productNBA_unit_ref.amount,
                      productShop_type: true,
                      productShop_nba_id: productUnit.data.data._id,
                    };
                    await axios
                      .post(`${process.env.VUE_APP_SHOP}product/shop`, value, config)
                      .catch((err) => {
                        this.$toast.add({
                          severity: "error",
                          summary: "ผิดพลาด",
                          detail: err.response.data.message,
                          life: 3000,
                        });
                      });
                  } else {
                    //กรณีมีอยู่แล้วให้ทำการบวกสินค้าเพิ่มในสต๊อก + กรณีไม่มีขายเป็นแพ็คหรือลัง
                    value = {
                      productShop_id: this.$store.getters.shop._id,
                      productShop_stock: old_product.productShop_stock + (productNBA.data.data.productNBA_unit_ref.amount * el.amount),
                    };
                    await axios
                      .put(
                        `${process.env.VUE_APP_SHOP}product/shop/${old_product._id}`,
                        value,
                        config
                      )
                      .catch((err) => {
                        this.$toast.add({
                          severity: "error",
                          summary: "ผิดพลาด",
                          detail: err.response.data.message,
                          life: 3000,
                        });
                      });
                  }
                } else {
                  // console.log('--ไม่พบสินค้ารหัสนี้--')
                  this.$toast.add({
                    severity: "error",
                    summary: "ผิดพลาด",
                    detail: "ไม่พบรหัสสินค้านี้",
                    life: 3000,
                  });
                }
              }
            }
          });

          //update status ใบสั่งซื้อ
          const new_status = {
            name: "นำเข้าสต๊อก",
            timestamp: dayjs(Date.now()).format(),
          };
          this.order.status.push(new_status);
          const new_timestamp = this.order.status;
          const new_data = {
            status: new_timestamp,
          };

          await axios
            .put(
              `${process.env.VUE_APP_SHOP}order/${this.order._id}`,
              new_data,
              config
            )
            .then(async () => {
              //update ใน this.preorders
              const position =this.orders.findIndex((el)=>el._id===this.order._id);
              await axios.get(`${process.env.VUE_APP_SHOP}order/${this.order._id}`, {
                headers: {
                  'auth-token': `Bearer ${this.$store.getters.token}`
                }
              }).then((res) => {
                this.orders.splice(position, 1, res.data.data);
              })

              this.product_detail = []
              this.barcode = "";
              this.isDisabled = false;
              this.isLoading = false;
              this.$toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "นำเข้าสินค้าลงในสต๊อกสำเร็จ",
                life: 3000,
              });
            })
            .catch((err) => {
              this.$toast.add({
                severity: "error",
                summary: "ผิดพลาด",
                detail: err.response.data.message,
                life: 3000,
              });
            });
        },
      });
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    datetimeFormat(date) {
      return dayjs(date).format("DD/MM/YYYY เวลา HH:mm:ss");
    },
  },
};
</script>

<style>

</style>