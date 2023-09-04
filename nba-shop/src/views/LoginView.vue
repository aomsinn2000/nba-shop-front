<template>
  <!-- <div class="container">
    <div class="grid grid-nogutter surface-section text-800">
      <div class="col-12 md:col-6 overflow-hidden">
        <img
          src="../assets/img/shop2.jpg"
          alt="Image"
          class="md:ml-auto block"
          style="width: 100%"
        />
      </div>
      <div class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
        <section>
          <div class="text-6xl text-primary font-bold mb-3">
            NBA ONE STOP SHOP
          </div>
          <h2 class="text-primary">"ร้านเดียวครบ จบทุกบริการ"</h2>
          <div class="grid">
            <div class="col-12">
              <div class="field">
                <label>ชื่อผู้ใช้งาน (USERNAME) :</label>
                <InputText
                  v-model="username"
                  type="text"
                  placeholder="ชื่อผู้ใช้งาน"
                  class="w-full font"
                  @keyup.enter="checklogin()"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="field">
                <label>รหัสผ่าน (PASSWORD) :</label>
                <InputText
                  v-model="password"
                  type="password"
                  placeholder="รหัสผ่าน"
                  class="w-full font"
                  @keyup.enter="checklogin()"
                />
              </div>
            </div>
          </div>

          <Button
            label="เข้าสู่ระบบ"
            class="w-full"
            @click="checklogin()"
            :loading="isLoading"
          ></Button>
        </section>
      </div>
    </div>
  </div> -->
  <div class="container">
    <div class="modal">
      <section>
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label style="font-size: 22px;" class="text-white">USERNAME</label>
              <InputText v-model="username" type="text" placeholder="ชื่อผู้ใช้งาน" class="w-full font"
                @keyup.enter="checklogin()" />
            </div>
          </div>
          <div class="col-12">
            <div class="field">
              <label style="font-size: 22px;" class="text-white">PASSWORD</label>
              <InputText v-model="password" type="password" placeholder="รหัสผ่าน" class="w-full font"
                @keyup.enter="checklogin()" />
            </div>
          </div>
        </div>
        <!-- <button type="button" class="accept-button" label="เข้าสู่ระบบ" @click="checklogin()" :loading="isLoading">ตกลง</button> -->
        <Button type="button" label="เข้าสู่ระบบ" class="w-full" @click="checklogin()" :loading="isLoading"></Button>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from 'dayjs';
export default {
  created() {
    document.title = "เข้าสู่ระบบ | NBA ONE STOP SHOP";
  },
  mounted() {
    if (this.$store.getters.logedIn === true) {
      this.$router.push("/");
    }
  },
  data: () => ({
    isLoading: false,
    username: "",
    password: "",
  }),
  methods: {
    async checklogin() {
      if (this.username === "" || this.password === "") {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน",
          life: 3000,
        });
        return false;
      }
      this.isLoading = true;
      await axios
        .post(`${process.env.VUE_APP_SHOP}login`, {
          username: this.username,
          password: this.password,
        })
        .then(async (res) => {
          if (res.data.level === "admin") {
            this.$toast.add({
              severity: "error",
              summary: "แจ้งเตือน",
              detail: "ไม่มีสิทธิ์ใช้งานระบบนี้",
              life: 3000,
            });
          } else if (res.data.level === "employee") {
            if (!res.data.result.employee_status) {
              this.$toast.add({
                severity: "error",
                summary: "ไม่สำเร็จ",
                detail: "บัญชีนี้ถูกปิดใช้งานไปแล้ว",
                life: 3000,
              });
            } else {
              await axios.post(`${process.env.VUE_APP_SHOP}login/history`, {
                name: res.data.result.name,
                ref: res.data.result,
                timestamp: dayjs(Date.now()).format()
              }, {
                headers: {
                  'auth-token': `Bearer ${res.data.token}`
                }
              })
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("shop_id", res.data.result.shop_id);
              window.location.assign("/");
            }
          } else {
            localStorage.setItem("token", res.data.token);
            window.location.assign("/");
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$toast.add({
            severity: "error",
            summary: "ไม่สำเร็จ",
            detail: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
            life: 3000,
          });
        });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: right;
  text-align: center;
  align-items: center;
  width: 100%;
  height: 1080px;
  background-image: url("../assets/img/login.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
}

.modal {
  max-width: 30%;
  padding: 1rem 2rem;
  margin-top: 5%;
  margin-right: 3%;
}


</style>