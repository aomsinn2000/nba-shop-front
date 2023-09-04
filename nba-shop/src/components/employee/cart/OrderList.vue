<template>
  <div>
    <div class="grid">
      <div class="col-12 lg:col-6">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-bookmark"></i>
          </span>
          <InputText v-model="search" class="w-full font" placeholder="กรอกเลขใบสั่งซื้อ" @keyup.enter="searchData()" />
          <Button @click="searchData()" icon="pi pi-search" />
          <Button @click="clearSearch(), search = ''" icon="pi pi-times" class="p-button-danger" v-if="search !== ''" />
        </div>
      </div>
      <div class="col-12 lg:col-6">
        <div class="grid">
          <div class="col-12">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                จาก
              </span>
              <Calendar :manualInput="false" v-model="datestart" class="w-full" inputClass="font"
                placeholder="เลือกวันที่เริ่มต้น" showButtonBar />
              <span class="p-inputgroup-addon">
                ถึง
              </span>
              <Calendar :manualInput="false" v-model="dateend" class="w-full" inputClass="font"
                placeholder="เลือกวันที่สิ้นสุด" showButtonBar />

              <Button icon="pi pi-search" @click="searchByDate()" class="pl-4 pr-4" />
              <Button icon="pi pi-times" @click="clearSearch()" class="p-button-danger pl-4 pr-4"
                v-if="datestart !== '' && dateend !== ''" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="col-12">
        <DataTable :value="item_preorder" responsiveLayout="scroll" :paginator="true" :rows="10">
          <template #empty>
            <p class="text-center"><em>ไม่พบข้อมูลใบสั่งซื้อ</em></p>
          </template>
          <Column header="เลขใบสั่งซื้อ">
            <template #body="item">
              <Chip :label="item.data.ponba_number" />
            </template>
          </Column>

          <Column header="จำนวนรายการ">
            <template #body="item">
              {{ numberFormat(item.data.ponba_detail.length) }} รายการ
            </template>
          </Column>
          <Column header="ยอดรวม">
            <template #body="item">
              {{ numberFormat(item.data.ponba_total) }} บาท
            </template>
          </Column>
          <Column header="วันที่สั่งซื้อ">
            <template #body="item">
              {{ datetimeFormat(item.data.ponba_timestamp[0].timestamp) }}
            </template>
          </Column>
          <Column header="สถานะ">
            <template #body="item">
              <Chip :label="item.data.ponba_status" :class="statusColor(item.data.ponba_status)" />
            </template>
          </Column>

          <Column header="ตัวเลือก">
            <template #body="item">
              <OrderDetail :ponba="item.data" v-if="item.data.ponba_status === 'ยืนยันการสั่งสินค้า'" />
              <Button v-if="item.data.ponba_status === 'รอตรวจสอบ'" icon="pi pi-list" label="รายละเอียด"
                @click="openDetail(item.data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Sidebar Detail-->
    <Sidebar v-model:visible="sidebarDetail" position="right" class="p-sidebar-md">
      <div v-if="ponba !== null">
        <div class="grid">
          <div class="col-12 text-center">
            <h3>เลขที่ใบสั่งซื้อ {{ ponba.ponba_number }}</h3>
            <p>
              วันที่สั่งซื้อ
              {{ datetimeFormat(ponba.ponba_timestamp[0].timestamp) }}
            </p>
          </div>
        </div>
        <div class="grid">
          <Divider type="dashed" align="center">
            <Chip label="รายละเอียดสินค้า" />
          </Divider>
          <div class="col-12">
            <DataTable :value="ponba.ponba_detail">
              <template #header>
                ทั้งหมด : {{ numberFormat(ponba.ponba_detail.length) }} รายการ
              </template>
              <Column field="productNBA_name" header="รายการ"></Column>
              <Column style="width: 20%" header="ราคา/หน่วย">
                <template #body="item">
                  {{ numberFormat(item.data.productNBA_cost) }}
                </template>
              </Column>
              <Column style="width: 20%" header="จำนวน">
                <template #body="item">
                  {{ numberFormat(item.data.amount) }}
                </template>
              </Column>
              <Column style="width: 20%" header="ยอดรวม">
                <template #body="item">
                  {{ numberFormat(item.data.total) }}
                </template>
              </Column>
              <template #footer>
                ยอดสุทธิ : {{ numberFormat(this.ponba.ponba_total) }} บาท
              </template>
            </DataTable>
          </div>
          <Divider type="dashed" align="center">
            <Chip label="รายละเอียดสถานะ" />
          </Divider>
          <div class="col-12">
            <Timeline :value="ponba.ponba_timestamp">
              <template #opposite="data">
                <small class="p-text-secondary">{{
                  datetimeFormat(data.item.timestamp)
                }}</small>
              </template>
              <template #content="data">
                <strong>
                  {{ data.item.name }}
                </strong>
              </template>
            </Timeline>
          </div>

        </div>
      </div>
    </Sidebar>


  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import OrderDetail from './OrderDetail.vue';
// import OrderDetail from "@/components/employee/cart/OrderDetail.vue"
export default {
  components: { OrderDetail },
  async mounted() {
    await axios
      .get(
        `${process.env.VUE_APP_SHOP}preorder/nba/shop-id/${localStorage.getItem(
          "shop_id"
        )}`,
        {
          headers: {
            "auth-token": `Bearer ${this.$store.getters.token}`,
          },
        }
      )
      .then((res) => {
        this.preoders = res.data.data;
        this.item_preorder = this.preoders.reverse();
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
        this.$toast.add({
          severity: "error",
          summary: "ผิดพลาด",
          detail: err.response.data.message,
          life: 3000,
        });
        this.$router.push("/");
      });
  },
  data: () => ({
    sidebarDetail: false,
    preoders: [],
    item_preorder: [],
    search: "",
    datestart: "",
    dateend: "",
    ponba: null,
  }),
  methods: {
    openDetail(item) {
      this.ponba = item;
      this.sidebarDetail = true;
    },
    searchData() {
      if (this.search === "") {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกเลขที่ใบสั่งซื้อที่ต้องการค้นหา",
          life: 3000,
        });
        return false;
      }
      this.item_preorder = this.preoders.filter(
        (el) => el.ponba_number.search(this.search) !== -1
      );
    },
    searchByDate() {
      if (this.datestart === "" || this.dateend === "") {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณาเลือกช่วงวันที่เริ่มต้นและสิ้นสุดที่ต้องการค้นหา",
          life: 3000,
        });
        return false;
      }
      this.item_preorder = this.preoders.filter(
        (el) =>
          dayjs(el.ponba_timestamp[0].timestamp).format("YYYY-MM-DD") >=
          dayjs(this.datestart).format('YYYY-MM-DD') &&
          dayjs(el.ponba_timestamp[0].timestamp).format("YYYY-MM-DD") <=
          dayjs(this.dateend).format('YYYY-MM-DD')
      );
    },
    clearSearch() {
      this.item_preorder = this.preoders
    },
    numberFormat(num) {
      return num.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    },
    datetimeFormat(date) {
      return dayjs(date).format("DD/MM/YYYY เวลา HH:mm:ss");
    },
    statusColor(status) {
      switch (status) {
        case "รอตรวจสอบ":
          return "bg-gray-500 text-white";
        case "ยืนยันการสั่งสินค้า":
          return "bg-yellow-500 text-white";
        case "อยู่ระว่างจัดส่ง":
          return "bg-purple-500 text-white";
        case "ขนส่งสำเร็จ":
          return "bg-orange-500 text-white";
        case "นำเข้าสต๊อก":
          return "bg-green-500 text-white";
        default:
          return "bg-red-500 text-white";
      }
    },
  },
};
</script>

<style></style>