<template>
  <Button label="รายละเอียด" icon="pi pi-list" class="p-button-outlined mr-2" @click="detail()" />

  <!--sidebar detail-->
  <Sidebar v-model:visible="sidebarDetail" position="right" class="p-sidebar-lg">
    <div class="grid">
      <div class="col-12 text-center">
        <h2>เลขที่ใบเสร็จ {{ order.invoice }}</h2>
        <p class="m-0 p-0 mb-2"><strong>วันที่เวลาที่สั่ง : </strong>{{ func.datetimeFormat(order.timestamp) }}</p>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Panel header="เกี่ยวกับลูกค้า & ที่อยู่จัดส่ง">
          <p class="p-0 m-0 mb-2"><strong>ชื่อ : </strong> {{ order.cus_name }}</p>
          <p class="p-0 m-0 mb-2"><strong>เบอร์โทร : </strong> {{ order.cus_tel }}</p>
          <p class="p-0 m-0 mb-2"><strong>ที่อยู่จัดส่ง : </strong> {{ order.cus_address }}</p>
        </Panel>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Panel :header="`ทั้งหมด : ${func.numberFormat(order.order_detail.length)} รายการ`">
          <DataTable :value="order.order_detail" :paginator="true" :rows="5">
            <Column header="รายการ">
              <template #body="item">
                <p class="m-0 p-0">{{ item.data.name }}</p>
                <p class="m-0 p-0 text-gray-400" v-if="item.data.code === 'artwork'"><small>{{ item.data.width }} x {{
                  item.data.height }}</small></p>
              </template>
            </Column>
            <Column header="ราคา/หน่วย" style="width: 15%">
              <template #body="item">
                {{ (item.data.code === 'artwork' ? func.numberDigitFormat(item.data.price) : '') }}
              </template>
            </Column>
            <Column header="จำนวน" style="width: 15%">
              <template #body="item">
                {{ func.numberFormat(item.data.amount) }}
              </template>
            </Column>
            <Column header="รวม" style="width: 15%">
              <template #body="item">
                {{ func.numberDigitFormat(item.data.total) }}
              </template>
            </Column>
          </DataTable>
        </Panel>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Panel header="กระบวนการ">
          <div class="grid">
            <div class="col-12">
              <Timeline :value="order.status">
                <template #opposite="slotProps">
                  <small class="p-text-secondary">{{ func.datetimeFormat(slotProps.item.timestamp) }}</small>
                </template>
                <template #content="slotProps">
                  <p class="p-0 m-0">{{ slotProps.item.name }}</p>
                  <p class="p-0 m-0" v-if="slotProps.item.name === 'สำเร็จ'"><strong>ขนส่ง : </strong>{{ order.courier_name }} | <strong>เลขพัสดุ : </strong>{{ order.tracking_code }}</p>       
                </template>
              </Timeline>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import func from '@/service/function';
import artwork_type from '@/service/artwork_type';
export default {
  setup() {
    return { func, artwork_type }
  },
  props: {
    order: Object
  },
  data: () => ({
    sidebarDetail: false
  }),
  methods: {
    detail() {
      console.log(this.order);
      this.sidebarDetail = true;
    }
  }
}
</script>

<style></style>