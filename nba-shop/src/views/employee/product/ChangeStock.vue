<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>ปรับสต๊อกสินค้า</h1>
        <p class="p-0 m-0 mt-3 mb-2 text-gray-600"><em><strong>อธิบาย :</strong> ใช้สำหรับปรับ กรณีต้องการแยกจาก แพ็ค
            ลัง ห่อ
            กลายเป็นการขายต่อชิ้น </em></p>
        <!-- <Message severity="warn">
          <p class="p-0 m-0"><strong>ตัวอย่าง : </strong> ต้องการแยกเบียร์หรือแกะเบียร์ออกจากกล่องเพื่อขายเป็นขวด
            <strong><u>วิธีการทำงาน : </u></strong> สแกนบาร์โค้ดลังเบียร์ใน STEP 1 และกรอกจำนวนลังที่ต้องการดึงออก
            จากนั้นสแกนบาร์โค้ดที่ขวดเบียร์ใน STEP 2 และกรอกจำนวนที่ขวดเบียร์ที่อยู่ในกล่อง
          </p>
        </Message> -->
      </div>
    </div>
    <div class="grid">
      <div class="col-12 lg:col-4 lg:col-offset-4">
        <Panel>
          <template #header>
            <p class="m-0 p-0"><strong>สแกนสินค้าที่นี่</strong></p>
          </template>
          <div class="grid">
            <div class="col-12">
              <div class="p-inputgroup">
                <InputText v-model="from.barcode" @keyup.enter="getProductFrom()" :disabled="checkFrom()"
                  placeholder="สแกนบาร์โค้ดช่องนี้" class="w-full font" />
                <Button icon="pi pi-search" class="p-button-info" @click="getProductFrom()" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
    <Dialog header="ยืนยันการปรับสต๊อกสินค้า" v-model:visible="dialogConfirm" :modal="true" :draggable="false"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
      <div class="grid">
        <div class="col-12 text-center">
          <i class="pi pi-exclamation-triangle" style="font-size: 4rem"></i>
        </div>
        <div class="col-12 text-center">
          <p class="m-0 p-0 mt-3">ต้องการปรับสต๊อกสินค้านี้</p>
          <div class="grid">
            <div class="col-12 md:col-6">
              <img style="max-width: 100px" :src="getImage(product_from_preview.productNBA_image)" />
              <Divider align="center" type="dashed">
                <Chip label="จาก" />
              </Divider>
              <p class="m-0 p-0 mt-2"><strong>บาร์โค้ด : </strong>{{ product_from_preview.productNBA_barcode }}</p>
              <p class="m-0 p-0 mt-2"><strong>ชื่อ : </strong>{{ product_from_preview.productNBA_name }}</p>
              <p class="m-0 p-0 mt-2"><strong>จำนวน : </strong>{{ numberFormat(from.amount) }}</p>
            </div>
            <div class="col-12 md:col-6">
              <img style="max-width: 100px" :src="getImage(product_to_preview.productNBA_image)" />
              <Divider align="center" type="dashed">
                <Chip label="เป็น" />
              </Divider>
              <p class="m-0 p-0 mt-2"><strong>บาร์โค้ด : </strong>{{ product_to_preview.productNBA_barcode }}</p>
              <p class="m-0 p-0 mt-2"><strong>ชื่อ : </strong>{{ product_to_preview.productNBA_name }}</p>
              <p class="m-0 p-0 mt-2"><strong>จำนวน : </strong>{{ numberFormat(to.amount) }}</p>
            </div>
            <div class="col-12">
              <p><em><strong>หมายเหตุ : </strong> สต๊อกสินค้าจะถูกปรับเปลี่ยนและไม่สามารถแก้ข้อมูลกลับได้
                  กรุณาตรวจสอบข้อมูลและสินค้าให้ถูกต้องก่อนกด "ตกลง"</em></p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="ยกเลิก" class="p-button-text" @click="dialogConfirm = false, clearFrom(), clearTo()" />
        <Button label="ตกลง" @click="confirm()" autofocus />
      </template>
    </Dialog>

  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  async created() {
    //call me
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
    })
    document.title = "ปรับสต๊อกสินค้า"
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

    await this.getProductShop();
    //console.log(this.product_shop);
  },
  data: () => ({
    dialogConfirm: false,
    product_shop: [],
    isLoading: false,
    from: {
      product_id: "",
      barcode: "",
      amount: null
    },
    to: {
      product_id: "",
      barcode: "",
      amount: null
    },
    product_from_preview: null,
    product_to_preview: null,
  }),
  methods: {
    clearFrom() {
      this.from.product_id = "";
      this.from.barcode = "";
      this.product_from_preview = null;
    },
    clearTo() {
      this.to.product_id = "";
      this.to.barcode = "";
      this.product_to_preview = null;
    },
    checkTo() {
      if (this.product_to_preview === null) {
        return false;
      } else {
        return true;
      }
    },
    checkFrom() {
      if (this.product_from_preview === null) {
        return false;
      } else {
        return true;
      }
    },
    getImage(item) {
      return 'https://drive.google.com/uc?export=view&id=' + item;
    },
    numberFormat(num) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    async getProductShop() {
      await axios.get(`${process.env.VUE_APP_SHOP}product/shop/shop-id/${localStorage.getItem('shop_id')}`, {
        headers: {
          'auth-token': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((res) => {
        this.product_shop = res.data.data;
      })

    },
    async getStockShop(barcode) {
      const product = this.product_shop.find((el) => el.productShop_barcode === barcode);
      const product_shop = await axios.get(`${process.env.VUE_APP_SHOP}product/shop/${product._id}`, {
        headers: {
          'auth-token': `Bearer ${this.$store.getters.token}`
        }
      }).catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      })
      return product_shop.data.data.productShop_stock;
    },
    async getProductFrom() {
      if (this.from.barcode === "") {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกบาร์โค้ด', life: 3000 });
        return false;
      }

      const config = {
        headers: {
          'auth-token': `Bearer ${this.$store.getters.token}`
        }
      }
      const product = this.product_shop.find((el) => el.productShop_barcode === this.from.barcode);

      if (product) {
        //check stock ปัจจุบัน
        if (await this.getStockShop(product.productShop_barcode) < 1) {
          this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'สินค้าที่ต้องการแยกในสต๊อกไม่เพียงพอ', life: 4000 });
          return false;
        }

        const product_nba = await axios.get(`${process.env.VUE_APP_SHOP}product/nba/barcode/${product.productShop_barcode}`, config).catch((err) => {
          if (err.response.status === 408) {
            window.location.reload();
          }
        })

        if (product_nba.data.data.productNBA_pack_status) {
          //ขายเป็นแพ็คและขายย่อย
          if (product_nba.data.data.productNBA_unit_ref.barcode !== '') {
            this.product_from_preview = product_nba.data.data;
            this.from.amount = 1;
            this.to.barcode = product_nba.data.data.productNBA_unit_ref.barcode;
            const product = await axios.get(`${process.env.VUE_APP_SHOP}product/nba/barcode/${this.to.barcode}`, config).catch((err) => {
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$store.commit('setLoading', false);
              this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: err.response.data.message, life: 3000 });
            });

            if (product) {
              this.product_to_preview = product.data.data;
              this.to.amount = product_nba.data.data.productNBA_unit_ref.amount;
            }

            this.openConfirmDialog();
          } else {
            this.from.barcode = '';
            this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่พบบาร์โค้ดสินค้ารายการย่อย', life: 3000 });
            return false;
          }
        } else {
          this.from.barcode = '';
          this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'สินค้านี้ไม่สามารถขายเป็นชิ้นได้', life: 3000 });
          return false;
        }
      } else {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่พบรายการสินค้าในร้านค้า', life: 3000 });
        this.from.barcode = '';
        return false;
      }
    },
    openConfirmDialog() {
      if (this.from.amount === null || this.to.amount === null) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกจำนวน', life: 3000 });
        return false;
      }
      if (this.from.amount > this.getStockShop(this.from.barcode)) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'สินค้าที่ต้องการแยกในสต๊อกไม่เพียงพอ', life: 4000 });
        return false;
      }
      this.dialogConfirm = true;
    },
    async confirm() {
      //set config API
      const config = {
        headers: {
          'auth-token': `Bearer ${this.$store.getters.token}`
        }
      }
      this.$store.commit('setLoading', true)
      //หาสินค้า step 1 เพื่อเอาลบลดสต๊อกเดิม
      const oldProduct = await this.product_shop.find((el) => el.productShop_nba_id === this.product_from_preview._id);
      const newStockAmount = oldProduct.productShop_stock - this.from.amount;
      //อัพเดตสต๊อก step 1
      // console.log('--ปรับสต๊อกต้นทาง--')
      const updateStockShop = await axios.put(`${process.env.VUE_APP_SHOP}product/shop/${oldProduct._id}`, {
        productShop_stock: newStockAmount
      }, config).catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
        this.$toast.add({ severity: 'error', summary: 'แจ้งเตือน', detail: err.response.data.message, life: 3000 });
        return false;
      })

      if (updateStockShop) {
        //หาสินค้า step 2 ว่ามีในสินค้า shop หรือป่าว ถ้ามีให้เอาไปบวกเพิ่มจากสต๊อกเดิม ถ้าไม่มีให้ให้เพิ่มใหม่
        const oldStock = await this.product_shop.find((el) => el.productShop_nba_id === this.product_to_preview._id);
        if (oldStock) {
          // console.log("อัพเดตจากสินค้าที่มีอยู่แล้ว...")
          //มีในสต๊อกร้านค้าอยู่แล้ว
          const newData = {
            productShop_stock: oldStock.productShop_stock + this.to.amount
          }
          await axios.put(`${process.env.VUE_APP_SHOP}product/shop/${oldStock._id}`, newData, config).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'แจ้งเตือน', detail: err.response.data.message, life: 3000 });
            return false;
          })
        } else {
          // console.log('สร้างสินค้าในร้านใหม่...')
          //ไม่มีในสต๊อกร้านค้า
          const data = {
            productShop_id: this.$store.getters.shop._id,
            productShop_barcode: this.product_to_preview.productNBA_barcode,
            productShop_status: true,
            productShop_stock: this.to.amount,
            productShop_type: true,
            productShop_nba_id: this.product_to_preview._id,
            productShop_vat_status: true
          }
          await axios.post(`${process.env.VUE_APP_SHOP}product/shop/`, data, config).catch((err) => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'แจ้งเตือน', detail: err.response.data.message, life: 3000 });
            return false;
          });
        }
      }

      //บันทึกลงประวัติการปรับ
      const data_history = {
        shop_id: this.$store.getters.shop._id,
        from: {
          product_id: this.product_from_preview._id,
          barcode: this.from.barcode,
          amount: this.from.amount
        },
        to: {
          product_id: this.product_to_preview._id,
          barcode: this.to.barcode,
          amount: this.to.amount
        },
        employee: this.$store.getters.name,
        status: [{
          name: 'สำเร็จ',
          timestamp: dayjs(Date.now()).format()
        }]
      }

      const create_history = await axios.post(`${process.env.VUE_APP_SHOP}product/shop/change-stock`, data_history, config).catch((err) => {
        this.$store.commit('setLoading', false);
        this.$toast.add({ severity: 'error', summary: 'แจ้งเตือน', detail: err.response.data.message, life: 3000 });
        return false;
      })

      if (create_history) {
        this.$store.commit('setLoading', false)
        this.dialogConfirm = false;
        await this.getProductShop();
        this.clearFrom();
        this.clearTo();
        this.from.amount = null;
        this.to.amount = null;
        this.$toast.add({ severity: 'success', summary: 'แจ้งเตือน', detail: "ปรับสต๊อกสินค้าเรียบร้อยแล้ว", life: 3000 });
      } else {
        this.$toast.add({ severity: 'error', summary: 'แจ้งเตือน', detail: "ปรับสต๊อกไม่สำเร็จ", life: 3000 });
      }
      this.$store.commit('setLoading', false)
    }
  }
}
</script>

<style>

</style>