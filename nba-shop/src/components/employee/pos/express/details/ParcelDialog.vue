<template>
    <Button icon="pi pi-box" class="p-button-success p-button-outlined m-1" @click="showDisplay()" />

    <!-- Dialog Parcel-->
    <Dialog header="รายละเอียด" v-model:visible="display" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div class="grid">
            <div class="col-12">
                <Card class="border-1 shadow-none border-gray-300">
                    <template #content>
                        <h3 class="m-0 text-center">น้ำหนัก</h3>
                        <p class="m-0 mt-3 text-center">{{ numberFormat(parcel.weight) }} กรัม</p>
                    </template>
                </Card>

                <Card class="border-1 shadow-none border-gray-300 mt-3">
                    <template #content>
                        <h3 class="m-0 text-center">กว้าง x ยาว x สูง</h3>
                        <p class="m-0 mt-3 text-center">{{ parcel.width }} x {{ parcel.length }} x {{ parcel.height }} เซนติเมตร</p>
                    </template>
                </Card>
            </div>
        </div>
        <template #footer>
            <Button label="ตกลง" icon="pi pi-check" @click="display = false" />
        </template>
    </Dialog>
</template>

<script>
export default {
    props: {
        parcel: Object
    },
    data: () => ({
        display: false
    }),
    methods: {
        showDisplay() {
            this.display = true;
        },
        numberFormat(num) {
            return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
        },
    }
}
</script>

<style>

</style>