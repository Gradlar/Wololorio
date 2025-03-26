# Equipe 8 - JSAÉ

## Wololorio

Wololorio est un jeu basé sur le principe de **Agar.io**.
Vous apparaissez dans un monde cadrillé avec d'autre joueur, votre but est de tuer les autres joueurs afin de gagner en niveau. 

### Comment lancer le jeu ?

Après téléchargement de ce projet, il vous reste plus qu'a lancé le serveur qui s'exécutera soit sur un port spécifique après modification dans le fichier `webpack.conf.js` ou a l'adresse `localhost:8080`, le lancement ce fait avec la commande suivante :
```bash
npm run server
```

Attention : cette action est a effectuer si vous héberger vous même le serveur. Dans d'autre cas vous serai tous seul en local.

Lancez également le client avec la commande : 
```bash
npm run client:start
```

Une fois arrivé là, il ne vous reste plus qu'a lancé votre navigateur a l'adresse suivante `http://localhost:8000` ou de clické [ici](http://localhost:8000).

### Comment jouer ?

Voici la liste des actions possible et la touche pour les activers.

|touche 			| action  				   |
|-------------------|--------------------------|
|Flèche haute		|Déplacement vers le haut  | 
|Flèche basse		|Déplacement vers le bas   |
|Flèche gauche		|Déplacement vers la gauche|
|Flèche droite		|Déplacement vers la droite|
|Click souris droit	|Tire un projectil		   |
|Click souris gauche|Active un bouclier	       |

### Évolution

Vous évoluerez en taille au fure et a mesure que vous tuerai et gagnerai de l'expérience.
Au début de votre partie vous gagnerai un level pour chaque orbe d'expérience récupérer mais une fois arrivé au niveau 5 vous grandirez à la seul condition de tuer des personnes ayant plus de 5 niveaux, la quantité d'expérience que vous gagnerai sera donc la quantité que la personne avais en sa pocession.

## Structure du projet

### Coté serveur
```bash
server/
├── Ennemi.js
├── Ennemi.test.js
├── index.js
├── Personnage.js
└── Personnage.test.js
```

Coté serveur l'arboréssance juste si-dessus contient :  
1. Une classe *index.js*  
Cette classe est le centre du serveur, elle contient la liste des joueurs connecté ainsi que toute les methodes de transmition/reception des données entre les joueurs.

2. Une classe *Personnage.js*  
Cette classe représente un personnage, elle permet de sauvegarder de nombreux paramètre comme le nombre de point de vie restant, le nom, la position sur la carte, le status du personnage, etc...

3. Une classe *Ennemi.js*  
Tout comme la classe Personnage, cette classe représente un ennemie.

4. Classe de test pour les classes *Personnage.js* et *Ennemi.js*  

### Coté client

``` bash
client/
├── public
│   ├── build
│   │   ├── main.bundle.js
│   │   └── main.bundle.js.map
│   ├── css
│   │   ├── fonts
│   │   │   ├── MotivaSans-BoldItalic.ttf
│   │   │   ├── MotivaSans-Bold.ttf
│   │   │   ├── MotivaSans-Light.ttf
│   │   │   ├── MotivaSans-Medium.ttf
│   │   │   ├── MotivaSans-RegularItalic.ttf
│   │   │   ├── MotivaSans-Regular.ttf
│   │   │   └── MotivaSans-Thin.ttf
│   │   └── main.css
│   ├── images
│   │   ├── tire.png
│   │   └── wololo.png
│   └── index.html
└── src
    ├── ExpBalls.js
    ├── Jeux.js
    ├── main.js
    ├── Menu.js
    ├── Projectile.js
    └── Terrain.js
```

Coté client l'arboréssance contient d'une part les fichiers source, d'une autre ce que la navigateur client utilise pour afficher le jeu.

Les fichiers sources contiennent :  
1. Classe *Main.js*  
Saisie le moment d'envoie du formulaire de connection et lance la boucle de jeu.

2. Classe *Jeux.js*  
La boucle de jeu, récupère et dessine tout les joueurs, envoie au serveur la nouvel position du joueur après chaque action.

3. Classe *Menu.js*  
Gère l'affichage et les actions dans les menus.

4. Classe *Terrain.js*  
Créer le terrain dans lequel vas évoluer les joueurs.

5. Classe *Projectile.js*  
Créer un projectile lors que le joueur tire et met à jour son annimation.

6. Classe *ExpBalls.js*  
Créer une boule d'expérience lorsqu'un joueur est tuer qui permet d'augmanter de niveau.