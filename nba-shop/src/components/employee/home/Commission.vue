<template>
    <Button label="ประวัติการเติมเงิน" class="p-button-outlined mr-2" @click="shopDialog" />
  
    <Dialog header="ประวัติการเติมเงิน" v-model:visible="displayHistory" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }">
      <div class="loading" v-if="isloading === true">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <DataTable :value="partner_money_history" :paginator="true" :rows="10"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 20, 50]" responsiveLayout="scroll"
          currentPageReportTemplate="แสดง {first} ถึง {last} ใน {totalRecords}">
          <Column field="type" header="รายการ">
            <template #body="item">
              <Chip :label="item.data.type" :class="statusColor(item.data.type)" />
            </template>
          </Column>
          <Column field="name" header="จำนวน">
            <template #body="item"> {{ numberFormat(item.data.amount) }} บาท</template>
          </Column>
          <Column field="name" header="รายละเอียด"></Column>
          <Column field="timestamp" header="วันที่ทำรายการ">
            <template #body="item">
              {{ dateFormat(item.data.timestamp) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>
  </template>
  
  <script>
  import { ref } from "@vue/reactivity";
  import dayjs from "dayjs";
  import axios from "axios";
  import "dayjs/locale/th";
  export default {
    props: {
      partner_id: String,
    },
    setup(props) {
      const partner_id = ref();
      const displayHistory = ref(false);
      const isloading = ref(true);
      const partner_money_history = ref([]);
  
      const shopDialog = () => {
        partner_id.value = props.partner_id;
        displayHistory.value = true;
        fetchMoney_history();
        console.log(props.partner_id);
      };
  
      const fetchMoney_history = async () => {
        await axios
          .get(`${process.env.VUE_APP_SHOP}more/money_history`, {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          })
          .then((res) => {
            const money_history = res.data.data;
            const filter_history = money_history.filter(
              (el) => el.partner_id === partner_id.value
            );
            partner_money_history.value = filter_history.reverse();
            console.log(filter_history);
            isloading.value = false;
          });
      };
      const statusColor = (type) => {
        switch (type) {
          case "เงินเข้า":
            return "bg-green-600 text-white";
          case "เงินออก":
            return "bg-red-600 text-white";
        }
      };
      const dateFormat = (date) => {
        return dayjs(date).locale("th").add(543, "year").format("DD MMMM YYYY");
      };
  
      return {
        dateFormat,
        shopDialog,
        statusColor,
        displayHistory,
        isloading,
        partner_money_history,
      };
    },
    methods: {
      numberFormat(num) {
        return num.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #b434db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  
  .with-border {
    border: 1px solid rgb(155, 153, 153);
  }
  </style>
  