<script>
import Images from './Images.vue'
import Configure from './Configure.vue'

export default {
    components: {
        Images,
        Configure
    }
};
</script>

<script setup>
import { onMounted } from 'vue'
import { useImageApiShowStore } from './store'
import { DockviewVue, themeAbyss } from 'dockview-vue';

const { initLinks } = useImageApiShowStore()
themeAbyss.className = 'dockview-theme-light';


onMounted(() => {
    initLinks()
})
function onReady(event) {
    const api = event.api;
    if (window.innerWidth >= 768) {
        const configurePanel = api.addPanel({
            id: 'Configure',
            component: 'Configure',
            minimumWidth: 300
        });
        const ImagesPanel = api.addPanel({
            id: 'Images',
            component: 'Images',
            position: {
                direction: 'right'
                // direction: 'below'
            }
        });
        configurePanel.group.header.hidden = true;
        ImagesPanel.group.header.hidden = true;
        configurePanel.group.api.setSize({
            width: 300
        })
    } else {
        const configurePanel = api.addPanel({
            id: 'Configure',
            component: 'Configure',
            minimumHeight: 215
        });
        const ImagesPanel = api.addPanel({
            id: 'Images',
            component: 'Images',
            position: {
                direction: 'below'
            }
        });
        configurePanel.group.header.hidden = true;
        ImagesPanel.group.header.hidden = true;
        configurePanel.group.api.setSize({
            height: 465
        })
    }
}

</script>

<template>
    <div class="container">
        <DockviewVue style="width:100%;height:100%" @ready="onReady">
        </DockviewVue>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>