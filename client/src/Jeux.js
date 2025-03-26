import { io } from 'socket.io-client';
import Terrain from "./Terrain.js";
import Projectile from "./Projectile.js";
import ExpBalls from "./ExpBalls.js";
import Menu from "./Menu.js";
import Personnage from "../../server/Personnage.js";

export default function jeux(userName) {
    const socket = io('http://192.168.1.22:8080');
    const player = new Personnage(socket.id, userName, 'images/wololo.png', Math.floor(Math.random() * (1000 - 10 + 1)) + 10, Math.floor(Math.random() * (1000 - 10 + 1)) + 10, 20, 50, 100, 0, 10, 4, 2000, 1, socket);
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const zoomLevel = 5;

    let mouseX = player.posX;
    let mouseY = player.posY;

    const avatarImg = new Image();
    avatarImg.src = player.avatar;

    const terrain = new Terrain(canvas);
    let projectiles = [];
    let players = [];
    let expBalls = [];

    let targetPosX = player.posX;
    let targetPosY = player.posY;

    let manaRestorationInterval = null;

    const keysPressed = {};

    let isShooting = false;
    let movementSpeed = 2;

    let deathMenuVisible = false;

    let shieldHeld = false;
    let shieldInterval;

    const menu = new Menu(player, canvas, socket);
    /*
        let bots = [];

        socket.on('initBots', (botsData) => {
            bots = botsData.map(bot => ({
                ...bot,
                avatarImg: new Image(),
            }));
            bots.forEach(bot => bot.avatarImg.src = bot.avatar);
        });

        socket.on('updateBots', (botsData) => {
            bots = botsData;
        });

        function drawBots() {


            bots.forEach(bot => {
                if (bot.avatarImg.complete) {
                    ctx.drawImage(bot.avatarImg, bot.posX, bot.posY, bot.size, bot.size);
                }
                ctx.fillStyle = "black";
                ctx.font = "10px Arial";
                ctx.fillText(bot.name, bot.posX, bot.posY - 10);
            });
        }
    */
    socket.on('updatePlayers', (playersData) => {
        players = playersData.filter((data) => data.id !== player.id);
        players.forEach(p => {
            if (!p.avatarImg) {
                p.avatarImg = new Image();
                p.avatarImg.src = p.avatar;
            }
        });
    });

    socket.on('playerDead', (data) => {
        const deadPlayer = players.find(p => p.id === data.id);
        if (deadPlayer) {
            players = players.filter(p => p.id === data.id);

            expBalls.push(new ExpBalls(deadPlayer.posX, deadPlayer.posY, deadPlayer.exp));


            if (String(player.name) === String(deadPlayer.name)) {
                player.isDead = true;
                deathMenuVisible = true;
                menu.showDeathMenu();
            }
        }
    });

    socket.on('newExpBall', (data) => {
        expBalls.push(new ExpBalls(data.x, data.y, data.value));
    });

    socket.on('initExpBalls', (existingExpBalls) => {
        existingExpBalls.forEach((expBall) => {
            expBalls.push(new ExpBalls(expBall.x, expBall.y, expBall.value));
        });
    });


    socket.on('newProjectile', (projectileData) => {
        const projectile = new Projectile(
            projectileData.x,
            projectileData.y,
            projectileData.direction,
            projectileData.speed,
            10,
            projectileData.playerName,
            projectileData.explosionRadius,
            projectileData.maxExplosionRadius
        );
        projectiles.push(projectile);
    });

    socket.emit('newPlayer', {avatar: player.avatar, name: player.name, posX: player.posX, posY: player.posY});

    socket.on('playerHit', (damage) => {
        if (!player.invincible) {
            player.vie -= damage;

            if (player.vie <= 0) {
                socket.emit('playerDead', { id: player.id });
            } else {
                player.activateInvincibility(1000);
            }
        }
    });

    const grassImage = new Image();
    grassImage.src = 'images/herbe.png';

    let isGrassImageLoaded = false;
    let isAvatarImageLoaded = false;
    let isRockImageLoaded = false;

    grassImage.onload = () => {
        isGrassImageLoaded = true;
    };

    const rockImage = new Image();
    rockImage.src = 'images/rock.png';


    rockImage.onload = () => {
        isRockImageLoaded = true;
    };

    avatarImg.onload = () =>{
        isAvatarImageLoaded = true;
    };
    /* addPlayer(player){
     players.push(player);
 }*/

    function checkImagesLoaded() {
        if (isGrassImageLoaded && isRockImageLoaded && isAvatarImageLoaded) {
            draw();
        } else {
            console.log("Images chargement...");
            requestAnimationFrame(checkImagesLoaded);
        }
    }

    checkImagesLoaded();

    function draw() {
        console.log("Lancement du jeu...");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleManaRestoration();

        player.posX += (targetPosX - player.posX) * 0.1;
        player.posY += (targetPosY - player.posY) * 0.1;

        checkPlayerCollisions();
        checkObstacleCollisions();

        player.posX = Math.max(player.size / 2, Math.min(player.posX, canvas.width - player.size / 2));
        player.posY = Math.max(player.size / 2, Math.min(player.posY, canvas.height - player.size / 2));

        updatePlayerMovement();

        socket.emit('playerMovement', {posX: player.posX, posY: player.posY});

        ctx.save();

        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(
            canvas.width / (2 * zoomLevel) - player.posX,
            canvas.height / (2 * zoomLevel) - player.posY
        );

        terrain.drawGrid(grassImage, rockImage);

        //drawBots();
        updateProjectiles(player);

        terrain.drawMessages(ctx, player);
        players.forEach((otherPlayer) => {
            const avatarImg = player.isShooting ? shootingAvatarImg : otherPlayer.avatarImg;
            const realSize = otherPlayer.size;
            const reducedSize = realSize * 0.2;

            const normalizedMouseX = mouseX / zoomLevel;
            const normalizedPlayerPosX = otherPlayer.posX / zoomLevel;

            const flipHorizontal = normalizedMouseX < normalizedPlayerPosX;

            expBalls.forEach((expBall, index) => {
                expBall.draw(ctx);

                const gainExp = expBall.collect(player);
                if (gainExp >= 0 && player.id !== otherPlayer.id) {
                    expBalls.splice(index, 1);
                    socket.emit('updatePlayerProjectile', {
                        explosionRadius: otherPlayer.explosionRadius,
                        projectileSpeed: otherPlayer.projectileSpeed
                    });
                    socket.emit('updatePlayerExp', gainExp);
                }
            });

            if (avatarImg && avatarImg.complete) {
                ctx.save();

                if (otherPlayer.invincible && otherPlayer.isBlinking()) {
                    ctx.globalAlpha = 0.5;
                } else {
                    ctx.globalAlpha = 1.0;
                }

                const centerX = otherPlayer.posX;
                const centerY = otherPlayer.posY;

                ctx.translate(centerX, centerY);

                if (flipHorizontal) {
                    ctx.scale(-1, 1);
                }

                ctx.drawImage(
                    avatarImg,
                    -reducedSize / 2,
                    -reducedSize / 2,
                    reducedSize,
                    reducedSize
                );

                ctx.restore();

                ctx.fillStyle = "black";
                ctx.font = "5px Arial";
                ctx.textAlign = "center";
                ctx.fillText(otherPlayer.name, otherPlayer.posX, otherPlayer.posY + reducedSize / 2 + 5);

                terrain.drawHealthBar(ctx, otherPlayer, reducedSize);
            }

            if (otherPlayer.shieldActive) {
                ctx.beginPath();
                ctx.arc(otherPlayer.posX, otherPlayer.posY, otherPlayer.size - 40, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(0, 100, 255, 0.7)";
                ctx.stroke();
                ctx.closePath();
            }
        });


        ctx.restore();
        terrain.drawManaBar(ctx, player);
        terrain.drawExpBar(ctx, player);
        terrain.drawUI(ctx, player);

        requestAnimationFrame(draw);
    }

    function updateProjectiles(player) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            let projectile = projectiles[i];

            if (projectile.exploding) {
                projectile.alpha -= 0.1;

                if (projectile.explosionRadius >= projectile.maxExplosionRadius || projectile.alpha <= 0) {
                    projectiles.splice(i, 1);
                    continue;
                }

                players.forEach((otherPlayer) => {
                    const dx = otherPlayer.posX - projectile.x;
                    const dy = otherPlayer.posY - projectile.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < projectile.explosionRadius) {
                        if (!player.invincible) {
                            socket.emit('playerHit', {
                                playerId: otherPlayer.id,
                                damage: 5
                            });
                        }
                    }
                });
            } else {
                projectile.update();

                players.forEach((otherPlayer) => {
                    if (String(otherPlayer.name) === projectile.playerName) return;

                    const dx = otherPlayer.posX - projectile.x;
                    const dy = otherPlayer.posY - projectile.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const combinedRadius = otherPlayer.size / 6 + projectile.size / 2;

                    if (distance < combinedRadius) {
                        projectile.explode();
                        if (!player.invincible) {
                            projectile.explode();

                            socket.emit('playerHit', {
                                playerId: otherPlayer.id,
                                damage: 10
                            });
                        }
                    }
                });

                if (
                    projectile.x <= 0 || projectile.x >= canvas.width ||
                    projectile.y <= 0 || projectile.y >= canvas.height
                ) {
                    projectile.explode();
                }
                terrain.obstacles.forEach((obstacle) => {
                    const halfObstacleSize = obstacle.size / 2;
                    const obstacleCenterX = obstacle.x + halfObstacleSize;
                    const obstacleCenterY = obstacle.y + halfObstacleSize;
                    const dx = Math.abs(projectile.x - obstacleCenterX);
                    const dy = Math.abs(projectile.y - obstacleCenterY);
                    const combinedRadius = (projectile.size / 2) + halfObstacleSize;

                    if (dx <= halfObstacleSize + projectile.size / 2 && dy <= halfObstacleSize + projectile.size / 2) {
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < combinedRadius) {
                            projectile.explode();
                        }
                    }
                });
            }
            projectile.draw(ctx);
        }
    }

    function updatePlayerMovement() {
        if (player.isDead) return;

        if (keysPressed['ArrowUp']) {
            targetPosY -= movementSpeed;
        }
        if (keysPressed['ArrowDown']) {
            targetPosY += movementSpeed;
        }
        if (keysPressed['ArrowLeft']) {
            targetPosX -= movementSpeed;
        }
        if (keysPressed['ArrowRight']) {
            targetPosX += movementSpeed;
        }
        if (keysPressed['Escape']) {
            menu.showGameMenu(players);
        }
    }

    function handleKeyDown(event) {
        keysPressed[event.key] = true;
        event.preventDefault();
    }

    function handleKeyUp(event) {
        keysPressed[event.key] = false;
        event.preventDefault();
    }

    function checkPlayerCollisions() {
        players.forEach((otherPlayer) => {
            if (otherPlayer.id === player.id) return;

            const dx = otherPlayer.posX - player.posX;
            const dy = otherPlayer.posY - player.posY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (player.size / 5 + otherPlayer.size / 5)) {
                player.posX -= dx * 0.05;
                player.posY -= dy * 0.05;
                otherPlayer.posX -= dx * 0.05;
                otherPlayer.posY -= dy * 0.05;
            }
        });
    }

    function checkObstacleCollisions() {
        terrain.obstacles.forEach((obstacle) => {
            const halfObstacleSize = obstacle.size / 2;
            const dx = obstacle.x + halfObstacleSize - player.posX;
            const dy = obstacle.y + halfObstacleSize - player.posY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const combinedRadius = (player.size / 2) + halfObstacleSize;
            if (distance < combinedRadius) {
                const overlap = combinedRadius - distance;

                const pushX = (dx / distance) * overlap;
                const pushY = (dy / distance) * overlap;

                player.posX -= pushX * 0.5;
                player.posY -= pushY * 0.5;
            }
        });
    }

    let shieldActive = false;

    canvas.addEventListener('mousedown', (event) => {
        if (player.isDead) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / zoomLevel + player.posX - (canvas.width / (2 * zoomLevel));
        const mouseY = (event.clientY - rect.top) / zoomLevel + player.posY - (canvas.height / (2 * zoomLevel));

        const dx = mouseX - player.posX;
        const dy = mouseY - player.posY;
        const direction = Math.atan2(dy, dx);

        if (event.button === 0) {
            if (player.mana >= 10) {
                socket.emit('playerShoot', {
                    direction,
                    playerId: player.id,
                    explosionRadius: player.explosionRadius,
                    projectileSpeed: player.projectileSpeed,
                    maxExplosionRadius: player.maxExplosionRadius
                });
                player.mana -= 10;
                isShooting = true;

                clearInterval(manaRestorationInterval);
                manaRestorationInterval = setInterval(handleManaRestoration, 100);

                setTimeout(() => {
                    isShooting = false;
                    clearInterval(manaRestorationInterval);
                }, 200);
            } else {
                terrain.showMessage(player.id,"No mana");
            }
        }

        if (event.button === 2 && !shieldActive) {
            if (player.activateShield()) {
                shieldActive = true;
                shieldHeld = true;
                socket.emit('shieldStatus', { id: player.id, active: true });

                shieldInterval = setInterval(() => {
                    if (player.mana >= 5 && shieldHeld) {
                        player.mana -= 5;
                    } else {
                        player.deactivateShield();
                        shieldActive = false;
                        clearInterval(shieldInterval);
                    }
                }, 100);
            } else {
                terrain.showMessage(player.id, "No mana");
            }
        }
    });

    canvas.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
            shieldHeld = false;
            player.deactivateShield();
            shieldActive = false;
            clearInterval(shieldInterval);
            socket.emit('shieldStatus', { id: player.id, active: false });
        }
    });

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    }, false);


    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) / zoomLevel + player.posX - (canvas.width / (2 * zoomLevel));
        mouseY = (event.clientY - rect.top) / zoomLevel + player.posY - (canvas.height / (2 * zoomLevel));

        const dx = mouseX - player.posX;
        const dy = mouseY - player.posY;
        player.direction = Math.atan2(dy, dx);
        socket.emit('updateDirection', { id: player.id, mouseX: player.mouseX, direction: player.direction });
    });

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function handleManaRestoration() {
        if (player.mana < player.manaMax) {
            player.mana += 0.3;
            if (player.mana > player.manaMax) {
                player.mana = player.manaMax;
            }
        }
    }

    socket.on('updatePlayerHealth', (data) => {
        const playerToUpdate = players.find(p => p.id === data.playerId);
        if (playerToUpdate) {
            playerToUpdate.vie = data.vie;
        }
    });

    socket.on('updateInvincibility', (data) => {
        const playerToUpdate = players.find(p => p.id === data.playerId);
        if (playerToUpdate) {
            playerToUpdate.invincible = data.invincible;
        }
    });

    socket.on('updateShield', (data) => {
        const playerToUpdate = players.find(p => p.id === data.playerId);
        if (playerToUpdate) {
            playerToUpdate.shieldActive = data.shieldActive;
        }
    });

    socket.on('updateDirection', (data) => {
        const playerToUpdate = players.find(p => p.id === data.playerId);
        if (playerToUpdate) {
            playerToUpdate.mouseX = data.mouseX;
            playerToUpdate.direction = data.direction;
        }
    });

    socket.on('updateExp', player => {
        const playerToUpdate = players.find(p => p.id === player.id);
        // if (playerToUpdate) {
        //     player.exp += data.exp;
        // 	if (player.exp >= player.expMax) {
        // 		player.level++;
        // 		player.exp = 0;
        // 		player.expMax *= 1.2;
        // 		player.manaMax += 20;
        // 		player.projectileSpeed += 1;
        // 		player.explosionRadius *= 1.2;
        // 		player.maxExplosionRadius *= 1.2;
        // 		player.size *= 1.2;
        // 	}
        // }
        if (playerToUpdate) {
            playerToUpdate.exp = player.exp;
            playerToUpdate.level = player.level;
            playerToUpdate.expMax = player.expMax;
            playerToUpdate.manaMax = player.manaMax;
            playerToUpdate.projectileSpeed = player.projectileSpeed;
            playerToUpdate.explosionRadius = player.explosionRadius;
            playerToUpdate.maxExplosionRadius = player.maxExplosionRadius;
            playerToUpdate.size = player.size;
        }
    })
}
