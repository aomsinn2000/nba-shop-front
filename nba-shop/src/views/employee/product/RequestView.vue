<template>
    <div class="text-center">
        <h1>รายการส่งตรวจสอบ</h1>
    </div>
    <div class="grid">
        <div class="col-12">
            <Button @click="back()" class="p-button-secondary" label="ย้อนกลับ" icon="pi pi-angle-left" />
        </div>
        <div class="col-12">
            <TableRequest />
        </div>
    </div>
</template>

<script>
import TableRequest from '@/components/employee/product/TableRequest.vue';
import axios from 'axios';
export default {
    components: {
        TableRequest
    },
    created() {
        document.title = "รายการส่งสินค้าตรวจสอบ"
    },
    async mounted() {
        //check function
        try {
            const func = await this.$store.getters.shop.shop_function.find((el) => el.name === 'pos');
            if (func) {
                if (!func.status) {
                    this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                    this.$router.push('/pos');
                }
            } else {
                this.$toast.add({ severity: 'error', summary: 'ปิดใช้งาน', detail: 'ร้านค้าของคุณไม่สามารถใช้งานฟังก์ชั้นนี้ได้', life: 3000 });
                this.$router.push('/pos')
            }
        } catch (err) {
            this.$router.push('/pos')
        }

        if (this.$store.getters.position !== 'manager') {
            this.$router.push('/');
        }

        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.shop = res.data.data;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        });

    },
    methods: {
        back() {
            window.history.back();
        },
    }
}
</script>

<style>

</style>