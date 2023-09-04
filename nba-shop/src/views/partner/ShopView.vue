<template>
  <div>
    <div class="grid mt-3">
        <div class="col-12">
            <Button class="p-button-secondary" label="ย้อนกลับ" icon="pi pi-angle-left" @click="back()"/>
        </div>
    </div>

    <div class="grid">
        <div class="col-12 text-center">
            <Image :src="'https://drive.google.com/uc?export=view&id='+shop.shop_logo" width="150"/>
        </div>
    </div>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>ร้าน {{shop.shop_name}}</h1>
            <h3>รหัสสาขา {{shop.shop_number}}</h3>
        </div>
    </div>
    
    <div class="grid">
        <div class="col-12">
            <TabView ref="tabview2">
                <TabPanel header="เกี่ยวกับร้าน">
                    <AboutShop :shop="shop"/>
                </TabPanel>
                <TabPanel header="จัดการพนักงาน">
                    <EmployeeShop/>
                </TabPanel>
            </TabView>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AboutShop from '@/components/partner/shop/AboutShop.vue'
import EmployeeShop from '@/components/partner/shop/EmployeeShop.vue'
export default {
    components:{
        AboutShop, EmployeeShop
    },
    async mounted(){
        //get shop
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${this.$route.params.shop_id}`, {
            headers:{
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res)=>{
            this.shop = res.data.data
        }).catch((err)=>{
            if(err.response.status === 408){
                window.location.reload();
            }
            this.$toast.add({severity:'error', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000});
            this.$router.push('/');
        })
        //set title
        document.title = "จัดการร้าน "+this.shop.shop_name;
    },
    data:()=>({
        shop:{
            shop_name: "",
            shop_number: "",
            shop_logo : "",
        }
    }),
    methods :{
        back(){
            window.history.back()
        }
    }
}
</script>

<style>

</style>