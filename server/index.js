import process from 'node:process';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import Projectile from "../client/src/Projectile.js";
import ExpBalls from "../client/src/ExpBalls.js";
import AIController from './IA.js';
import Personnage from './Personnage.js';

let players = [];
let projectiles = [];
let expBalls = [];

const httpServer = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(
		`Le server est en cours de fonctionnement\nIl y a actuellement ${players.length} joueurs sur le serveur`
	);
});

let port = process.env.PORT || 8080;

httpServer.listen(port, '192.168.1.22', () => {
	console.log(`Server running at http://192.168.1.22:${port}/`);
});

const io = new IOServer(httpServer, { cors: true });

/*let bots = [];

function createBot(id) {
	return {
		id,
		name: `Bot_${id}`,
		posX: Math.random() * 1000,
		posY: Math.random() * 1000,
		size: 50,
		avatar: 'images/wololo.png',
		vie: 100
	};
}

for (let i = 0; i < 5; i++) {
	bots.push(createBot(i));
}*/

io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`);

	//socket.emit('initBots', bots);

	/*setInterval(() => {
		bots.forEach(bot => {
			bot.posX += Math.random() * 10 - 5;
			bot.posY += Math.random() * 10 - 5;
		});

		io.emit('updateBots', bots);
	}, 1000);*/

	socket.on('newPlayer', (data) => {
		const newPlayer = new Personnage(
			socket.id,
			data.name,
			data.avatar,
			data.posX,
			data.posY,
			50,
			50,
			100,
			0,
			10,
			4,
			2000,
			1
		);
		players.push(newPlayer);

		io.emit('updatePlayers', players);
	});

	socket.on('disconnect', () => {
		console.log(`Player disconnected: ${socket.id}`);
		players = players.filter(player => player.id !== socket.id);

		io.emit('updatePlayers', players);
	});

	socket.on('playerMovement', (data) => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			player.posX = data.posX;
			player.posY = data.posY;
			io.emit('updatePlayers', players);
		}
	});

	socket.on('playerShoot', (data) => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			const explosionRadius = data.explosionRadius;
			const maxExplosionRadius = data.maxExplosionRadius;
			const projectileSpeed = data.projectileSpeed;

			const projectile = new Projectile(
				player.posX,
				player.posY,
				data.direction,
				projectileSpeed,
				String(player.name),
				explosionRadius,
				maxExplosionRadius
			);

			projectiles.push(projectile);

			io.emit('newProjectile', {
				x: projectile.x,
				y: projectile.y,
				direction: projectile.direction,
				speed: projectile.speed,
				playerName: String(player.name),
				explosionRadius: explosionRadius,
				maxExplosionRadius : maxExplosionRadius,
			});

			player.avatar = 'images/tire.png';
			io.emit('updatePlayers', players);

			setTimeout(() => {
				player.avatar = 'images/wololo.png';
				io.emit('updatePlayers', players);
			}, 200);
		}
	});


	socket.on('playerHit', (data) => {
		const player = players.find(p => p.id === data.playerId);

		if (player) {
			player.vie -= data.damage;

			if (player.vie <= 0) {
				console.log(`${player.name} est mort`);
				io.emit('playerDead', { id: player.id });
				players = players.filter(p => p.id !== player.id);
			}

			io.emit('updatePlayerHealth', {
				playerId: player.id,
				vie: player.vie
			});
		}
	});

	socket.on('activateInvincibility', (duration) => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			player.invincible = true;
			setTimeout(() => {
				player.invincible = false;
			}, duration);
		}
	});

	socket.on('shieldStatus', (data) => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			player.shieldActive = data.active;
			io.emit('updateShield', { playerId: player.id, shieldActive: player.shieldActive });
		}
	});

	socket.on('updateDirection', (data) => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			player.mosueX = data.mouseX;
			player.direction = data.direction;
			io.emit('updateDirection', { playerId: player.id, mouseX: player.mouseX, direction: player.direction });
		}
	})

	socket.emit('initExpBalls', expBalls);

	socket.on('playerDead', (data) => {
		const deadPlayer = players.find(p => p.id === data.id);
		if (deadPlayer) {
			players = players.filter(p => p.id !== data.id);

			expBalls.push(new ExpBalls(deadPlayer.x, deadPlayer.y, deadPlayer.exp));

			io.emit('newExpBall', {
				x: deadPlayer.posX,
				y: deadPlayer.posY,
				value: deadPlayer.exp});
		}
	});

	socket.on('updatePlayerProjectile', (stats) => {
		const player = players.find(p => p.id === stats.id);
		if (player) {
			player.explosionRadius = stats.explosionRadius
			player.projectileSpeed = stats.projectileSpeed;
			player.size = stats.size;
			io.emit('updateProjectile', { playerId: player.id, explosionRadius: player.explosionRadius, projectileSpeed: player.projectileSpeed, size: player.size});
		}
	});

	socket.on('updatePlayerExp', data => {
		const player = players.find(p => p.id === socket.id);
		if (player) {
			player.increaseExp(data);
			io.emit('updateExp', player);
			console.log(player);
		}
	});
});

