<template>
  <Button icon="pi pi-search" label="ตรวจสอบ" @click="checkPrice()" />

    <Dialog header="เปรียบเทียบราคาขนส่ง" v-model:visible="dialogResult" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
        <div class="grid">
            <div class="col-12">
                <Message><p class="m-0 p-0"><strong>หมายเหตุ : </strong> ข้อมูลนี้เป็นการตรวจสอบหรือเปรียบเทียบราคาส่งพัสดุต่อชิ้นโดยประมาณเท่านั้น ราคาอาจจะต่างขึ้นหรือลงเล็กน้อยจากการบุ๊คหรือคีย์ข้อมูลครบถ้วนจริง</p></Message>
            </div>
            <div class="col-12">
                <DataTable :value="item_res" :paginator="true" :rows="5">
                    <template #empty>
                        <p class="p-0 m-0"><em>--ไม่มีรายการขนส่ง--</em></p>
                    </template>
                    <Column header="#" style="width: 50px">
                        <template #body="item">
                            <img :src="getImage(item.data.courier_code)" width="50"/>
                        </template>
                    </Column>
                    <Column header="รายการขนส่ง">
                        <template #body="item">
                            {{ item.data.courier_name }}
                        </template>
                    </Column>
                    <Column header="ราคา (บาท)">
                        <template #body="item">
                            {{ numberFormat(item.data.price) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Button label="ตกลง" @click="item_res=[], dialogResult= false" />
        </template>
    </Dialog>

</template>

<script>
import axios from 'axios';
export default {
    props: {
        check : Object
    },
    data: ()=>({
        item_res : [],
        dialogResult : false,
    }),
    methods :{
        async checkPrice(){
            if(this.check.parcel.weight==='' || this.check.parcel.width === '' || this.check.parcel.length==='' || this.check.parcel.height==='' || this.check.name ===''){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณากรอกข้อมูลขนาดพัสดุ', life: 3000});
                return false;
            }
            if(this.check.to_select===null){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาเลือกปลายทางส่งพัสดุ', life: 3000});
                return false;
            }
            //check branch id 
            let branch_id = '';
            if(this.$store.getters.shop.shop_branch_id !=='ไม่มี'){
                branch_id =this.$store.getters.shop_branch_id
            }
            const data = {
                from :{
                    name : this.$store.getters.shop.shop_name,
                    tel : "0800000000",
                    address : this.$store.getters.shop.shop_address,
                    district : this.$store.getters.shop.shop_district,
                    state : this.$store.getters.shop.shop_state,
                    province : this.$store.getters.shop.shop_province,
                    postcode : this.$store.getters.shop.shop_postcode
                },
                to: {
                    name : this.$store.getters.shop.shop_name ,
                    tel : "0800000000",
                    address : this.$store.getters.shop.shop_address ,
                    district: this.check.to_select.district ,
                    state :this.check.to_select.state ,
                    province :this.check.to_select.province,
                    postcode : String(this.check.to_select.postcode),
                },
                parcel : {
                    name : this.check.parcel.name,
                    weight : this.check.parcel.weight,
                    width : this.check.parcel.width,
                    length : this.check.parcel.width,
                    height : this.check.parcel.height
                },
                branch_id : branch_id
            }
            this.$store.commit('setLoading', true);
            await axios.post(`${process.env.VUE_APP_SHOP}express/pricelist`,data, {
                headers: {
                    'auth-token' : `Bearer ${this.$store.getters.token}`
                }
            }).then((res)=>{
                console.log(res);
                this.item_res = res.data.data;
                this.$store.commit('setLoading', false);
                this.dialogResult = true;
            }).catch((err)=>{
                if(err.response.status===408){
                    window.location.reload();
                }
                console.log(err);
                this.$toast.add({severity:'error', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000});
                this.$store.commit('setLoading', false);
            })
        },
        getImage(item) {
            switch (item) {
                case 'DHL':
                    return require('@/assets/img/icon_courier/DHL.png')
                case 'FLE':
                    return require('@/assets/img/icon_courier/FLE.png')
                case 'NJV':
                    return require('@/assets/img/icon_courier/NJV.png')
                case 'SCG':
                    return require('@/assets/img/icon_courier/SCG.png')
                case 'SCGC':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'SCGF':
                    return require('@/assets/img/icon_courier/SCGC.png')
                case 'TP2':
                    return require('@/assets/img/icon_courier/TP2.png')
                case 'EMST':
                    return require('@/assets/img/icon_courier/EMST.png')
                case 'ECP':
                    return require('@/assets/img/icon_courier/ECP.png')
                case 'BEST':
                    return require('@/assets/img/icon_courier/BEST.png')
                case 'SPX':
                    return require('@/assets/img/icon_courier/SPX.png')
                case 'KRYS':
                    return require('@/assets/img/icon_courier/KRY.png')
                default:
                    return require('@/assets/img/icon_courier/NONE.png')
            }
        },
        numberFormat(num) {
            return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        },
    }
}
</script>

<style>

</style>