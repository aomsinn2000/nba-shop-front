<template>
  <div class="grid">
    <div class="col-12 lg:col-4">
      <span class="p-input-icon-left" style="width: 100%">
        <i class="pi pi-search" />
        <InputText type="text" v-model="search" placeholder="ค้นหาสินค้าตามบาร์โค้ด หรือ ชื่อสินค้า" class="w-full font"
          @keyup="searchData()" />
      </span>
    </div>
    <div class="col-12 lg:col-8 text-right">
      <AllImageBarcode :products="selectPrint" />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <DataTable :value="item_product" :paginator="true" :rows="20" :loading="isLoading" v-model:selection="selectPrint"
        :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect"
        @row-unselect="onRowUnselect">
        <template #empty>
          <p class="text-center"><em>--ไม่พบข้อมูลสินค้า--</em></p>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column header="รหัสสินค้า" style="width: 15%">
          <template #body="item">
            <Chip :label="item.data.productShop_barcode"/>
          </template>
        </Column>
        <Column header="ชื่อสินค้า">
          <template #body="item">
            {{ item.data.product_ref.productNBA_name }}
          </template>
        </Column>
        <Column header="ราคาสินค้า (บาท)" style="width: 15%">
          <template #body="item">
            {{ numberFormat(item.data.product_ref.productNBA_price) }}
          </template>
        </Column>
        <Column header="สต๊อกคงเหลือ (ชิ้น)" style="width: 15%">
          <template #body="item">
            {{ numberFormat(item.data.productShop_stock) }}
          </template>
        </Column>
        <Column header="ตัวเลือก" style="width: 15%">
          <template #body="item">
            <Button @click="openDetail(item.data)" icon="pi pi-list" class="mr-2" />
            <ImageBarcode :product="item.data" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <!-- sidebar detail-->
  <Sidebar v-model:visible="sidebarDetail" position="right" class="p-sidebar-md" v-if="product !== null">
    <ProductDetail :product="product" />
  </Sidebar>
</template>

<script>
import ProductDetail from "@/components/employee/product/ProductDetail";
import ImageBarcode from "@/components/employee/product/ImageBarcode";
import axios from "axios";
import AllImageBarcode from './AllImageBarcode.vue';
export default {
  components: {
    ProductDetail, ImageBarcode, AllImageBarcode
  },
  created() {
    document.title = "สินค้าในสต๊อกทั้งหมด";
  },
  async mounted() {
    //โหลดสินค้า nba ทั้งหมด
    await axios.get(`${process.env.VUE_APP_SHOP}product/nba`, {
      headers: {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).then((res) => {
      this.product_nba = res.data.data;
    })
    //โหลดสินค้าใสสต๊อกของร้านค้า
    await axios
      .get(
        `${process.env.VUE_APP_SHOP}product/shop/shop-id/${localStorage.getItem("shop_id")}`,
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
            this.print_product.push({ ...value });
          }
        });
        this.item_product = this.products.reverse();
        this.isLoading = false;
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        this.$router.push('/');
        this.isLoading = false;
      });
  },
  data: () => ({
    isLoading: true,
    product_nba: [],
    products: [],
    item_product: [],
    product: null,
    sidebarDetail: true,
    search: "",
    product_cost: 0,
    print_product: [],
    selectPrint: [],
    selectAll: false
  }),
  methods: {
    searchData() {
      if (this.search === "") {
        this.item_product = this.products;
      } else {
        this.item_product = this.products.filter((el) => el.product_ref.productNBA_name.search(this.search) !== -1 || el.productShop_barcode.search(this.search) !== -1);
      }
    },
    openDetail(item) {
      this.product = item;
      this.sidebarDetail = true;
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
    onSelectAllChange(event) {
      const selectAll = event.checked;
      if (selectAll) {
        this.selectAll = true;
        this.selectPrint = this.products;
      }
      else {
        this.selectAll = false;
        this.selectPrint = [];
      }
    },
    onRowSelect() {
      this.selectAll = this.selectPrint.length === this.print_product;
      console.log(this.selectPrint)
    },
    onRowUnselect() {
      this.selectAll = false;
      console.log(this.selectPrint);
    }
  },
};
</script>