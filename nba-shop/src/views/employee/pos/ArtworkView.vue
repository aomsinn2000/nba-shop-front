<template>
  <div>
    <div class="grid">
      <div class="col-12">
        <h1 class="text-center">สั่งสื่อสิ่งพิมพ์ (Artwork)</h1>
      </div>
    </div>
    <div class="grid">
      <div class="col-12 lg:col-5">
        <div class="grid">
          <div class="col-12">
            <Panel header="STEP 1. รายละเอียดลูกค้า">
              <div class="grid">
                <div class="col-12 lg:col-6">
                  <div class="field">
                    <span class="p-float-label">
                      <InputText v-model="cus_name" class="font w-full" :disabled="isDisabled"
                        placeholder="กรอกชื่อ-นามสกุลลูกค้า" />
                      <label>ชื่อ-นามสกุล</label>
                    </span>
                  </div>
                </div>
                <div class="col-12 lg:col-6">
                  <div class="field">
                    <span class="p-float-label">
                      <InputMask v-model="cus_tel" mask="999-9999999" class="w-full font" :disabled="isDisabled" />
                      <label>เบอร์โทร</label>
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-8">
                  <div class="field">
                    <span class="p-float-label">
                      <InputMask v-model="people_id" mask="9-9999-99999-99-9" class="font w-full"
                        :disabled="isDisabled" />
                      <label>เลขประจำตัวประชาชน <small><strong>หมายเหตุ :
                          </strong>เพื่อใช้ในการออกใบกำกับภาษี</small></label>
                    </span>
                  </div>
                </div>
                <div class="col-12 lg:col-4">
                  <div class="field">
                    <span class="p-float-label">
                      <InputText v-model="line_id" class="font w-full" :disabled="isDisabled"
                        placeholder="กรอกไลน์ไอดี" />
                      <label>Line ID</label>
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid">
                <div class="col-12">
                  <div class="field">
                    <span class="p-float-label">
                      <InputText v-model="cus_address" class="w-full font" :disabled="isDisabled"
                        placeholder="กรอกที่อยู่จัดส่ง บ้านเลขที่ หมู่ที่" />
                      <label>ที่อยู่จัดส่ง (ถ้ามี)<small><strong>หมายเหตุ : </strong> กรณีสินค้ามีการจัดส่งจะต้อง
                          กรอกที่อยู่จัดส่งให้เรียบร้อย</small></label>
                    </span>
                  </div>
                </div>
                <div class="col-12">
                  <div class="grid">
                    <div class="col-12 lg:col-6">
                      <div class="field">
                        <span class="p-float-label">
                          <Dropdown v-model="province" :options="item_province" option-label="name_th" :filter="true"
                            class="w-full" inputClass="font" @change="chooseToProvince" :disabled="isDisabled" />
                          <label>จังหวัด</label>
                        </span>
                      </div>
                    </div>
                    <div class="col-12 lg:col-6">
                      <div class="field">
                        <span class="p-float-label">
                          <Dropdown v-model="state" :options="item_state" :filter="true" option-label="name_th"
                            class="w-full" inputClass="font" @change="chooseToState" :disabled="isDisabled" />
                          <label>เขต/อำเภอ</label>
                        </span>
                      </div>
                    </div>
                    <div class="col-12 lg:col-6">
                      <div class="field">
                        <span class="p-float-label">
                          <Dropdown v-model="district" :options="item_district" option-label="name_th" class="w-full"
                            inputClass="font" @change="chooseToDistrict" :disabled="isDisabled" />
                          <label>แขวง/ตำบล</label>
                        </span>
                      </div>
                    </div>
                    <div class="col-12 lg:col-6">
                      <div class="field">
                        <span class="p-float-label">
                          <InputText v-model="postcode" class="font w-full" :disabled="isDisabled" />
                          <label>รหัสไปรษณีย์</label>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid">
                <div class="col-12 text-right">
                  <Button @click="clearAddress()" icon="pi pi-pencil" label="แก้ไขที่ข้อมูล" class="p-button-outlined"
                    v-if="isDisabled === true" />
                </div>
              </div>
            </Panel>
          </div>
          <div class="col-12">
            <Panel header="STEP 2. บริการออกแบบสื่อสิ่งพิมพ์">
              <ArtworkList />
            </Panel>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-7">
        <div class="grid">
          <div class="col-12 lg:col-6">
            <CheckOut />
          </div>
          <div class="col-12 lg:col-6">
            <div class="grid">
              <div class="col-12 lg:col-6">
                <span class="p-float-label">
                  <InputText v-model="tel_platform" class="w-full font" :disabled="isDisabled" />
                  <label>เอ็นบีเอ แฟมมิลี่</label>
                </span>
              </div>
              <div class="col-12 lg:col-6">
                <Button @click="checkPlatform()" label="NBA FAMILY" class="p-button-success" />
              </div>
              <div class="col-12">
                <CustomerDisplay />
              </div>
              <div class="col-12">
                <CheckOutButton />
              </div>
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="col-12">
            <OrderList />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import callme from '@/service/callme'
import axios from 'axios'
import ArtworkList from '@/components/employee/pos/artwork/ArtworkList.vue';
import CheckOut from '@/components/employee/pos/artwork/CheckOut.vue';
import OrderList from '@/components/employee/pos/artwork/OrderList.vue'
import CustomerDisplay from '@/components/employee/pos/CustomerDisplay.vue';
import CheckOutButton from '@/components/employee/pos/artwork/CheckOutButton.vue';
export default {
  components: {
    ArtworkList, CheckOut, OrderList, CustomerDisplay,
    CheckOutButton
  },
  async created() {
    await callme(localStorage.getItem('token'));
    document.title = 'ออกแบบสื่อสิ่งพิมพ์'
  },

  async mounted() {
    this.isLoading = true;
    await axios.get(`${process.env.VUE_APP_SHOP}thailand/province`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      this.$store.commit('setLoading', false);
      this.item_province = res.data;
    }).catch((err) => {
      console.log(err);
      this.$store.commit('setLoading', false);
      this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดจังหวัดไม่สำเร็จ', life: 3000 });
      this.$router.push('/');
    })

    //ตรวจสอบร้านค้านี้เปิดให้บริการขายหน้าร้านไหม
    await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      const shop_function = res.data.data.shop_function;
      const check_function = shop_function.find((el) => el.name === 'artwork');
      if (!check_function) {
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ไม่สามารถใช้งานฟังก์ชั่นออกแบบสื่อสิ่งพิมพ์ได้', life: 3000 });
        this.$router.push('/pos');
      } else {
        if (!check_function.status) {
          this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ไม่สามารถใช้งานฟังก์ชั่นออกแบบสื่อสิ่งพิมพ์ได้', life: 3000 });
          this.$router.push('/pos');
        }
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
      this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
    })
    localStorage.setItem('order_total', 0);
    this.$store.commit('updateTotalArtwork');
  },
  data: () => ({
    cus_name: '',
    cus_tel: '',
    cus_address: '',
    tel_platform: '',
    people_id: '',
    line_id: '',
    address: null,
    isDisabled: false,
    isLoading: false,
    item_province: [],
    item_state: [],
    item_district: [],
    province: null,
    state: null,    //อำเภอ
    district: null,  //ตำบล
    postcode: '',
  }),
  methods: {
    clearAddress() {
      this.isDisabled = false;
    },
    //TO
    async chooseToProvince(event) {
      if (event.value !== null) {
        this.province = event.value;
        await axios.get(`${process.env.VUE_APP_SHOP}thailand/amphure/by-province-id/${event.value.id}`, {
          headers: {
            'auth-token': `Bearer ${localStorage.getItem('token')}`
          }
        }).then((res) => {
          this.item_state = res.data;
          this.state = null;
          this.district = null;
        }).catch((err) => {
          console.log(err);
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดเขต/อำเภอ ไม่สำเร็จ', life: 3000 });
        })
      } else {
        this.item_state = [];
      }
    },
    async chooseToState(event) {
      if (event.value !== null) {
        this.state = event.value;
        await axios.get(`${process.env.VUE_APP_SHOP}thailand/tambon/by-amphure-id/${event.value.id}`).then((res) => {
          this.item_district = res.data;
          this.district = null;
          this.postcode = '';
        }).catch((err) => {
          console.log(err);
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'โหลดแขวง/ตำบล ไม่สำเร็จ', life: 3000 });
        })
      } else {
        this.item_district = []
      }
    },
    chooseToDistrict(event) {
      this.district = event.value;
      this.postcode = event.value.zip_code;
    },

    async checkPlatform() {
      await axios.get(`${process.env.VUE_APP_SHOP}more/platform/member/${this.tel_platform}`, {
        headers: {
          'auth-token': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((res) => {
        this.$toast.add({ severity: 'success', summary: res.data.data.name, detail: `${res.data.data.address}, ${res.data.data.subdistrict} ${res.data.data.district} ${res.data.data.province} ${res.data.data.postcode}`, life: 7000 })
        let address = '';
        if (this.cus_name === '' || this.cus_tel === '' || this.people_id === '' || this.line_id === '') {
          this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรอกข้อมูลลูกค้าให้ครบถ้วน', life: 3000 });
          return false;
        }
        if (this.cus_address !== '') {
          if (this.province === null || this.state === null || this.district === null || this.zip_code === '') {
            this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรณีมีที่อยู่จัดส่ง กรุณาเลือกที่อยู่จัดส่ง', life: 5000 });
            return false;
          } else {
            address = `${this.cus_address}, แขวง/ตำบล: ${this.district.name_th} เขต/อำเภอ: ${this.state.name_th} จังหวัด:${this.province.name_th} ${this.postcode}`
          }
        }

        const cus = {
          cus_name: this.cus_name,
          cus_tel: this.cus_tel,
          cus_address: address,
          people_id: this.people_id,
          line_id: this.line_id,
          tel_platform: this.tel_platform,
        }
        this.$store.commit('setArtworkCus', cus);
        this.isDisabled = true;
      }).catch((err) => {
        console.log(err);
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'เบอร์นี้ยังไม่ได้สมัครแพลตฟอร์ม ไม่สามารถรับค่าคอมมิชชั่นได้ กรุณาแจ้งให้พาร์ทเนอร์สมัครแพลตฟอร์ม', life: 5000 })
      })
    }
  }
}
</script>

<style></style>