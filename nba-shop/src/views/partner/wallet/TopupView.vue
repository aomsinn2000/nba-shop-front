<template>
  <div>
    <div class="grid">
      <div class="col-12 text-center">
        <h1>เติมเงินเข้ากระเป๋าอิเล็กทรอนิกส์</h1>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Button label="เติมเงินโดยการโอน" icon="" @click="$router.push('/wallet/topup/slip')" class="mr-2" />
        <Button label="เติมเงินด้วย QR Code" icon="pi pi-qrcode" class="p-button-outlined" @click="$router.push('/wallet/topup/qrcode')"/>
      </div>
      <div class="col-12">
        <TableTopup />
      </div>
    </div>
  </div>
</template>

<script>
import TableTopup from '@/components/partner/wallet/TableTopup.vue';
export default {
  components :{
    TableTopup
  },
  created(){
    document.title = "เติมเงินเข้ากระเป๋าอิเล็กทรอนิกส์"
  }
}
</script>

<style>

</style>