<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>เติมเงินมือถือ (Mobile Topup)</h1>
        <p class="p-0 m-0">เติมเงินมือถือทุกเครือข่าย</p>
      </div>
      <div class="col-12">
        <Message severity="warn">
          <p class="p-0 m-0"><strong>สำคัญ : </strong> กรุณาตรวจสอบเบอร์โทรและเครือข่ายให้ถูกต้องทุกครั้ง
            หากเติมเงินผิดเบอร์จะไม่สามารถดึงเงินคืนได้ ทางร้านค้าจะต้องรับผิดชอบด้วยตัวเอง
            ทางบริษัทจะไม่รับผิดชอบทุกกรณีที่ทำรายการสำเร็จเรียบร้อยแล้ว</p>
        </Message>
      </div>
    </div>
    <div class="grid">
      <div class="col-12 lg:col-5">
        <TabView>
          <TabPanel header="เติมเงินมือถือ" :disabled="checkOrder()">
            <Panel header="เลือกบริการ" v-if="!checkOrder()">
              <MobileTopupList />
            </Panel>
            <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
            </Message>
          </TabPanel>
          <TabPanel header="เติมวอลเล็ต" :disabled="checkOrder()">
            <Panel header="เลือกบริการ" v-if="!checkOrder()">
              <WalletTopupList />
            </Panel>
            <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
            </Message>
          </TabPanel>
          <TabPanel header="บัตรเติมเงิน&เติมเกมส์" :disabled="checkOrder()">
            <Panel header="เลือกบริการ" v-if="!checkOrder()">
              <CardTopupList />
            </Panel>
            <Message v-else :closable="false">มีรายการที่รอการชำระอยู่ กรุณาตรวจสอบและทำรายการให้เสร็จสิ้น...
            </Message>
          </TabPanel>
        </TabView>
      </div>

      <div class="col-12 lg:col-7">
        <div class="grid">
          <div class="col-12">
            <Checkout />
          </div>
          <div class="col-12">
            <Panel>
              <template #header>
                <p class="p-0 m-0"><strong>สินค้าทั้งหมด : </strong>{{
                  numberFormat($store.getters.order_topup.length)
                }} รายการ</p>
              </template>
              <OrderList />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import MobileTopupList from '@/components/employee/pos/mobile_topup/MobileTopupList.vue';
import Checkout from '@/components/employee/pos/mobile_topup/Checkout.vue';
import OrderList from '@/components/employee/pos/mobile_topup/OrderList.vue';
import CardTopupList from '@/components/employee/pos/mobile_topup/CardTopupList.vue';
import WalletTopupList from '@/components/employee/pos/mobile_topup/WalletTopupList.vue';
export default {
  components: {
    MobileTopupList,
    Checkout, OrderList, CardTopupList, WalletTopupList,
  },
  async created() {
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        "auth-token": `Bearer ${localStorage.getItem("token")}`,
      },
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
    })
  },
  async mounted() {
    //check function
    try {
      const mobile_topup = await this.$store.getters.shop.shop_function.find((el) => el.name === 'mobile_topup');
      if (mobile_topup) {
        if (!mobile_topup.status) {
          this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
          this.$router.push('/pos');
        }
      } else {
        this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
        this.$router.push('/pos')
      }
      document.title = "เติมเงินมือถือ & บัตรเติมเงิน"
    } catch (err) {
      this.$router.push('/pos')
    }
    localStorage.setItem('order_total', this.$store.getters.order_express_total);
    localStorage.setItem('order_amount', 0);
  },
  methods: {
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    checkOrder() {
      if (this.$store.getters.order_topup.length !== 0) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style>

</style>