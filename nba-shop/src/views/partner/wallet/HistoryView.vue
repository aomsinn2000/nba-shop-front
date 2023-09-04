<template>
  <div>
    <div class="grid">
        <div class="col-12 text-center">
            <h1>ประวัติการทำรายการ</h1>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <TableHistory/>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TableHistory from '@/components/partner/wallet/TableHistory.vue';
export default {
    components :{
        TableHistory
    },
    async created() {
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
      headers: {
        'auth-token': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch((err) => {
      if (err.response.status === 408) {
        window.location.reload();
      }
    })
    document.title = "ประวัติการทำรายการกระเป๋าเงินอิเล็กทรอนิกส์"
  },
}
</script>

<style>

</style>