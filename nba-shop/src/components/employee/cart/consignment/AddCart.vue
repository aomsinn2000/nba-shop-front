<template>
    <div class="p-inputgroup">
        <InputNumber v-model="amount" showButtons :step="1" :min="1" :max="product.productNBA_stock" buttonLayout="horizontal"
            incrementButtonClass="p-button-success" decrementButtonClass="p-button-danger"
            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" inputClass="border-noround" />
        <Button icon="pi pi-cart-plus" class="ml-2 border-round" @click="addCart()"/>
    </div>
</template>

<script>

export default {
    props:{
        product: Object
    },
    data: () => ({
        amount: 1
    }),
    methods: {
        addCart(){
            const data = {
                ...this.product,
                amount : this.amount,
                total : this.product.productNBA_cost*this.amount
            }
            this.$store.commit('addConsignment', data);
            this.$toast.add({severity:'success', summary: 'เพิ่มสำเร็จ', detail:'เพิ่มในรายการสั่งเรียบร้อยแล้ว', life: 3000});
        }
    }
}
</script>

<style></style>