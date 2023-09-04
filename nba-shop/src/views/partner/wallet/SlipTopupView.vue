<template>
    <div>
        <div class="grid">
            <div class="col-12 text-center">
                <h1 class="mb-0">เติมเงินเข้ากระเป๋า</h1>
                <p class="mt-0"><strong>ประเภท :</strong> แนบสลิปการโอน</p>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <Message><strong>เวลาทำการ : </strong> เวลาทำการตรวจสอบแจ้งเติมเงิน ทุกวัน เวลา 9.00 น. ถึง 18.00 น. หากนอกเวลาทำการจะทำการตรวจสอบในเวลาทำการของวันถัดไป</Message>
                <Message severity="warn"><strong>สำคัญ :</strong> ยอดเงินขั้นต่ำในการโอนอย่างน้อย 500 บาท ขึ้นไป หากโอนยอดผิดหรือน้อยกว่านี้ กระบวนการตรวจสอบอาจใช้เวลานาน หรือรายการจะถูกยกเลิกทันที</Message>
            </div>
        </div>
        <div class="grid">
            <div class="col-12 lg:col-3">
                <Panel header="STEP 1 : โอนเงินเข้าบัญชีบริษัท">
                    <div class="grid">
                        <div class="col-12">
                            <Image :src="require('@/assets/img/scb_bank.jpg')" :preview="true" imageClass="w-full" />
                        </div>
                    </div>
                </Panel>
            </div>
            <div class="col-12 lg:col-3">
                <Panel header="STEP 2 : กรอกจำนวนเงิน และ แนบหลักฐานการโอน">
                    <div class="grid">
                        <div class="col-12">
                            <div class="field">
                                <span class="p-float-label">
                                    <InputNumber v-model="amount" placeholder="ยอดขั้นต่ำในการแจ้งเติมเงิน 500 ต่อครั้ง"
                                        :min="500" inputClass="font" class="w-full" />
                                    <label>จำนวน : </label>
                                </span>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="field">
                                <FileUpload mode="basic" :auto="true" chooseLabel="แนบรูปภาพหลักฐานการโอน" uploadIcon="pi pi-paperclip" @uploader="chooseImage" :customUpload="true" v-if="slip_img===null"/>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
            <div class="col-12 lg:col-3">
                <Panel header="STEP 3 : รูปภาพหลักฐานการโอน">
                    <div class="grid" v-if="img_preview!==null">
                        <div class="col-12">
                            <Image :src="img_preview" imageClass="w-full" :preview="true" />
                        </div>
                        <div class="col-12 text-center">
                            <Button label="ลบ" @click="clearImage()" icon="pi pi-trash" class="p-button-danger" />
                        </div>
                    </div>
                    <div class="grid" v-else>
                        <div class="col-12 text-center">
                            <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/document_view.png" width="200" />
                        </div>
                    </div>
                </Panel>
            </div>
            <div class="col-12 lg:col-3">
                <Panel header="STEP 4 : แจ้งเติมเงิน">
                    <div class="grid">
                        <div class="col-12">
                            <Checkbox  v-model="checked" :binary="true" /> ยอมรับเงื่อนไขการและข้อความแจ้งเตือนข้างต้น 
                            <!-- <Button label="เงื่อนไขและข้อตกลง" class="p-button-text p-0 m-0" /> -->
                        </div>
                        <div class="col-12">
                            <Button label="ส่งข้อมูลแจ้งเติมเงิน" icon="pi pi-send" @click="confirm()" />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import axios from 'axios';
export default {
    async created(){
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers : {
                'auth-token' : `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err)=>{
            if(err.response.status===408){
                localStorage.clear();
                window.location.reload();
            }
        })
        document.title = "เติมเงินเข้ากระเป่า แบบสลิปการโอน"
    },
    data: () => ({
        amount: null,
        slip_img: null,
        img_preview: null,
        checked : false

    }),
    methods : {
        clearImage(){
            this.img_preview = null;
            this.slip_img = null;
        },
        chooseImage(event){
            if(this.amount === null){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณากรอกจำนวนเงินที่โอน', life: 3000});
                return false;
            }
            this.slip_img = event.files[0];
            this.img_preview = event.files[0].objectURL;
        },
        confirm(){
            if(this.amount === null){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณากรอกจำนวนยอดที่โอน', life: 3000});
                return false;
            }

            if(this.slip_img === null){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาแนบรูปภาพหลักฐานการโอน', life: 3000});
                return false;
            }

            if(!this.checked){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณาอ่านและยอมรับเงื่อนไข', life: 3000});
                return false;
            }

            this.$confirm.require({
                message: 'ต้องการส่งข้อมูลการแจ้งเติมเงินเข้าสู่ระบบ?',
                header: 'แจ้งเติมเงิน',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    const formData = new FormData();
                    formData.append('partner_id' , this.$store.getters.id);
                    formData.append('amount', this.amount);
                    formData.append('timestamp', dayjs(Date.now()).format());
                    formData.append('slip_img', this.slip_img);

                    await axios.post(`${process.env.VUE_APP_SHOP}partner/wallet_topup/slip`, formData , {
                        headers : {
                            'auth-token' : `Bearer ${this.$store.getters.token}`
                        }
                    }).then(()=>{
                        this.$store.commit('setLoading', false);
                        this.$toast.add({severity:'success', summary: 'สำเร็จ', detail:'แจ้งชำระเงินเรียบร้อย รอการตรวจสอบจากส่วนกลางในวันเวลาทำการภายใน 10-15 นาที', life: 5000});
                        setTimeout(()=>{
                            this.$router.push('/wallet/topup');
                        }, 1000)
                        
                    }).catch((err)=>{
                        if(err.response.status === 408){
                            window.location.reload();
                        }
                        this.$store.commit('setLoading', false);
                        this.$toast.add({severity:'success', summary: 'ผิดพลาด', detail:err.response.data.message, life: 5000});
                        this.$router.push('/wallet/history');
                    })
                },
            });



        }
    }
}
</script>

<style>

</style>