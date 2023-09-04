<template>
  <Panel>
    <template #header><i class="pi pi-list"></i>ยอดรวมสุทธิ (บาท)</template>
    <h1 class="text-total text-right">
      {{ numberFormat($store.getters.order_act_total) }}
    </h1>
    <div class="grid">
      <div class="col-12 lg:col-6">
        <p style="margin: 0" class="text-right text-gray-500" v-if="this.$store.getters.order_discount !== 0">
          ส่วนลด : {{ numberFormat($store.getters.order_discount) }}
        </p>
      </div>
    </div>
  </Panel>
</template>

<script>
import func from '@/service/function'
export default {
  setup() {
    return func
  }
}
</script>

<style></style>