import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Ennemi from './Ennemi.js';

describe('Ennemi', () => {

    it('should move towards the player correctly', () => {
        const player = { posX: 100, posY: 100, size: 30 };

        const ennemi = new Ennemi(player);

        const initialDistance = Math.sqrt(
            Math.pow(ennemi.x - player.posX, 2) + Math.pow(ennemi.y - player.posY, 2)
        );

        ennemi.update(player);

        const newDistance = Math.sqrt(
            Math.pow(ennemi.x - player.posX, 2) + Math.pow(ennemi.y - player.posY, 2)
        );

        assert.strictEqual(newDistance < initialDistance, true, 'Ennemi should move closer to player');
    });


    it('should not move if the enemy is too close to the player', () => {
        const player = { posX: 100, posY: 100, size: 30 };

        const ennemi = new Ennemi(player);
        ennemi.x = 100;
        ennemi.y = 100;

        const initialX = ennemi.x;
        const initialY = ennemi.y;

        ennemi.update(player);

        assert.strictEqual(ennemi.x, initialX);
        assert.strictEqual(ennemi.y, initialY);
    });
});
