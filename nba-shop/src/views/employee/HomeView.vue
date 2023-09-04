<template>
  <div>
    <div class="grid">
      <div class="col-12  md:col-9">
        <!-- <DeclareSlide /> -->
        <div class="background-header-menu">
          <Menu />
        </div>
        
       
      </div>
      <div class="col-12 md:col-3">
        
        <Wallet class="mb-2"/>
        <Income class="mb-2"/>
        <Order />

        
        
        <!-- <img :src="getImg()" style="width: 100%;" /> -->
      </div>
     



      <div class="col-12 lg:col-3 ">
        <div class="grid">
          <div class="col-12">
            <!-- เงินในกระเป๋า -->
            <!-- <Wallet /> -->
          </div>
          <div class="col-12">
            <!-- ยอดขายประจำวัน -->
            <!-- <Income /> -->
          </div>
          <div class="col-12">
            <!-- เงินคืน -->
            <!-- <CancelOrder /> -->
          </div>
          <!-- <div class="col-12" v-if="$store.getters.position==='manager'">
            <ShopInvoice/>
          </div>
          <div class="col-12" v-if="$store.getters.position==='manager'">
            <OrderImport />
          </div> -->
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="col-12  md:col-9">
        <!-- <Menu/> -->
        <DeclareSlide class="background-header-menu"/>
      </div>
      <div class="col-12 md:col-3">
        <!-- <Order /> -->
        <img :src="getImg()" style="width: 100%;" />
      </div>
    </div>
  </div>
</template> 

<script>
import Menu from "@/components/employee/pos/Menu.vue"
import dayjs from 'dayjs'
import Wallet from '@/components/employee/home/Wallet.vue'
import DeclareSlide from '@/components/employee/more/DeclareSlide.vue'
import axios from 'axios'
// import ShopInvoice from '@/components/employee/home/ShopInvoice.vue'
// import OrderImport from '@/components/employee/home/OrderImport.vue'
import Order from '@/components/employee/home/Order.vue'
import Income from "@/components/employee/home/Income.vue"
// import CancelOrder from "@/components/employee/home/Cancelorder.vue"

export default {
  components: {
    // ChartAll,
    Menu,
    DeclareSlide,
    Wallet,
    // ShopInvoice, 
    // OrderImport,
    Order,
    Income,
    // CancelOrder,
  },

  date: () => ({
    thisYear: dayjs(Date.now()).format('DD/MM/YYYY'),

  }),
  
  async created() {
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
    })
    document.title = "NBA One Stop Shop"
  },

  methods: {
    getImg(){
      return 'https://drive.google.com/uc?export=view&id=190LLMRMEuZ2ORKmgfIB5OWhxj_03vVBT'
    }
    
  },

}

</script>

<style>
.background-header-menu .p-panel .p-panel-headervv {
    border: 1px solid #dee2e6;
    padding: 1.25rem;
    background: #c1b5fb;
    color: #343a40;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}
.test .p-panel .p-panel-header {
  background: red;
}



</style>