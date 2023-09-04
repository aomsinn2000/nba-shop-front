<template>
    <Button icon="pi pi-pencil" class="p-button-sm p-button-outlined mr-1" @click="dialogEdit()" />


    <!-- Dialog -->
    <Dialog v-model:visible="dialog" header="แก้ไขจำนวนและรายละเอียด" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '55vw' }">
        <div class="grid mt-3">
            <div class="col-12 lg:col-4">
                <div class="field">
                    <span class="p-float-label">
                        <InputNumber v-model="amount" :min="1" showButtons placeholder="กรอกจำนวนชิ้นงานที่ต้องการสั่ง" inputClass="w-full" class="w-full" />
                        <label>จำนวน/ชิ้น</label>
                    </span>
                </div>

            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <div class="field">
                    <label>รายละเอียดเพิ่มเติม (ถ้ามี) :</label>
                    <Editor v-model="detail" editorStyle="height: 200px">
                        <template #toolbar>
                            <span class="ql-formats">
                                <button class="ql-bold"></button>
                                <button class="ql-italic"></button>
                                <button class="ql-underline"></button>
                            </span>
                        </template>
                    </Editor>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="ยกเลิก" class="p-button-danger p-button-outlined" @click="dialog=false"/>
            <Button label="อัพเดต" @click="updateDetail()"/>
        </template>
    </Dialog>
</template>

<script>
export default {
    props: {
        artwork: Object
    },
    data: () => ({
        dialog: false,
        detail: '',
        amount : 0,
    }),
    methods: {
        dialogEdit() {
            console.log('artwork', this.artwork);
            this.detail = this.artwork.detail;
            this.amount = this.artwork.amount;
            this.dialog = true;
        },
        updateDetail(){
            console.log('update detail');
            this.$confirm.require({
                message: 'ยืนยันการแก้ไขรายละเอียด?',
                header: 'อัพเดตรายละเอียด',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel : 'ตกลง',
                rejectLabel : 'ยกเลิก',
                accept: () => {
                    const new_data = {...this.artwork, detail: this.detail, amount: this.amount};
                    this.$store.dispatch('updateArtwork', new_data);
                    this.$toast.add({severity:'success', summary: 'สำเร็จ', detail:'อัพเดตข้อมูลสื่อสิ่งพิมพ์เรียบร้อยแล้ว', life: 3000});
                    this.dialog = false;
                }
            });
        }
    }
}
</script>

<style></style>