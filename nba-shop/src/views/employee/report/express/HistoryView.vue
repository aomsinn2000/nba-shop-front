<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1>ประวัติการส่งพัสดุ</h1>
            </div>
            <div class="col-12">
                <TabView>
                    <TabPanel header="รายการตามใบสั่งซื้อ">
                        <TableOrder/>
                    </TabPanel>
                    <TabPanel header="รายการตามบุ๊คกิ้ง">
                        <TableBooking/>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<script>
import TableOrder from '@/components/employee/pos/express/TableOrder.vue';
import TableBooking from '@/components/employee/pos/express/TableBooking.vue';
import axios from 'axios';
export default {
    components:{
        TableOrder, TableBooking
    },
    async created(){
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers : {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err)=>{
            if(err.response.status === 408){
                window.location.reload();
            }
        })
        document.title="ประวัติการทำรายการส่งพัสดุ"
    }
}
</script>

<style>

</style>