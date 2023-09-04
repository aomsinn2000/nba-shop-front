<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h2>{{ product.product_ref.productNBA_name }}</h2>
        <Chip :label="checkProductOf(product.productShop_type)" :class="colorProductOf(product.productShop_type)" />
        <div v-if="product.productShop_barcode !== ''" class="mt-2">
          <Image :src="'https://barcode.tec-it.com/barcode.ashx?data=' + product.product_ref.productNBA_barcode" width="150" />
        </div>
      </div>
      <div class="col-12 text-center">
        <Image :src="getImage(product.product_ref.productNBA_image)" width="250" :preview="true" />
      </div>
      <div class="col-12 text-center">
        <p>
          <strong>ราคา : </strong>
          {{ numberFormat(product.product_ref.productNBA_price) }} บาท
        </p>
        <p v-if="
          this.$store.getters.level === 'partner' ||
          this.$store.getters.position === 'manager'
        ">
          <strong>ต้นทุนสินค้าของร้านค้า : </strong>{{ numberFormat(product.product_ref.productNBA_cost) }} บาท
        </p>
      </div>

    </div>
    <Divider type="dashed" align="center">
      <Chip label="รายละเอียด" />
    </Divider>
    <div class="grid">
      <div class="col-12" v-html="product.product_ref.productNBA_detail"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  methods: {
    getImage(item) {
      return `https://drive.google.com/uc?export=view&id=${item}`;
    },
    checkProductOf(item) {
      if (item) {
        return "สินค้า NBA";
      } else {
        return "สินค้าทางร้าน";
      }
    },
    colorProductOf(item) {
      if (item) {
        return "bg-purple-500 text-white";
      } else {
        return "bg-blue-600 text-white";
      }
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>