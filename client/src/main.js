import jeux from "./Jeux.js";

const userForm = document.querySelector('.user-form');
const userNameInput = userForm.querySelector('input[name=username]');

function handleUserSubmit(event) {
    event.preventDefault();

    const userName = userNameInput.value.trim();
    if (!userName) {
        alert('Veuillez entrer un nom valide.');
        return;
    }
    const gameTitle = document.querySelector('.game-title');
    const gameLogo = document.querySelector('.game-logo');
    const travoltaGif = document.querySelector('.travolta-gif');
    if (gameTitle) gameTitle.remove();
    if (gameLogo) gameLogo.remove();
    if (travoltaGif) travoltaGif.remove();

    this.remove();
    sessionStorage.setItem('userName', userName);
    console.log("Nom de l'utilisateur enregistré :", userName);
    jeux(userName);
}

userForm.addEventListener('submit', handleUserSubmit);