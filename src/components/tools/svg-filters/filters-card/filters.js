import { ref, h } from 'vue';
import feGaussianBlur from './feGaussianBlur.vue';
import feDropShadow from './feDropShadow.vue';
import feMorphology from './feMorphology.vue';
import feDisplacementMap from './feDisplacementMap.vue';
import feBlend from './feBlend.vue';
import feColorMatrix from './feColorMatrix.vue';
import feConvolveMatrix from './feConvolveMatrix.vue';
import feComponentTransfer from './feComponentTransfer.vue';
import feSpecularLighting from './feSpecularLighting.vue';
import feDiffuseLighting from './feDiffuseLighting.vue';
import feFlood from './feFlood.vue';
import feTurbulence from './feTurbulence.vue';
import feImage from './feImage.vue';
import feTile from './feTile.vue';
import feOffset from './feOffset.vue';
import feComposite from './feComposite.vue';
import feMerge from './feMerge.vue';

class feGaussianBlurComponent {
    constructor() {
        this.option = {
            stdDeviationX: ref(5),
            stdDeviationY: ref(5),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('blur')
        }
        this.component = h(feGaussianBlur, this.option);
    }
    toString() {
        return `<feGaussianBlur stdDeviation="${this.option.stdDeviationX} ${this.option.stdDeviationY}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`;
    }
}

class feDropShadowComponent {
    constructor() {
        this.option = {
            stdDeviationX: ref(5),
            stdDeviationY: ref(5),
            dx: ref(40),
            dy: ref(10),
            floodColor: ref('#000000'),
            floodOpacity: ref(1),
            in: ref('SourceGraphic'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('dropShadow')
        }
        this.component = h(feDropShadow, this.option);
    }
    toString() {
        return `<feDropShadow stdDeviation="${this.option.stdDeviationX} ${this.option.stdDeviationY}" in="${this.option.in}" dx="${this.option.dx}" dy="${this.option.dy}" flood-color="${this.option.floodColor}" flood-opacity="${this.option.floodOpacity}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}"/>`;
    }
}

class feMorphologyComponent {
    constructor() {
        this.option = {
            operator: ref('erode'),
            radiusX: ref(5),
            radiusY: ref(5),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('morphology')
        }
        this.component = h(feMorphology, this.option);
    }

    toString() {
        return `<feMorphology operator="${this.option.operator}" radius="${this.option.radiusX} ${this.option.radiusY}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`;
    }
}

class feDisplacementMapComponent {
    constructor() {
        this.option = {
            in: ref('SourceGraphic'),
            in2: ref('SourceGraphic'),  // SourceAlpha
            scale: ref(10),
            xChannelSelector: ref('R'),
            yChannelSelector: ref('G'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('displacementMap')
        }
        this.component = h(feDisplacementMap, this.option);
    }

    toString() {
        return `<feDisplacementMap in="${this.option.in}" in2="${this.option.in2}" scale="${this.option.scale}" xChannelSelector="${this.option.xChannelSelector}" yChannelSelector="${this.option.yChannelSelector}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}"/>`
    }
}

class feBlendComponent {
    constructor() {
        this.option = {
            mode: ref('normal'),
            in: ref('SourceGraphic'),
            in2: ref('SourceGraphic'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('blend')
        }
        this.component = h(feBlend, this.option);
    }

    toString() {
        return `<feBlend mode="${this.option.mode}" in="${this.option.in}" in2="${this.option.in2}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}"/>`
    }
}

class feColorMatrixComponent {
    constructor() {
        this.option = {
            type: ref('matrix'),
            values: ref('1 0 0 0 0 \n0 1 0 0 0 \n0 0 1 0 0 \n0 0 0 1 0'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('colorMatrix')
        }
        this.component = h(feColorMatrix, this.option);
    }

    toString() {
        return `<feColorMatrix type="${this.option.type}" values="${this.option.values}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`
    }
}

class feConvolveMatrixComponent {
    constructor() {
        this.option = {
            orderX: ref(3),
            orderY: ref(3),
            kernelMatrix: ref('-1 0 0 \n0 1 -1 \n0 0 0'),
            divisor: ref(1),
            bias: ref(1),
            targetX: ref(0),
            targetY: ref(0),
            edgeMode: ref('duplicate'),
            preserveAlpha: ref(true),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('convolveMatrix')
        }
        this.component = h(feConvolveMatrix, this.option);
    }

    toString() {
        return `<feConvolveMatrix order="${this.option.orderX} ${this.option.orderY}" kernelMatrix="${this.option.kernelMatrix}" divisor="${this.option.divisor}" bias="${this.option.bias}" targetX="${this.option.targetX}" targetY="${this.option.targetY}" edgeMode="${this.option.edgeMode}" preserveAlpha="${this.option.preserveAlpha}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height:"${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`
    }
}

class feComponentTransferComponent {
    constructor() {
        this.option = {
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('componentTransfer'),
            feFuncRType: ref('identity'),
            feFuncGType: ref('identity'),
            feFuncBType: ref('identity'),
            feFuncAType: ref('identity'),
            feFuncRTableValues: ref('0 0 0 0'),
            feFuncGTableValues: ref('0 0 0 0'),
            feFuncBTableValues: ref('0 0 0 0'),
            feFuncATableValues: ref('0 0 0 0'),
            feFuncRSlope: ref(1),
            feFuncGSlope: ref(1),
            feFuncBSlope: ref(1),
            feFuncASlope: ref(1),
            feFuncRIntercept: ref(0),
            feFuncGIntercept: ref(0),
            feFuncBIntercept: ref(0),
            feFuncAIntercept: ref(0),
            feFuncRAmplitude: ref(1),
            feFuncGAmplitude: ref(1),
            feFuncBAmplitude: ref(1),
            feFuncAAmplitude: ref(1),
            feFuncRExponent: ref(1),
            feFuncGExponent: ref(1),
            feFuncBExponent: ref(1),
            feFuncAExponent: ref(1),
            feFuncROffset: ref(0),
            feFuncGOffset: ref(0),
            feFuncBOffset: ref(0),
            feFuncAOffset: ref(0)
        }
        this.component = h(feComponentTransfer, this.option);
    }

    getFeFunc(type) {
        let feFuncType = this.option['feFunc' + type + 'Type']
        if (feFuncType == 'identity') {
            return `<feFunc${type} type="${feFuncType}"/>`
        } else if (feFuncType == 'table' || feFuncType == 'discrete') {
            return `<feFunc${type} type="${feFuncType}" tableValues="${this.option['feFunc' + type + 'TableValues']}"/>`
        } else if (feFuncType == 'linear') {
            return `<feFunc${type} type="${feFuncType}" slope="${this.option['feFunc' + type + 'Slope']}" intercept="${this.option['feFunc' + type + 'Intercept']}"/>`
        } else if (feFuncType == 'gamma') {
            return `<feFunc${type} type="${feFuncType}" amplitude="${this.option['feFunc' + type + 'Amplitude']}" exponent="${this.option['feFunc' + type + 'Exponent']}" offset="${this.option['feFunc' + type + 'Offset']}"/>`
        }
    }

    toString() {
        return `<feComponentTransfer x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}">${this.getFeFunc('R')}${this.getFeFunc('G')}${this.getFeFunc('B')}${this.getFeFunc('A')}</feComponentTransfer>`
    }
}

class feSpecularLightingComponent {
    constructor() {
        this.option = {
            surfaceScale: ref(5),
            specularConstant: ref(0.75),
            specularExponent: ref(20),
            lightingColor: ref('#ff0000'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('specularLighting'),
            azimuth: ref(3),
            elevation: ref(100),
            lightX: ref(200),
            lightY: ref(100),
            lightZ: ref(200),
            pointsAtX: ref(0),
            pointsAtY: ref(0),
            pointsAtZ: ref(0),
            specularExponent: ref(1),
            limitingConeAngle: ref(60),
            type: ref('feDistantLight')
        }
        this.component = h(feSpecularLighting, this.option);
    }
    getLight() {
        if (this.option.type == 'feDistantLight') {
            return `<feDistantLight azimuth="${this.option.azimuth}" elevation="${this.option.elevation}"/>`
        } else if (this.option.type == 'fePointLight') {
            return `<fePointLight x="${this.option.lightX}" y="${this.option.lightY}" z="${this.option.lightZ}"/>`
        } else if (this.option.type == 'feSpotLight') {
            return `<feSpotLight x="${this.option.lightX}" y="${this.option.lightY}" z="${this.option.lightZ}" pointsAtX="${this.option.pointsAtX}" pointsAtY="${this.option.pointsAtY}" pointsAtZ="${this.option.pointsAtZ}" specularExponent="${this.option.specularExponent}" limitingConeAngle="${this.option.limitingConeAngle}"/>`
        }
    }
    toString() {
        return `<feSpecularLighting surfaceScale="${this.option.surfaceScale}" specularConstant="${this.option.specularConstant}" specularExponent="${this.option.specularExponent}" lighting-color="${this.option.lightingColor}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}">${this.getLight()}</feSpecularLighting>`
    }
}

class feDiffuseLightingComponent {
    constructor() {
        this.option = {
            surfaceScale: ref(5),
            diffuseConstant: ref(0.75),
            lightingColor: ref('#ff0000'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('diffuseLighting'),
            azimuth: ref(3),
            elevation: ref(100),
            lightX: ref(200),
            lightY: ref(100),
            lightZ: ref(200),
            pointsAtX: ref(0),
            pointsAtY: ref(0),
            pointsAtZ: ref(0),
            specularExponent: ref(1),
            limitingConeAngle: ref(60),
            type: ref('feDistantLight')
        }
        this.component = h(feDiffuseLighting, this.option);
    }
    getLight() {
        if (this.option.type == 'feDistantLight') {
            return `<feDistantLight azimuth="${this.option.azimuth}" elevation="${this.option.elevation}"/>`
        } else if (this.option.type == 'fePointLight') {
            return `<fePointLight x="${this.option.lightX}" y="${this.option.lightY}" z="${this.option.lightZ}"/>`
        } else if (this.option.type == 'feSpotLight') {
            return `<feSpotLight x="${this.option.lightX}" y="${this.option.lightY}" z="${this.option.lightZ}" pointsAtX="${this.option.pointsAtX}" pointsAtY="${this.option.pointsAtY}" pointsAtZ="${this.option.pointsAtZ}" specularExponent="${this.option.specularExponent}" limitingConeAngle="${this.option.limitingConeAngle}"/>`
        }
    }
    toString() {
        return `<feDiffuseLighting surfaceScale="${this.option.surfaceScale}" diffuseConstant="${this.option.diffuseConstant}" lighting-color="${this.option.lightingColor}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}">${this.getLight()}</feDiffuseLighting>`
    }
}

class feFloodComponent {
    constructor() {
        this.option = {
            floodColor: ref('#000000'),
            floodOpacity: ref(1),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('flood')
        }
        this.component = h(feFlood, this.option);
    }
    toString() {
        return `<feFlood flood-color="${this.option.floodColor}" flood-opacity="${this.option.floodOpacity}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}"/>`
    }
}

class feTurbulenceComponent {
    constructor() {
        this.option = {
            baseFrequencyX: ref(0.05),
            baseFrequencyY: ref(0.05),
            numOctaves: ref(3),
            seed: ref(2),
            stitchTiles: ref('stitch'),
            type: ref('turbulence'),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('turbulence')
        }
        this.component = h(feTurbulence, this.option);
    }
    toString() {
        return `<feTurbulence baseFrequency="${this.option.baseFrequencyX} ${this.option.baseFrequencyY}" numOctaves="${this.option.numOctaves}" seed="${this.option.seed}" stitchTiles="${this.option.stitchTiles}" type="${this.option.type}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}"result="${this.option.result}"/>`
    }
}

class feImageComponent {
    constructor() {
        this.option = {
            href: ref(''),
            x: ref(0),
            y: ref(0),
            width: ref(500),
            height: ref(500),
            result: ref('image')
        }
        this.component = h(feImage, this.option);
    }
    toString() {
        return `<feImage xlink:href="${this.option.href}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}"/>`
    }
}

class feTileComponent {
    constructor() {
        this.option = {
            x: ref(0),
            y: ref(0),
            width: ref(500),
            height: ref(500),
            in: ref('SourceGraphic'),
            result: ref('tile')
        }
        this.component = h(feTile, this.option);
    }
    toString() {
        return `<feTile x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`
    }
}

class feOffsetComponent {
    constructor() {
        this.option = {
            dx: ref(0),
            dy: ref(0),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            in: ref('SourceGraphic'),
            result: ref('offset')
        }
        this.component = h(feOffset, this.option);
    }
    toString() {
        return `<feOffset dx="${this.option.dx}" dy="${this.option.dy}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" in="${this.option.in}" result="${this.option.result}"/>`
    }
}


class feCompositeComponent {
    constructor() {
        this.option = {
            operator: ref('in'),
            in: ref('SourceGraphic'),
            in2: ref('SourceAlpha'),
            k1: ref(0),
            k2: ref(8),
            k3: ref(-0.5),
            k4: ref(-4.5),
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('composite')
        }
        this.component = h(feComposite, this.option);
    }
    toString() {
        if (this.option.operator == 'arithmetic') {
            return `<feComposite operator="${this.option.operator}" in="${this.option.in}" in2="${this.option.in2}" k1="${this.option.k1}" k2="${this.option.k2}" k3="${this.option.k3}" k4="${this.option.k4}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}"result="${this.option.result}"/>`
        }else{
            return `<feComposite operator="${this.option.operator}" in="${this.option.in}" in2="${this.option.in2}" x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}"result="${this.option.result}"/>`
        }
    }
}

class feMergeComponent {
    constructor() {
        this.option = {
            x: ref('0%'),
            y: ref('0%'),
            width: ref('100%'),
            height: ref('100%'),
            result: ref('merge'),
            in: ref([ref('SourceGraphic'), ref('SourceAlpha')])
        }
        this.component = h(feMerge, this.option);
    }
    toString() {
        return `<feMerge x="${this.option.x}" y="${this.option.y}" width="${this.option.width}" height="${this.option.height}" result="${this.option.result}">${this.option.in.map(item => `<feMergeNode in="${item.value}"/>`).join('')}</feMerge>`
    }
}

export { feGaussianBlurComponent, feDropShadowComponent, feMorphologyComponent, feDisplacementMapComponent, feBlendComponent, feColorMatrixComponent, feConvolveMatrixComponent, feComponentTransferComponent, feSpecularLightingComponent, feDiffuseLightingComponent, feFloodComponent, feTurbulenceComponent, feImageComponent, feTileComponent, feOffsetComponent, feCompositeComponent, feMergeComponent }