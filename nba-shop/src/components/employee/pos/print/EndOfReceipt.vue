<template>
    <div>
        <div style="width:100%" v-if="imageDetail.length===0">
            <div v-for="item in imageDetail" :key="item" style="margin-top: 10px;">
                <img class="w-full" style="width:100%" :src="'https://drive.google.com/uc?export=view&id='+item" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}more/function_more/function/end_of_receipt`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            if (res.data.data.func_detail.length !== 0) {
                this.imageDetail = res.data.data.func_detail;
            }
        })
    },
    data: ()=>({
        imageDetail : []
    })

}
</script>
