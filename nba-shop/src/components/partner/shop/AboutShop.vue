<template>
  <div>
    <div class="grid">
      <div class="col-12">
        สถานะ :
        <Chip
          :label="statusName(shop.shop_status)"
          :class="statusColor(shop.shop_status)"
        />
      </div>
    </div>

    <div class="grid">
      <div class="col-12 lg:col-6">
        <Divider type="dashed">
          <Chip label="ข้อมูลร้าน" />
        </Divider>
        <div class="grid">
          <div class="col-12">
            <strong>ชื่อร้าน :</strong> {{ shop.shop_name }}
          </div>
          <div class="col-12">
              <strong>ที่อยู่ : </strong> {{ shop.shop_address }} 
              ,{{ shop.shop_district }} {{shop.shop_state}} {{shop.shop_province}} {{shop.shop_postcode}}
          </div>
          <div class="col-12">
            <strong>ระดับ : </strong> {{shop.shop_level_name}}
          </div>
          <div class="col-12">
            <strong>ระดับพื้นที่ : </strong> {{shop.shop_level_note}}
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6">
        <Divider type="dashed">
          <Chip label="ข้อมูลการจดทะเบียน" />
        </Divider>
        <div class="grid">
            <div class="col-12">
                <strong>สถานะการจดทะเบียน  :</strong> {{shop.shop_status_tax}}
            </div>
        </div>
        <div class="grid" v-if="shop.shop_status_tax !=='ไม่มี'">
            <div class="col-12 lg:col-6">
                <strong>ชื่อที่ใช้จด : </strong> {{shop.shop_tax_name}}
            </div>
            <div class="col-12 lg:col-6">
                <strong>เลขที่จดทะเบียน : </strong> {{shop.shop_tax_number}}
            </div>
            <div class="col-12">
                <strong>ที่อยู่ :</strong> {{shop.shop_tax_address}}
            </div>
        </div>
      </div>
      <div class="col-12 lg:col-6">
        <Divider type="dashed">
            <Chip label="ฟังก์ชั่นให้บริการ"/>
        </Divider>
        <div class="grid">
            <div class="col-12">
                <div v-for="item in shop.shop_function" :key="item" class="inline">
                    <Chip :label="serviceName(item.name)" class="mr-2 bg-pink-300 text-white mb-2" />
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shop: Object,
  },
  methods: {
    statusName(status) {
      if (status) {
        return "ออนไลน์";
      } else {
        return "ปิดใช้งาน";
      }
    },
    statusColor(status) {
      if (status) {
        return "bg-green-500 text-white";
      } else {
        return "bg-red-500 text-white";
      }
    },
    serviceName(service){
        switch(service){
            case 'pos':
                return 'ขายของหน้าร้าน';
            case 'counter_service':
                return 'เคาน์เตอร์เซอร์วิส';
            case 'artwork':
                return 'ออกแบบสื่อสิ่งพิมพ์';
            case 'express':
                return 'ขนส่งพัสดุ';
            case 'coffee_shop':
                return 'ร้านกาแฟ';
            case 'mobile_topup': 
                return 'เติมเงิน'
            default:
                return service;
        }
    }
  },
};
</script>

<style>
</style>