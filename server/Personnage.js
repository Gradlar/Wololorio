export default class Personnage {
    constructor(id, name, avatar, posX, posY, size, mana, vie, exp, projectileSpeed, numProjectiles, fireRate, level, startTime) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.mana = mana;
        this.vie = vie;
        this.exp = exp;
        this.level = level;
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.blinkTimer = 0;
        this.isFireRateBonusActive = false;
        this.projectileSpeed = projectileSpeed;
        this.numProjectiles = numProjectiles;
        this.fireRate = fireRate;
        this.expMax = 100;
        this.manaMax = 50;
        this.shieldActive = false;
        this.direction = 0;
        this.explosionRadius = 2;
        this.maxExplosionRadius = 10;
        this.startTime = Date.now();
        this.isDead = false;
        this.maxVie = 100;
    }

    moveOn(x, y) {
        this.posX = x;
        this.posY = y;
    }

    activateShield() {
        if (this.mana >= 20) {
            this.shieldActive = true;
            this.invincible = true;
            return true;
        }
        return false;
    }

    deactivateShield() {
        this.shieldActive = false;
        this.invincible = false;
    }

    updateInvincibility() {
        if (this.invincible) {
            this.invincibilityTimer -= 16;
            this.blinkTimer += 16;

            if (this.blinkTimer >= 500) {
                this.blinkTimer = 0;
            }

            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
            }
        }
    }

    activateInvincibility(duration = 1000) {
        this.invincible = true;
        this.invincibilityTimer = duration;
        this.blinkTimer = 0;
    }

    isBlinking() {
        return this.blinkTimer < 250;
    }

    increaseExp(amount) {
        this.exp += amount;

        const levelUps = Math.floor(this.exp / this.expMax);

        Array.from({ length: levelUps }).forEach(() => {
            this.levelUp();
        });
    }

    levelUp() {
        this.level++;
        this.expMax *= 1.5;
        this.manaMax += 20;
        this.projectileSpeed += 1;
        this.explosionRadius *= 1.5;
        this.maxExplosionRadius *= 1.5;
        this.size *= 1.2;
        this.vie *= 1.2;
        this.maxVie *= 1.2;
    }

    grow(value) {
        this.size += value;
    }

}
