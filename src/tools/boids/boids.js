class Boid {
    constructor(canvas) {
        // 画布
        this.canvas = canvas;

        // 初始化位置在画布随机位置
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };

        // 初始化速度（随机方向和大小）
        this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };

        // 初始化加速度
        this.acceleration = {
            x: 0,
            y: 0
        };

        // 个体的大小
        this.size = 5;

        // 最大速度限制（防止速度过快）
        this.maxSpeed = 4;

        // 最大转向力限制
        this.maxForce = 0.2;

        // 视觉范围（决定能感知多远的邻居）
        this.perceptionRadius = 100;
    }

    // 更新Boid位置
    update() {
        // 更新速度
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // 限制最大速度
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }

        // 更新位置
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // 重置加速度
        this.acceleration = { x: 0, y: 0 };

        // 边界检查，如果超出画布则从另一边出现
        if (this.position.x < 0) this.position.x = this.canvas.width;
        if (this.position.y < 0) this.position.y = this.canvas.height;
        if (this.position.x > this.canvas.width) this.position.x = 0;
        if (this.position.y > this.canvas.height) this.position.y = 0;
    }

    // 绘制Boid
    draw() {
        const ctx = this.canvas.getContext('2d');

        // 保存当前画布状态
        ctx.save();

        // 移动到Boid位置
        ctx.translate(this.position.x, this.position.y);

        // 计算旋转角度（根据速度方向）
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.rotate(angle);

        // 绘制三角形代表Boid
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0);
        ctx.lineTo(-this.size, -this.size);
        ctx.lineTo(-this.size / 2, 0);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();

        // 填充颜色
        ctx.fillStyle = 'rgba(50, 150, 255, 0.8)';
        ctx.fill();

        // 恢复画布状态
        ctx.restore();
    }

    // 应用力（根据牛顿第二定律 F=ma，假设质量m=1）
    applyForce(force) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    // 分离规则：避免与邻居太近
    separation(boids) {
        const steering = { x: 0, y: 0 };
        let total = 0;

        for (const other of boids) {
            // 计算与邻居的距离
            const distance = Math.sqrt(
                Math.pow(this.position.x - other.position.x, 2) +
                Math.pow(this.position.y - other.position.y, 2)
            );

            // 如果在感知范围内且不是自己
            if (distance > 0 && distance < this.perceptionRadius) {
                // 计算远离邻居的向量
                const diff = {
                    x: this.position.x - other.position.x,
                    y: this.position.y - other.position.y
                };

                // 距离越近，排斥力越大（与距离成反比）
                const normalizeFactor = 1 / distance;
                steering.x += diff.x * normalizeFactor;
                steering.y += diff.y * normalizeFactor;
                total++;
            }
        }

        if (total > 0) {
            // 计算平均值
            steering.x /= total;
            steering.y /= total;

            // 将向量转为单位向量
            const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
            if (magnitude > 0) {
                steering.x = (steering.x / magnitude) * this.maxSpeed;
                steering.y = (steering.y / magnitude) * this.maxSpeed;

                // 计算转向力（期望速度减去当前速度）
                steering.x -= this.velocity.x;
                steering.y -= this.velocity.y;

                // 限制转向力大小
                const steeringMagnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                if (steeringMagnitude > this.maxForce) {
                    steering.x = (steering.x / steeringMagnitude) * this.maxForce;
                    steering.y = (steering.y / steeringMagnitude) * this.maxForce;
                }
            }
        }

        return steering;
    }

    // 对齐规则：与邻居的平均方向保持一致
    alignment(boids) {
        const steering = { x: 0, y: 0 };
        let total = 0;

        for (const other of boids) {
            const distance = Math.sqrt(
                Math.pow(this.position.x - other.position.x, 2) +
                Math.pow(this.position.y - other.position.y, 2)
            );

            if (distance > 0 && distance < this.perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }

        if (total > 0) {
            // 计算平均速度
            steering.x /= total;
            steering.y /= total;

            // 转为单位向量并乘以最大速度
            const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
            if (magnitude > 0) {
                steering.x = (steering.x / magnitude) * this.maxSpeed;
                steering.y = (steering.y / magnitude) * this.maxSpeed;

                // 计算转向力
                steering.x -= this.velocity.x;
                steering.y -= this.velocity.y;

                // 限制转向力大小
                const steeringMagnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                if (steeringMagnitude > this.maxForce) {
                    steering.x = (steering.x / steeringMagnitude) * this.maxForce;
                    steering.y = (steering.y / steeringMagnitude) * this.maxForce;
                }
            }
        }

        return steering;
    }

    // 聚集规则：向邻居的平均位置移动
    cohesion(boids) {
        const steering = { x: 0, y: 0 };
        let total = 0;

        for (const other of boids) {
            const distance = Math.sqrt(
                Math.pow(this.position.x - other.position.x, 2) +
                Math.pow(this.position.y - other.position.y, 2)
            );

            if (distance > 0 && distance < this.perceptionRadius) {
                steering.x += other.position.x;
                steering.y += other.position.y;
                total++;
            }
        }

        if (total > 0) {
            // 计算平均位置
            steering.x /= total;
            steering.y /= total;

            // 计算朝向平均位置的向量
            steering.x -= this.position.x;
            steering.y -= this.position.y;

            // 转为单位向量并乘以最大速度
            const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
            if (magnitude > 0) {
                steering.x = (steering.x / magnitude) * this.maxSpeed;
                steering.y = (steering.y / magnitude) * this.maxSpeed;

                // 计算转向力
                steering.x -= this.velocity.x;
                steering.y -= this.velocity.y;

                // 限制转向力大小
                const steeringMagnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                if (steeringMagnitude > this.maxForce) {
                    steering.x = (steering.x / steeringMagnitude) * this.maxForce;
                    steering.y = (steering.y / steeringMagnitude) * this.maxForce;
                }
            }
        }

        return steering;
    }

    // 综合应用所有规则
    flock(boids, options) {
        // 计算三种规则的力
        const separationForce = this.separation(boids);
        const alignmentForce = this.alignment(boids);
        const cohesionForce = this.cohesion(boids);

        // 可以调整这些权重来改变行为
        separationForce.x *= options.separationWeight;
        separationForce.y *= options.separationWeight;
        alignmentForce.x *= options.alignmentWeight;
        alignmentForce.y *= options.alignmentWeight;
        cohesionForce.x *= options.cohesionWeight;
        cohesionForce.y *= options.cohesionWeight;

        // 应用这些力
        this.applyForce(separationForce);
        this.applyForce(alignmentForce);
        this.applyForce(cohesionForce);
    }
}
export default Boid;
