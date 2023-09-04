<template>
  <Button icon="pi pi-user" label="ผู้ส่ง" class="m-1 p-button-outlined" @click="openDialogFrom()"/>

  <!-- Dialog Parcel-->
  <Dialog header="รายละเอียดผู้ส่ง" v-model:visible="display" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '25vw' }">
        <div class="grid">
            <div class="col-12">
                <Card class="border-1 shadow-none border-gray-300">
                    <template #content>
                        <h3 class="m-0 text-center">ชื่อ</h3>
                        <p class="m-0 mt-1 text-center">{{ from.name }}</p>
                        <Divider></Divider>
                        <h3 class="m-0 mt-3 text-center">เบอร์โทร</h3>
                        <p class="m-0 mt-1 text-center">{{ from.tel }}</p>
                    </template>
                </Card>

                <Card class="border-1 shadow-none border-gray-300 mt-3">
                    <template #content>
                        <h3 class="m-0 text-center">ที่อยู่</h3>
                        <p class="m-0 mt-2 text-center">{{ from.address }}</p>
                        <Divider></Divider>
                        <p class="m-0 mt-2 text-center">{{ from.district }} , {{ from.state }}</p>
                        <p class="m-0 mt-2 text-center">{{ from.province }}</p>
                        <p class="m-0 mt-2 text-center">{{ from.postcode }}</p>
                        
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
        from : Object
    },
    data : ()=>({
        display : false
    }),
    methods :{
        openDialogFrom(){
            this.display = true;
        }
    }
}
</script>

<style>

</style>