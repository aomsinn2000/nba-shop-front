<template>
    <Button icon="pi pi-list mr-2" label="รายละเอียด" class="w-full p-button-text p-button-sm" @click="detail()" />

    <!-- Sidebar -->
    <Sidebar v-model:visible="sidebar" position="right" class="p-sidebar-md">
        <div class="grid">
            <div class="col-12 text-center">
                <h2 class="mb-1">{{ product.productNBA_name }}</h2>
                <Badge :value="'รหัสสินค้า : '+product.productNBA_barcode" severity="info"/>
            </div>
            <div class="col-12 text-center">
                <Image :src="getImage(product.productNBA_image)" width="200" :preview="true" />
            </div>
        </div>
        <div class="grid">
            <div class="col-12 lg:col-4 lg:col-offset-4">
                <AddCart :product="product"/>
            </div>
        </div>
        <div class="grid">
            <div class="col-12">
                <Panel header="รายละเอียด">
                    <div class="grid">
                        <div class="col-12 m-0 p-0">
                            <div v-html="product.productNBA_detail"></div>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </Sidebar>
</template>

<script>
import func from '@/service/function'
import AddCart from '@/components/employee/cart/consignment/AddCart.vue'
export default {
    setup() {
        return func
    },
    components:{
        AddCart
    },
    props: {
        product: Object
    },
    data: () => ({
        sidebar: false
    }),
    methods: {
        detail() {
            this.sidebar = true;
        }
    }


}
</script>

<style></style>