import jeux from "./Jeux.js";

export default class Menu {
    constructor(player, canvas, socket) {
        this.player = player;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameMenuVisible = false;
        this.deathMenuVisible = false;
        this.gameMenu = null;
        this.deathMenu = null;
        this.socket = socket;
    }

    showDeathMenu() {
        this.deathMenuVisible = true;

        if (!this.deathMenu) {
            this.deathMenu = document.createElement("div");
            this.deathMenu.style.position = "absolute";
            this.deathMenu.style.top = "50%";
            this.deathMenu.style.left = "50%";
            this.deathMenu.style.transform = "translate(-50%, -50%)";
            this.deathMenu.style.backgroundColor = "rgba(250,250,250,0.8)";
            this.deathMenu.style.padding = "20px";
            this.deathMenu.style.borderRadius = "10px";
            this.deathMenu.style.color = "#000000";
            this.deathMenu.style.fontSize = "20px";
            this.deathMenu.style.textAlign = "center";
            this.deathMenu.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            this.deathMenu.style.zIndex = 9999;

            const deathText = document.createElement("p");
            deathText.textContent = "Vous êtes mort";
            this.deathMenu.appendChild(deathText);

            const timeSurvived = ((Date.now() - this.player.startTime) / 1000).toFixed(1);
            const timeText = document.createElement("p");
            timeText.textContent = `Temps de survie : ${timeSurvived} secondes`;
            this.deathMenu.appendChild(timeText);

            const expText = document.createElement("p");
            expText.textContent = `XP gagné : ${this.player.exp}`;
            this.deathMenu.appendChild(expText);

            const score = Math.floor(timeSurvived * 10 + this.player.exp * 50); // Exemple de calcul du score
            const scoreText = document.createElement("p");
            scoreText.textContent = `Score : ${score}`;
            scoreText.style.fontWeight = "bold";
            scoreText.style.color = "#e67e22";
            this.deathMenu.appendChild(scoreText);

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.marginTop = "15px";

            const menuButton = document.createElement("button");
            menuButton.textContent = "Retour au menu";
            menuButton.style.borderRadius = "10px";
            menuButton.style.padding = "10px";
            menuButton.style.border = "none";
            menuButton.style.background = "gray";
            menuButton.style.color = "white";
            menuButton.style.cursor = "pointer";
            menuButton.onclick = (event) => {
                event.preventDefault();
                this.backToMenu();
                this.removeDeathMenu();
            };

            const replayButton = document.createElement("button");
            replayButton.textContent = "Rejouer";
            replayButton.style.borderRadius = "10px";
            replayButton.style.padding = "10px";
            replayButton.style.border = "none";
            replayButton.style.background = "green";
            replayButton.style.color = "white";
            replayButton.style.cursor = "pointer";
            replayButton.onclick = (event) => {
                event.preventDefault();
                this.restartGame();
                this.removeDeathMenu();
                console.log(this.player);
            };

            buttonContainer.appendChild(menuButton);
            buttonContainer.appendChild(replayButton);
            this.deathMenu.appendChild(buttonContainer);

            document.body.appendChild(this.deathMenu);
        }
    }

    restartGame() {
        this.player.avatar = 'images/wololo.png';
        this.player.x = 100;
        this.player.y = 100;
        this.player.size = 20;
        this.player.mana = 50;
        this.player.vie = 100;
        this.player.exp = 0;
        this.player.projectileSpeed = 10;
        this.player.numProjectiles = 4;
        this.player.fireRate = 2000;
        this.player.level = 1;
        this.player.score = 0;
        this.player.isDead = false;
        this.startTime = Date.now();
        //addPlayer(this.player);
        this.removeDeathMenu();
    }

    removeDeathMenu() {
        if (this.deathMenu) {
            document.body.removeChild(this.deathMenu);
            this.deathMenu = null;
        }
    }

    backToMenu() {
        window.location.href = "/menu";
    }

    showGameMenu(players) {
        if (!this.gameMenu) {
            this.gameMenu = document.createElement("div");
            this.gameMenu.style.position = "absolute";
            this.gameMenu.style.top = "50%";
            this.gameMenu.style.left = "50%";
            this.gameMenu.style.transform = "translate(-50%, -50%)";
            this.gameMenu.style.backgroundColor = "rgba(255,255,255,0.9)";
            this.gameMenu.style.padding = "20px";
            this.gameMenu.style.borderRadius = "10px";
            this.gameMenu.style.color = "#000";
            this.gameMenu.style.fontSize = "20px";
            this.gameMenu.style.textAlign = "center";
            this.gameMenu.style.zIndex = 9999;
            this.gameMenu.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.3)";
            this.gameMenu.style.width = "300px";

            const title = document.createElement("h2");
            title.textContent = "Menu du Jeu";
            this.gameMenu.appendChild(title);

            this.scoreboard = document.createElement("div");
            this.scoreboard.style.margin = "15px";
            this.scoreboard.style.padding = "10px";
            this.scoreboard.style.backgroundColor = "#222";
            this.scoreboard.style.color = "#f1dd05";
            this.scoreboard.style.borderRadius = "8px";
            this.scoreboard.style.fontSize = "18px";
            this.scoreboard.style.textAlign = "left";
            this.scoreboard.style.overflowY = "auto";
            this.scoreboard.style.maxHeight = "200px";
            this.scoreboard.innerHTML = this.generateScoreboardHTML(players);
            this.gameMenu.appendChild(this.scoreboard);

            const resumeButton = document.createElement("button");
            resumeButton.textContent = "Retour au Jeu";
            resumeButton.style.margin = "10px";
            resumeButton.style.padding = "10px";
            resumeButton.style.fontSize = "16px";
            resumeButton.style.cursor = "pointer";
            resumeButton.onclick = () => {
                this.removeGameMenu();
            };

            const menuButton = document.createElement("button");
            menuButton.textContent = "Retour au Menu Principal";
            menuButton.style.margin = "10px";
            menuButton.style.padding = "10px";
            menuButton.style.fontSize = "16px";
            menuButton.style.cursor = "pointer";
            menuButton.onclick = () => {
                this.backToMenu();
            };

            const creditsButton = document.createElement("button");
            creditsButton.textContent = "Voir les Crédits";
            creditsButton.style.margin = "10px";
            creditsButton.style.padding = "10px";
            creditsButton.style.fontSize = "16px";
            creditsButton.style.cursor = "pointer";
            creditsButton.onclick = () => {
                this.showCredits();
            };

            this.gameMenu.appendChild(resumeButton);
            this.gameMenu.appendChild(menuButton);
            this.gameMenu.appendChild(creditsButton);

            document.body.appendChild(this.gameMenu);

            this.updateScoreboardInterval = setInterval(() => {
                if (this.scoreboard) {
                    this.scoreboard.innerHTML = this.generateScoreboardHTML(players);
                }
            }, 500);
        }
    }

    showCredits() {
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "10000";

        const modalContent = document.createElement("div");
        modalContent.style.backgroundColor = "#fff";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "10px";
        modalContent.style.textAlign = "center";
        modalContent.style.width = "80%";
        modalContent.style.maxWidth = "500px";

        const title = document.createElement("h3");
        title.textContent = "Crédits";
        modalContent.appendChild(title);
        title.style.color = "#000";

        const creditsText = document.createElement("p");
        creditsText.innerHTML = `
        <strong>Créateurs :</strong> Enzo Lamour et Thomas Smeeckaert<br>
        <strong>Groupe :</strong> 8 <br>
        <strong>Jeu vidéo préféré :</strong> CS2 <br>
        <strong>Pourcentage :</strong> Enzo : 70% Thomas: 30%<br>
    `;
        creditsText.style.color = "#000";
        modalContent.appendChild(creditsText);

        const closeButton = document.createElement("button");
        closeButton.textContent = "Fermer";
        closeButton.style.marginTop = "15px";
        closeButton.style.padding = "10px";
        closeButton.style.fontSize = "16px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = () => {
            document.body.removeChild(modal);
        };
        modalContent.appendChild(closeButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }



    generateScoreboardHTML(players) {
        return `
        <h3>Scoreboard</h3>
        <ul style="list-style:none; padding:0;">
            ${players
            .map(player => `<li style="margin: 5px 0; color: #fff;">
                    ${player.name}: <strong>${player.exp}</strong>
                </li>`)
            .join("")}
        </ul>
    `;
    }

    removeGameMenu() {
        if (this.gameMenu) {
            document.body.removeChild(this.gameMenu);
            this.gameMenu = null;
        }
    }

    toggleGameMenu() {
        if (this.gameMenuVisible) {
            this.removeGameMenu();
        } else {
            this.showGameMenu();
        }
        this.gameMenuVisible = !this.gameMenuVisible;
    }
}
