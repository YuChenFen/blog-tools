// 形状预设与图案解析：将 SVG 路径 / PNG 轮廓 / 内置预设转换为 THREE.Shape 数组
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/**
 * 生成内置预设形状（以 THREE.Shape 形式，单位化到 [-1,1] 区间）
 */
export function createPresetShape(type) {
  const shape = new THREE.Shape();
  switch (type) {
    case 'circle': {
      // 用显式点循环构建圆形路径（64 段），确保完全闭合
      // 起点在底部 (-π/2)，使接缝不显眼
      const seg = 64;
      const startA = -Math.PI / 2;
      const endA = startA + Math.PI * 2;
      for (let i = 0; i <= seg; i++) {
        const a = startA + (i / seg) * (endA - startA);
        const x = Math.cos(a);
        const y = Math.sin(a);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      break;
    }
    case 'hexagon': {
      polygonPath(shape, 6, 1, -Math.PI / 2);
      break;
    }
    case 'pentagon': {
      polygonPath(shape, 5, 1, -Math.PI / 2);
      break;
    }
    case 'square': {
      const s = 0.92;
      shape.moveTo(-s, -s);
      shape.lineTo(s, -s);
      shape.lineTo(s, s);
      shape.lineTo(-s, s);
      shape.lineTo(-s, -s);
      shape.closePath();
      break;
    }
    case 'shield': {
      const w = 0.82, h = 1.05, bottom = -0.95;
      shape.moveTo(-w, h * 0.62);
      shape.lineTo(w, h * 0.62);
      shape.lineTo(w, -h * 0.05);
      shape.quadraticCurveTo(w, bottom, 0, bottom);
      shape.quadraticCurveTo(-w, bottom, -w, -h * 0.05);
      shape.lineTo(-w, h * 0.62);
      shape.closePath();
      break;
    }
    default: {
      // 默认圆形也使用显式点循环
      const seg = 64;
      const startA = -Math.PI / 2;
      for (let i = 0; i <= seg; i++) {
        const a = startA + (i / seg) * Math.PI * 2;
        const x = Math.cos(a), y = Math.sin(a);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
    }
  }
  return [shape];
}

function polygonPath(shape, sides, radius, startAngle) {
  for (let i = 0; i <= sides; i++) {
    const a = startAngle + (i / sides) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
}

/**
 * 解析 SVG 文本，返回归一化后的 Shape 数组（保留多路径与填充规则）
 */
export function shapesFromSVG(svgText) {
  // 预处理：将 fill/stroke 的 url(#id) 引用替换为回退纯色，
  // 避免 SVGLoader 报 "url access in attributes is not implemented" 警告
  const cleaned = svgText
    .replace(/(fill|stroke)\s*=\s*"url\([^"]*\)"/gi, '$1="#000000"')
    .replace(/(fill|stroke)\s*:\s*url\([^)]*\)/gi, '$1:#000000');

  const loader = new SVGLoader();
  const data = loader.parse(cleaned);
  const shapes = [];
  for (const path of data.paths) {
    const pathShapes = SVGLoader.createShapes(path);
    for (const s of pathShapes) shapes.push(s);
  }
  if (shapes.length === 0) return null;
  return normalizeShapes(shapes);
}

/**
 * 从 PNG 图片提取不透明区域的外轮廓，生成 Shape。
 * 使用边缘追踪得到一条主轮廓；适合徽章类图形。
 */
export function shapesFromPNG(pngImage) {
  return new Promise((resolve, reject) => {
    const img = pngImage;
    const maxDim = 256;
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, w, h);
    } catch (e) {
      reject(new Error('无法读取图片像素数据'));
      return;
    }
    const alpha = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      alpha[i] = imageData.data[i * 4 + 3];
    }
    const threshold = 128;
    const shape = traceContour(alpha, w, h, threshold);
    if (!shape) {
      reject(new Error('未检测到有效轮廓'));
      return;
    }
    resolve(normalizeShapes([shape]));
  });
}

/**
 * 简化的外轮廓追踪：从图像左上找到第一个不透明像素，
 * 沿顺时针方向追踪边界，生成 THREE.Shape。
 */
function traceContour(alpha, w, h, threshold) {
  const isOpaque = (x, y) =>
    x >= 0 && y >= 0 && x < w && y < h && alpha[y * w + x] >= threshold;

  // 找到第一个不透明像素
  let startX = -1, startY = -1;
  outer: for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isOpaque(x, y)) { startX = x; startY = y; break outer; }
    }
  }
  if (startX < 0) return null;

  // Moore 邻域追踪
  const dirs = [
    [1, 0], [1, 1], [0, 1], [-1, 1],
    [-1, 0], [-1, -1], [0, -1], [1, -1]
  ];
  const points = [];
  let cx = startX, cy = startY;
  let backDir = 6; // 从左方向来
  let safety = w * h * 4;
  let firstP = null;

  do {
    const px = cx + 0.5, py = cy + 0.5;
    points.push([px, py]);
    if (!firstP) firstP = [px, py];

    let found = false;
    for (let i = 0; i < 8; i++) {
      const d = (backDir + 1 + i) % 8;
      const nx = cx + dirs[d][0];
      const ny = cy + dirs[d][1];
      if (isOpaque(nx, ny)) {
        cx = nx; cy = ny;
        backDir = (d + 4) % 8;
        found = true;
        break;
      }
    }
    if (!found) break;
    safety--;
    if (safety <= 0) break;
    // 回到起点附近且已采集足够点则结束
    if (points.length > 2 && Math.abs(cx - startX) <= 0 && Math.abs(cy - startY) <= 0) break;
  } while (true);

  if (points.length < 3) return null;

  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.lineTo(points[0][0], points[0][1]);
  return shape;
}

/**
 * 将一组 Shape 归一化：居中并缩放到半径 ~1 的范围
 */
function normalizeShapes(shapes) {
  const box = new THREE.Box2();
  const tmp = new THREE.Vector2();
  for (const s of shapes) {
    for (const p of s.getPoints(64)) {
      box.expandByPoint(tmp.copy(p));
    }
  }
  if (box.isEmpty()) return shapes;
  const center = new THREE.Vector2();
  box.getCenter(center);
  const size = new THREE.Vector2();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y) || 1;
  const scale = 2 / maxDim;
  const out = [];
  for (const s of shapes) {
    const ns = new THREE.Shape();
    const pts = s.getPoints(128);
    if (pts.length === 0) continue;
    ns.moveTo((pts[0].x - center.x) * scale, (pts[0].y - center.y) * scale);
    for (let i = 1; i < pts.length; i++) {
      ns.lineTo((pts[i].x - center.x) * scale, (pts[i].y - center.y) * scale);
    }
    // 确保路径闭合
    ns.closePath();
    for (const hole of s.holes) {
      const hpts = hole.getPoints(128);
      if (hpts.length === 0) continue;
      const nh = new THREE.Path();
      nh.moveTo((hpts[0].x - center.x) * scale, (hpts[0].y - center.y) * scale);
      for (let i = 1; i < hpts.length; i++) {
        nh.lineTo((hpts[i].x - center.x) * scale, (hpts[i].y - center.y) * scale);
      }
      nh.closePath();
      ns.holes.push(nh);
    }
    out.push(ns);
  }
  return out;
}
