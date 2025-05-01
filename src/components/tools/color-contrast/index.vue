<template>
    <div class="title">
        <h2>颜色对比度</h2>
    </div>
    <div class="container">
        <div class="color-container">
            <div class="color-row">
                <div class="item">文字颜色</div>
                <p>{{ textColor }}</p>
                <div class="item"><input type="color" v-model="textColor" /></div>
            </div>
            <div class="color-row">
                <div class="item">对象颜色</div>
                <p>{{ objectColor }}</p>
                <div class="item"><input type="color" v-model="objectColor" /></div>
            </div>
            <div class="color-row">
                <div class="item">背景颜色</div>
                <p>{{ backgroundColor }}</p>
                <div class="item"><input type="color" v-model="backgroundColor" /></div>
            </div>
        </div>
        <div class="body-container">
            <div class="bg" :style="{ backgroundColor: backgroundColor }">
                <div class="object" :style="{ backgroundColor: objectColor, color: textColor }">
                    Text
                </div>
            </div>
        </div>
        <div class="contrast-container">
            <div class="card">
                <p>文本和对象</p>
                <div class="level" :style="{ color: TOContrastLevel.color }">{{ TOContrastLevel.label }}</div>
                <p class="level">{{ TOContrast }} : 1</p>
                <a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum">理解成功标准1.4.3：对比度</a>
            </div>
            <div class="card">
                <div class="item">背景和对象</div>
                <div class="level" :style="{ color: OBContrastLevel.color }">{{ OBContrastLevel.label }}</div>
                <p class="level">{{ OBContrast }} : 1</p>
                <a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast">理解成功标准1.4.11：非文本对比</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const TOContrastLevel = ref({
    label: 'AAA',
    color: '#1d5d35'
})
const OBContrastLevel = ref({
    label: 'AA',
    color: '#008531'
})
const textColor = ref('#ffffff');
const objectColor = ref("#000000");
const backgroundColor = ref("#ffffff");
const TOContrast = computed(() => {
    let toc = contrast(textColor.value, objectColor.value)
    if (toc >= 7) {
        TOContrastLevel.value.label = 'AAA'
        TOContrastLevel.value.color = '#1d5d35'
    } else if (toc >= 4.5) {
        TOContrastLevel.value.label = 'AA'
        TOContrastLevel.value.color = '#008531'
    } else if (toc >= 3) {
        TOContrastLevel.value.label = 'AA Large'
        TOContrastLevel.value.color = '#ae490f'
    } else {
        TOContrastLevel.value.label = 'Fail'
        TOContrastLevel.value.color = '#cc0000'
    }
    return toc
});
const OBContrast = computed(() => {
    let obc = contrast(objectColor.value, backgroundColor.value)
    if (obc >= 3) {
        OBContrastLevel.value.label = 'AA'
        OBContrastLevel.value.color = '#008531'
    } else {
        OBContrastLevel.value.label = 'Fail'
        OBContrastLevel.value.color = '#cc0000'
    }
    return obc
});

function luminance(r, g, b) {
    let temp = [r, g, b].map(function (x) {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return temp[0] * 0.2126 + temp[1] * 0.7152 + temp[2] * 0.0722;
}

function contrast(color1, color2) {
    let rgb1 = [color1.substring(1, 3), color1.substring(3, 5), color1.substring(5, 7)]
    let rgb2 = [color2.substring(1, 3), color2.substring(3, 5), color2.substring(5, 7)]
    rgb1 = rgb1.map(function (x) {
        return parseInt(x, 16);
    });
    rgb2 = rgb2.map(function (x) {
        return parseInt(x, 16);
    });
    let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    let brightest = Math.max(lum1, lum2);
    let darkest = Math.min(lum1, lum2);
    return Math.round(((brightest + 0.05) / (darkest + 0.05)) * 100) / 100
}
</script>

<style scoped>
.title {
    position: absolute;
    width: 100%;
    padding: 20px;
    text-align: center;
}

.container {
    width: 100%;
    height: 100%;
    display: flex;
    user-select: none;
    padding: 0 20px;

    .color-container {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
        padding: 0 20px;

        .color-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
            font-size: 1.2rem;
            gap: 10px;

            p {
                font-size: 1rem;
                width: 90px;
                border: 1px solid #000;
                padding: 5px 5px;
            }

            input[type=color] {
                border: 1px solid #000;
                padding: 5px 5px;
                width: 90px;
                height: 40px;
            }
        }
    }

    .body-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 10px;

        div {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .bg {
            width: 325px;
            height: 325px;
            border-radius: 50%;
            border: 3px solid #000;
            font-size: 3rem;

            .object {
                width: 200px;
                height: 200px;
                border-radius: 50%;
            }
        }
    }

    .contrast-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;

        .card {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-evenly;
            gap: 10px;
            padding: 10px;
            width: 260px;
            border: 1px solid #000;
            border-radius: 5px;

            .level {
                font-size: 1.5rem;
                font-weight: bolder;
            }
        }
    }
}

a {
    color: -webkit-link;
    text-decoration: revert-layer;
}

@media (max-width: 768px) {
    .title {
        display: none;
    }

    .container {
        flex-direction: column;

        & .color-container {
            flex-direction: row;
        }

        & .contrast-container {
            margin-top: 20px;
            flex-direction: row;
        }

        .body-container {
            .bg {
                width: 70vw;
                height: 70vw;
                font-size: 10vw;

                .object {
                    width: 40vw;
                    height: 40vw;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>