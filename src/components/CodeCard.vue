<template>
    <div class="feng-code-card" :style="{ 'width': width, 'height': height }">
        <header>
            <div class="feng-code-card-header__right">
                <div style="background-color: #ff6057;" @click.stop="emits('red')"></div>
                <div style="background-color: #ffbd2f;" @click.stop="emits('yellow')"></div>
                <div style="background-color: #28c93f;" @click.stop="emits('green')"></div>
            </div>
            <slot name="header-title" :value="value"></slot>
        </header>
        <main class="feng-code-card-main">
            <slot name="main" :value="value"></slot>
        </main>
    </div>
</template>

<script setup>
defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    value: {
        default: {}
    }
});

const emits = defineEmits(['red', 'green', 'yellow'])
</script>

<style>
.feng-code-card {
    width: 50%;
    height: max-content;
    min-width: 76px;
    min-height: 35px;
    background-color: rgb(243, 243, 243);
    overflow: hidden;
    resize: both;
    border-radius: 5px;
    border: solid #dadada 1px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transition: background .8s, color .8s;
}

.feng-code-card::-webkit-resizer {
    background: transparent;
}

.feng-code-card header {
    width: 100%;
    height: 35px;
    border-bottom: solid #dadada 1px;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.feng-code-card header .feng-code-card-header__right {
    display: flex;
    height: 100%;
    align-items: center;
}

.feng-code-card header .feng-code-card-header__right div {
    width: 12px;
    height: 12px;
    margin-right: 10px;
    border-radius: 50%;
    cursor: pointer;
}

.feng-code-card header .feng-code-card-header__right div:nth-child(1) {
    margin-left: 10px;
}

.feng-code-card-main {
    height: calc(100% - 35px);
}
</style>
