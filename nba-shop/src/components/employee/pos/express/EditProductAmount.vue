<template>
    <Button icon="pi pi-pencil" class="p-button-sm p-button-outlined m-1" @click="openDialog()" />


    <!-- Dialog Amount-->
    <Dialog header="จำนวน" v-model:visible="dialogAmount" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '20vw' }">
        <div class="grid">
            <div class="col-12 mb-0">
                <div class="field mb-0">
                    <label>จำนวน : </label>
                    <InputNumber v-model="amount" class="w-full mt-0 mb-0" inputClass="font w-full" placeholder="กรอกจำนวน" :min="1" showButtons />
                </div>

            </div>
        </div>
        <template #footer>
            <Button @click="dialogAmount = false" class="p-button-text" label="ยกเลิก" />
            <Button @click="updateAmount()" icon="pi pi-check" label="ตกลง" />
        </template>
    </Dialog>
</template>

<script>
export default {
    props: {
        data: Object
    },
    data: () => ({
        dialogAmount: false,
        amount: null
    }),
    methods: {
        openDialog() {
            console.log(this.data);
            this.amount = this.data.amount;
            this.dialogAmount = true;
        },
        updateAmount() {
            console.log("update amount")
            if (this.amount < 1) {
                this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'จำนวนต้องมีขึ้นต่ำ 1', life: 3000 });
                return false;
            }
            const data = {
                ...this.data,
                amount : this.amount,
                total : this.data.detail.price * this.amount
            };
            console.log(data);
            this.$store.commit('updateOrderExpress', data)
            this.dialogAmount = false;
        }
    }
}
</script>

<style>

</style>