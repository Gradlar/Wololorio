import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ExpBalls from './ExpBalls.js';

describe('ExpBalls', () => {
    it('should create an experience ball with the correct properties', () => {
        const expBall = new ExpBalls(50, 100, 10);

        assert.strictEqual(expBall.x, 50);
        assert.strictEqual(expBall.y, 100);
        assert.strictEqual(expBall.size, 2);
        assert.strictEqual(expBall.expValue, 10);
    });

    it('should return the correct experience when collected by a player', () => {
        const expBall = new ExpBalls(50, 100, 10);
        const player = { posX: 50, posY: 100, size: 20, exp: 5 };

        const expGained = expBall.collect(player);
        assert.strictEqual(expGained, 10);
    });

    it('should return 100 experience when collected by a player with zero exp', () => {
        const expBall = new ExpBalls(50, 100, 10);
        const player = { posX: 50, posY: 100, size: 20, exp: 0 };

        const expGained = expBall.collect(player);
        assert.strictEqual(expGained, 100);
    });

    it('should return -1 when not collected by a player', () => {
        const expBall = new ExpBalls(50, 100, 10);
        const player = { posX: 200, posY: 200, size: 20, exp: 5 };

        const expGained = expBall.collect(player);
        assert.strictEqual(expGained, -1);
    });
});
