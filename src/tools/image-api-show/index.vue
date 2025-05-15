<script>
import Images from './Images.vue'
import Configure from './Configure.vue'
import Tab from './Tab.vue';
import RightAction from './RightAction/index.vue';
import LeftActions from './LeftActions.vue';
import HttpView from './HttpView.vue';

export default {
    components: {
        Images,
        Configure,
        Tab,
        RightAction,
        LeftActions,
        HttpView
    }
};
</script>

<script setup>
import { onMounted } from 'vue'
import { useImageApiShowStore } from './store'
import { DockviewVue, themeAbyss } from 'dockview-vue';

const { setDockviewApi, initLinks } = useImageApiShowStore()
themeAbyss.className = 'dockview-theme-light';


onMounted(() => {
    initLinks()
})
function onReady(event) {
    const api = event.api;
    setDockviewApi(api)
    if (window.innerWidth >= 768) {
        const configurePanel = api.addPanel({
            id: 'Configure',
            component: 'Configure',
            minimumWidth: 0
        });
        const ImagesPanel = api.addPanel({
            id: '图像',
            component: 'Images',
            tabComponent: 'Tab',
            position: {
                direction: 'right'
            }
        });
        configurePanel.group.header.hidden = true;
        // ImagesPanel.group.header.hidden = true;
        configurePanel.group.api.setSize({
            width: 300
        })
        api.onWillShowOverlay((e) => {
            e.preventDefault();
        })
    } else {
        const configurePanel = api.addPanel({
            id: 'Configure',
            component: 'Configure',
            minimumHeight: 0
        });
        const ImagesPanel = api.addPanel({
            id: '图像',
            component: 'Images',
            tabComponent: 'Tab',
            position: {
                direction: 'below'
            }
        });
        configurePanel.group.header.hidden = true;
        // ImagesPanel.group.header.hidden = true;
        configurePanel.group.api.setSize({
            height: 150
        })
        api.onWillShowOverlay((e) => {
            e.preventDefault();
        })
    }
}

</script>

<template>
    <div class="container">
        <DockviewVue style="width:100%;height:100%" @ready="onReady" rightHeaderActionsComponent="RightAction"
            leftHeaderActionsComponent="LeftActions">
        </DockviewVue>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>