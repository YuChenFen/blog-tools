<template>
    <div class="container">
        <div class="svg-filters-list padding-10" style="overflow-y: scroll;">
            <s-button class="feng-btn" type="text" v-for="svgFilter in svgFiltersList" :key="svgFilter.name"
                @click="addSvgFilter(svgFilter)">
                <p style="color: #000;">{{ svgFilter.name }}</p>
            </s-button>
        </div>
        <draggable v-model="svgFiltersContainer" item-key="dragId" :forceFallback="true" :animation="200"
            handle="header" class="svg-filters-card-list padding-10"
            style="border-right: 1px solid #999;overflow-y: scroll;">
            <template #item="{ element }">
                <div class="user-select">
                    <code-card :value="element" @red="deleteSvgFilter(element)">
                        <template #header-title="element">
                            <p>{{ element.value.name }}</p>
                            <s-checkbox v-model="element.value.use" style="color: #009688" type="checkbox"></s-checkbox>
                        </template>
                        <template #main="element">
                            <div class="svg-filters-card">
                                <component :is="element.value.component"></component>
                            </div>
                        </template>
                    </code-card>
                </div>
            </template>
        </draggable>
        <div class="svg-filters-img-code padding-10">
            <div class="svg-filters-img-code-title" style="width: 100%;overflow: hidden;">
                <img src="./img/fill.png" style="filter: url(#filter);width: min(80%, 50dvh);">
                <h1 style="font-size: 5em;font-weight: 800;filter: url(#filter);">Text</h1>
            </div>
            <div style="flex: 1;overflow: scroll;">
                <code-card>
                    <template #main>
                        <div style="height: 100%;padding: 10px;overflow: auto;">
                            <s-text-field label="SVG滤镜" v-model="svgFiltersString" type="multiLine"
                                style="width: 100%;"></s-text-field>
                        </div>
                    </template>
                </code-card>
            </div>
        </div>
        <svg style="width: 0;height: 0;">
            <defs v-html="getSvgFiltersHTML()">
            </defs>
        </svg>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from "vuedraggable";
import { feGaussianBlurComponent, feDropShadowComponent, feMorphologyComponent, feDisplacementMapComponent, feBlendComponent, feColorMatrixComponent, feConvolveMatrixComponent, feComponentTransferComponent, feSpecularLightingComponent, feDiffuseLightingComponent, feFloodComponent, feTurbulenceComponent, feImageComponent, feTileComponent, feOffsetComponent, feCompositeComponent, feMergeComponent } from './filters-card/filters.js';
import CodeCard from "../../components/CodeCard.vue";

const svgFiltersString = ref('')
const svgFiltersList = [
    {
        name: 'feGaussianBlur',
        component: feGaussianBlurComponent
    },
    {
        name: 'feDropShadow',
        component: feDropShadowComponent
    },
    {
        name: 'feMorphology',
        component: feMorphologyComponent
    },
    {
        name: 'feDisplacementMap',
        component: feDisplacementMapComponent
    },
    {
        name: 'feBlend',
        component: feBlendComponent
    },
    {
        name: 'feColorMatrix',
        component: feColorMatrixComponent
    },
    {
        name: 'feConvolveMatrix',
        component: feConvolveMatrixComponent
    },
    {
        name: 'feComponentTransfer',
        component: feComponentTransferComponent
    },
    {
        name: 'feSpecularLighting',
        component: feSpecularLightingComponent
    },
    {
        name: 'feDiffuseLighting',
        component: feDiffuseLightingComponent
    },
    {
        name: 'feFlood',
        component: feFloodComponent
    },
    {
        name: 'feTurbulence',
        component: feTurbulenceComponent
    },
    {
        name: 'feImage',
        component: feImageComponent
    },
    {
        name: 'feTile',
        component: feTileComponent
    },
    {
        name: 'feOffset',
        component: feOffsetComponent
    },
    {
        name: 'feComposite',
        component: feCompositeComponent
    },
    {
        name: 'feMerge',
        component: feMergeComponent
    }
]

const svgFiltersContainer = ref([

])

function getSvgFiltersHTML() {
    svgFiltersString.value = `<filter id="filter" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">${svgFiltersContainer.value.map(svgFilter => svgFilter.use ? svgFilter.toString() : "").join("")}</filter>`;
    return svgFiltersString.value;
}


function addSvgFilter(svgFilter) {
    let component = new svgFilter.component();
    component.name = svgFilter.name;
    component.use = ref(true);
    component.dragId = ref(Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36));   // 为唯一ID
    svgFiltersContainer.value.push(component);
}

function deleteSvgFilter(svgFilter) {
    svgFiltersContainer.value.splice(svgFiltersContainer.value.indexOf(svgFilter), 1)
}
</script>

<style scoped>
.feng-btn {
    border-radius: 5px;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, .1) 0px 2px 3px -1px, rgba(0, 0, 0, .06) 0px 2px 2px -1px;
    color: #b0b0b0;
    border: 1px solid rgba(0, 0, 0, .1);
    padding: 0 15px;
    min-width: max-content;
}

.container {
    display: flex;
    height: 100%;
    width: 100vw;
}

.padding-10 {
    padding: 10px;
}

.svg-filters-list {
    flex: 0 0 195px;
    border-right: 1px solid #999;
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.svg-filters-card-list {
    flex: 1 0 380px;
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.svg-filters-card {
    padding: 10px;
    /* border-radius: 5px;
        border: 1px solid #999;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(var(--text-color), 0.3) 0px 1px 3px -1px; */
}

.svg-filters-img-code {
    flex: 1 0 500px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.svg-filters-img-code-title {
    border: 1px solid #999;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    padding: 25px;
}

@media screen and (max-width: 768px) {
    .container {
        flex-direction: column;
        gap: 10px;
    }

    .svg-filters-list {
        flex: 0 0 60px;
        width: 100vw;
        flex-direction: row;
    }
}
</style>