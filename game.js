const GRID_SIZE = 11;
const TREE_COUNT = 30;

const EMOJIS = {
    GRASS: '⬜', // Usaremos un color neutro de fondo o nada para que se vea el fondo de la celda
    TREE: '🌲',
    PLAYER_UP: '⬆️',
    PLAYER_DOWN: '⬇️',
    PLAYER_LEFT: '⬅️',
    PLAYER_RIGHT: '➡️'
};

let playerX = 5;
let playerY = 5;
let playerDir = 'up';
let map = [];

function initGame() {
    // Generar mapa
    for (let y = 0; y < GRID_SIZE; y++) {
        map[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            map[y][x] = 'grass';
        }
    }

    // Colocar árboles
    let placed = 0;
    while (placed < TREE_COUNT) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        if (x === 5 && y === 5) continue;
        if (map[y][x] === 'grass') {
            map[y][x] = 'tree';
            placed++;
        }
    }

    draw();
}

function draw() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (x === playerX && y === playerY) {
                cell.textContent = EMOJIS[`PLAYER_${playerDir.toUpperCase()}`];
            } else if (map[y][x] === 'tree') {
                cell.textContent = EMOJIS.TREE;
            } else {
                cell.textContent = EMOJIS.GRASS;
            }
            
            gridElement.appendChild(cell);
        }
    }
}

window.addEventListener('keydown', (e) => {
    let newX = playerX;
    let newY = playerY;
    let newDir = playerDir;

    const key = e.key.toLowerCase();

    if (key === 'w') { newY--; newDir = 'up'; }
    else if (key === 's') { newY++; newDir = 'down'; }
    else if (key === 'a') { newX--; newDir = 'left'; }
    else if (key === 'd') { newX++; newDir = 'right'; }
    else { return; } // Ignorar otras teclas

    // Límites y Colisiones
    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        if (map[newY][newX] !== 'tree') {
            playerX = newX;
            playerY = newY;
        }
    }
    playerDir = newDir;
    
    draw();
});

// --- INTEGRACIÓN DISCORD (MODO HÍBRIDO) ---
import { DiscordSDK } from "https://cdn.skypack.dev/@discord/embedded-app-sdk";

const queryParams = new URLSearchParams(window.location.search);
const isDiscord = queryParams.has("frame_id");

// 1. INICIAMOS EL JUEGO DE INMEDIATO
// Esto evita que la pantalla se quede en negro si Discord tarda en responder
initGame();

// 2. CONFIGURACIÓN DE DISCORD EN SEGUNDO PLANO
if (isDiscord) {
    const discordSdk = new DiscordSDK("1324706596395352124");
    
    async function setupDiscord() {
        try {
            await discordSdk.ready();
            console.log("Discord SDK listo");
            
            // Intentamos autorizar (esto es opcional para que el juego funcione)
            await discordSdk.commands.authorize({
                client_id: "1324706596395352124",
                response_type: "code",
                scope: ["identify"],
                prompt: "none",
            });
        } catch (e) {
            console.warn("Discord SDK no pudo conectar, pero el juego sigue:", e);
        }
    }
    setupDiscord();
}
