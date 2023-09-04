<template>
  <div>
    <div class="grid">
      <div class="col-12">
        <marquee-text class="text-slide" :repeat="30">กรณี <strong>"ยกเลิกใบเสร็จ"</strong> จะสามารถยกเลิกได้ภายในวันเท่านั้น และเป็นการยกเลิกทั้งใบเสร็จ ไม่สามารถยกเลิกบางรายการได้  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ใบกำกับภาษีสามารถออกได้เฉพาะร้านค้าที่จดทะเบียนภาษีมูลค่าเพิ่มเท่านั้น!</marquee-text>
      </div>
    </div>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>ประวัติการขายสินค้า</h1>
        </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <History/>
      </div>
    </div>
  </div>
</template>
<script>
import History from '@/components/employee/pos/shop/History.vue'
export default {
  components:{
    History
  }
}
</script>

<style scoped>
.text-slide{
  background-color:red;
  color : white;
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>