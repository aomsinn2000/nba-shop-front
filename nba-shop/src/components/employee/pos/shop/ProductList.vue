<template>
  <div class="grid">
    <div class="col-12">
      <Panel>
        <template #header>
          <form @submit="scanBarcode" class="w-full">
            <InputText v-model="barcode" class="font w-full" placeholder="สแกนบาร์โค้ดในช่องนี้"
              :disabled="isDisabled" />
          </form>
        </template>
        <Divider type="dashed" align="center">
          <Chip label="รายการสินค้า" />
        </Divider>
        <InputText v-model="search" @keyup="searchData()" class="w-full font mb-2" placeholder="ค้นหาชื่อสินค้า" />
        <DataView :value="item_product" :paginator="true" :rows="12" :loading="isLoading">
          <template #empty>
            <p><em>--ไม่พบรายการสินค้า--</em></p>
          </template>
          <template #list="item">
            <div class="col-12 lg:col-3 md:col-4 sm:col-6">
              <div class="card">
                <div class="card-amount" v-if="$store.getters.amountProductById(item.data._id) !== 0">
                  <p v-html="$store.getters.amountProductById(item.data._id)"></p>
                  <button class="card-btn" @click="delOrder(item.data)">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
                <div @click="addOrder(item.data)">
                  <div class="card-img">
                    <img :src="getImage(item.data.product_ref.productNBA_image)" />
                  </div>
                  <div class="card-head">
                    {{ item.data.product_ref.productNBA_name }}
                  </div>
                  <div class="card-price">
                    <p>
                      <small>ราคา :</small><strong>{{
                        numberFormat(item.data.product_ref.productNBA_price)
                      }}</strong><small> บาท</small>
                    </p>
                  </div>
                  <div style="padding: 5px;">
                    <Badge :value="checkStockName(item.data.productShop_stock)"
                      :class="checkStockColor(item.data.productShop_stock)" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </Panel>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import dayjs from 'dayjs';
export default {
  async mounted() {
    this.$store.commit('setLoading', true);
    await axios
      .get(`${process.env.VUE_APP_SHOP}product/nba`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.product_nba = res.data.data;
      });

    await axios
      .get(
        `${process.env.VUE_APP_SHOP}product/shop/shop-id/${localStorage.getItem(
          "shop_id"
        )}`,
        {
          headers: {
            "auth-token": `Bearer ${this.$store.getters.token}`,
          },
        }
      )
      .then(async (res) => {
        let value = null;
        await res.data.data.forEach(el => {
          value = this.product_nba.find((e) => e._id === el.productShop_nba_id);
          if (value) {
            this.products.push({ ...el, product_ref: value })
          }
        });
        this.$store.commit('setProductShop', this.products);
        this.item_product = this.$store.getters.product_shop;
        this.isDisabled = false;
        this.isLoading = false;
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
        this.$router.push("/");
      });
      this.$store.commit('setLoading', false);
  },
  data: () => ({
    isLoading: true,
    isDisabled: true,
    products: [],
    item_product: [],
    product_nba: [],
    search: "",
    barcode: "",
  }),
  methods: {
    checkStockName(item) {
      if (item > 0) {
        return `มี ${this.numberFormat(item)} ชิ้น`
      } else {
        return "หมดสต๊อก"
      }
    },
    checkStockColor(item) {
      if (item > 0) {
        return "text-white bg-green-500"
      } else {
        return "text-white bg-red-500"
      }
    },
    delOrder(item) {
      this.$store.commit("delOrder", item);
      this.$toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบสำเร็จ",
        life: 1000,
      });
    },
    scanBarcode(evt) {
      evt.preventDefault();
      if (this.barcode === "") {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกรหัสสินค้าหรือรหัสบาร์โค้ด",
          life: 2000,
        });
        return false;
      }
      const product = this.$store.getters.product_shop.find((el) => el.productShop_barcode === this.barcode);
      if (product) {
        this.addOrder(product);
      } else {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "ไม่พบรหัสสินค้ารายการนี้",
          life: 2000,
        });
      }
      this.barcode = "";
    },
    
    addOrder(item) {
      const product = this.$store.getters.product_shop.find((el) => el._id === item._id);
      const timenow = dayjs(Date.now()).format('HH:mm:ss');

      //ตรวจสอบเวลาจำหน่ายเครื่องดื่มแอลกอฮอร์
      if (product.product_ref.productNBA_alcohol_status === true) {
        const start1 = dayjs().set('hour', 0).set('minute', 0).set('second', 0).format('HH:mm:ss')
        const end1 = dayjs().set('hour', 11).set('minute', 0).set('second', 0).format('HH:mm:ss')
        const start2 = dayjs().set('hour', 14).set('minute', 0).set('second', 0).format('HH:mm:ss')
        const end2 = dayjs().set('hour', 17).set('minute', 0).set('second', 0).format('HH:mm:ss')
        if (((timenow > start1) && (timenow < end1))||((timenow > start2) && (timenow < end2))) {
          //ในเวลา
          this.$toast.add({
            severity: "error",
            summary: "นอกเวลาจำหน่าย",
            detail: "ไม่สามารถขายสินค้าประเภทแอลกอฮอลได้ เนื่องจากอยู่นอกเวลาจำหน่าย 11.00-14.00 น. และ 17.00-24.00 น.",
            life: 5000,
          });
          return false;
        }
      }

      const amount_order = this.$store.getters.amountProductById(item._id);
      const in_stock = this.$store.getters.product_shop.find(
        (el) => el._id === item._id
      ).productShop_stock;
      if (in_stock < amount_order + 1) {
        this.$toast.add({
          severity: "error",
          summary: "ผิดพลาด",
          detail: "เนื่องจากสินค้าในสต๊อกไม่พอจำหน่าย",
          life: 1000,
        });
      } else {
        const new_data = {
          ...item,
          amount: 1,
          total: item.product_ref.productNBA_price * 1,
        };
        this.$store.commit("pushOrder", new_data);
        this.$toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "เพิ่มสินค้าสำเร็จ",
          life: 600,
        });
      }
    },
    searchData() {
      if (this.search === "") {
        this.item_product = this.$store.getters.product_shop;
      } else {
        this.item_product = this.$store.getters.product_shop.filter(
          (el) => el.product_ref.productNBA_name.search(this.search) !== -1
        );
      }
    },
    checkProductImage(item) {
      if (item.productShop_type) {
        const product = this.product_nba.find(
          (el) => el._id === item.productShop_nba_id
        );
        if (product) {
          return `https://drive.google.com/uc?export=view&id=${product.productNBA_image}`;
        } else {
          return 'https://static.thenounproject.com/png/3674270-200.png'
        }

      } else {
        return `https://drive.google.com/uc?export=view&id=${item.productShop_image}`;
      }
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    getImage(item) {
      return `https://drive.google.com/uc?export=view&id=${item}`;
    },
  },
};
</script>
  
<style scoped>
.card {
  position: relative;
  margin: 3px;
  border-radius: 5px;
  border: 1px solid rgb(167, 167, 167);
  cursor: pointer;
}

.card:active {
  transform: scale(0.9);
  transition: all 0.3s ease-in-out;
  opacity: 0.8;
}

.card-img>img {
  width: 100%;
}

.card-head {
  font-weight: bold;
  padding: 3px;
}

.card-price {
  padding: 3px;
}

.card-price>p {
  margin: 0;
}

.card-amount {
  position: absolute;
  padding: 5px;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: white;
  border-radius: 3px;
}

.card-amount>p {
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.card-btn {
  cursor: pointer;
  border: 1px solid red;
  border-radius: 3px;
  padding: 10px;
  background-color: white;
  color: red;
}

.card-btn:hover {
  color: white;
  background-color: red;
}
</style>