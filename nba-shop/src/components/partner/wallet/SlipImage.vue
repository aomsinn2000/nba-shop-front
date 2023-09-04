<template>
  <Button icon="pi pi-image" title="รูปหลักฐานที่แนบ" @click="open()" class="mr-2"/>

  <Dialog v-model:visible="display" header="รูปภาพที่แนบ" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '25vw'}">
    <div class="grid">
        <div class="col-12 text-center">
            <Image :preview="true" :src="getImage(topup.detail.slip_img)" width="300"/>
        </div>
    </div>
    <template #footer>
        <Button label="ตกลง" @click="display = false" />
    </template>
  </Dialog>
</template>

<script>
export default {
    props:{
        topup : Object
    },
    data: ()=>({
        display : false
    }),
    methods: {
        open(){
            this.display = true;
        },
        getImage(item){
                return 'https://drive.google.com/uc?export=view&id='+item         
        }
    }
}
</script>

<style>

</style>