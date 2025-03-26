export default class Ennemi {
    constructor(player) {
        const spawnDistance = 300 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;

        this.x = player.posX + Math.cos(angle) * spawnDistance;
        this.y = player.posY + Math.sin(angle) * spawnDistance;
        this.size = 20;
        this.speed = 1;

        this.hitboxSize = this.size * 0.8;
        this.updateHitbox();
    }

    update(player) {
        const dx = player.posX - this.x;
        const dy = player.posY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        this.updateHitbox();
    }

    updateHitbox() {
        this.hitboxX = this.x - this.hitboxSize / 2;
        this.hitboxY = this.y - this.hitboxSize / 2;
    }

    checkCollision(projectile) {
        const dx = projectile.x - this.x;
        const dy = projectile.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.hitboxSize / 2 + 3;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}
