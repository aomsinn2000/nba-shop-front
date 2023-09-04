<template>
  <Button icon="pi pi-info-circle" class="p-button-warning p-button-outlined" title="เหตุผลที่ยกเลิก" @click="open()" />

  <!-- Dialog Remark-->
  <Dialog v-model:visible="display" header="เหตุผลที่ถูกยกเลิก" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '25vw'}">
    <div class="grid">
        <div class="col-12">
            <p>{{ this.msg }}</p>
        </div>
    </div>
    <template #footer>
        <Button label="ตกลง" @click="display = false" />
    </template>
  </Dialog>
</template>

<script>
export default {
    props : {
        msg: String
    },
    data: ()=> ({
        display : false
    }),
    methods: {
        open(){
            this.display = true;
        }
    }
}
</script>

<style>

</style>