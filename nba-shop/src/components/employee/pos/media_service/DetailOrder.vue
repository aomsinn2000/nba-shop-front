<template>
  <Button label="รายละเอียด" icon="pi pi-list" class="p-button-outlined mr-2" @click="detail()" />

  <!--sidebar detail-->
  <Sidebar v-model:visible="sidebarDetail" position="right" class="p-sidebar-lg">
    <div class="grid">
      <div class="col-12 text-center">
        <h2>เลขที่ใบเสร็จ {{ order.receiptnumber }}</h2>
        <p class="m-0 p-0 mb-2"><strong>วันที่เวลาที่สั่ง : </strong>{{ func.datetimeFormat(order.timestamp) }}</p>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Panel header="เกี่ยวกับลูกค้า & ที่อยู่จัดส่ง">
          <p class="p-0 m-0 mb-2"><strong>ชื่อ : </strong> {{ order.customer_name }}</p>
          <p class="p-0 m-0 mb-2"><strong>เบอร์โทร : </strong> {{ order.customer_contact }}</p>
          <p class="p-0 m-0 mb-2"><strong>ที่อยู่จัดส่ง : </strong> {{ order.customer_address }}</p>
        </Panel>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Panel :header="`ทั้งหมด : ${order.product_detail.length} รายการ`">
          <DataTable :value="order.product_detail" :paginator="true" :rows="5">
            <Column header="รายการ">
              <template #body="item">
                <p class="m-0 p-0">{{ item.data.packagename }}</p>
                <small><strong>หมายเหตุ : </strong>{{ item.data.packagedetail }}</small>
                <!-- <p class="m-0 p-0 text-gray-400" v-if="item.data.code === 'artwork'"><small>{{ item.data.width }} x {{
                  item.data.height }}</small></p> -->
              </template>
            </Column>
            <Column header="ราคา/หน่วย" style="width: 15%">
              <template #body="item">
                <!-- {{ (item.data.code === 'artwork' ? func.numberDigitFormat(item.data.price) : '') }} -->
                {{ func.numberDigitFormat(item.data.price / item.data.quantity) }}
              </template>
            </Column>
            <Column header="จำนวน" style="width: 15%">
              <template #body="item">
                {{ item.data.quantity }}
              </template>
            </Column>
            <Column header="รวม" style="width: 15%">
              <template #body="item">
                {{ func.numberDigitFormat(item.data.price) }}
              </template>
            </Column>
          </DataTable>
        </Panel>
      </div>
    </div>
    <div class="grid" v-if="order.servicename === 'Act of legislation Service(พรบ.)'">
      <div class="col-12">
        <Panel header="รูปภาพ/เอกสารที่แนบมา" v-if="order.status !== 'เรียบร้อย'">
          <div class="grid mt-3">
            <div class="col-12 lg:col-6 text-center">
              <img :src="getImage(order.picture[0])" class="product-image" />
            </div>
            <div class="col-12 lg:col-6 text-center">
              <img :src="getImage(order.picture[1])" class="product-image" />
            </div>
          </div>
        </Panel>
        <Panel header="รูปภาพ/เอกสารที่แนบคืนมา" v-if="order.status === 'เรียบร้อย'">
          <div class="grid mt-3">
            <div class="col-12 lg:col-6 text-center">
              <img :src="getLast(getLastImg(order.deliverdata))" class="product-image" />
            </div>
            <div class="col-12 lg:col-6 text-center">
              <img :src="getLast(getLastImg(order.deliverdata))" class="product-image" />
            </div>
          </div>
          <div class="grid mt-3">
            <div class="col-12 lg:col-6 text-center">
              {{ (order.deliverdata) }}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import func from '@/service/function';
import service_type from '@/service/service_type';
export default {
  setup() {
    return { func, service_type }
  },
  props: {
    order: Object
  },
  data: () => ({
    sidebarDetail: false,
    imagePreview: null,
  }),
  methods: {
    detail() {
      console.log(this.order);
      this.sidebarDetail = true;
    },
    getImage(item) {
      return "https://drive.google.com/uc?export=view&id=" + item;
    },

    getLastImg(item) {
      const last = item[item.length - 1].picture;
      return last;
    },
    getLastFile(item){
      const file = item[item.length - 1].file;
      return file;
    },
    getLast(item){
      const img = item[item.length - 1].imgUrl;
      return img;
    }
  }
}
</script>

<style>
.product-image {
  width: 300px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>