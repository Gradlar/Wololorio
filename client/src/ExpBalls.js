export default class ExpBalls {
    constructor(x, y, expValue) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.expValue = expValue;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

    collect(player) {
        const dx = player.posX - this.x;
        const dy = player.posY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size / 2 + this.size) {
            if (this.expValue === 0) {
                player.increaseExp(100);
                console.log("100");
                return 100;
            } else {
                player.increaseExp(this.expValue);
                console.log(this.expValue);
                return this.expValue;
            }
        }
        return -1;
    }
}
