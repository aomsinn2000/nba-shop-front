<template>
  <Button @click="dialog=true" class="p-button-text  p-0 m-0 ml-2" label="เงื่อนไขและข้อตกลง" />
  
  <Dialog header="เงื่อนไขและข้อตกลง" v-model:visible="dialog" modal :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '50vw' }">
    <div class="grid">
        <div class="col-12">
            <p><strong>1. </strong> ระบบนี้เป็นเพียงระบบคีย์พัสดุและเรียกขนส่งนั้นๆ เข้ารับพัสดุเท่านั้น ระยะเวลาในการจัดส่งพัสดุจะช้าหรือเร็ว ขึ้นอยู่กับแบรนด์ขนส่งนั้นๆ ไม่ได้เกี่ยวข้องโดยตรงกับบริษัท</p>
            <p><strong>2. </strong> การคีย์ข้อมูลขนาดพัสดุ กว้างxยาวxสูง(เซนติเมตร) และน้ำหนักของพัสดุ(กรัม) จะต้องคีย์ตามความจริง <strong><em>หากคีย์ไม่ตรงกับพัสดุจริงทางบริษัทจะหักเงินในกระเป๋าพาร์ทเนอร์ร้านค้าตามจำนวนส่วนต่างทันที โดยไม่แจ้งให้ทราบล่วงหน้า</em></strong></p>
            <p><strong>3. </strong> หากขนส่งมารับพัสดุหรือร้านค้ายินยอมให้ขนส่งรับพัสดุไปโดยไม่สแกนเข้ารับพัสดุหน้างาน หากพัสดุชิ้นนั้นเกิดการสูญหาย บริษัทจะไม่มีการรับผิดชอบทุกกรณี เนื่องจากทางร้านค้าไม่ปฏิบัติตามกฎและเงื่อนไขในการส่งพัสดุกับทางบริษัท</p>
        </div>
    </div>
    <template #footer>
        <Button label="ปิด" class="p-button-text" @click="dialog =false" />
    </template>
  </Dialog>
</template>

<script>
export default {
    data: ()=>({
        dialog: false,
    })
}
</script>

<style>

</style>