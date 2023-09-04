<template>
    <div class="grid">
        <div class="col-6">
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                        <i class="pi pi-search"></i>
                </span>
                <InputText v-model="search" placeholder="กรอกคีย์ชื่อสินค้าที่ต้องการค้นหา" class="w-full font" @keyup="searchData()"/>
            </div>
        </div>
    </div>
    <div class="grid">
        <div class="col-12">
            <DataView :value="item_product" :paginator="true" :rows="20">
                <template #empty>
                    <p><em>ไม่พบข้อมูลสินค้า</em></p>
                </template>
                <template #list="item">
                    <div class="col-12 md:col-3">
                        <div class="product-grid-item card">
                            <div class="product-grid-item-content">
                                <img :src="getImage(item.data.productNBA_image)" style="width: 100%" />
                                <div class="product-name">
                                    {{ item.data.productNBA_name }}
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col-12 text-right">
                                    <p class="p-0 m-0"><small>กำไร : </small><strong>{{ numberFormat(item.data.productNBA_price - item.data.productNBA_cost) }}</strong> .-</p>
                                    <p class="p-0 m-0"><small>ราคาหน้าร้าน : </small><strong>{{ numberFormat(item.data.productNBA_price) }}</strong> .-</p>
                                    <h2 class="p-0 m-0"><small style="font-size:14px">ราคา(ต้นทุน) : </small><strong>{{ numberFormat(item.data.productNBA_cost) }}</strong><small>.-</small></h2>
                                </div>
                            </div>
                            <div>
                                <div v-for="item in item.data.productNBA_type" :key="item" class="inline">
                                    <Badge :value="nameProductType(item)" class="mr-1" severity="success"></Badge>
                                </div>
                            </div>
                            <div class="grid mt-2">
                                <div class="col-12">
                                    <AddCart :product="item.data"/>
                                </div>
                                <div class="col-12">
                                    <ProductDetail :product="item.data" />
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
import func from '@/service/function'
import AddCart from '@/components/employee/cart/consignment/AddCart.vue'
import ProductDetail from './consignment/ProductDetail.vue'
export default {
    setup() {
        return func;
    },
    components: {
        AddCart, ProductDetail
    },
    async mounted() {
        this.$store.commit('setLoading', true);
        //load product type
        await axios
            .get(`${process.env.VUE_APP_SHOP}type`, {
                headers: {
                    "auth-token": `Bearer ${this.$store.getters.token}`,
                },
            })
            .then((res) => {
                this.item_product_type = res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
        //load product
        await axios.get(`${process.env.VUE_APP_SHOP}product/nba/by/consignment`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.products = res.data.data.filter((el)=>el.productNBA_status!==false && el.productNBA_stock !== 0);
            this.item_product = this.products;
        }).catch((err) => {
            if (err.response.status === 408) {
                window.location.reload();
            }
            this.$store.commit('setLoading', false);
            this.$toast.add({ severity: 'error', summary: 'ไม่สำเร็จ', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })
        this.$store.commit('setLoading', false);
    },
    data: () => ({
        products: [],
        item_product: [],
        product_type: [],
        search : '',
    }),
    methods: {
        nameProductType(item) {
            const product_type = this.item_product_type.find((el) => el._id === item);
            if (product_type) {
                return product_type.type_name;
            } else {
                return 'ไม่มีประเภท'
            }
        },
        clearSearch(){
            this.search = '';
        },
        searchData(){
            if(this.search !== ''){
                this.item_product = this.products.filter((el)=>el.productNBA_name.search(this.search)!==-1);
            }else{
                this.item_product = this.products
            }
        }
    }
}
</script>

<style scoped>
.card {
    background: #ffffff;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
    font-size: 1.2rem;
    font-weight: 700;
}

.product-description {
    margin: 0 0 1rem 0;
}

.product-category-icon {
    vertical-align: middle;
    margin-right: 0.5rem;
}

.product-category {
    font-weight: 600;
    vertical-align: middle;
}

::v-deep(.product-list-item) {
    display: flex;
    align-items: center;
    padding: 1rem;
    width: 100%;

    img {
        width: 50px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        margin-right: 2rem;
    }

    .product-list-detail {
        flex: 1 1 0;
    }

    .p-rating {
        margin: 0 0 0.5rem 0;
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        align-self: flex-end;
    }

    .product-list-action {
        display: flex;
        flex-direction: column;
    }

    .p-button {
        margin-bottom: 0.5rem;
    }
}

::v-deep(.product-grid-item) {
    margin: 0.5rem;
    border: 1px solid var(--surface-border);

    .product-grid-item-top,
    .product-grid-item-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    img {
        margin: 2rem 0;
        max-width: 300px;
    }

    .product-grid-item-content {
        text-align: center;
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 600;
    }
}

@media screen and (max-width: 576px) {
    .product-list-item {
        flex-direction: column;
        align-items: center;

        img {
            margin: 1rem 0;
        }

        .product-list-detail {
            text-align: center;
        }

        .product-price {
            align-self: center;
        }

        .product-list-action {
            display: flex;
            flex-direction: column;
        }

        .product-list-action {
            margin-top: 2rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
}
</style>