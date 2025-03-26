export default class Terrain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.gridSize = 50;
        this.messages = [];
        this.generateObstacles();
    }

    drawGrid(grassImage,rockImage) {
        const { ctx, canvas, gridSize } = this;
        for (let x = 0; x < canvas.width; x += grassImage.width) {
            for (let y = 0; y < canvas.height; y += grassImage.height) {
                ctx.drawImage(grassImage, 0, 0, canvas.width, canvas.height);
            }
        }

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        this.ctx.strokeStyle = "#333333";
        this.ctx.lineWidth = 2;
        this.obstacles.forEach(({ x, y }) => {
            const rockSize = gridSize * 1.5;
            ctx.drawImage(rockImage, x + (gridSize - rockSize) / 2, y + (gridSize - rockSize) / 2, rockSize, rockSize);
        });
    }

    generateObstacles() {
        const cols = Math.floor(this.canvas.width / this.gridSize);
        const rows = Math.floor(this.canvas.height / this.gridSize);

        this.obstacles = [
            { x: 2 * this.gridSize, y: 3 * this.gridSize, size: 50 },
            { x: 5 * this.gridSize, y: 7 * this.gridSize, size: 50 },
            { x: 8 * this.gridSize, y: 2 * this.gridSize, size: 50 },
            { x: 10 * this.gridSize, y: 6 * this.gridSize, size: 50 },
            { x: 12 * this.gridSize, y: 9 * this.gridSize, size: 50 },
            { x: 15 * this.gridSize, y: 4 * this.gridSize, size: 50 },
            { x: 18 * this.gridSize, y: 8 * this.gridSize, size: 50 },
            { x: 20 * this.gridSize, y: 10 * this.gridSize, size: 50 },
            { x: 22 * this.gridSize, y: 12 * this.gridSize, size: 50 },
            { x: 25 * this.gridSize, y: 5 * this.gridSize, size: 50 }
        ];
    }

    drawManaBar(ctx, player) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 20;

        ctx.fillStyle = "#000000";
        ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

        ctx.fillStyle = "#4444FF";
        ctx.fillRect(x, y, (player.mana / player.manaMax) * barWidth, barHeight);

        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    drawExpBar(ctx, player) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 50;

        ctx.fillStyle = "#000000";
        ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

        ctx.fillStyle = "#f1dd05";
        const expBarWidth = (player.exp / player.expMax) * barWidth;
        ctx.fillRect(x, y, expBarWidth, barHeight);

        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    drawHealthBar(ctx, player) {
        const barWidth = 20;
        const barHeight = 2;
        const x = player.posX - 10;
        const y = player.posY + player.size / 2-13;

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = "#00ff16";
        ctx.fillRect(x, y, (player.vie / player.maxVie) * barWidth, barHeight);

        ctx.fillStyle = "#000000";
        ctx.font = "2px Arial";
        ctx.fillText(player.vie, x + barWidth / 2 - ctx.measureText(player.vie).width / 2+1.5, y+1.7);    }

    showMessage(playerId, message) {
        this.messages.push({ playerId, message, time: Date.now() });
    }

    drawMessages(ctx, player) {
        const currentTime = Date.now();

        this.messages.forEach((msg, index) => {
            if (currentTime - msg.time > 3000) {
                this.messages.splice(index, 1);
            } else {
                const bubbleHeight = 15;

                ctx.fillStyle = "black";
                ctx.font = "4px 'VT323'";
                ctx.textAlign = "center";
                ctx.fillText(msg.message, player.posX, player.posY + 5 - player.size / 2 - 10 + bubbleHeight / 2);
            }
        });
    }

    drawUI(ctx, player) {
        ctx.fillStyle = "#000000";
        ctx.font = "16px VT323";
        ctx.textAlign = "left";
        ctx.fillText(`Level: ${player.level}`, 10, 90);
    }

}
