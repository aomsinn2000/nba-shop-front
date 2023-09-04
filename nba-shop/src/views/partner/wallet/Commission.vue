<template>
    <div>
      <div class="grid">
          <div class="col-12 text-center">
              <h1>คอมมิชชั่นสะสม</h1>
          </div>
      </div>
      <div class="grid">
          <div class="col-12">
              <TableCommission/>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import TableCommission from '@/components/partner/wallet/TabelCommission.vue';
  export default {
      components :{
        TableCommission
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
      document.title = "คอมมิชชั่นสะสม"
    },
  }
  </script>
  
  <style>
  
  </style>