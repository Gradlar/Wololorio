export default class Projectile {
    constructor(x, y, direction, speed, size, playerName, explosionRadius, maxExplosionRadius) {
        this.direction = direction;
        this.speed = speed;
        this.size = size || 5;
        this.playerName = playerName;

        this.x = x + 1;
        this.y = y + 1;

        this.exploding = false;
        this.explosionRadius = explosionRadius;
        this.maxExplosionRadius = maxExplosionRadius;
        this.alpha = 1;
        this.explosionSpeed = 2;
    }

    update() {
        if (this.exploding) {
            this.explosionRadius += this.explosionSpeed;
            this.alpha -= 0.05;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.explosionRadius = this.maxExplosionRadius;
            }
        } else {
            this.x += Math.cos(this.direction) * this.speed;
            this.y += Math.sin(this.direction) * this.speed;
        }
    }

    explode() {
        this.exploding = true;
    }

    draw(ctx) {
        if (!isFinite(this.x) || !isFinite(this.y)) {
            return;
        }

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 10);
        gradient.addColorStop(0, 'cyan');
        gradient.addColorStop(0.5, 'white');
        gradient.addColorStop(1, 'blue');

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        let angle = this.direction;
        let length = 5;

        for (let i = 0; i < 4; i++) {
            angle += Math.random() * 0.5 - 0.25;
            length += Math.random() * 3 - 1.5;
            let x2 = this.x + Math.cos(angle) * length;
            let y2 = this.y + Math.sin(angle) * length;
            ctx.lineTo(x2, y2);
        }

        if (this.exploding) {
            this.drawExplosion(ctx);
            return;
        }

        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    drawExplosion(ctx) {
        if (this.explosionRadius >= this.maxExplosionRadius) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.restore();

        this.explosionRadius += 5;
        this.alpha -= 0.1;

        if (this.alpha <= 0) {
            this.explosionRadius = this.maxExplosionRadius;
        }
    }
}
