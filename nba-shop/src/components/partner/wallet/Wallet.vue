<template>
    <Panel>
        <template #header>
            <p class="p-0 m-0">
                <i class="pi pi-wallet"></i><strong> กระเป๋าอิเล็กทรอนิกส์</strong>
            </p>
        </template>
        <h2 class="text-center p-0 m-0">{{ numberFormat(partner_wallet) }} <small>บาท</small></h2>
        <div class="grid mt-2">
            <div class="col-12 text-center">
                <Button label="เติมเงินเข้ากระเป๋า" class="p-button-sm p-button-success mr-2"
                    @click="$router.push('wallet/topup')" />
                <Button label="ประวัติเงินเข้า-ออก" icon="pi pi-history" class="p-button-text p-button-sm"
                    @click="$router.push('wallet/history')" />
            </div>
        </div>
    </Panel>
</template>

<script>
import axios from 'axios';
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}partner/${localStorage.getItem('partner_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.partner_wallet = res.data.data.partner_wallet;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    data : ()=>({
        partner_wallet : 0,
    }),
    methods:{
        numberFormat(item){
            return item.toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
        }
    }
}
</script>

<style>

</style>