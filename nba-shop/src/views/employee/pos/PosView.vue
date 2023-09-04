<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>เมนูบริการหน้าร้าน</h1>
        </div>
    </div>
    <div class="grid"  v-if="$store.getters.position==='manager'">
        <div class="md:col-8 md:col-offset-2 lg:col-8 lg:col-offset-2">
            <Wallet />
        </div>
    </div>
    <div class="grid">
        <div class="md:col-8 md:col-offset-2 lg:col-8 lg:col-offset-2">
            <Menu />
        </div>
    </div>
</template>

<script>
import Menu from "@/components/employee/pos/Menu.vue"
import Wallet from "@/components/employee/home/Wallet.vue"
import axios from 'axios'
export default {
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

        document.title = "เมนูบริการหน้าร้าน"
    },
    components: {
        Menu,Wallet
    }
}
</script>

<style>

</style>