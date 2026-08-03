// 材质管理：程序化生成 matcap 与法线贴图，构建徽章材质
import * as THREE from 'three';

const matcapCache = new Map();
const normalCache = new Map();

/**
 * 程序化生成 matcap 纹理（512x512）
 */
export function getMatcap(name) {
  if (!name || name === 'none') return null;
  if (matcapCache.has(name)) return matcapCache.get(name);

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  switch (name) {
    case 'chrome': drawMatcap(ctx, size, ['#ffffff', '#cfd6e0', '#6b7785', '#2a3038', '#0d1014']); break;
    case 'gold': drawMatcap(ctx, size, ['#fff7d6', '#ffd86b', '#c9962a', '#6e4f12', '#2c1d04']); break;
    case 'bronze': drawMatcap(ctx, size, ['#fff0d8', '#e0a86a', '#9c5e2a', '#52301a', '#1a0e06']); break;
    case 'dark_metal': drawMatcap(ctx, size, ['#9aa4b2', '#5a626e', '#33383f', '#1a1d22', '#08090b']); break;
    case 'blue_glass': drawMatcapGlass(ctx, size); break;
    default: return null;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  matcapCache.set(name, tex);
  return tex;
}

function drawMatcap(ctx, s, stops) {
  // 从左上到右下的径向渐变模拟金属球
  const grad = ctx.createRadialGradient(s * 0.36, s * 0.32, s * 0.04, s * 0.5, s * 0.5, s * 0.62);
  stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);

  // 边缘暗化
  const rim = ctx.createRadialGradient(s * 0.5, s * 0.5, s * 0.42, s * 0.5, s * 0.5, s * 0.5);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, s, s);

  // 高光
  const hi = ctx.createRadialGradient(s * 0.34, s * 0.28, 0, s * 0.34, s * 0.28, s * 0.22);
  hi.addColorStop(0, 'rgba(255,255,255,0.9)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hi;
  ctx.fillRect(0, 0, s, s);
}

function drawMatcapGlass(ctx, s) {
  const grad = ctx.createRadialGradient(s * 0.4, s * 0.34, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
  grad.addColorStop(0, '#dff1ff');
  grad.addColorStop(0.35, '#5fa8e6');
  grad.addColorStop(0.7, '#1f4f86');
  grad.addColorStop(1, '#0a1a30');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);

  const rim = ctx.createRadialGradient(s * 0.5, s * 0.5, s * 0.4, s * 0.5, s * 0.5, s * 0.5);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, s, s);

  const hi = ctx.createRadialGradient(s * 0.36, s * 0.3, 0, s * 0.36, s * 0.3, s * 0.24);
  hi.addColorStop(0, 'rgba(255,255,255,0.95)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hi;
  ctx.fillRect(0, 0, s, s);
}

/**
 * 程序化生成法线贴图（1024x1024）
 */
export function getNormalMap(name) {
  if (!name || name === 'none') return null;
  if (normalCache.has(name)) return normalCache.get(name);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  switch (name) {
    case 'brushed': drawBrushedNormal(ctx, size); break;
    case 'scratched': drawScratchedNormal(ctx, size); break;
    case 'leather': drawLeatherNormal(ctx, size); break;
    default: return null;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  normalCache.set(name, tex);
  return tex;
}

function setPixel(data, x, y, w, r, g, b) {
  const i = (y * w + x) * 4;
  data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
}

// 法线贴图：值 128 = 平面。根据高度差计算 RGB。
function heightToNormalMap(heightFn, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      h[y * size + x] = heightFn(x, y);
    }
  }
  const img = ctx.createImageData(size, size);
  const strength = 2.0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xl = h[y * size + Math.max(0, x - 1)];
      const xr = h[y * size + Math.min(size - 1, x + 1)];
      const yu = h[Math.max(0, y - 1) * size + x];
      const yd = h[Math.min(size - 1, y + 1) * size + x];
      const dx = (xl - xr) * strength;
      const dy = (yu - yd) * strength;
      const i = (y * size + x) * 4;
      img.data[i] = Math.max(0, Math.min(255, (dx * 0.5 + 0.5) * 255));
      img.data[i + 1] = Math.max(0, Math.min(255, (dy * 0.5 + 0.5) * 255));
      img.data[i + 2] = 220;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return ctx;
}

function drawBrushedNormal(ctx, size) {
  // 水平拉丝：沿 X 方向的高频细线
  const out = heightToNormalMap((x, y) => {
    const line = Math.sin(y * 0.9) * 0.5 + Math.sin(y * 2.3 + 1.1) * 0.3;
    const noise = (Math.random() - 0.5) * 0.6;
    const fade = Math.sin((x / size) * Math.PI) * 0.2;
    return line + noise + fade;
  }, size);
  ctx.drawImage(out.canvas, 0, 0);
}

function drawScratchedNormal(ctx, size) {
  const out = heightToNormalMap((x, y) => {
    let v = Math.sin(x * 0.05 + y * 0.02) * 0.15;
    // 随机划痕
    for (let i = 0; i < 6; i++) {
      const sx = (i * 97 + 13) % size;
      const sy = (i * 53 + 41) % size;
      const ang = (i * 0.7) % (Math.PI * 2);
      const len = 80 + (i * 31) % 120;
      const dx = x - sx, dy = y - sy;
      const px = dx * Math.cos(ang) + dy * Math.sin(ang);
      const perp = -dx * Math.sin(ang) + dy * Math.cos(ang);
      if (px > 0 && px < len && Math.abs(perp) < 1.5) {
        v += 0.6 * (1 - Math.abs(perp) / 1.5);
      }
    }
    return v;
  }, size);
  ctx.drawImage(out.canvas, 0, 0);
}

function drawLeatherNormal(ctx, size) {
  const out = heightToNormalMap((x, y) => {
    const cell = 24;
    const cx = (x % cell) / cell - 0.5;
    const cy = (y % cell) / cell - 0.5;
    const d = Math.sqrt(cx * cx + cy * cy);
    let v = Math.cos(d * 6.28) * 0.3 * (1 - d);
    // 细微颗粒
    v += (Math.random() - 0.5) * 0.25;
    return v;
  }, size);
  ctx.drawImage(out.canvas, 0, 0);
}

/**
 * 构建徽章材质
 */
export function buildMaterial(opts) {
  const {
    matcap, normalMap, normalScale,
    metalness, roughness, color, envMap,
    polygonOffset = false
  } = opts;

  const matOpts = {
    color: color ? new THREE.Color(color) : 0xffffff,
    polygonOffset,
    polygonOffsetFactor: polygonOffset ? -1 : 0,
    polygonOffsetUnits: polygonOffset ? -1 : 0
  };

  if (matcap) {
    const m = new THREE.MeshMatcapMaterial({
      ...matOpts,
      matcap
    });
    if (normalMap) {
      m.normalMap = normalMap;
      m.normalScale = new THREE.Vector2(normalScale, normalScale);
    }
    return m;
  }

  const m = new THREE.MeshStandardMaterial({
    ...matOpts,
    metalness: Math.max(0, Math.min(1, metalness)),
    roughness: Math.max(0.02, Math.min(1, roughness)),
    envMap: envMap || null,
    envMapIntensity: 1.0
  });
  if (normalMap) {
    m.normalMap = normalMap;
    m.normalScale = new THREE.Vector2(normalScale, normalScale);
  }
  return m;
}
