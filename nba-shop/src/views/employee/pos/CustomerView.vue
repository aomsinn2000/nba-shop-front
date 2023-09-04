<template>
  <div class="grid p-2">
    <div class="col-12 p-0 mb-2">
      <div class="border-1" style="border-radius:5px;">
        <div v-if="order_total !== 0">
          <div class="grid p-0" v-if="order_change == -1">
            <div class="col-12 p-3 pb-0 pt-2">
              <div class="grid">
                <div class="col-12 p-0 pt-2 pr-3 pb-0">
                  <h1 class="text-right subtitle">ยอดที่ต้องชำระ <small v-if="order_amount !== 0">({{
                    numberFormat(order_amount) }} ชิ้น)</small></h1>
                </div>
                <div class="col-12 p-0 pr-3">
                  <h1 class="text-total text-right">
                    {{ numberDigitFormat(order_total) }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <!-- เงินทอน -->
          <div class="grid p-0" v-else>
            <div class="col-12 p-3 pb-0 pt-2">
              <div class="grid">
                <div class="col-12 p-0 pt-2 pr-2 pb-0">
                  <h1 class="text-right subtitle">เงินทอน</h1>
                </div>
              </div>
              <div class="col-12 p-0 pr-3">
                <h1 class="text-total text-right">
                  {{ numberDigitFormat(order_change) }}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="grid">
            <div class="col-12 p-3 pb-0 pt-2">
              <div class="grid">
                <div class="col-12 p-0 pr-3 pt-4">
                  <h1 class="text-total text-right" style="color: indigo">
                    <marquee-text class="text-slide"
                      :repeat="5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      ร้าน {{ shop.shop_name }} ยินดีต้อนรับ | ขอบพระคุณที่แวะมาใช้บริการ</marquee-text>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 p-0 mb-2">
      <div class="col-12 p-0 pt-2 pr-3 pb-0">
        <h1 class="text-right subtitle">ยอดที่ต้องชำระ <small v-if="order_amount !== 0">({{ numberFormat(order_amount) }}
            ชิ้น)</small></h1>
      </div>
      <div class="col-12 p-0 pr-3">
        <h1 class="text-total text-right">
          {{ $store.getters.order_list }}
        </h1>
      </div>
    </div>


    <!--Image Slide-->
    <!-- <image-slide-display /> -->
  </div>
</template>
 
<script>
// import ImageSlideDisplay from '@/components/employee/pos/ImageSlideDisplay.vue';
import axios from 'axios';
import func from '@/service/function';
export default {
  // components: { ImageSlideDisplay },
  setup() {
    return func
  },
  async mounted() {
    this.getOrderTotal();
    //get shop
    await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      this.shop = res.data.data;
    })
    this.order_total = localStorage.getItem('order_total')
    if (localStorage.getItem('order_change') !== null) {
      this.order_change = localStorage.getItem('order_change')
    }

  },
  data: () => ({
    order_total: 0,
    order_change: -1,
    order_amount: 0,
    shop: []
  }),
  methods: {
    getOrderTotal() {
      setInterval(() => {
        this.order_total = Number(localStorage.getItem('order_total'));
        this.order_change = Number(localStorage.getItem('order_change'));
        this.order_amount = Number(localStorage.getItem('order_amount'));
      }, 500)

      let windowName = "Customer Display";
      window.open('', windowName, "location=no,height=720,width=1280");
    },
  }
}
</script>

<style scoped>
.text-total {
  font-size: 90px;
}

h1,
h2,
p {
  padding: 0px;
  margin: 0px;
}

.subtitle {
  color: indigo;
}</style>