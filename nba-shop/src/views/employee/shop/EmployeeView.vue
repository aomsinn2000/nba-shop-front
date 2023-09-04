<template>
  <div>
    <div class="grid">
        <div class="col-12">
            <h1>จัดการพนักงาน</h1>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <EmployeeShop/>
        </div>
    </div>
  </div>
</template>

<script>
import EmployeeShop from '@/components/employee/shop/EmployeeShop.vue'
export default {
    components:{
        EmployeeShop
    },
    mounted(){
        if(this.$store.getters.position!=="manager"){
            this.$router.push('/');
        }
    }
}
</script>

<style>

</style>