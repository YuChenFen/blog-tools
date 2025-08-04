import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useWgslEditorStore = defineStore('wgsl-editor', () => {
    let dockviewApi = null;
    const vertexShader = ref(`// 顶点着色器
struct Out{
    @builtin(position) position:vec4<f32>,
    @location(0) color:vec4<f32>,
    @location(1) frame: f32,
}
struct Input{
    @location(0) pos:vec3<f32>,
}
struct Uniforms {
    frame: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input:Input) -> Out {
    var out:Out;
    out.position = vec4<f32>(input.pos, 1.0);
    out.color = vec4<f32>((input.pos + 1.0) / 2.0, 1.0);
    out.frame = uniforms.frame;
    return out;
}
`);
    const fragmentShader = ref(`// 片元着色器
struct Input{
    @builtin(position) position:vec4<f32>,
    @location(0) color:vec4<f32>,
    @location(1) frame: f32,
}
@fragment
fn main(input:Input) -> @location(0) vec4<f32> {
    return vec4<f32>(input.color.xy, sin(input.frame / 50), 1.0);
}
`);

    function setDockviewApi(api) {
        dockviewApi = api
    }

    return { setDockviewApi, vertexShader, fragmentShader }
})