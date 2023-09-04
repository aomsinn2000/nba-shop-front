<template>
  <div class="grid">
    <div class="col-12 text-center">
        <h1>ประวัติสั่งงานบริการอื่นๆ</h1>
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
        <TableOrder/>
    </div>
  </div>
</template>
<script>
import callme from '@/service/callme';
import TableOrder from '@/components/employee/pos/media_service/TableOrder.vue';
export default {
    components:{
        TableOrder
    },
    async created(){
        await callme(localStorage.getItem('token'));
        document.title = 'ประวัติสั่งงานบริการอื่นๆ'
    }
}
</script>

<style>

</style>