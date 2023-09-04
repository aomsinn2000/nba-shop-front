<template>
  <div>
    <div class="grid">
      <div class="col-12 lg:col-6">
        <span class="p-input-icon-left" style="width: 100%">
          <i class="pi pi-search" />
          <InputText
            v-model="search"
            class="font w-full"
            placeholder="ค้นหาสินค้าโดย บาร์โค้ด หรือชื่อสินค้า"
            @keyup="searchData()"
          />
        </span>
      </div>
      <div class="col-12 lg:col-3">
        <Dropdown
          v-model="product_type"
          placeholder="ประเภทสินค้าทั้งหมด"
          inputClass="font"
          class="w-full"
          :options="item_product_type"
          optionLabel="type_name"
          optionValue="_id"
          @change="searchType()"
          :showClear="true"
        />
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <DataView :value="item_product" :paginator="true" :rows="20" :loading="isLoading">
          <template #empty
            ><p><em>ไม่พบข้อมูลสินค้า</em></p></template
          >
          <template #list="item">
            <div class="col-12 md:col-3">
              <div class="product-grid-item card">
                <div class="product-grid-item-content">
                  <img
                    :src="returnImage(item.data.productNBA_image)"
                    style="width: 100%"
                  />
                  <div class="product-name">
                    {{ item.data.productNBA_name }}
                  </div>
                  <div class="product-description">
                    รหัส : {{ item.data.productNBA_barcode }}
                  </div>
                </div>
                <div class="product">
                  กำไร/ชิ้น :
                  {{ numberFormat(item.data.productNBA_price - item.data.productNBA_cost) }} บาท
                </div>
                <div class="product">
                  ราคาหน้าร้าน :
                  {{ numberFormat(item.data.productNBA_price) }} บาท
                </div>
                <div>
                  <span class="product-price"
                    ><small>ต้นทุน : </small
                    >{{ numberFormat(item.data.productNBA_cost) }}
                    <small>บาท</small></span
                  >
                </div>
                <div>
                  ประเภทสินค้า : <br />
                  <div v-for="item in item.data.productNBA_type" :key="item" class="inline">
                    <Badge :value="nameProductType(item)" class="mr-1" severity="success" ></Badge>
                  </div>
                </div>
                <div style="margin-top: 10px">
                  <Button
                    icon="pi pi-list"
                    class="w-full p-button-sm p-button-secondary font"
                    label="รายละเอียด"
                    @click="openDetail(item.data)"
                  />
                  <Button
                    icon="pi pi-cart-plus"
                    class="w-full mt-2 font"
                    label="เพิ่มในตะกร้า"
                    @click="openDialogAmount(item.data)"
                  />
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>

    <!-- Dialog เพิ่มจำนวน-->
    <Dialog
      v-model:visible="dialogAmount"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '20vw' }"
    >
      <template #header>จำนวนสั่งซื้อ</template>
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <InputNumber
              class="font"
              inputClass="w-full"
              v-model="amount"
              mode="decimal"
              showButtons
              :min="1"
              :max="stock"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          class="p-button-text"
          @click="(dialogAmount = false), (this.amount = 1)"
        />
        <Button label="ตกลง" @click="addCart()" />
      </template>
    </Dialog>

    <!-- Sidebar-->
    <Sidebar
      v-model:visible="sidebarDetail"
      class="p-sidebar-md"
      position="right"
    >
      <div class="grid">
        <div class="col-12 text-center">
          <Image :src="returnImage(this.product.productNBA_image)" width="200" :preview="true"/>
        </div>
        <div class="col-12">
          <h2>{{ this.product.productNBA_name }}</h2>
        </div>
        <Divider type="dashed">
          <b>รายละเอียด</b>
        </Divider>
        <div class="col-12" v-html="this.product.productNBA_detail"></div>
        <Divider type="dashed">
          <b>ราคา & ต้นทุน</b>
        </Divider>
        <div class="col-12">
          <p>
            <strong>ราคาต้นทุน : </strong>
            {{ this.numberFormat(this.product.productNBA_cost) }}
            <small>บาท</small>
          </p>
          <p>
            <strong>ราคาขายหน้าร้าน : </strong>{{ this.numberFormat(this.product.productNBA_price) }}
            <small>บาท</small>
          </p>
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async mounted() {
    this.isLoading = true;
    this.$store.commit('setLoading', true);
    //load product
    await axios
      .get(`${process.env.VUE_APP_SHOP}product/nba/by/credit`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.products = res.data.data.filter(
          (el) => el.productNBA_status !== false && el.productNBA_stock !== 0
        );
        this.item_product = this.products.reverse();
        this.isLoading = false;
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });
    //load product type
    await axios
      .get(`${process.env.VUE_APP_SHOP}type`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.item_product_type = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

      this.$store.commit('setLoading', false);
  },
  data: () => ({
    isLoading: false,
    sidebarDetail: false,
    products: [],
    item_product: [],
    item_product_type: [],
    product_type: null,
    search: "",
    product: {
      _id: "",
      productNBA_name: "",
      productNBA_barcode: "",
      productNBA_cost: 0,
      productNBA_detail: "",
      productNBA_price: 0,
      productNBA_profit: {
        platform: {
          level_one: 0,
          level_two: 0,
          level_tree: 0,
          level_owner: 0,
        },
        shop: 0,
      },
      productNBA_type:null,
    },
    amount: 1,
    stock: 0,
    dialogAmount: false,
  }),
  methods: {
    openDetail(item) {
      this.product = item;
      this.sidebarDetail = true;
    },
    nameProductType(item){
      const product_type = this.item_product_type.find((el)=>el._id === item);
      if(product_type){
        return product_type.type_name;
      }else{
        return 'ไม่มีประเภท'
      }      
    },
    searchType() {
      if (this.product_type === null) {
        this.item_product = this.products;
      } else {
        let item = [];
        this.item_product = this.products.forEach((el) => {
          for (let i = 0; i < el.productNBA_type.length; i++) {
            if (el.productNBA_type[i] === this.product_type) {
              item.push(el);
            }
          }
        });
        this.item_product = item;
      }
    },
    returnImage(img) {
      if (img !== "") {
        return "https://drive.google.com/uc?export=view&id=" + img;
      }
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    searchData() {
      if (this.search === "") {
        this.item_product = this.products;
      } else {
        this.item_product = this.products.filter(
          (el) =>
            el.productNBA_name.search(this.search) !== -1 ||
            el.productNBA_barcode.search(this.search) !== -1
        );
      }
    },
    openDialogAmount(item) {
      this.stock = item.productNBA_stock;
      this.product = item;
      this.dialogAmount = true;
    },
    addCart() {
      const total = this.product.productNBA_cost * this.amount;
      if(this.$store.getters.shop.shop_credit<(total+this.$store.getters.cart_total)){
        this.$toast.add({
        severity: "warn",
        summary: "เครดิตไม่เพียงพอ",
        detail: "ไม่สามารถเพิ่มสินค้าในตะกร้าได้ เนื่องจากเครดิตสั่งซื้อไม่เพียงพอ",
        life: 3000,
      });
        return false;
      }
      const product = {
        ...this.product,
        amount: this.amount,
        total: total,
      };
      this.$store.commit("pushCart", product);
      this.$toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "เพิ่มสินค้าในตะกร้าเรียบร้อยแล้ว",
        life: 3000,
      });
      this.amount = 1;
      this.dialogAmount = false;
    },
  },
};
</script>

<style scoped>
.card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.p-dropdown {
  width: 14rem;
  font-weight: normal;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.product-description {
  margin: 0 0 1rem 0;
}

.product-category-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.product-category {
  font-weight: 600;
  vertical-align: middle;
}

::v-deep(.product-list-item) {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;

  img {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-right: 2rem;
  }

  .product-list-detail {
    flex: 1 1 0;
  }

  .p-rating {
    margin: 0 0 0.5rem 0;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    align-self: flex-end;
  }

  .product-list-action {
    display: flex;
    flex-direction: column;
  }

  .p-button {
    margin-bottom: 0.5rem;
  }
}

::v-deep(.product-grid-item) {
  margin: 0.5rem;
  border: 1px solid var(--surface-border);

  .product-grid-item-top,
  .product-grid-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  img {
    margin: 2rem 0;
    max-width: 300px;
  }

  .product-grid-item-content {
    text-align: center;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

@media screen and (max-width: 576px) {
  .product-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 1rem 0;
    }

    .product-list-detail {
      text-align: center;
    }

    .product-price {
      align-self: center;
    }

    .product-list-action {
      display: flex;
      flex-direction: column;
    }

    .product-list-action {
      margin-top: 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>