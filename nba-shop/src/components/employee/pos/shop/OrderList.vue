<template>
  <div class="grid">
    <div class="col-12">
      <Panel>
        <template #header>
          <p style="margin: 0">
            ทั้งหมด
            <strong>{{
              numberFormat($store.getters.order_product.length)
            }}</strong>
            รายการ
          </p>
        </template>
        <DataTable
          :value="this.$store.getters.order_product"
          :paginator="true"
          :rows="10"
        >
          <template #empty>
            <p class="text-center"><em>--ยังไม่มีรายการสั่งซื้อ--</em></p>
          </template>
          <Column header="ชื่อสินค้า">
            <template #body="item">
              {{item.data.product_ref.productNBA_name}}
            </template>
          </Column>
          <Column style="width: 15%" header="ราคา/หน่วย">
            <template #body="item">
              {{ numberFormat(item.data.product_ref.productNBA_price) }}
            </template>
          </Column>
          <Column style="width: 15%" header="จำนวน">
            <template #body="item">
              {{ numberFormat(item.data.amount) }}
            </template>
          </Column>
          <Column style="width: 15%" header="รวม">
            <template #body="item">
              <strong>{{ numberFormat(item.data.total) }}</strong>
            </template>
          </Column>
          <Column style="width: 20%" header="ตัวเลือก">
            <template #body="item">
              <Button
                @click="openDialogAmount(item.data)"
                icon="pi pi-pencil"
                class="p-button-sm p-button-outlined mr-2"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-sm p-button-outlined"
                @click="delOrder(item.data)"
              />
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>

    <!-- Dialog Edit Amount-->
    <Dialog v-model:visible="dialogAmount" :modal="true">
      <template #header>แก้ไขจำนวนสินค้า</template>
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <InputNumber
              v-model="amount"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              placeholder="กรอกจำนวนสินค้า"
              inputClass="font"
              :min="1"
              :max="inputMax"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          class="p-button-text"
          label="ยกเลิก"
          @click="dialogAmount = false"
        />
        <Button label="ตกลง" @click="updateAmount()" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async mounted() {
    await axios
      .get(`${process.env.VUE_APP_SHOP}product/shop`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.products = res.data.data;
      });
  },
  data: () => ({
    dialogAmount: false,
    amount: null,
    order: null,
    inputMax: null,
    products: [],
  }),
  methods: {
    openDialogAmount(item) {
      const product = this.products.find((el) => el._id === item._id);
      this.inputMax = product.productShop_stock;
      this.order = item;
      this.amount = item.amount;
      this.dialogAmount = true;
    },
    updateAmount() {
      if (this.amount === null) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกจำนวนสั่งซื้อสินค้า",
          life: 3000,
        });
        return false;
      }
      const new_data = {
        ...this.order,
        amount: this.amount,
        total: this.order.product_ref.productNBA_price * this.amount,
      };
      this.$store.commit("updateOrder", new_data);
      this.$toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "อัพเดตจำนวนสินค้าเรียบร้อย",
        life: 3000,
      });
      this.dialogAmount = false;
    },
    delOrder(item) {
      this.$store.commit("delOrder", item);
      this.$toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบสำเร็จ",
        life: 600,
      });
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
  },
};
</script>

<style>
</style>