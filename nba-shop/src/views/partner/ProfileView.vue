<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>โปรไฟล์ของฉัน</h1>
        </div>
        <div class="col-12 lg:col-6">
            <Panel header="เกี่ยวกับฉัน">
                <div class="grid" v-if="partner.length!==0">
                    <div class="col-12">
                        <Divider align="center" type="dashed">
                            <Chip label="ข้อมูลทั่วไป" />
                        </Divider>
                    </div>
                    <div class="col-12">
                        <p class="p-0 m-0"><strong>ชื่อ-นามสกุล : </strong>{{ partner.partner_name }}</p>
                        <p class="p-0"><strong>เบอร์โทร : </strong> {{ partner.partner_phone }}</p>
                        <p class="p-0"><strong>เลขบัตรประชาชน : </strong>{{ partner.partner_iden }}</p>
                        <p class="p-0"><strong>วันที่เริ่ม : </strong>{{ dateFormat(partner.partner_date_start) }}</p>
                        <div v-if="partner.partner_promise.status">
                            <p class="p-0"><strong>วันที่เซ็นสัญญาอิเล็กทรอนิกส์ : </strong> {{ datetimeFormat(partner.partner_promise.timestamp) }}</p>
                        </div>
                    </div>
                    <div class="col-12">
                        <Divider align="center" type="dashed">
                            <Chip label="ข้อมูลที่อยู่" />
                        </Divider>
                    </div>
                    <div class="col-12">
                        <p class="p-0 m-0"><strong>ที่อยู่ : </strong> {{ partner.partner_address }}</p>
                        <p class="p-0"><strong>แขวง/ตำบล : </strong>{{ partner.partner_district }}</p>
                        <p class="p-0"><strong>เขต/อำเภอ : </strong>{{ partner.partner_state }}</p>
                        <p class="p-0"><strong>จังหวัด : </strong>{{ partner.partner_province }}</p>
                    </div>
                </div>
            </Panel>
        </div>
        <div class="col-12 lg:col-6">
            <Panel header="เปลี่ยนรหัสผ่าน">
                <div class="grid">
                    <div class="col-12">
                        <InlineMessage severity="info">
                            <p class="p-0 m-0"><strong>หมายเหตุ : </strong> กรณีเปลี่ยนรหัสผ่านใหม่ต้องมีอย่างน้อย 8
                                ตัวอักษรขึ้นไป</p>
                        </InlineMessage>
                    </div>
                    <div class="col-12">
                        <div class="field mt-2">
                            <span class="p-float-label">
                                <InputText v-model="password" type="password" class="w-full font" />
                                <label>รหัสผ่านใหม่ </label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="field">
                            <span class="p-float-label">
                                <InputText v-model="confirm_password" type="password" class="w-full font" />
                                <label>ยืนยันรหัสผ่านใหม่อีกครั้ง</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-12">
                        <Button label="เปลี่ยนรหัสผ่าน" @click="changePassword()" />
                    </div>
                </div>
            </Panel>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs';
export default {
    async created() {
        await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).catch((err) => {
            if (err.response.status === 408) {
                localStorage.clear();
                window.location.reload();
            }
        })
        document.title = "โปรไฟล์ของฉัน"
    },
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.id}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.partner = res.data.data
        })
    },
    data: () => ({
        partner: [],
        password: '',
        confirm_password: '',
    }),
    methods: {
        dateFormat(date) {
            if (date) {
                return dayjs(date).format('DD/MM/YYYY');
            }

        },
        datetimeFormat(date) {
            if (date) {
                return dayjs(date).format('DD/MM/YYYY เวลา HH:mm:ss');
            }

        },
        changePassword() {
            if (this.password === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกรหัสผ่านที่ต้องการเปลี่ยน', life: 3000 });
                return false;
            }
            if (this.password.length < 8) {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรขึ้นไป', life: 3000 });
                return false;
            }
            if (this.confirm_password === '') {
                this.$toast.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกรหัสผ่านยืนยันอีกครั้ง', life: 3000 });
                return false;
            }
            if (this.password !== this.confirm_password) {
                this.$toast.add({ severity: 'warn', summary: 'รหัสผ่านไม่ตรงกัน', detail: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบให้ถูกต้อง', life: 3000 });
                return false;
            }
            this.$confirm.require({
                message: 'ต้องการเปลี่ยนรหัสผ่านนี้?',
                header: 'เปลี่ยนรหัสผ่าน',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "ตกลง",
                rejectLabel: "ยกเลิก",
                accept: async () => {
                    this.$store.commit('setLoading', true);
                    await axios.put(`${process.env.VUE_APP_SHOP}partner/${this.$store.getters.id}`, {
                        partner_password: this.password
                    }, {
                        headers: {
                            'auth-token': `Bearer ${this.$store.getters.token}`
                        }
                    }).then((res) => {
                        console.log(res);
                        this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว', life: 5000 });
                        this.password = '';
                        this.confirm_password = '';
                        this.$store.commit('setLoading', true);
                    }).catch((err) => {
                        this.$store.commit('setLoading', true);
                        if (err.response.status === 408) {
                            window.location.reload();
                        }
                    })

                },
            });

        }
    }
}
</script>

<style>

</style>