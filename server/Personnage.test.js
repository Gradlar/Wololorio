import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Personnage from './Personnage.js';

describe('Personnage', () => {
    it('should create a player with the correct properties', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        assert.strictEqual(player.name, 'JohnDoe');
        assert.strictEqual(player.avatar, 'images/wololo.png');
        assert.strictEqual(player.posX, 10);
        assert.strictEqual(player.posY, 20);
        assert.strictEqual(player.size, 30);
        assert.strictEqual(player.mana, 50);
        assert.strictEqual(player.vie, 100);
    });

    it('should move the player correctly using moveOn()', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        player.moveOn(50, 100);

        assert.strictEqual(player.posX, 50);
        assert.strictEqual(player.posY, 100);
    });

    it('should grow the player correctly using grow()', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        player.grow(10);

        assert.strictEqual(player.size, 40);
    });

    it('should activate invincibility correctly using activateInvincibility()', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        player.activateInvincibility(1000);

        assert.strictEqual(player.invincible, true);
        assert.strictEqual(player.invincibilityTimer, 1000);
        assert.strictEqual(player.blinkTimer, 0);
    });

    it('should update invincibility timer correctly', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        player.activateInvincibility(1000);
        player.updateInvincibility();

        assert.strictEqual(player.invincibilityTimer, Math.max(1000 - 16, 0));
    });

    it('should deactivate invincibility when the timer expires', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);

        player.activateInvincibility(32);
        player.updateInvincibility();
        player.updateInvincibility();

        assert.strictEqual(player.invincible, false);
        assert.strictEqual(player.invincibilityTimer, 0);
    });

    it('should blink when invincible', () => {
        const player = new Personnage(1,'JohnDoe', 'images/wololo.png', 10, 20, 30, 50, 100);
        player.activateInvincibility(1000);
        assert.strictEqual(player.isBlinking(), true);

        for (let i = 0; i < 16; i++) {
            player.updateInvincibility();
        }

        assert.strictEqual(player.isBlinking(), false);
    });
});
