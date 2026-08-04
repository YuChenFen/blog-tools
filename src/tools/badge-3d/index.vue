<template>
    <div id="badge-3d-body">
        <!-- 左侧控制面板 -->
        <aside id="panel" class="panel">
            <div class="panel-header">
                <div class="brand">
                    <span class="brand-mark">●</span>
                    <div class="brand-text">
                        <h1>徽章造 3D</h1>
                        <p>在线 3D 徽章制作工具</p>
                    </div>
                </div>
            </div>

            <div class="panel-scroll">
                <!-- 上传 -->
                <section class="block">
                    <div class="block-title">上传图案</div>
                    <div class="row upload-row">
                        <label class="upload-btn" for="fileInput">
                            <span>+ 上传</span>
                            <input type="file" id="fileInput"
                                accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp,image/bmp,image/gif"
                                hidden />
                        </label>
                        <span class="hint">SVG / PNG（应用到徽章）</span>
                        <button id="clearBtn" class="ghost-btn">清除</button>
                    </div>
                </section>

                <!-- 形状预设 -->
                <section class="block">
                    <div class="block-title">形状预设</div>
                    <div class="row shape-row" id="shapeRow">
                        <button class="shape-btn active" data-shape="circle" title="圆形">○</button>
                        <button class="shape-btn" data-shape="hexagon" title="六边形">⬡</button>
                        <button class="shape-btn" data-shape="pentagon" title="五边形">⬠</button>
                        <button class="shape-btn" data-shape="square" title="正方形">□</button>
                        <button class="shape-btn" data-shape="shield" title="盾牌">🛡</button>
                    </div>
                </section>

                <!-- 几何 -->
                <section class="block">
                    <div class="block-title">几何参数</div>
                    <div class="ctrl" data-key="depth">
                        <label>深度</label>
                        <input type="range" min="0" max="1" step="0.01" value="0.30" />
                        <span class="val">0.30</span>
                    </div>
                    <div class="ctrl" data-key="bevel">
                        <label>斜面</label>
                        <input type="range" min="0" max="0.2" step="0.005" value="0.04" />
                        <span class="val">0.04</span>
                    </div>
                    <div class="ctrl" data-key="thickness">
                        <label>厚度</label>
                        <input type="range" min="0" max="0.3" step="0.005" value="0.08" />
                        <span class="val">0.08</span>
                    </div>
                    <div class="ctrl" data-key="size">
                        <label>大小</label>
                        <input type="range" min="0.3" max="1.5" step="0.01" value="1.00" />
                        <span class="val">1.00</span>
                    </div>
                </section>

                <!-- 图层 -->
                <section class="block">
                    <div class="block-title">图层 <span class="sub">（最多 6 层）</span></div>
                    <div id="layersList" class="layers-list"></div>
                    <button id="addLayerBtn" class="add-btn">+ 添加图层</button>
                </section>

                <!-- 材质 -->
                <section class="block">
                    <div class="block-title">材质</div>
                    <div class="ctrl">
                        <label>材质捕获</label>
                        <select id="matcapSel">
                            <option value="none">无</option>
                            <option value="chrome">铬</option>
                            <option value="gold">金</option>
                            <option value="bronze">铜</option>
                            <option value="dark_metal">暗金属</option>
                            <option value="blue_glass">蓝玻璃</option>
                        </select>
                    </div>
                    <div class="ctrl">
                        <label>法线贴图</label>
                        <select id="normalSel">
                            <option value="none">无</option>
                            <option value="brushed">拉丝</option>
                            <option value="scratched">划痕</option>
                            <option value="leather">皮革</option>
                        </select>
                    </div>
                    <div class="ctrl" data-key="normalScale">
                        <label>法线缩放</label>
                        <input type="range" min="0" max="3" step="0.05" value="1.0" />
                        <span class="val">1.0</span>
                    </div>
                    <div class="ctrl" data-key="metalness">
                        <label>金属度</label>
                        <input type="range" min="0" max="1" step="0.01" value="0.90" />
                        <span class="val">0.90</span>
                    </div>
                    <div class="ctrl" data-key="roughness">
                        <label>粗糙度</label>
                        <input type="range" min="0" max="1" step="0.01" value="0.15" />
                        <span class="val">0.15</span>
                    </div>
                </section>

                <!-- 灯光 -->
                <section class="block">
                    <div class="block-title">灯光</div>
                    <div class="ctrl">
                        <label>环境</label>
                        <select id="envSel">
                            <option value="none">无</option>
                            <option value="studio" selected>工作室</option>
                        </select>
                    </div>
                    <div class="ctrl" data-key="ambient">
                        <label>环境光</label>
                        <input type="range" min="0" max="2" step="0.01" value="0.40" />
                        <span class="val">0.40</span>
                    </div>
                    <div class="ctrl" data-key="spotInt">
                        <label>聚光灯强度</label>
                        <input type="range" min="0" max="5" step="0.01" value="2.00" />
                        <span class="val">2.00</span>
                    </div>
                    <div class="ctrl" data-key="lightX">
                        <label>灯光 X</label>
                        <input type="range" min="-15" max="15" step="0.1" value="5.0" />
                        <span class="val">5.0</span>
                    </div>
                    <div class="ctrl" data-key="lightY">
                        <label>灯光 Y</label>
                        <input type="range" min="-15" max="15" step="0.1" value="8.0" />
                        <span class="val">8.0</span>
                    </div>
                    <div class="ctrl" data-key="lightZ">
                        <label>灯光 Z</label>
                        <input type="range" min="-15" max="15" step="0.1" value="6.0" />
                        <span class="val">6.0</span>
                    </div>
                </section>

                <!-- 画布 -->
                <section class="block">
                    <div class="block-title">画布</div>
                    <div class="ctrl ctrl-color">
                        <label>背景颜色</label>
                        <input type="color" id="bgColor" value="#111111" />
                        <span class="val mono">#111111</span>
                    </div>
                    <div class="ctrl ctrl-check">
                        <label>自动旋转</label>
                        <input type="checkbox" id="autoRotate" checked />
                    </div>
                    <div class="ctrl ctrl-check">
                        <label>透视</label>
                        <input type="checkbox" id="perspective" checked />
                    </div>
                    <div class="ctrl ctrl-check">
                        <label>预览</label>
                        <input type="checkbox" id="preview" checked />
                    </div>
                </section>

                <!-- 后期特效 -->
                <section class="block">
                    <div class="block-title">后期特效</div>
                    <div class="sub-title">辉光</div>
                    <div class="ctrl" data-key="bloomStrength">
                        <label>强度</label>
                        <input type="range" min="0" max="3" step="0.01" value="0.40" />
                        <span class="val">0.40</span>
                    </div>
                    <div class="ctrl" data-key="bloomThreshold">
                        <label>阈值</label>
                        <input type="range" min="0" max="1" step="0.01" value="0.85" />
                        <span class="val">0.85</span>
                    </div>
                    <div class="ctrl" data-key="bloomRadius">
                        <label>半径</label>
                        <input type="range" min="0" max="1" step="0.01" value="0.30" />
                        <span class="val">0.30</span>
                    </div>
                    <div class="sub-title">景深</div>
                    <div class="ctrl" data-key="dofFocus">
                        <label>焦点</label>
                        <input type="range" min="0" max="20" step="0.05" value="5.00" />
                        <span class="val">5.00</span>
                    </div>
                    <div class="ctrl" data-key="dofAperture">
                        <label>光圈</label>
                        <input type="range" min="0" max="0.02" step="0.0001" value="0.0000" />
                        <span class="val">0.0000</span>
                    </div>
                    <div class="ctrl" data-key="dofMaxBlur">
                        <label>最大模糊</label>
                        <input type="range" min="0" max="0.05" step="0.001" value="0.010" />
                        <span class="val">0.010</span>
                    </div>
                </section>

                <!-- 文字 -->
                <section class="block">
                    <div class="block-title">文字</div>
                    <div class="ctrl ctrl-text">
                        <label>名称</label>
                        <input type="text" id="capName" placeholder="徽章名称" maxlength="40" />
                    </div>
                    <div class="ctrl ctrl-text">
                        <label>版权</label>
                        <input type="text" id="capCopy" placeholder="© 版权信息" maxlength="40" />
                    </div>
                </section>

                <!-- 导出 -->
                <section class="block">
                    <div class="block-title">导出</div>
                    <div class="ctrl">
                        <label>背景</label>
                        <select id="exportBgSel">
                            <option value="scene">场景</option>
                            <option value="solid">纯色</option>
                            <option value="gradient">渐变</option>
                        </select>
                    </div>
                    <div class="ctrl">
                        <label>尺寸</label>
                        <select id="exportSizeSel">
                            <option value="512">512×512</option>
                            <option value="1024" selected>1024×1024</option>
                            <option value="2048">2048×2048</option>
                        </select>
                    </div>
                    <button id="exportBtn" class="primary-btn">导出 PNG</button>
                </section>

                <footer class="panel-footer">
                    <span>提示：拖拽 3D 视图可旋转视角，滚轮缩放</span>
                </footer>
            </div>
        </aside>

        <!-- 3D 视口 -->
        <main id="viewport" class="viewport">
            <canvas id="canvas"></canvas>
            <div class="vp-topbar">
                <button id="panelToggle" class="icon-btn" title="收起 / 展开面板" aria-label="收起 / 展开面板">☰</button>
                <button id="resetCamBtn" class="ghost-btn small" title="重置视角">重置视角</button>
                <div class="vp-status" id="vpStatus">就绪</div>
            </div>
            <div class="vp-hint" id="vpHint">拖拽旋转 · 滚轮缩放 · 右键平移</div>
        </main>
        <!-- 移动端面板遮罩 -->
        <div id="panelBackdrop" class="panel-backdrop"></div>
    </div>
</template>

<script setup>
// 徽章造 3D — 主程序
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import {
    createPresetShape, shapesFromSVG, shapesFromPNG
} from './shapes.js';
import { getMatcap, getNormalMap, buildMaterial } from './materials.js';
import { onMounted } from 'vue';

onMounted(() => {
    // ===== 全局状态 =====
    const state = {
        shape: 'circle',
        customShapes: null,    // 上传得到的 Shape 数组（优先于预设）
        faceTexture: null,     // 上传图片生成的贴图（应用到徽章正面）
        depth: 0.30,
        bevel: 0.04,
        thickness: 0.08,
        size: 1.00,
        matcap: 'none',
        normalMap: 'none',
        normalScale: 1.0,
        metalness: 0.90,
        roughness: 0.15,
        env: 'studio',
        ambient: 0.40,
        spotInt: 2.00,
        lightX: 5.0,
        lightY: 8.0,
        lightZ: 6.0,
        bgColor: '#111111',
        autoRotate: true,
        perspective: true,
        preview: true,
        bloomStrength: 0.40,
        bloomThreshold: 0.85,
        bloomRadius: 0.30,
        dofFocus: 5.00,
        dofAperture: 0.0,
        dofMaxBlur: 0.010,
        capName: '',
        capCopy: '',
        layers: [
            { zOffset: 0.00, depthMul: 1.00, color: '#666666' }
        ]
    };

    const MAX_LAYERS = 6;
    let scene, renderer, composer, camera, orthoCamera, controls;
    let badgeGroup, ambientLight, spotLight, envTex, captionSprite;
    let bloomPass, bokehPass, renderPass, outputPass;
    let currentMaterials = [];   // 用于释放

    const canvas = document.getElementById('canvas');
    const viewport = document.getElementById('viewport');

    // ===== 初始化 =====
    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(state.bgColor);

        const w = viewport.clientWidth, h = viewport.clientHeight;

        // 透视相机
        camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
        camera.position.set(0, 0, 5);

        // 正交相机（透视开关关闭时使用）
        const orthoSize = 2.4;
        orthoCamera = new THREE.OrthographicCamera(
            -orthoSize * w / h, orthoSize * w / h, orthoSize, -orthoSize, 0.1, 100
        );
        orthoCamera.position.set(0, 0, 5);

        renderer = new THREE.WebGLRenderer({
            canvas, antialias: true, alpha: false,
            preserveDrawingBuffer: true   // 便于导出
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        // 环境贴图
        const pmrem = new THREE.PMREMGenerator(renderer);
        envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;

        // 灯光
        ambientLight = new THREE.AmbientLight(0xffffff, state.ambient);
        scene.add(ambientLight);
        spotLight = new THREE.SpotLight(0xffffff, state.spotInt * 10, 0, Math.PI / 4, 0.4, 1.2);
        spotLight.position.set(state.lightX, state.lightY, state.lightZ);
        scene.add(spotLight);
        scene.add(spotLight.target);

        // 徽章组
        badgeGroup = new THREE.Group();
        scene.add(badgeGroup);

        // 控制器
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 2;
        controls.maxDistance = 12;
        controls.autoRotate = state.autoRotate;
        controls.autoRotateSpeed = 1.2;

        // 后期处理
        composer = new EffectComposer(renderer);
        renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), state.bloomStrength, state.bloomRadius, state.bloomThreshold);
        composer.addPass(bloomPass);
        bokehPass = new BokehPass(scene, camera, {
            focus: state.dofFocus, aperture: state.dofAperture, maxblur: state.dofMaxBlur
        });
        bokehPass.enabled = state.dofAperture > 0.0001;
        composer.addPass(bokehPass);
        // SMAA 抗锯齿：弥补 EffectComposer 渲染到 RT 时丢失的 MSAA，让边缘更锐利
        const smaaPass = new SMAAPass(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
        composer.addPass(smaaPass);
        outputPass = new OutputPass();
        composer.addPass(outputPass);

        // 文字说明
        captionSprite = makeCaptionSprite();
        captionSprite.position.set(0, -1.7, 0);
        scene.add(captionSprite);

        buildBadge();
        bindUI();
        onResize();

        window.addEventListener('resize', onResize);
        animate();
    }

    // ===== 徽章构建 =====
    function getActiveShapes() {
        if (state.customShapes && state.customShapes.length) return state.customShapes;
        return createPresetShape(state.shape);
    }

    function buildBadge() {
        // 释放旧资源
        while (badgeGroup.children.length) {
            const c = badgeGroup.children.pop();
            c.geometry?.dispose();
        }
        currentMaterials.forEach(m => m.dispose());
        currentMaterials = [];

        const shapes = getActiveShapes();
        if (!shapes || !shapes.length) return;

        const baseDepth = Math.max(0.001, state.depth);
        const bevel = state.bevel;
        const thickness = state.thickness;
        const size = state.size;

        // 根据是否有上传纹理调整 Bloom 效果
        const hasFaceTexGlobal = !!state.faceTexture;
        if (hasFaceTexGlobal) {
            bloomPass.strength = Math.min(state.bloomStrength, 0.15);
            bloomPass.threshold = Math.max(state.bloomThreshold, 0.95);
        } else {
            bloomPass.strength = state.bloomStrength;
            bloomPass.threshold = state.bloomThreshold;
        }

        // ===== 图层堆叠优化：确保几何无交叉 =====
        // 先计算每个图层的实际深度和 bevel 偏移
        const layerConfigs = state.layers.map((layer, idx) => {
            const layerDepth = Math.max(0.001, baseDepth * layer.depthMul);
            // bevel 实际占用的 Z 空间（前后面各有 bevelThickness）
            const bevelZ = bevel > 0.001 ? bevel * 0.8 : 0;
            return {
                layer,
                layerDepth,
                // 图层的实际 Z 范围（从底面到顶面）
                halfDepth: layerDepth / 2 + bevelZ
            };
        });

        // 自动堆叠模式：从最底层开始，确保上一层的底面 >= 下一层的顶面
        // Layer 0 作为基准，使用其 zOffset 作为起点
        const STACK_GAP = 0.0001; // 层间微小间隙，防止共面
        const zPositions = [];
        let currentTopZ = null;

        layerConfigs.forEach((cfg, idx) => {
            const { halfDepth, layer } = cfg;
            let zCenter;

            if (idx === 0) {
                // 第一层使用原始 zOffset
                zCenter = layer.zOffset + thickness * 0.5;
                currentTopZ = zCenter + halfDepth;
            } else {
                // 后续层：基于上一层的顶部位置自动堆叠
                // 如果用户设置的 zOffset 导致交叉，则使用自动堆叠位置
                const userZ = layer.zOffset + thickness * 0.5;
                const minZ = currentTopZ + STACK_GAP;
                zCenter = Math.max(userZ, minZ);
                currentTopZ = zCenter + halfDepth;
            }
            zPositions.push(zCenter);
        });

        // 构建每层
        layerConfigs.forEach((cfg, idx) => {
            const { layer, layerDepth } = cfg;
            const z = zPositions[idx];

            // 内层图层减小 bevel，减少交叉伪影
            const isTopLayer = idx === state.layers.length - 1;
            const layerBevel = isTopLayer ? bevel : bevel * 0.5;

            const geom = new THREE.ExtrudeGeometry(shapes, {
                depth: layerDepth,
                bevelEnabled: layerBevel > 0.001,
                bevelThickness: layerBevel,
                bevelSize: layerBevel * 0.6,
                bevelSegments: 6,
                curveSegments: 128,
                steps: 1
            });
            // 居中并翻转 Y（SVG 坐标系 Y 向下）
            geom.center();
            geom.rotateX(Math.PI);
            geom.translate(0, 0, z);
            geom.scale(size, size, size);

            // 若存在上传贴图，依据几何包围盒重算 UV，使贴图贴合正面
            const hasFaceTex = !!state.faceTexture && idx === 0;
            if (hasFaceTex) applyFaceUVs(geom);

            const matcapTex = getMatcap(state.matcap);
            const normalTex = getNormalMap(state.normalMap);
            const baseMatOpts = {
                matcap: matcapTex,
                normalMap: normalTex,
                normalScale: state.normalScale,
                metalness: state.metalness,
                roughness: state.roughness,
                color: layer.color,
                envMap: state.env === 'studio' ? envTex : null,
                polygonOffset: idx > 0  // 内层图层启用 polygonOffset 防Z-fighting
            };

            let mesh;
            if (hasFaceTex) {
                const faceMat = new THREE.MeshBasicMaterial({
                    map: state.faceTexture,
                    color: 0xffffff,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1
                });
                faceMat.needsUpdate = true;
                const sideMat = buildMaterial(baseMatOpts);
                currentMaterials.push(faceMat, sideMat);
                mesh = new THREE.Mesh(geom, [faceMat, sideMat]);
            } else {
                const mat = buildMaterial(baseMatOpts);
                currentMaterials.push(mat);
                mesh = new THREE.Mesh(geom, mat);
            }
            mesh.castShadow = true;
            badgeGroup.add(mesh);
        });

        updateCaption();
    }

    function updateCaption() {
        if (!captionSprite) return;
        scene.remove(captionSprite);
        captionSprite.material.map?.dispose();
        captionSprite.material.dispose();
        captionSprite = makeCaptionSprite();
        captionSprite.position.set(0, -1.7, 0);
        scene.add(captionSprite);
    }

    function makeCaptionSprite() {
        const name = state.capName || '';
        const copy = state.capCopy || '';
        const lines = [name, copy].filter(Boolean);
        // 使用 2x 超采样提升文字清晰度
        const SS = 2;
        const canvas2 = document.createElement('canvas');
        const ctx = canvas2.getContext('2d');
        const fontSize = 54 * SS;
        ctx.font = `${fontSize}px "PingFang SC","Microsoft YaHei",Arial,sans-serif`;
        let maxW = 1;
        lines.forEach(l => { maxW = Math.max(maxW, ctx.measureText(l).width); });
        const padX = 40 * SS, padY = 24 * SS, lineH = fontSize + 12 * SS;
        canvas2.width = Math.ceil(maxW + padX * 2);
        canvas2.height = Math.max(64 * SS, lines.length * lineH + padY);
        ctx.font = `${fontSize}px "PingFang SC","Microsoft YaHei",Arial,sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
        ctx.fillStyle = '#e6e8ee';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lines.forEach((l, i) => {
            ctx.fillText(l, canvas2.width / 2, padY / 2 + i * lineH + fontSize / 2);
        });
        const tex = new THREE.CanvasTexture(canvas2);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        const scale = 2.6;
        sprite.scale.set(scale, scale * canvas2.height / canvas2.width, 1);
        return sprite;
    }

    // ===== UI 绑定 =====
    function bindUI() {
        // 通用滑块绑定
        document.querySelectorAll('.ctrl[data-key] input[type="range"]').forEach(el => {
            const key = el.parentElement.dataset.key;
            const valEl = el.parentElement.querySelector('.val');
            const update = () => {
                const v = parseFloat(el.value);
                state[key] = v;
                valEl.textContent = formatVal(v, key);
                applyParam(key);
            };
            el.addEventListener('input', update);
            update();
        });

        // 形状预设
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.shape = btn.dataset.shape;
                state.customShapes = null;
                buildBadge();
            });
        });

        // 文件上传
        const fileInput = document.getElementById('fileInput');
        const onFileChange = async (e) => {
            const file = fileInput.files[0];
            if (!file) return;
            setStatus('正在解析图案…');
            try {
                if (file.type.includes('svg') || file.name.endsWith('.svg')) {
                    const text = await file.text();
                    const shapes = shapesFromSVG(text);
                    if (!shapes) throw new Error('SVG 中未找到可用路径');
                    state.customShapes = shapes;
                    // 同时渲染 SVG 为贴图，使图案内容显示在徽章正面
                    // state.faceTexture = await makeTextureFromSVG(text);
                    state.faceTexture = null;
                    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                    buildBadge();
                    setStatus('已加载 SVG');
                } else if (file.type.includes('png') || file.name.endsWith('.png')) {
                    const img = await loadImage(file);
                    // 将图片作为贴图应用到徽章正面
                    state.faceTexture = makeTextureFromImage(img);
                    // 同时提取轮廓作为徽章外形（失败则保留当前形状）
                    try {
                        const imgForShape = drawOrientedImage(img, 1);
                        const shapes = await shapesFromPNG(imgForShape);
                        if (shapes && shapes.length) {
                            state.customShapes = shapes;
                            document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                        }
                    } catch (tracErr) {
                        console.warn('轮廓提取失败，仅应用贴图', tracErr);
                    }
                    buildBadge();
                    setStatus('已加载 PNG');
                } else if (/image\/(jpe?g|tiff?|webp|bmp|gif)/i.test(file.type || '') || /\.(jpe?g|tiff?|webp|bmp|gif)$/i.test(file.name || '')) {
                    const oriPromise = readExifOrientation(file);
                    const img = await loadImage(file, oriPromise);
                    state.faceTexture = makeTextureFromImage(img);
                    buildBadge();
                    setStatus('已加载图片');
                } else {
                    throw new Error('仅支持 SVG / PNG / JPG 图片格式');
                }
            } catch (err) {
                setStatus('加载失败：' + err.message, true);
            } finally {
                fileInput.value = '';
            }
        };
        fileInput.addEventListener('change', onFileChange);

        // 清除
        document.getElementById('clearBtn').addEventListener('click', () => {
            state.customShapes = null;
            if (state.faceTexture) {
                state.faceTexture.dispose();
                state.faceTexture = null;
            }
            document.querySelector(`.shape-btn[data-shape="${state.shape}"]`)?.classList.add('active');
            buildBadge();
            setStatus('已清除自定义图案');
        });

        // 材质下拉
        document.getElementById('matcapSel').addEventListener('change', (e) => {
            state.matcap = e.target.value; buildBadge();
        });
        document.getElementById('normalSel').addEventListener('change', (e) => {
            state.normalMap = e.target.value; buildBadge();
        });

        // 环境下拉
        document.getElementById('envSel').addEventListener('change', (e) => {
            state.env = e.target.value;
            scene.environment = state.env === 'studio' ? envTex : null;
            buildBadge();
        });

        // 背景色
        const bgColor = document.getElementById('bgColor');
        bgColor.addEventListener('input', (e) => {
            state.bgColor = e.target.value;
            scene.background = new THREE.Color(state.bgColor);
            bgColor.parentElement.querySelector('.val').textContent = state.bgColor;
        });

        // 开关
        document.getElementById('autoRotate').addEventListener('change', (e) => {
            state.autoRotate = e.target.checked;
            controls.autoRotate = state.autoRotate;
        });
        document.getElementById('perspective').addEventListener('change', (e) => {
            state.perspective = e.target.checked;
            applyCamera();
        });
        document.getElementById('preview').addEventListener('change', (e) => {
            state.preview = e.target.checked;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, state.preview ? 2 : 1));
            composer.setPixelRatio(Math.min(window.devicePixelRatio, state.preview ? 2 : 1));
            onResize();
        });

        // 文字
        document.getElementById('capName').addEventListener('input', (e) => {
            state.capName = e.target.value; updateCaption();
        });
        document.getElementById('capCopy').addEventListener('input', (e) => {
            state.capCopy = e.target.value; updateCaption();
        });

        // 重置视角
        document.getElementById('resetCamBtn').addEventListener('click', () => {
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
            orthoCamera.position.set(0, 0, 5);
            orthoCamera.lookAt(0, 0, 0);
            controls.target.set(0, 0, 0);
            controls.update();
        });

        // 导出
        document.getElementById('exportBtn').addEventListener('click', exportPNG);

        // 图层
        renderLayers();
        document.getElementById('addLayerBtn').addEventListener('click', addLayer);

        // 移动端面板
        const panel = document.getElementById('panel');
        const toggle = document.getElementById('panelToggle');
        const backdrop = document.getElementById('panelBackdrop');
        toggle.addEventListener('click', () => {
            panel.classList.toggle('open');
            backdrop.classList.toggle('show');
        });
        backdrop.addEventListener('click', () => {
            panel.classList.remove('open');
            backdrop.classList.remove('show');
        });
    }

    function formatVal(v, key) {
        if (['dofAperture'].includes(key)) return v.toFixed(4);
        if (['dofMaxBlur'].includes(key)) return v.toFixed(3);
        if (['lightX', 'lightY', 'lightZ', 'normalScale'].includes(key)) return v.toFixed(1);
        return v.toFixed(2);
    }

    function applyParam(key) {
        switch (key) {
            case 'depth': case 'bevel': case 'thickness': case 'size':
                buildBadge();
                break;
            case 'normalScale':
                currentMaterials.forEach(m => {
                    if (m.normalScale) m.normalScale.set(state.normalScale, state.normalScale);
                });
                break;
            case 'metalness':
                currentMaterials.forEach(m => { if ('metalness' in m) m.metalness = state.metalness; });
                break;
            case 'roughness':
                currentMaterials.forEach(m => { if ('roughness' in m) m.roughness = Math.max(0.02, state.roughness); });
                break;
            case 'ambient':
                ambientLight.intensity = state.ambient;
                break;
            case 'spotInt':
                spotLight.intensity = state.spotInt * 10;
                break;
            case 'lightX': case 'lightY': case 'lightZ':
                spotLight.position.set(state.lightX, state.lightY, state.lightZ);
                break;
            case 'bloomStrength':
                bloomPass.strength = !!state.faceTexture
                    ? Math.min(state.bloomStrength, 0.15)
                    : state.bloomStrength;
                break;
            case 'bloomThreshold':
                bloomPass.threshold = !!state.faceTexture
                    ? Math.max(state.bloomThreshold, 0.95)
                    : state.bloomThreshold;
                break;
            case 'bloomRadius': bloomPass.radius = state.bloomRadius; break;
            case 'dofFocus':
                bokehPass.uniforms.focus.value = state.dofFocus; break;
            case 'dofAperture':
                bokehPass.uniforms.aperture.value = state.dofAperture;
                bokehPass.enabled = state.dofAperture > 0.0001;
                break;
            case 'dofMaxBlur':
                bokehPass.uniforms.maxblur.value = state.dofMaxBlur; break;
        }
    }

    function applyCamera() {
        const w = viewport.clientWidth, h = viewport.clientHeight;
        if (state.perspective) {
            composer.passes.forEach(p => { p.camera = camera; });
            renderPass.camera = camera;
            bokehPass.camera = camera;
            controls.object = camera;
        } else {
            const orthoSize = 2.4;
            orthoCamera.left = -orthoSize * w / h;
            orthoCamera.right = orthoSize * w / h;
            orthoCamera.top = orthoSize;
            orthoCamera.bottom = -orthoSize;
            orthoCamera.updateProjectionMatrix();
            composer.passes.forEach(p => { p.camera = orthoCamera; });
            renderPass.camera = orthoCamera;
            bokehPass.camera = orthoCamera;
            controls.object = orthoCamera;
        }
        controls.update();
    }

    // ===== 图层 UI =====
    function renderLayers() {
        const list = document.getElementById('layersList');
        list.innerHTML = '';
        state.layers.forEach((layer, idx) => {
            const item = document.createElement('div');
            item.className = 'layer-item';
            item.innerHTML = `
      <div class="layer-head">
        <div class="layer-name">
          <span class="layer-dot" style="background:${layer.color}">
            <input type="color" value="${layer.color}" data-idx="${idx}" data-field="color" />
          </span>
          图层 ${idx + 1}
        </div>
        ${state.layers.length > 1 ? `<button class="layer-del" data-idx="${idx}" title="删除图层">×</button>` : ''}
      </div>
      <div class="layer-ctrl">
        <label>Z 偏移</label>
        <input type="range" min="0" max="0.5" step="0.005" value="${layer.zOffset}" data-idx="${idx}" data-field="zOffset" />
        <span class="val">${layer.zOffset.toFixed(2)}</span>
      </div>
      <div class="layer-ctrl">
        <label>深度 ×</label>
        <input type="range" min="0" max="2" step="0.05" value="${layer.depthMul}" data-idx="${idx}" data-field="depthMul" />
        <span class="val">${layer.depthMul.toFixed(2)}</span>
      </div>
    `;
            list.appendChild(item);
        });

        list.querySelectorAll('input[type="range"]').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = +el.dataset.idx;
                const field = el.dataset.field;
                const v = parseFloat(el.value);
                state.layers[idx][field] = v;
                el.parentElement.querySelector('.val').textContent = v.toFixed(2);
                buildBadge();
            });
        });
        list.querySelectorAll('input[type="color"]').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = +el.dataset.idx;
                state.layers[idx].color = el.value;
                el.parentElement.style.background = el.value;
                buildBadge();
            });
        });
        list.querySelectorAll('.layer-del').forEach(el => {
            el.addEventListener('click', () => {
                const idx = +el.dataset.idx;
                state.layers.splice(idx, 1);
                renderLayers();
                buildBadge();
            });
        });

        document.getElementById('addLayerBtn').disabled = state.layers.length >= MAX_LAYERS;
    }

    function addLayer() {
        if (state.layers.length >= MAX_LAYERS) return;
        const last = state.layers[state.layers.length - 1];
        state.layers.push({
            zOffset: Math.min(0.5, (last?.zOffset || 0) + 0.06),
            depthMul: Math.max(0.1, (last?.depthMul || 1) * 0.5),
            color: '#cccccc'
        });
        renderLayers();
        buildBadge();
    }

    // ===== 工具函数 =====

    // 从 File 的二进制中读取 EXIF Orientation（JPEG 标记 0x0112）；读不到返回 1
    function readExifOrientation(file) {
        return new Promise((resolve) => {
            if (!/(jpe?g|tiff?)$/i.test(file.name) && !/image\/(jpe?g|tiff?)/i.test(file.type || '')) {
                resolve(1); return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const view = new DataView(e.target.result);
                if (view.byteLength < 4) { resolve(1); return; }
                if (view.getUint16(0, false) !== 0xFFD8) { resolve(1); return; } // 非 JPEG SOI
                let offset = 2;
                while (offset < view.byteLength - 4) {
                    const marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xFFE1) { // APP1 (Exif)
                        if (view.getUint32(offset + 2, false) !== 0x45786966) { resolve(1); return; } // "Exif"
                        const little = view.getUint16(offset + 8, false) === 0x4949;
                        const tiffOffset = offset + 8;
                        const ifd0 = tiffOffset + view.getUint32(tiffOffset + 4, little);
                        const entries = view.getUint16(ifd0, little);
                        for (let i = 0; i < entries; i++) {
                            const tag = view.getUint16(ifd0 + 2 + i * 12, little);
                            if (tag === 0x0112) { // Orientation
                                resolve(view.getUint16(ifd0 + 2 + i * 12 + 8, little));
                                return;
                            }
                        }
                        resolve(1); return;
                    } else if ((marker & 0xFF00) !== 0xFF00) {
                        break;
                    } else {
                        offset += view.getUint16(offset, false);
                    }
                }
                resolve(1);
            };
            reader.onerror = () => resolve(1);
            reader.readAsArrayBuffer(file.slice(0, Math.min(file.size, 256 * 1024)));
        });
    }

    // 根据 EXIF Orientation 1~8 将 img 绘制到 canvas 上并纠正方向；返回 canvas（校正后像素方向与真实场景一致）
    // 变换参考业界标准实现 blueimp/JavaScript-Load-Image，确保 8 种方向均将像素正确映射到输出画布
    function drawOrientedImage(img, orientation) {
        const ori = orientation || 1;
        const w = img.width, h = img.height;
        const swapWH = ori >= 5 && ori <= 8;
        const outW = swapWH ? h : w;
        const outH = swapWH ? w : h;
        const canvas = document.createElement('canvas');
        canvas.width = outW; canvas.height = outH;
        const ctx = canvas.getContext('2d');
        ctx.save();
        // 说明：Canvas 变换后调用的变换先作用于像素点（右乘），即代码顺序与像素点上的执行顺序相反
        switch (ori) {
            case 1: // 正常（无变换）
                break;
            case 2: // 水平镜像翻转（左-右颠倒）
                ctx.translate(outW, 0); ctx.scale(-1, 1);
                break;
            case 3: // 旋转 180°（上下+左右都颠倒，常见于相机倒置拍摄）
                ctx.translate(outW, outH); ctx.rotate(Math.PI);
                break;
            case 4: // 垂直镜像翻转（上-下颠倒）
                ctx.translate(0, outH); ctx.scale(1, -1);
                break;
            case 5: // 转置 transpose（沿主对角线翻转，等价于 顺时针 90° + 水平镜像）
                // 注意：无需 translate(0,0) 以外的平移；否则会将图像移出输出画布
                ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1);
                break;
            case 6: // 顺时针 90°（最常见：手机竖屏右手持拍照，传感器方向标记为 6）
                ctx.translate(outW, 0); ctx.rotate(0.5 * Math.PI);
                break;
            case 7: // 横置 transverse（沿反对角线翻转，等价于 顺时针 90° + 垂直镜像）
                ctx.translate(outW, outH); ctx.rotate(-0.5 * Math.PI); ctx.scale(1, -1);
                break;
            case 8: // 逆时针 90°（顺时针 270°，手机横屏翻转持拍照）
                ctx.translate(0, outH); ctx.rotate(-0.5 * Math.PI);
                break;
            default: break;
        }
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
        return canvas;
    }

    function loadImage(file, orientationPromise) {
        return new Promise((resolve, reject) => {
            const oriPromise = orientationPromise || Promise.resolve(1);
            const img = new Image();
            const cleanup = () => { try { URL.revokeObjectURL(img.src); } catch (_) { } };
            img.onload = async () => {
                try {
                    const ori = await oriPromise;
                    const oriented = drawOrientedImage(img, ori);
                    cleanup();
                    resolve(oriented);
                } catch (e) {
                    cleanup(); reject(e);
                }
            };
            img.onerror = () => { cleanup(); reject(new Error('图片解码失败')); };
            img.src = URL.createObjectURL(file);
        });
    }

    // 将 Image 或 Canvas 转为 CanvasTexture
    // 画布尺寸匹配图片实际比例（最长边 ≤ 1024），避免非 1:1 图片出现透明边框
    function makeTextureFromImage(img) {
        const maxSize = 1024;
        const w = img.width, h = img.height;

        // 1. 先绘制到临时 canvas 读取像素，裁剪透明边距
        const tmp = document.createElement('canvas');
        tmp.width = w; tmp.height = h;
        const tctx = tmp.getContext('2d', { willReadFrequently: true });
        tctx.drawImage(img, 0, 0, w, h);
        const data = tctx.getImageData(0, 0, w, h).data;

        // 2. 扫描非透明区域的最小边界
        let minX = w, minY = h, maxX = 0, maxY = 0;
        let found = false;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[(y * w + x) * 4 + 3] > 0) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                    found = true;
                }
            }
        }
        // 无非透明像素则回退整图
        if (!found) { minX = 0; minY = 0; maxX = w - 1; maxY = h - 1; }
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;

        // 3. 按最长边等比缩放裁剪区域
        const scale = Math.min(maxSize / cropW, maxSize / cropH);
        const cw = Math.max(1, Math.round(cropW * scale));
        const ch = Math.max(1, Math.round(cropH * scale));

        const canvas = document.createElement('canvas');
        canvas.width = cw; canvas.height = ch;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, cw, ch);
        // 从原图裁剪区域绘制到画布（无透明边框）
        ctx.drawImage(img, minX, minY, cropW, cropH, 0, 0, cw, ch);

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        return tex;
    }

    // 将 SVG 文本渲染为 CanvasTexture
    function makeTextureFromSVG(svgText) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(makeTextureFromImage(img));
            };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG 渲染失败')); };
            img.src = url;
        });
    }

    // 依据几何体 XY 包围盒生成 [0,1] 范围的 UV，使贴图正确贴合徽章正面
    // 关键：只为 materialIndex=0（前后面）的顶点设置 UV，侧面顶点设置为安全值
    function applyFaceUVs(geometry) {
        const pos = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        if (!uv) return;

        const groups = geometry.groups || [];
        const frontBackGroup = groups.find(g => g.materialIndex === 0);

        // 如果找不到 materialIndex=0 的分组，回退到原逻辑
        if (!frontBackGroup) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i), y = pos.getY(i);
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
            const rangeX = (maxX - minX) || 1;
            const rangeY = (maxY - minY) || 1;
            for (let i = 0; i < uv.count; i++) {
                const x = pos.getX(i), y = pos.getY(i);
                uv.setXY(i, (x - minX) / rangeX, (y - minY) / rangeY);
            }
            uv.needsUpdate = true;
            return;
        }

        // 1. 计算前后面顶点的 XY 范围
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        const start = frontBackGroup.start;
        const end = start + frontBackGroup.count;
        for (let i = start; i < end; i++) {
            const x = pos.getX(i), y = pos.getY(i);
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
        const rangeX = (maxX - minX) || 1;
        const rangeY = (maxY - minY) || 1;

        // 2. 只为前后面顶点设置 UV 映射
        for (let i = start; i < end; i++) {
            const x = pos.getX(i), y = pos.getY(i);
            // 正向映射：贴图顶部(UV.y=1) 对应几何正上方(maxY)，贴图底部(UV.y=0) 对应几何正下方(minY)
            uv.setXY(i, (x - minX) / rangeX, (y - minY) / rangeY);
        }

        // 3. 侧面顶点设置为安全值（侧面使用 sideMat 材质，不需要纹理坐标）
        const sideGroup = groups.find(g => g.materialIndex === 1);
        if (sideGroup) {
            const sStart = sideGroup.start;
            const sEnd = sStart + sideGroup.count;
            for (let i = sStart; i < sEnd; i++) {
                uv.setXY(i, 0.5, 0.5);
            }
        }

        uv.needsUpdate = true;
    }

    function setStatus(msg, isError) {
        const el = document.getElementById('vpStatus');
        el.textContent = msg;
        el.style.color = isError ? 'var(--danger)' : '';
        clearTimeout(setStatus._t);
        setStatus._t = setTimeout(() => {
            el.textContent = '就绪';
            el.style.color = '';
        }, 3500);
    }

    function onResize() {
        const w = viewport.clientWidth, h = viewport.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const orthoSize = 2.4;
        orthoCamera.left = -orthoSize * w / h;
        orthoCamera.right = orthoSize * w / h;
        orthoCamera.top = orthoSize;
        orthoCamera.bottom = -orthoSize;
        orthoCamera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
    }

    // ===== 导出 =====
    function exportPNG() {
        const size = +document.getElementById('exportSizeSel').value;
        const bgMode = document.getElementById('exportBgSel').value;
        const wasAutoRotate = controls.autoRotate;
        controls.autoRotate = false;

        const oldBg = scene.background;
        if (bgMode === 'solid') {
            scene.background = new THREE.Color(state.bgColor);
        } else if (bgMode === 'gradient') {
            scene.background = makeGradientTexture(state.bgColor);
        } else {
            scene.background = new THREE.Color(state.bgColor);
        }

        // 临时调整渲染尺寸
        const oldPR = renderer.getPixelRatio();
        const oldW = viewport.clientWidth, oldH = viewport.clientHeight;
        renderer.setPixelRatio(1);
        renderer.setSize(size, size, false);
        composer.setPixelRatio(1);
        composer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();

        renderer.render(scene, state.perspective ? camera : orthoCamera);
        composer.render();

        const dataURL = renderer.domElement.toDataURL('image/png');

        // 恢复
        renderer.setPixelRatio(oldPR);
        renderer.setSize(oldW, oldH, false);
        composer.setPixelRatio(oldPR);
        composer.setSize(oldW, oldH);
        camera.aspect = oldW / oldH;
        camera.updateProjectionMatrix();
        scene.background = oldBg;
        controls.autoRotate = wasAutoRotate;

        // 下载
        const a = document.createElement('a');
        const safeName = (state.capName || 'badge').replace(/[^\w\u4e00-\u9fa5-]+/g, '_').slice(0, 30) || 'badge';
        a.href = dataURL;
        a.download = `${safeName}_${size}.png`;
        a.click();
        setStatus(`已导出 ${size}×${size} PNG`);
    }

    function makeGradientTexture(color) {
        const c = new THREE.Color(color);
        const lighter = c.clone().lerp(new THREE.Color(0xffffff), 0.12);
        const darker = c.clone().lerp(new THREE.Color(0x000000), 0.35);
        const canvas2 = document.createElement('canvas');
        canvas2.width = 16; canvas2.height = 256;
        const ctx = canvas2.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#' + lighter.getHexString());
        grad.addColorStop(1, '#' + darker.getHexString());
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 256);
        const tex = new THREE.CanvasTexture(canvas2);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // ===== 渲染循环 =====
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        composer.render();
    }

    // 启动
    init();
})
</script>

<style>
#badge-3d-body {
    --bg: #0e0f12;
    --bg-panel: #16181d;
    --bg-block: #1c1f26;
    --bg-input: #0c0d10;
    --border: #2a2e38;
    --border-soft: #232730;
    --text: #e6e8ee;
    --text-dim: #9aa0ad;
    --text-faint: #5e6470;
    --accent: #ffd54a;
    --accent-soft: rgba(255, 213, 74, 0.14);
    --accent-line: rgba(255, 213, 74, 0.35);
    --danger: #ff6b6b;
    --radius: 10px;
    --radius-sm: 7px;
    --shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
    --panel-w: 320px;
    --mono: "SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
        "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
}

#badge-3d-body {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    margin: 0;
    padding: 0;
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.5;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    button,
    input,
    select,
    textarea {
        font-family: inherit;
        color: inherit;
    }

    /* ===== 控制面板 ===== */
    .panel {
        width: var(--panel-w);
        flex: 0 0 var(--panel-w);
        height: 100%;
        background: var(--bg-panel);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        z-index: 20;
        transition: transform 0.28s ease;
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
        background: linear-gradient(180deg, #1a1d24 0%, #16181d 100%);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .brand-mark {
        font-size: 22px;
        color: var(--accent);
        line-height: 1;
        filter: drop-shadow(0 0 8px var(--accent-soft));
    }

    .brand-text h1 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .brand-text p {
        margin: 0;
        font-size: 11px;
        color: var(--text-faint);
    }

    .icon-btn {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-dim);
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-size: 15px;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
    }

    .icon-btn:hover {
        color: var(--text);
        border-color: var(--accent-line);
    }

    .panel-scroll {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 8px 12px 20px;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
    }

    .panel-scroll::-webkit-scrollbar {
        width: 8px;
    }

    .panel-scroll::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 4px;
    }

    .panel-scroll::-webkit-scrollbar-thumb:hover {
        background: #3a3f4a;
    }

    /* ===== 区块 ===== */
    .block {
        background: var(--bg-block);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius);
        padding: 12px 12px 14px;
        margin-bottom: 10px;
    }

    .block-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        text-transform: none;
        letter-spacing: 0.3px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .block-title .sub {
        font-weight: 400;
        color: var(--text-faint);
        font-size: 11px;
    }

    .sub-title {
        font-size: 11px;
        color: var(--text-dim);
        margin: 10px 0 6px;
        padding-left: 2px;
        border-left: 2px solid var(--accent-line);
        padding-left: 8px;
    }

    /* ===== 通用控件 ===== */
    .ctrl {
        display: grid;
        grid-template-columns: 70px 1fr 46px;
        align-items: center;
        gap: 8px;
        margin-bottom: 7px;
    }

    .ctrl:last-child {
        margin-bottom: 0;
    }

    .ctrl label {
        font-size: 12px;
        color: var(--text-dim);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ctrl .val {
        font-size: 11px;
        color: var(--text);
        text-align: right;
        font-family: var(--mono);
    }

    .ctrl .val.mono {
        text-align: left;
        padding-left: 6px;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        background: var(--bg-input);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--accent);
        border: 2px solid #1a1d24;
        box-shadow: 0 0 0 1px var(--accent-line);
        cursor: pointer;
        transition: transform 0.1s;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.15);
    }

    input[type="range"]::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--accent);
        border: 2px solid #1a1d24;
        cursor: pointer;
    }

    select {
        width: 100%;
        height: 28px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text);
        padding: 0 8px;
        font-size: 12px;
        cursor: pointer;
        outline: none;
        transition: border-color 0.15s;
    }

    select:hover,
    select:focus {
        border-color: var(--accent-line);
    }

    select option {
        background: #1a1d24;
    }

    input[type="text"] {
        width: 100%;
        height: 28px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text);
        padding: 0 8px;
        font-size: 12px;
        outline: none;
        transition: border-color 0.15s;
    }

    input[type="text"]:focus {
        border-color: var(--accent);
    }

    input[type="color"] {
        width: 100%;
        height: 28px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        padding: 2px;
        outline: none;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 5px;
    }

    input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 34px;
        height: 18px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: 10px;
        position: relative;
        cursor: pointer;
        transition: background 0.18s;
    }

    input[type="checkbox"]::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 12px;
        height: 12px;
        background: var(--text-faint);
        border-radius: 50%;
        transition: all 0.18s;
    }

    input[type="checkbox"]:checked {
        background: var(--accent-soft);
        border-color: var(--accent-line);
    }

    input[type="checkbox"]:checked::after {
        left: 18px;
        background: var(--accent);
    }

    .ctrl-check {
        grid-template-columns: 70px 1fr;
    }

    .ctrl-color {
        grid-template-columns: 70px 1fr 90px;
    }

    .ctrl-text {
        grid-template-columns: 50px 1fr;
    }

    /* ===== 上传行 ===== */
    .upload-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .upload-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 12px;
        background: var(--accent);
        color: #1a1d24;
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: filter 0.15s;
    }

    .upload-btn:hover {
        filter: brightness(1.08);
    }

    .hint {
        font-size: 11px;
        color: var(--text-faint);
        flex: 1;
    }

    .ghost-btn {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-dim);
        padding: 5px 10px;
        border-radius: var(--radius-sm);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s;
    }

    .ghost-btn:hover {
        color: var(--text);
        border-color: var(--accent-line);
    }

    .ghost-btn.small {
        padding: 4px 10px;
        font-size: 11px;
    }

    .primary-btn {
        width: 100%;
        margin-top: 8px;
        padding: 9px 12px;
        background: var(--accent);
        color: #1a1d24;
        border: none;
        border-radius: var(--radius-sm);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: filter 0.15s, transform 0.1s;
    }

    .primary-btn:hover {
        filter: brightness(1.08);
    }

    .primary-btn:active {
        transform: translateY(1px);
    }

    /* ===== 形状按钮 ===== */
    .shape-row {
        display: flex;
        gap: 6px;
    }

    .shape-btn {
        flex: 1;
        height: 38px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-dim);
        font-size: 18px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .shape-btn:hover {
        color: var(--text);
        border-color: var(--accent-line);
    }

    .shape-btn.active {
        color: var(--accent);
        border-color: var(--accent);
        background: var(--accent-soft);
    }

    /* ===== 图层 ===== */
    .layers-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 8px;
    }

    .layer-item {
        background: var(--bg-input);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-sm);
        padding: 8px;
    }

    .layer-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
    }

    .layer-name {
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .layer-dot {
        width: 14px;
        height: 14px;
        border-radius: 4px;
        border: 1px solid var(--border);
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .layer-dot input[type="color"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        border: none;
        padding: 0;
    }

    .layer-del {
        background: transparent;
        border: none;
        color: var(--text-faint);
        cursor: pointer;
        font-size: 14px;
        padding: 0 4px;
        line-height: 1;
        border-radius: 4px;
        transition: color 0.15s;
    }

    .layer-del:hover {
        color: var(--danger);
    }

    .layer-ctrl {
        display: grid;
        grid-template-columns: 50px 1fr 40px;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
    }

    .layer-ctrl:last-child {
        margin-bottom: 0;
    }

    .layer-ctrl label {
        font-size: 11px;
        color: var(--text-faint);
    }

    .layer-ctrl .val {
        font-size: 10px;
        text-align: right;
        font-family: var(--mono);
        color: var(--text-dim);
    }

    .add-btn {
        width: 100%;
        padding: 7px;
        background: transparent;
        border: 1px dashed var(--border);
        color: var(--text-dim);
        border-radius: var(--radius-sm);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s;
    }

    .add-btn:hover {
        color: var(--accent);
        border-color: var(--accent-line);
        background: var(--accent-soft);
    }

    .add-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    /* ===== 面板底部 ===== */
    .panel-footer {
        margin-top: 8px;
        padding: 10px 4px 4px;
        font-size: 11px;
        color: var(--text-faint);
        text-align: center;
        border-top: 1px solid var(--border-soft);
    }

    /* ===== 视口 ===== */
    .viewport {
        flex: 1;
        position: relative;
        overflow: hidden;
        background:
            radial-gradient(circle at 50% 40%, #1a1d26 0%, #0e0f12 70%);
    }

    #canvas {
        display: block;
        width: 100%;
        height: 100%;
    }

    .vp-topbar {
        position: absolute;
        top: 14px;
        left: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        pointer-events: none;
        z-index: 5;
    }

    .vp-topbar button {
        pointer-events: auto;
    }

    .vp-status {
        font-size: 11px;
        color: var(--text-faint);
        background: rgba(14, 15, 18, 0.6);
        padding: 4px 10px;
        border-radius: 12px;
        border: 1px solid var(--border-soft);
        backdrop-filter: blur(6px);
    }

    .vp-hint {
        position: absolute;
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 11px;
        color: var(--text-faint);
        background: rgba(14, 15, 18, 0.5);
        padding: 5px 14px;
        border-radius: 12px;
        border: 1px solid var(--border-soft);
        backdrop-filter: blur(6px);
        pointer-events: none;
        z-index: 5;
        white-space: nowrap;
    }

    .panel-backdrop {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 15;
        opacity: 0;
        transition: opacity 0.25s;
    }

    .panel-backdrop.show {
        display: block;
        opacity: 1;
    }

    /* ===== 加载提示 ===== */
    .loader {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        background: var(--bg);
        z-index: 100;
        transition: opacity 0.4s;
    }

    .loader.hide {
        opacity: 0;
        pointer-events: none;
    }

    .loader-ring {
        width: 42px;
        height: 42px;
        border: 3px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
    }

    .loader-text {
        color: var(--text-dim);
        font-size: 13px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* ===== 响应式 ===== */
    @media (max-width: 860px) {
        :root {
            --panel-w: 300px;
        }

        .icon-btn {
            display: flex;
        }

        .panel {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            box-shadow: var(--shadow);
        }

        .panel.open {
            transform: translateX(0);
        }

        .vp-hint {
            font-size: 10px;
            padding: 4px 10px;
        }
    }

    @media (max-width: 480px) {
        :root {
            --panel-w: 86vw;
        }

        .vp-topbar {
            top: 10px;
            left: 10px;
            right: 10px;
        }

        .ctrl {
            grid-template-columns: 64px 1fr 42px;
            gap: 6px;
        }

        .ctrl-check {
            grid-template-columns: 64px 1fr;
        }

        .ctrl-color {
            grid-template-columns: 64px 1fr 80px;
        }

        .ctrl-text {
            grid-template-columns: 46px 1fr;
        }
    }
}
</style>