<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <h1 class="text-center">โปรไฟล์ของฉัน</h1>
            </div>
        </div>
        <div class="grid">
            <div class="col-12 lg:col-6">
                <Panel header="ข้อมูลทั่วไป">
                    <p><strong>รหัสพนักงาน :</strong> {{ employee.employee_username }}</p>
                    <Divider type="dashed"></Divider>
                    <p><strong>ชื่อ-นามสกุล :</strong> {{ employee.employee_name }}</p>
                    <Divider type="dashed"></Divider>
                    <p><strong>เบอร์โทร : </strong> {{ employee.employee_phone }}</p>
                    <Divider type="dashed"></Divider>
                    <p><strong>ตำแหน่ง : </strong> {{ positionName(employee.employee_position) }}</p>
                    <Divider type="dashed"></Divider>
                </Panel>
            </div>
            <div class="col-12 lg:col-6">
                <Panel header="เปลี่ยนรหัสผ่าน">
                    <div class="grid">
                        <div class="col-12">
                            <div class="field">
                                <label>เปลี่ยนรหัสผ่านใหม่ :</label>
                                <Password v-model="password" inputClass="font" inputStyle="width: 100%;" class="w-full" placeholder="กรอกรหัสผ่านที่ต้องการเปลี่ยน"/>
                            </div>
                        </div>
                    </div>
                    <div class="grid">
                        <div class="col-12">
                            <div class="field">
                                <label>ยืนยันรหัสผ่านใหม่อีกครั้ง :</label>
                                <InputText type="password" v-model="confirm_password" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" class="font w-full"/>
                            </div>
                        </div>
                    </div>
                    <Button label="เปลี่ยนรหัสผ่าน" @click="changePassword()" :loading="isLoading"/>
                </Panel>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    created() {
        document.title = "โปรไฟล์ของฉัน"
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}employee/${this.$store.getters.id}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.employee = res.data.data
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
    },
    data: () => ({
        employee: [],
        password: "",
        confirm_password: "",
        isLoading : false,
    }),
    methods: {
        changePassword(){
            if(this.password.length<6){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรขึ้นไป', life: 3000});
                return false;
            }
            if(this.password === "" || this.confirm_password===""){
                this.$toast.add({severity:'warn', summary: 'แจ้งเตือน', detail:'กรุณากรอกรหัสที่ต้องการเปลี่ยนให้ครบถ้วน', life: 3000});
                return false;
            }
            if(this.password !== this.confirm_password){
                this.$toast.add({severity:'warn', summary: 'รหัสผ่านไม่ตรงกัน', detail:'รหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบให้ถูกต้อง', life: 3000});
                return false;
            }

            this.$confirm.require({
                message: 'ต้องการเปลี่ยนรหัสผ่านในการเข้าสู่ระบบ?',
                header: 'เปลียนรหัสผ่าน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel : "ยกเลิก",
                accept: async () => {
                    this.isLoading = true;
                    await axios.put(`${process.env.VUE_APP_SHOP}employee/${this.$store.getters.id}`, {
                        employee_password : this.password
                    },{
                        headers:{
                            'auth-token' :`Bearer ${this.$store.getters.token}`
                        }
                    }).then(()=>{
                        this.isLoading = false;
                        this.$toast.add({severity:'success', summary: 'สำเร็จ', detail:'เปลี่ยนรหัสผ่านเข้าสู่ระบบเรียบร้อยแล้ว', life: 3000});
                        this.password = "";
                        this.confirm_password = "";
                    }).catch((err)=>{
                        if(err.response.status === 408){
                            window.location.reload();
                        }
                        this.isLoading = false;
                        this.$toast.add({severity:'error', summary: 'ไม่สำเร็จ', detail:err.response.data.message, life: 3000});
                    })
                }
            });

        },
        positionName(item) {
            switch (item) {
                case 'manager':
                    return 'ผู้จัดการ';
                case 'cashier':
                    return 'แคชเชียร์';
                case 'genaral':
                    return 'ทั่วไป';
                default:
                    return 'ไม่พบตำแหน่ง'
            }
        }
    }
}
</script>

<style>

</style>