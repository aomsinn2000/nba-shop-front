<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1 class="mb-2">ใบแจ้งหนี้</h1>
                <p class="p-0 m-0 text-gray-600"><em>ใบแจ้งหนี้ปิดงานร้านค้าประจำวัน</em></p>
            </div>
        </div>
        <div class="grid">
            <div class="col-12 mt-2">
                <table-invoice />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import TableInvoice from '@/components/employee/shop/TableInvoice.vue';
export default {
    components: { TableInvoice },
    async created() {
        //call me
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
        document.title = "รายการใบแจ้งหนี้"
    },
    async mounted() {
        if (this.$store.getters.position !== "manager") {
            this.$router.push('/');
        }

    }

}
</script>

<style>

</style>