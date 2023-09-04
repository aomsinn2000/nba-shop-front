<template>
    <div class="grid" v-if="!loading">
        <div class="col-12">
            <Panel class="w-full ">
                <template #header>
                    <p class="m-0 p-0"><i class="pi pi-microsoft icon-color" ></i> &nbsp;<strong>เมนูบริการ</strong></p>
                </template>
                <div class="grid background-menu">
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('pos') === true">
                        <div class="menu" @click="$router.push('/pos/shop')">
                            <img src="@/assets/img/icon_menu/pos.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('counter_service') === true">
                        <div class="menu" @click="$router.push('/pos/counter_service')">
                            <img src="@/assets/img/icon_menu/counter.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('express') === true">
                        <div class="menu" @click="$router.push('/pos/express')">
                            <img src="@/assets/img/icon_menu/express.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('mobile_topup') === true">
                        <div class="menu" @click="$router.push('/pos/mobile_topup')">
                            <img src="@/assets/img/icon_menu/mobile_topup.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('artwork') === true">
                        <div class="menu" @click="$router.push('/pos/artwork')">
                            <img src="@/assets/img/icon_menu/artwork.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('media_service') === true">
                        <div class="menu" @click="$router.push('/pos/media_service')">
                            <img src="@/assets/img/icon_menu/media.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('program') === true">
                        <div class="menu" @click="$router.push('/pos/program')">
                            <img src="@/assets/img/icon_menu/program.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('account_service') === true">
                        <div class="menu" @click="$router.push('/pos/accounting')">
                            <img src="@/assets/img/icon_menu/account.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('booking_service') === true">
                        <div class="menu">
                            <img src="@/assets/img/icon_menu/booking.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('act_service') === true">
                        <div class="menu" @click="ChooseAct = true">
                            <img src="@/assets/img/icon_menu/act1.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('IT_support') === true">
                        <div class="menu" @click="$router.push('/pos/itsupport')">
                            <img src="@/assets/img/icon_menu/itsupport.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4" v-if="checkFunction('merit_service') === true">
                        <div class="menu">
                            <img src="@/assets/img/icon_menu/merit.png" style="width: 100%" />
                        </div>
                    </div>
                    <div class="col-6 lg:col-2 sm:col-4">
                        <div class="menu">
                            <img src="@/assets/img/icon_menu/sermons.png" style="width: 100%" />
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    </div>
    <div v-else>
        <Skeleton width="100%" height="200px"></Skeleton>
    </div>
    <Dialog v-model:visible="ChooseAct" header="พ.ร.บ ภาษีและประกัน" :modal="true"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '30vw' }">
        <div class="grid">
            <div class="col-12 sm:col-4">
                <div class="menu"  @click="$router.push('/pos/act_service')">
                    <img src="@/assets/img/icon_menu/act2.png" style="width: 100%" />
                </div>
            </div>
            <div class="col-12 sm:col-4">
                <div class="menu" @click="$router.push('/pos/Tax_service')">
                    <img src="@/assets/img/icon_menu/tax.png" style="width: 100%" />
                </div>
            </div>
            <!-- <div class="col-12 sm:col-4">
                <div class="menu">
                    <img src="@/assets/img/icon_menu/tax.png" style="width: 100%" />
                </div>
            </div> -->
            <div class="col-12 sm:col-4">
                <!-- <div class="menu" @click="$router.push('/pos/insurance_service')">
                    <img src="@/assets/img/icon_menu/insurance.png" style="width: 100%" />
                </div> -->
                <div class="menu">
                    <img src="@/assets/img/icon_menu/insurance.png" style="width: 100%" />
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }).then((res) => {
            this.shop_function = res.data.data.shop_function;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
            this.$router.push('/');
        })

        this.loading = false;
    },
    data: () => ({
        loading: true,
        shop_function: [],

        ChooseAct: false,
    }),
    methods: {
        checkFunction(item) {
            const func = this.shop_function.find((el) => el.name === item);
            if (!func) {
                return false;
            } else {
                if (func.status) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}
</script>

<style>
.menu:hover {
    position: relative;
    cursor: pointer;
}

.menu>img:hover {
    transform: scale(1.1);
    transition-timing-function: linear;
    transition-duration: 0.1s;
}
.background-menu{
    background: #ffe7ff;
    border-radius: 5px;
}
.icon-color{
    color: #6d28d9;
}

</style>