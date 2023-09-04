<template>
  <Button @click="openBarcodeList()" :loading="isLoading" label="บริการทั้งหมด" class="p-button-success p-button-outlined"/>

  <Sidebar v-model:visible="sidebar" class="p-sidebar-md" position="right">
    <div class="grid">
        <div class="col-12 text-center">
            <h2>รายการชำระที่เปิดให้บริการ</h2>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <InputText v-model="search" class="w-full font"  @keyup="searchData()" placeholder="กรอกชื่อบริการที่ต้องกาค้นหา"/>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <DataTable :value="item_barcode" :paginator="true" :rows="15">
                <template #empty>
                    <p class="m-0 p-0"><em>--ไม่มีพบบริการที่เปิดอยู่--</em></p>
                </template>
                <Column header="#" style="width: 60px">
                    <template #body="item">
                        <Image :src="getImage(item.data.productid)" width="60"/>
                    </template>
                </Column>
                <Column header="ชื่อบริการ">
                    <template #body="item">
                        {{ item.data.productname }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
  </Sidebar>
</template>

<script>
import axios from 'axios';
export default {
    data : ()=>({
        sidebar : false,
        item_barcode : [],
        barcode_service : [],
        isLoading : false,
        search : '',
    }),
    methods: {
        searchData(){
            if(this.search!==''){
                this.item_barcode = this.barcode_service.filter((el)=>el.productname.search(this.search)!==-1);
            }else{
                this.item_barcode = this.barcode_service
            }
        },
        async openBarcodeList(){
            this.isLoading = true;
            await axios.get(`${process.env.VUE_APP_SHOP}counter_service/service/barcode`, {
                headers: {
                    'auth-token' : `Bearer ${this.$store.getters.token}`
                }
            }).then((res)=>{
                this.barcode_service = res.data.data;
                this.item_barcode = res.data.data;
                this.sidebar = true;
                this.isLoading = false;
            }).catch((err)=>{
                if(err.response.status === 408){
                    window.location.reload();
                }
                this.$toast.add({severity:'err', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000});
                this.isLoading = false;
            })
        },
        getImage(item) {
            try {
                return require('@/assets/img/counter_service/' + item + '.png');
            } catch {
                return 'https://promotions.co.th/wp-content/uploads/2019/03/06.jpg';
            }
        }
    }
}
</script>

<style>

</style>