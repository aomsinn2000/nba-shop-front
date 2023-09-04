<template>
  <div>
    <DataTable :value="item_shop">
      <Column header="#" style="width: 7%">
        <template #body="item">
          <Image
            :src="
              'https://drive.google.com/uc?export=view&id=' +
              item.data.shop_logo
            "
            width="80"
          />
        </template>
      </Column>
      <Column header="รห้สร้านค้า" style="width: 10%">
        <template #body="item">
          <Chip :label="item.data.shop_number" />
        </template>
      </Column>
      <Column field="shop_name" header="ชื่อร้าน" style="width: 20%"></Column>
      <Column header="ที่อยู่" style="width: 25%">
        <template #body="item">
          {{ item.data.shop_address }}, {{ item.data.shop_district }}
          {{ item.data.shop_state }} {{ item.data.shop_province }}
          {{ item.data.shop_postcode }}
        </template>
      </Column>
      <Column header="เครดิต" style="width: 10%">
        <template #body="item">
          {{
            item.data.shop_credit.toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
          }}
        </template>
      </Column>
      <Column field="quantity" header="สถานะ" style="width: 10%">
        <template #body="item">
          <Chip
            :class="statusColor(item.data.shop_status)"
            :label="statusName(item.data.shop_status)"
          />
        </template>
      </Column>
      <Column header="ตัวเลือก">
        <template #body="item">
          <Button icon="pi pi-list" @click="$router.push('/shop/'+item.data._id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script>
import axios from "axios";
export default {
  async mounted() {
    await axios
      .get(
        `${process.env.VUE_APP_SHOP}shop/partner/${localStorage.getItem('partner_id')}`,
        {
          headers: {
            "auth-token": `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        this.shops = res.data.data;
        this.item_shop = this.shops.reverse();
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });
  },
  data: () => ({
    shops: [],
    item_shop: [],
  }),
  methods: {
    statusName(item) {
      if (item) {
        return "ออนไลน์";
      } else {
        return "ระงับใช้งาน";
      }
    },
    statusColor(item) {
      if (item) {
        return "bg-green-600 text-white";
      } else {
        return "bg-red-600 text-white";
      }
    },
  },
};
</script>