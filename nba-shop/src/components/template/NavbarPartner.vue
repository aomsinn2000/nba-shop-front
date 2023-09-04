<template>
  <Menubar :model="items" class="pb-2 pt-2">
    <template #start>
      <img src="@/assets/one_stop_logo.png" height="40" class="mr-2" />
    </template>
    <template #end>
      <Button class="p-button-danger" label="ออกจากระบบ" icon="pi pi-power-off" @click="logout()" />
    </template>
  </Menubar>

  <!-- sidebar สัญญาอิเล็กทรอนิกส์-->
  <Sidebar v-model:visible="sidebar" :showCloseIcon="false" position="full">
    <TabView>
      <TabPanel header="One Stop Service" v-if="checkOneStopService()">
        <ContractDocument :partner="partner" />
      </TabPanel>
      <TabPanel header="One Stop Service" v-if="checkOneStopShop()">
        Comming Soon...
      </TabPanel>
    </TabView>
    <div class="grid">
      <div class="col-12 pl-4">
        <Checkbox v-model="checked" :binary="true" /> ยอมรับเงื่อนไขสัญญาข้างต้น และเซ็นสัญญาอิเล็กทรอนิกส์
        ถือว่าสัญญาฉบับนี้สมบูรณ์แบบและถูกต้องตามกฎหมาย
      </div>
      <div class="col-12 pl-4">
        <Button label="ยินยอมและเซ็นสัญญา" class="mr-2" @click="confirmSign()" />
        <Button class="p-button-danger" label="ออกจากระบบ" icon="pi pi-power-off" @click="logout()" />
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Menubar from "primevue/menubar";
import ContractDocument from '@/components/partner/dashboard/ContractDocument.vue'
import { ref } from "vue";
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  components: {
    Menubar, ContractDocument
  },
  setup() {
    const items = ref([
      {
        label: "หน้าแรก",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "กระเป๋าอิเล็กทรอนิกส์",
        icon: 'pi pi-wallet',
        items: [
          {
            label: 'รายการเติมเงิน',
            icon : 'pi pi-circle',
            to : '/wallet/topup'
          },
          {
            label: 'เติมเงิน',
            icon: 'pi pi-circle',
            items: [
              {
                label: 'แนบหลักฐานการโอน',
                to: '/wallet/topup/slip'
              },
              {
                label : 'ผ่าน QR Code',
                to : '/wallet/topup/qrcode'
              }

            ]
          }, 
          {
            label: 'ประวัติทางการเงิน',
            icon: 'pi pi-circle',
            to: '/wallet/history'
          },
          {
            label: 'คอมมิชชั่น',
            icon: 'pi pi-circle',
            to: '/wallet/commission'
          }
        ]
      }, {
        label: "ตั้งค่าโปรไฟล์",
        icon: "pi pi-fw pi-cog",
        to: "/profile"
      }
    ]);
    return { items };
  },
  async mounted() {
    await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.id}`, {
      headers: {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).then((res) => {
      this.partner = res.data.data;
    })

    await axios.get(`${process.env.VUE_APP_SHOP}shop/partner/${this.$store.getters.id}`, {
      headers: {
        'auth-token': `Bearer ${this.$store.getters.token}`
      }
    }).then((res) => {
      this.shop = res.data.data;
    })

    //check เซ็นสัญญาอิเล็กทรอนิกส์
    if (!this.partner.partner_promise.status) {
      this.sidebar = true;
    }

    // console.log(this.shop);
    // console.log(this.partner);
  },
  data: () => ({
    partner: [],
    shop: [],
    sidebar: false,
    checked: false,
  }),
  methods: {
    logout() {
      this.$confirm.require({
        message: "ต้องการออกจากระบบนี้?",
        header: "ออกจากระบบ",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        acceptLabel: "ออกจากระบบ",
        rejectLabel: "ยกเลิก",
        accept: () => {
          localStorage.clear();
          window.location.reload();
        },
      });
    },
    confirmSign() {
      if (!this.checked) {
        this.$toast.add({ severity: 'warn', summary: 'อ่านสัญญาและยอมรับเงื่อนไข', detail: 'กรุณาอ่านสัญญาและยอมรับเงื่อนไขในระบบ เพื่อเซ็นสัญญาอิเล็กทรอนิกส์', life: 7000 });
        return false;
      }

      this.$confirm.require({
        message: 'สัญญาฉบับนี้จะมีผลทันที ต้องการทำการเซ็นสัญญาอิเล็กทรอนิกส์?',
        header: 'ยืนยันเซ็นสัญญาอิเล็กทรอนิกส์',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'ตกลง',
        rejectLabel: 'ยกเลิก',
        accept: async () => {
          this.$store.commit('setLoading', true);
          const data = {
            partner_promise: {
              status: true,
              timestamp: dayjs(Date.now()).format()
            }
          }
          const config = {
            headers: {
              'auth-token': `Bearer ${this.$store.getters.token}`
            }
          }
          await axios.put(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.id}`, data, config).then(() => {
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เซ็นสัญญาอิเล็กทรอนิกส์เรียบร้อยแล้ว', life: 7000 });
            this.sidebar = false;
          }).catch((err) => {
            if (err.response.status === 408) {
              window.location.reload();
            }
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 7000 });
          })
        },
      });
    },
    checkCoffeeShop() {
      const shop = this.shop.find((el) => el.shop_level_name === 'ร้านกาแฟ');
      if (shop) {
        return true;
      } else {
        return false;
      }
    },
    checkOneStopShop() {
      const shop = this.shop.find((el) => el.shop_partner_type === 'One Stop Shop');
      if (shop) {
        return true;
      } else {
        return false;
      }
    },
    checkOneStopService() {
      const shop = this.shop.find((el) => el.shop_partner_type === 'One Stop Service')
      if (shop) {
        return true;
      } else {
        return false;
      }
    }
  },
};
</script>