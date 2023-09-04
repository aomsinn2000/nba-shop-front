<template>
    <div class="grid">
        <div class="col-12">
            <DataView :value="products" :paginator="true" :rows="10">
                <template #empty>
                    <p><em>--ไม่พบรายการสินค้า--</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 lg:col-3 md:col-4 sm:col-6">
                        <div class="card">
                            <div class="card-amount"
                                v-if="$store.getters.amountProductExpressById(item.data._id) !== 0">
                                <p v-html="$store.getters.amountProductExpressById(item.data._id)"></p>
                                <button class="card-btn" @click="delOrder(item.data._id)" ><i class="pi pi-trash"></i></button>
                            </div>
                            <div @click="addOrder(item.data)" class="pb-2 pt-2">
                                <div class="card-img">
                                    <img src="https://cdn-icons-png.flaticon.com/512/679/679821.png" />
                                </div>
                                <div class="card-head">
                                    {{ item.data.name }}
                                </div>
                                <div class="card-price">
                                    <p><small>ราคา : </small><strong>{{ numberFormat(item.data.price) }}</strong><small> บาท</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    async created() {
        await axios.get(`${process.env.VUE_APP_SHOP}express/product/shop_id/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.products = res.data.data;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
        })
    },
    data: () => ({
        products: [],
    }),
    methods: {
        addOrder(item){
            //check ถ้าไม่มีพัสดุที่จะส่งจะไม่สามารถเพิ่มสินค้าได้
            if(this.$store.getters.order_express.length===0){
                this.$toast.add({ severity: 'warn', summary: 'ไม่มีพัสดุที่ส่ง', detail: 'เนื่องจากไม่มีพัสดุที่ส่งจริงไม่สามารถเพิ่มสินค้าได้', life: 3000 });
                return false;
            }
            const data = { 
                id : item._id,
                type : "product", 
                detail : item,
                amount : 1,
                total : item.price
            }
            this.$store.dispatch('addOrderExpress', data);
            this.$toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มรายการสินค้าเรียบร้อยแล้ว', life: 3000 });
        },
        delOrder(item){
            
            this.$store.dispatch('delOrderExpress', item);
        },
        numberFormat(num) {
            return num.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        },
        
    }
}
</script>

<style scoped>
.card {
    position: relative;
    margin: 3px;
    border-radius: 5px;
    border: 1px solid rgb(167, 167, 167);
    cursor: pointer;
}

.card:active {
    transform: scale(0.9);
    transition: all 0.3s ease-in-out;
    opacity: 0.8;
}
.card:hover{
    transform: scale(1.03);
    transition: all 0.1s ease-in-out;
}

.card-img>img {
    width: 100%;
}

.card-head {
    font-weight: bold;
    padding: 3px;
}

.card-price {
    padding: 3px;
}

.card-price>p {
    margin: 0;
}

.card-amount {
    position: absolute;
    padding: 5px;
    top: 0;
    left: 0;
    z-index: 3;
    background-color: white;
    border-radius: 3px;
}

.card-amount>p {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.card-btn {
    cursor: pointer;
    border: 1px solid red;
    border-radius: 3px;
    padding: 10px;
    background-color: white;
    color: red;
}

.card-btn:hover {
    color: white;
    background-color: red;
}
</style>