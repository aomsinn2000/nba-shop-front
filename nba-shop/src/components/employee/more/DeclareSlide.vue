<template>
    <div class="grid">
        <div class="col-12">
            <!-- <Panel v-if="images !== null">
                <template #header>
                    <p class="p-0 m-0"><i class="pi pi-megaphone"></i> <strong>ประชาสัมพันธ์</strong></p>
                </template>
                <Galleria :value="images" :showIndicators="true" :showIndicatorsOnItem="true" :showThumbnails="false"
                    containerStyle="max-width: 100%" :circular="true" :autoPlay="true" :transitionInterval="8000">
                    <template #item="slotProps">
                        <img :src="getImage(slotProps.item)" style="width: 100%; display: block;" />
                    </template>
                </Galleria>
            </Panel> -->
            <Panel>
                <template #header>
                    <p class="p-0 m-0"><i class="pi pi-megaphone icon-color"></i> <strong>ประชาสัมพันธ์</strong></p>
                </template>
                <img src="@/assets/DeclareSlide3.png" style="width: 100%" />
            </Panel>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    async mounted() {
        await axios.get(`${process.env.VUE_APP_SHOP}more/function_more/function/declare_image_slide`, {
            headers: {
                'auth-token': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            this.images = res.data.data.func_detail.reverse();
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
.icon-color{
    color: #6d28d9;
}

</style>