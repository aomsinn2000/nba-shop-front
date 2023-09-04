<template>
  <div>
    <DataTable :value="item_order" :paginator="true" :rows="20">
      <template #empty>
        <p class="m-0 p-0 text-center"><em>--ไม่มีพบรายการ--</em></p>
      </template>
      <Column header="เลขที่ใบเสร็จ" style="width: 5%">
        <template #body="item">
          <Chip :label="item.data.invoice" />
        </template>
      </Column>
      <Column header="รายการ">
        <template #body="item">
          {{ item.data.detail.productname }}
        </template>
      </Column>
      <Column header="การชำระเงิน" style="width :10%">
        <template #body="item">
          {{ numberFormat(item.data.price) }}
        </template>
      </Column>
      <Column header="เจ้าหน้าที่" style="width: 10%">
        <template #body="item">
          <Badge :value="item.data.employee" class="bg-pink-600" />
        </template>
      </Column>
      <Column header="ยอดรวม" style="width: 10%">
        <template #body="item">
          {{ numberFormat(item.data.price + item.data.charge) }}
        </template>
      </Column>
      <Column header="วันที่ทำรายการ" style="width: 15%">
        <template #body="item">
          {{ datetimeFormat(item.data.timestamp) }}
        </template>
      </Column>
      <Column header="ตัวเลือก" style="width: 27%">
        <template #body="item">
          <div class="grid">
            <div class="col-12 lg:col-6 md:col-12">
              <DetailOrder :order_cs="item.data" />
            </div>
            <div class="col-12 lg:col-6 md:col-12">
              <PrintReceipt :order_cs="item.data" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import PrintReceipt from './PrintReceipt.vue';
import DetailOrder from './DetailOrder.vue'
import axios from 'axios'
import dayjs from 'dayjs';
export default {
  components: {
    PrintReceipt, DetailOrder
  },
  async mounted() {
    this.$store.commit('setLoading', true);
    await axios.get(`${process.env.VUE_APP_SHOP}counter_service/shop-id/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      this.orders = res.data.data;
      this.item_order = this.orders.reverse();
    }).catch((err) => {
      this.$store.commit('setLoading', false)
      this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
      this.$router.push('/');
    })
    this.$store.commit('setLoading', false)
  },

  data: () => ({
    item_order: [],
    orders: [],
    search: '',
    datestart: null,
    dateend: null
  }),

  methods: {
    
    getOrderName(item) {
      switch (item.company) {
        case 'SOT':
          return item.detail.productname;
        default:
          return item.invoice
      }
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    datetimeFormat(date) {
      return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss')
    },
    dateFormat(date) {
      return dayjs(date).format('DD/MM/YYYY')
    }
  }
}
</script>

<style>

</style>