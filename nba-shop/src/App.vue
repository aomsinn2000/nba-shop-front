<template>
  <div v-if="this.$store.getters.logedIn === true">
    <div v-if="this.$store.getters.id !== ''">
      <div v-if="this.$route.path !== '/pos/customerdisplay'">
        <Navbar v-if="this.$store.getters.level === 'employee'" />
        <NavbarPartner v-if="this.$store.getters.level === 'partner'" />
        <router-view />
      </div>
      <div v-else>
        <router-view />
      </div>
    </div>
  </div>
  <div v-else>
    <LoginView />
  </div>
  <Toast />
  <ConfirmDialog />

  <!-- dialog loading-->
  <Dialog class="border-0 shadow-none " :draggable="false" v-model:visible="$store.getters.loading" :closable="false"
    :modal="true">
    <div class="grid">
      <div class="col-12 text-center">
        <img src="https://i.pinimg.com/originals/97/e9/42/97e942ce7fc4e9d4ea6d844a382f251f.gif" width="200" />
      </div>
    </div>
    <!-- <ProgressSpinner style="width:80px;height:80px" strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" /><br /> -->
  </Dialog>
  
</template>
<script>
import axios from "axios";
import Navbar from "@/components/template/Navbar.vue";
import NavbarPartner from "@/components/template/NavbarPartner.vue";
import jwtDecode from "jwt-decode";
import LoginView from "@/views/LoginView.vue";
export default {
  components: {
    Navbar,
    NavbarPartner,
    LoginView
  },
  async beforeCreate() {
    // this.$store.commit('setLoading' , true);
    // window.addEventListener("load", (event) => {
    //   if(event.isTrusted){
    //     this.$store.commit('setLoading' , false); 
    //   }
    // });

    if (localStorage.getItem("token") !== null) {
      await axios
        .post(`${process.env.VUE_APP_SHOP}me`, null, {
          headers: {
            "auth-token": `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(async (res) => {
          const decoded = await jwtDecode(localStorage.getItem("token"));
          const data_login = {
            logedIn: true,
            level: res.data.level,
            position: res.data.position,
            name: res.data.name,
            id: decoded._id,
          };
          this.$store.commit("setLogin", data_login);
          if (data_login.level === 'employee') {
            await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
              headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
              }
            }).then(async (res) => {
              await this.$store.commit('setShop', res.data.data);
            }).catch(() => {
              localStorage.clear();
              this.$store.commit("setDefaultLogin");
              this.$router.push("/login");
            });

            await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.shop.shop_partner_id}`, {
              headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
              }
            }).then(async (res) => {
              const partner_data = {
                _id: res.data.data._id,
                partner_phone: res.data.data.partner_phone,
                partner_wallet: res.data.data.partner_wallet
              }
              await this.$store.commit('setPartner', partner_data);
            }).catch(() => {
              localStorage.clear();
              this.$store.commit("setDefaultLogin");
              this.$router.push("/login");
            });
          }
          //partner
          if(data_login.level==='partner'){
            localStorage.setItem('partner_id', res.data._id);
          }
        })
        .catch(() => {
          localStorage.clear();
          this.$store.commit("setDefaultLogin");
          this.$router.push("/login");
        });
    } else {
      localStorage.clear();
      this.$router.push("/login");
    }
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1ff;
}

::-webkit-scrollbar-thumb {
  background: #C3B1E1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {

  background: #b491c8;
}
</style>
