<template>
    <codemirror v-model="modelValue" :disabled="disabled" :autofocus="true" :indent-with-tab="true" :tab-size="4"
        :extensions="extensions" style="width: 100%;height: 100%;" />
</template>
<script setup>
import { ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        default: 'HTML'
    }
})

const modelValue = defineModel('modelValue')
const extensions = ref([])
function changeLanguage(language) {
    if (language === 'HTML') {
        extensions.value = [html()]
    } else if (language === 'JSON') {
        extensions.value = [json()]
    }
}
changeLanguage(props.language)
watch(() => props.language, () => {
    changeLanguage(props.language)
})

</script>

<style scoped>
:deep(.ͼ4 .cm-line) {
    font-family: fangsong;
}

:deep(span[title="Fold line"]),
:deep(span[title="Unfold line"]) {
    position: relative;
    color: rgba(0, 0, 0, 0);
}

:deep(span[title="Unfold line"]::before),
:deep(span[title="Fold line"]::before) {
    content: '▶';
    color: #6c6c6c;
    position: absolute;
    font-size: 8px;
    top: 1px;
    left: -1px;
}

:deep(span[title="Fold line"]::before) {
    transform: rotate(90deg);
}
</style>
