<template>
    <Button label="หน้าจอสำหรับลูกค้า" icon="pi pi-external-link" class="p-button-outlined"
        @click="customerDisplay()" />
</template>

<script>
export default {
    methods: {
        customerDisplay() {
            const url = "/pos/customerdisplay";
            const windowName = "Customer Display";
            window.open(url, windowName, "location=no,height=720,width=1280");
        },
    }
}
</script>

<style>

</style>