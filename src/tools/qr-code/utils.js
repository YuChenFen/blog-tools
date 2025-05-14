// 绘制颜色
export function drawColor(type, color, canvas) {
    const ctx = canvas.getContext('2d');
    if (type === 'solid') {
        ctx.fillStyle = color.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (type === 'linear-gradient') {
        const centerW = canvas.width / 2;
        const centerH = canvas.height / 2;
        const angle = Number(color.angle) + 90;
        const startx = centerW + centerW * Math.cos(angle * Math.PI / 180);
        const starty = centerH + centerH * Math.sin(angle * Math.PI / 180);
        const endx = centerW - centerW * Math.cos(angle * Math.PI / 180);
        const endy = centerH - centerH * Math.sin(angle * Math.PI / 180);
        const gradient = ctx.createLinearGradient(startx, starty, endx, endy)
        for (let i = 0; i < color.stops.length; i++) {
            let alpha = Math.round(Number(color.stops[i].opacity) * 255 / 100).toString(16).padStart(2, '0');
            gradient.addColorStop(color.stops[i].position / 100, color.stops[i].color + alpha)
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (type === 'radial-gradient') {
        const centerW = canvas.width / 2;
        const centerH = canvas.height / 2;
        const gradient = ctx.createRadialGradient(centerW, centerH, 0, centerW, centerH, centerW);
        for (let i = 0; i < color.stops.length; i++) {
            gradient.addColorStop(color.stops[i].position / 100, color.stops[i].color)
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}