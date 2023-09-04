<template>
    <!-- <Panel>
        <template #header>
            <p class="p-0 m-0">
                <i class="pi pi-wallet"></i><strong>&nbsp;&nbsp;&nbsp; กระเป๋าอิเล็กทรอนิกส์</strong>
            </p>
        </template>
        <h2 class="text-center p-0 m-0">{{ numberFormat(partner_wallet) }} <small>บาท</small></h2>
    </Panel> -->
  
    <Card class="card-partner-wallet text-white ">
        <template #content>
            <div class="grid pb-0 mb-0">
                <div class="col-12 mb-0">
                    <h1 class="p-0 m-0" style="text-align: center;">
                        <i class="pi pi-wallet"></i>&nbsp;&nbsp;<small style="font-size: 20px;">กระเป๋าอิเล็กทรอนิกส์</small>
                        <br>
                        <div>
                            {{ numberFormat(partner_wallet) }} <small style="font-size: 20px;">&nbsp;บาท</small>
                        </div>
                    </h1>
                </div>
            </div>
        </template>
    </Card>
</template>

<script>
import axios from 'axios';
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res)=>{
            this.shop = res.data.data
        })
        await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.shop.shop_partner_id}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.partner = res.data.data;
            this.partner_wallet = res.data.data.partner_wallet;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    data : ()=>({
        shop : [],
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
.card-partner-wallet{
    background: linear-gradient(110deg, #6d28d9 60%, #7c3aed 60%);
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

</style>