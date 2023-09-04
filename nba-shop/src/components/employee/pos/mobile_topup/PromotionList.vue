<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <DataView :value="item_service" :paginator="true" :rows="12">
                    <template #empty>
                        <p class="p-0 m-0 text-center"><em>--ไม่พบรายการ--</em></p>
                    </template>
                    <template #list="item">
                        <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                            <div class="card" @click="chooseService(item.data)">
                                <div class="card-img">
                                    <img :src="getImage(item.data.productid)">
                                </div>
                                <div class="card-head">
                                    <p class="mb-0 mt-0 text-center">{{ item.data.productname }}</p>
                                </div>
                                <div style="padding: 5px;" class="text-center">
                                    <Badge :value="item.data.productid" class="bg-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>

        <!-- Dialog Service -->
        <Dialog header="ข้อมูลรายละเอียด" v-model:visible="dialogService" :modal="true"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
            <div v-if="service !== null">
                <div class="grid">
                    <div class="col-12 text-center">
                        <img :src="getImage(service.productid)" width="100" />
                        <Divider align="center" type="dashed">
                            <Chip :label="service.productname" />
                        </Divider>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <div class="p-float-label">
                                <InputMask v-model="mobile" mask="999-9999999" class="w-full font" />
                                <label>เบอร์โทร</label>
                            </div>
                        </div>

                    </div>
                    <div class="col-12">
                        <div class="field">
                            <div class="p-float-label">
                                <Dropdown v-model="price" :options="service.price.split(',')" class="w-full" inputClass="font" />
                                <label>จำนวน</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="ยกเลิก" class="p-button-text p-button-danger"
                    @click="dialogService = false, service = null, mobile = ''" />
                <Button label="ตกลง" @click="confirm()" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        this.$store.commit('setLoading', true);
        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/service/mobile`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.services = res.data.data
            this.item_service = this.services;

        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
        this.$store.commit('setLoading', false);
    },
    data: () => ({
        dialogService: false,
        service: null,
        services: [],
        item_service: [],
        mobile: '',
        price : null,
        verify: null,
    }),
    methods: {
        getImage(item) {
            try {
                const img = require('@/assets/img/counter_service/' + item + '.png')
                return img
            } catch (err) {
                return 'https://cdn-icons-png.flaticon.com/512/5521/5521112.png';
            }
        },
        chooseService(item) {
            this.service = item;
            this.dialogService = true;
        },
        confirm() {
            if(this.mobile === null || this.mobile===''){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรณีกรอกเบอร์โทรศัพท์', life: 3000});
                return false;
            }
            if(this.price===null || this.price<=0){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาเลือกจำนวนเงินที่ต้องการเติม', life: 3000});
                return false;
            }
            this.$confirm.require({
                message: `ยืนยันการเติมเงินมือถือ ${this.service.productname} ที่เบอร์ ${this.mobile} จำนวน ${this.numberFormat(this.price)} บาท`,
                header: 'เติมเงินมือถือ',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel : "ยกเลิก",
                acceptLabel : "ตกลง",
                accept: async () => {
                    //callback to execute when user confirms the action
                    this.$store.commit('setLoading', true);
                    await axios.post(`${process.env.VUE_APP_SHOP}counter_service/mobile_topup/verify`, {
                        productid : this.service.productid,
                        mobile: this.mobile.replace(/-/g,''),
                        price : this.price
                    } ,{
                        headers : {
                            'auth-token' : `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res)=>{
                        this.verify = res.data;
                        if(res.data.error_code === 'E00'){
                            const data = [];
                            const order = {
                                name : this.service.productname ,
                                type: 'เติมเงินมือถือ',
                                ref : {...res.data},
                                service : this.service,
                                mobile : this.mobile,
                                total : Number(this.price)
                            }
                            const charge = {
                                name : 'ค่าธรรมเนียม+บริการ',
                                service : null,
                                total : res.data.charge
                            }
                            data.push(order);
                            data.push(charge);
                            this.$store.commit('setOrderTopup', data);
                            
                            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการเติมเงินสำเร็จ', life: 3000 });
                            this.dialogService = false;
                            localStorage.setItem('order_total', this.$store.getters.order_topup_total)
                            this.mobile = '',
                            this.price = null;
                        }else{
                            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: res.data.error_text, life: 3000 });
                            this.$store.commit('setLoading', false);
                        }
                        this.$store.commit('setLoading', false);
                    }).catch((err)=>{
                        if(err.response.status === 408){
                            window.location.reload();
                        }
                        this.$toast.add({severity:'error', summary: 'ผิดพลาด', detail:err.response.data.message, life: 3000});
                        this.$store.commit('setLoading', false);
                    })
                    
                }
            });
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        }
    }

}
</script>

<style>

</style>