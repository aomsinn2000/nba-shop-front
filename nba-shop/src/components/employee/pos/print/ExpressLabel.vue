<template>
    <div class="grid">
        <div class="col-12">
            <Button label="พิมพ์ใบปะหน้า" icon="pi pi-print" class="w-full" @click="print()" />
        </div>
    </div>

    <!-- Print -->
        <div id="printLabel" style="display : none;" v-html="html">

        </div>

</template>

<script>
export default {
    props: {
        order: String
    },
    data: () => ({
        html: ""
    }),
    methods: {
        print() {
            var a = window.open();
            a.document.write(this.order);
            a.document.close();
            setTimeout(() => {
                a.print();
                a.close();
            }, 1000)
        }
    }
}
</script>

<style>

</style>