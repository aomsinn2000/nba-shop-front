<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1>ประวัติการทำรายการเคาน์เตอร์เซอร์วิส</h1>
            </div>
            <div class="col-12">
                <TableOrder/>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import TableOrder from '@/components/employee/pos/counter_service/TableOrder.vue';
export default {
    components: {
        TableOrder
    },
    async created() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        });
        document.title = 'ประวัติการทำรายการเคาน์เตอร์วิส'
    }
}
</script>

<style>

</style>