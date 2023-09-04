<template>
  <div>
    <div class="grid">
      <div class="col-12">
        <h1 class="text-center">ประกัน (รถยนต์ - รถจักรยานยนต์)</h1>
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
                      <label>Line ID (ถ้ามี)</label>
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
                      <label>ที่อยู่ <small><strong>หมายเหตุ : </strong>เพื่อใช้ในการออกใบกำกับภาษี</small></label>
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
                    <div class="col-12 lg:col-5">
                      <div class="field">
                        <span class="p-float-label">
                          <Dropdown v-model="district" :options="item_district" option-label="name_th" class="w-full"
                            inputClass="font" @change="chooseToDistrict" :disabled="isDisabled" />
                          <label>แขวง/ตำบล</label>
                        </span>
                      </div>
                    </div>
                    <div class="col-12 lg:col-3">
                      <div class="field">
                        <span class="p-float-label">
                          <InputText v-model="postcode" class="font w-full" :disabled="isDisabled" />
                          <label>รหัสไปรษณีย์</label>
                        </span>
                      </div>
                    </div>
                    <div class="col-12 lg:col-1 ml-2">
                      <div class="field">
                        <Button class="pi pi-image" @click="dialog_img1 = true" :disabled="isDisabled" />
                      </div>
                    </div>
                    <div class="col-12 lg:col-1 ml-2">
                      <div class="field">
                        <Button class="pi pi-image" @click="dialog_img2 = true" :disabled="isDisabled" />
                      </div>
                    </div>
                    <div class="col-12 lg:col-1 ml-2">
                      <div class="field">
                        <Button class="pi pi-image" @click="dialog_img3 = true" :disabled="isDisabled" />
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
            <Panel header="STEP 2. ประกัน (รถยนต์ - รถจักรยานยนต์)">
              <InsuranceList />
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
              <div class="col-12 lg:col-6">
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

  <Dialog v-model:visible="dialog_img1" header="แนบภาพถ่ายหนังสือจดทะเบียน (เล่มเขียวคู่มือรถ)" :modal="true"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
    <div class="col-12">
      <label v-if="!img_preview1" class="file-input-label">
        <span>แนบรูป</span>
        <input type="file" class="input-image" @change="SetImage1" />
      </label>
      <Image v-if="img_preview1" :src="img_preview1" width="200" height="200" preview />
    </div>
    <div class="col-12 text-right">
      <Button v-if="img_preview1 != null" label="เปลียนรูป" @click="ResetImage" class="mr-2" />
      <Button v-if="img_preview1 != null" @click="dialog_img1 = false" label="ยืนยัน" />
    </div>
  </Dialog>

  <Dialog v-model:visible="dialog_img2" header="เอกสารประกันเดิม (ประกันหมดอายุ)" :modal="true"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
    <div class="col-12">
      <label v-if="!img_preview2" class="file-input-label">
        <span>แนบรูป</span>
        <input type="file" class="input-image" @change="SetImage2" />
      </label>
      <Image v-if="img_preview2" :src="img_preview2" width="200" height="200" preview />
    </div>
    <div class="col-12 text-right">
      <Button v-if="img_preview2 != null" label="เปลียนรูป" @click="ResetImage" class="mr-2" />
      <Button v-if="img_preview2 != null" @click="dialog_img2 = false" label="ยืนยัน" />
    </div>
  </Dialog>

  <Dialog v-model:visible="dialog_img3" header="แนบภาพถ่ายสำเนาใบขับขี่" :modal="true"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
    <div class="col-12">
      <label v-if="!img_preview3" class="file-input-label">
        <span>แนบรูป</span>
        <input type="file" class="input-image" @change="SetImage3" />
      </label>
      <Image v-if="img_preview3" :src="img_preview3" width="200" height="200" preview />
    </div>
    <div class="col-12 text-right">
      <Button v-if="img_preview3 != null" label="เปลียนรูป" @click="ResetImage" class="mr-2" />
      <Button v-if="img_preview3 != null" @click="dialog_img3 = false" label="ยืนยัน" />
    </div>
  </Dialog>
</template>

<script>
import callme from '@/service/callme'
import axios from 'axios'
import InsuranceList from '@/components/employee/pos/insurance_service/InsuranceList.vue';
import CheckOut from '@/components/employee/pos/insurance_service/CheckOut.vue';
import OrderList from '@/components/employee/pos/insurance_service/OrderList.vue'
import CustomerDisplay from '@/components/employee/pos/CustomerDisplay.vue';
import CheckOutButton from '@/components/employee/pos/insurance_service/CheckOutButton.vue';
export default {
  components: {
    InsuranceList, CheckOut, OrderList, CustomerDisplay,
    CheckOutButton
  },
  async created() {
    await callme(localStorage.getItem('token'));
    document.title = 'บริการประกัน (รถยนต์ - รถจักรยานยนต์)'
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
      const check_function = shop_function.find((el) => el.name === 'program');
      if (!check_function) {
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ไม่สามารถใช้งานฟังก์ชั่นออกแบบโปรแกรมและเว็บไซต์ได้', life: 3000 });
        this.$router.push('/pos');
      } else {
        if (!check_function.status) {
          this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ร้านค้านี้ไม่สามารถใช้งานฟังก์ชั่นออกแบบโปรแกรมและเว็บไซต์ได้', life: 3000 });
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
    this.$store.commit('updateTotalAct');
  },
  data: () => ({
    cus_name: '',
    cus_tel: '',
    people_id: '',
    line_id: '',
    address: null,
    tel_platform: '',
    isDisabled: false,
    isLoading: false,

    item_province: [],
    item_state: [],
    item_district: [],
    province: null,
    state: null,    //อำเภอ
    district: null,  //ตำบล
    postcode: '',

    dialog_img1: false,
    dialog_img2: false,
    dialog_img3: null,
    img_upload1: null,
    img_upload2: null,
    img_upload3: null,
    img_size: null,
    img_preview1: null,
    img_preview2: null,
    img_preview3: null,

    imageid: '',

  }),
  methods: {
    clearAddress() {
      this.isDisabled = false;
    },

    SetImage1(e) {
      const file = e.target.files;
      if (file) {
        this.img_size = file[0].size;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);
        fileReader.addEventListener("load", (event) => {
          this.img_preview1 = event.target.result;
        })
        this.img_upload1 = file;
      }
    },

    SetImage2(e) {
      const file = e.target.files;
      if (file) {
        this.img_size = file[0].size;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);
        fileReader.addEventListener("load", (event) => {
          this.img_preview2 = event.target.result;
        })
        this.img_upload2 = file;
      }
    },

    SetImage3(e) {
      const file = e.target.files;
      if (file) {
        this.img_size = file[0].size;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);
        fileReader.addEventListener("load", (event) => {
          this.img_preview3 = event.target.result;
        })
        this.img_upload3 = file;
      }
    },

    ResetImage() {
      this.img_preview1 = null;
      this.img_preview2 = null;
      this.img_preview3 = null;
      this.img_upload1 = null;
      this.img_upload2 = null;
      this.img_upload3 = null;
    },

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
      }).catch((err) => {
        console.log(err);
        this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'เบอร์นี้ยังไม่ได้สมัครแพลตฟอร์ม ไม่สามารถรับค่าคอมมิชชั่นได้ กรุณาแจ้งให้พาร์ทเนอร์สมัครแพลตฟอร์ม', life: 5000 })
      })
      if (this.cus_name === '' || this.cus_tel === '' || this.people_id === '' || this.tel_platform === '') {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรอกข้อมูลลูกค้าให้ครบถ้วน', life: 3000 });
        return false;
      }

      let address = '';
      if (this.cus_address !== '') {
        if (this.province === null || this.state === null || this.district === null || this.zip_code === '') {
          this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรณีมีที่อยู่จัดส่ง กรุณาเลือกที่อยู่จัดส่ง', life: 5000 });
          return false;
        } else {
          address = `${this.cus_address}, แขวง/ตำบล: ${this.district.name_th} เขต/อำเภอ: ${this.state.name_th} จังหวัด:${this.province.name_th} ${this.postcode}`
        }
      }

      if (this.img_upload1 === null) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาแนบเอกสารหนังสือจดทะเบียน (เล่มเขียวคู่มือรถ)', life: 3000 });
        return false;
      }

      if (this.img_upload2 === null) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาแนบเอกสารประกันเดิม (ประกันหมดอายุ)', life: 3000 });
        return false;
      }

      if (this.img_upload3 === null) {
        this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณาแนบเอกสารสำเนาใบขับขี่', life: 3000 });
        return false;
      }

      this.$confirm.require({
        message: `ตรวจสอบข้อมูลถูกต้องและครบถ้วน`,
        header: 'ตรวจสอบและยืนยัน',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          this.$store.commit('setLoading', true);
          //อัพโหลดรูปภาพเพื่อเอาไอดีรูปภาพ
          let imageid1 = "";
          let imageid2 = "";
          let imageid3 = "";
          if (this.img_upload1 !== null && this.img_upload2 !== null && this.img_upload3) {
            const formData = new FormData();
            formData.append('imgCollection', this.img_upload1[0]);
            formData.append('imgCollection', this.img_upload2[0]);
            formData.append('imgCollection', this.img_upload3[0]);
            await axios.post(`${process.env.VUE_APP_SHOP}image/collection`, formData, {
              headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
              }
            }).then((res) => {
              imageid1 = res.data.file[0];
              imageid2 = res.data.file[1];
              imageid3 = res.data.file[2];
            }).catch((err) => {
              if (err.response.status === 408) {
                window.location.reload();
              }
            });
          }

          const cus = {
            cus_name: this.cus_name,
            cus_tel: this.cus_tel,
            cus_address: address,
            people_id: this.people_id,
            line_id: this.line_id,
            tel_platform: this.tel_platform,
          }

          const img = {
            img1: imageid1,
            img2: imageid2,
            img3: imageid3,
          }

          this.$store.commit('setInsuranceCus', cus);
          this.$store.dispatch('addInsuranceimg', img);
          this.isDisabled = true;
          this.$store.commit('setLoading', false);
        }
      })
    },
  }

}
</script>

<style>
.file-input-label {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aquamarine;
  height: 150px;
  width: 150px;
}

.input-image {
  display: none
}
</style>