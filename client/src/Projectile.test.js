import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Projectile from './Projectile.js'; // Assuming your file is named 'Projectile.js'

describe('Projectile', () => {
    it('should create a projectile with the correct properties', () => {
        const projectile = new Projectile(100, 100, Math.PI / 4, 5, 10, 'player1', 0, 50);

        assert.strictEqual(typeof projectile.x, 'number');
        assert.strictEqual(typeof projectile.y, 'number');
        assert.strictEqual(projectile.size, 10);
        assert.strictEqual(projectile.playerName, 'player1');
        assert.strictEqual(projectile.explosionRadius, 0);
        assert.strictEqual(projectile.maxExplosionRadius, 50);
        assert.strictEqual(projectile.alpha, 1);
        assert.strictEqual(projectile.exploding, false);
    });

    it('should update the position of the projectile correctly', () => {
        const projectile = new Projectile(100, 100, Math.PI / 4, 5, 10, 'player1', 0, 50);

        const initialX = projectile.x;
        const initialY = projectile.y;

        projectile.update();

        const newX = projectile.x;
        const newY = projectile.y;

        assert.strictEqual(newX !== initialX, true, 'Projectile should move horizontally');
        assert.strictEqual(newY !== initialY, true, 'Projectile should move vertically');
    });

    it('should update explosion radius and alpha when exploding', () => {
        const projectile = new Projectile(100, 100, Math.PI / 4, 5, 10, 'player1', 0, 50);

        projectile.explode();

        const initialExplosionRadius = projectile.explosionRadius;
        const initialAlpha = projectile.alpha;

        projectile.update();

        assert.strictEqual(projectile.explosionRadius > initialExplosionRadius, true, 'Explosion radius should increase');
        assert.strictEqual(projectile.alpha < initialAlpha, true, 'Alpha should decrease during explosion');
    });

    it('should correctly create the explosion visual', () => {
        const projectile = new Projectile(100, 100, Math.PI / 4, 5, 10, 'player1', 0, 50);

        projectile.explode();

        const ctx = {
            beginPath: () => {},
            arc: () => {},
            fillStyle: '',
            fill: () => {},
            strokeStyle: '',
            lineWidth: 0,
            stroke: () => {},
            closePath: () => {},
            save: () => {},
            restore: () => {},
            globalAlpha: 1,
        };

        projectile.drawExplosion(ctx);

        assert.strictEqual(projectile.explosionRadius > 0, true, 'Explosion radius should be greater than 0 when drawing the explosion');
    });
});
