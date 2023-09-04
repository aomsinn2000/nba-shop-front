<template>
    <div class="grid">
        <div class="col-12" v-if="images!==null">
            <Galleria :value="images" :showIndicators="true" :showIndicatorsOnItem="true" :showThumbnails="false"
                containerStyle="max-width: 100%" :circular="true" :autoPlay="true" :transitionInterval="8000">
                <template #item="slotProps">
                    <img :src="getImage(slotProps.item)" style="width: 100%; display: block;" />
                </template>
            </Galleria>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}more/function_more/function/Promote_slide`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.images = res.data.data.func_detail;
        })
    },
    data: () => ({
        images: null,
    }),
    methods: {
        getImage(item) {
            return 'https://drive.google.com/uc?export=view&id=' + item
        }
    }
}
</script>

<style>

</style>