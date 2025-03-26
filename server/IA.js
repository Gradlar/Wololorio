import Personnage from './Personnage.js';

export default class IA extends Personnage {
    constructor(id, name, posX, posY, speed, io, terrain) {
        super(id, name, posX, posY, speed);
        this.io = io;
        this.terrain = terrain;

        this.avatar = 'images/wololo.png';
        this.size = 50;
        this.vie = 100;
        this.exp = 0;
        this.mana = 50;
        this.fireRate = 500;
        this.invincible = false;
        this.isBlinking = false;

        this.directionIndex = 0;
        this.directions = [
            { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }
        ];

        this.start();
    }

    update() {
        const dir = this.directions[this.directionIndex];
        this.move(dir.x, dir.y);

        if (this.posX >= this.terrain.width - this.size) this.directionIndex = 1;
        if (this.posY >= this.terrain.height - this.size) this.directionIndex = 2;
        if (this.posX <= 0) this.directionIndex = 3;
        if (this.posY <= 0) this.directionIndex = 0;

        this.io.emit('updateAI', this.getData());
    }

    getData() {
        return {
            id: this.id,
            avatar: this.avatar,
            name: this.name,
            posX: this.posX,
            posY: this.posY,
            size: this.size,
            vie: this.vie,
            exp: this.exp,
            mana: this.mana,
            fireRate: this.fireRate,
            invincible: this.invincible,
            isBlinking: this.isBlinking,
        };
    }

    start() {
        this.interval = setInterval(() => this.update(), 100);
    }

    stop() {
        clearInterval(this.interval);
    }
}
