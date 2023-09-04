<template>
    <div v-if="!loading">
        <Chart type="line" :data="basicData" />
    </div>
    <div v-else>
        <Skeleton width="100%" height="300px"></Skeleton>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'
export default {
    async mounted() {
        this.loading = true;
        const config = {
            headers: {
                'auth-token': `Bearer ${this.$store.getters.token}`
            }
        }
        await axios.get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, config).then((res) => {
            this.shop = res.data.data;
        })
        await axios.get(`${process.env.VUE_APP_SHOP}preorder/shop/shop-id/${localStorage.getItem('shop_id')}`, config).then((res) => {
            this.poshops = res.data.data.filter((el) => el.poshop_status === true);
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })

        await axios.get(`${process.env.VUE_APP_SHOP}counter_service/shop-id/${localStorage.getItem('shop_id')}`,config).then((res)=>{
            this.cs=res.data.data;
        });

        await axios.get(`${process.env.VUE_APP_SHOP}mobile_topup/shop-id/${localStorage.getItem('shop_id')}`,config).then((res)=>{
            this.mobile_topup = res.data.data;
        })
        await axios.get(`${process.env.VUE_APP_SHOP}express/booking/${localStorage.getItem('shop_id')}`, config).then((res) => {
            this.bookings = res.data.data;
        }).catch((err) => {
            this.$toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: err.response.data.message, life: 3000 });
        })

        //ยอดขายเปิดไหม
        if (this.checkFunction('pos')) {
            this.getSales();
        }
        //ยอดขายการส่งพัสดุ
        if (this.checkFunction('express')) {
            this.getBookingSale();
        }
        //เติมเงินมือถือ
        if(this.checkFunction('mobile_topup')){
            this.getMobileTopup();
        }
        //counter service
        if(this.checkFunction('counter_service')){
            this.getCouterService();
        }
        //artwork service
        if(this.checkFunction('artwork')){
            this.getArtwork();
        }
        //media service
        if(this.checkFunction('media_service')){
            this.getMediaService();
        }

        this.loading = false;
        

    },
    data: () => ({
        loading : false,
        shop: null,
        bookings: [],
        poshops: [],
        cs : [],
        mobile_topup: [],
        artwork: [],
        basicData: {
            labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มีถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
            datasets: []
        },
        thisYear: dayjs(Date.now()).format('YYYY'),
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }),
    methods: {
        checkFunction(item) {
            const func = this.shop.shop_function.find((el) => el.name === item);
            if (func) {
                if (func.status) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        getSales() {
            //form
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.poshops.filter((item) => dayjs(item.poshop_timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.poshop_timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + product.poshop_total, 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดขายสินค้า(บาท)',
                data: data,
                fill: false,
                borderColor: '#42A5F5',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
        getBookingSale() {
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.bookings.filter((item) => dayjs(item.timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + product.price, 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดส่งพัสดุ(บาท)',
                data: data,
                fill: false,
                borderColor: '#FFA500',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
        getCouterService(){
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.cs.filter((item) => dayjs(item.timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + (product.price+product.charge), 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดฝากจ่ายเคาน์เตอร์เซอร์วิส(บาท)',
                data: data,
                fill: false,
                borderColor: '#FF00EE',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
        getMobileTopup(){
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.mobile_topup.filter((item) => dayjs(item.timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + (product.price+product.charge), 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดเติมเงินมือถือ(บาท)',
                data: data,
                fill: false,
                borderColor: '#CD853F',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
        getArtwork(){
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.mobile_topup.filter((item) => dayjs(item.timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + (product.price+product.charge), 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดส่งงานออกแบบสื่อสิ่งพิมพ์(บาท)',
                data: data,
                fill: false,
                borderColor: '#33FF33',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
        getMediaService(){
            let data = [];
            this.month.forEach((el) => {
                const findDate = this.mobile_topup.filter((item) => dayjs(item.timestamp).format('MM') == el)
                const findYear = findDate.filter((item) => dayjs(item.timestamp).format('YYYY') === this.thisYear)
                if (findYear.length !== 0) {
                    const sum = findYear.reduce((sumPrice, product) => sumPrice + (product.price+product.charge), 0);
                    data.push(sum);
                } else {
                    data.push(0);
                }
            })

            const form = {
                label: 'ยอดบริการสื่อโฆษณาออนไลน์(บาท)',
                data: data,
                fill: false,
                borderColor: '#33FF33',
                tension: .4
            };
            this.basicData.datasets.push(form);
        },
    }
}
</script>

<style>

</style>