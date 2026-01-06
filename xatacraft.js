// --- SISTEMA DE LOG PARA DISCORD ---
function logToScreen(msg) {
    const logEl = document.getElementById('debug-log');
    if (logEl) {
        const line = document.createElement('div');
        line.textContent = `> ${msg}`;
        logEl.appendChild(line);
        logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(msg);
}

const GRID_WIDTH = 14;
const GRID_HEIGHT = 8;
const TREE_COUNT = 25;

const EMOJIS = {
    GRASS: '', 
    TREE: '🌲',
    PLAYER_UP: '⬆️',
    PLAYER_DOWN: '⬇️',
    PLAYER_LEFT: '⬅️',
    PLAYER_RIGHT: '➡️'
};

let playerX = 7;
let playerY = 4;
let playerDir = 'up';
let map = [];

function initGame() {
    logToScreen("Iniciando mapa 14x8...");
    try {
        // Generar mapa
        for (let y = 0; y < GRID_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                map[y][x] = 'grass';
            }
        }

        // Colocar árboles
        let placed = 0;
        while (placed < TREE_COUNT) {
            const x = Math.floor(Math.random() * GRID_WIDTH);
            const y = Math.floor(Math.random() * GRID_HEIGHT);
            if (x === playerX && y === playerY) continue;
            if (map[y][x] === 'grass') {
                map[y][x] = 'tree';
                placed++;
            }
        }
        logToScreen("Mapa generado. Dibujando...");
        draw();
    } catch (e) {
        logToScreen("ERROR en initGame: " + e.message);
    }
}

function draw() {
    try {
        const gridElement = document.getElementById('grid');
        if (!gridElement) {
            logToScreen("ERROR: No se encontró el element #grid");
            return;
        }
        gridElement.innerHTML = '';

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (x === playerX && y === playerY) {
                    cell.textContent = EMOJIS[`PLAYER_${playerDir.toUpperCase()}`] || '👤';
                } else if (map[y][x] === 'tree') {
                    cell.textContent = EMOJIS.TREE;
                } else {
                    cell.textContent = EMOJIS.GRASS;
                }
                
                gridElement.appendChild(cell);
            }
        }
    } catch (e) {
        logToScreen("ERROR en draw: " + e.message);
    }
}

window.addEventListener('keydown', (e) => {
    let newX = playerX;
    let newY = playerY;
    let newDir = playerDir;

    const key = e.key.toLowerCase();
    logToScreen("Tecla pulsada: " + key);

    if (key === 'w') { newY--; newDir = 'up'; }
    else if (key === 's') { newY++; newDir = 'down'; }
    else if (key === 'a') { newX--; newDir = 'left'; }
    else if (key === 'd') { newX++; newDir = 'right'; }
    else { return; } 

    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        if (map[newY][newX] !== 'tree') {
            playerX = newX;
            playerY = newY;
        }
    }
    playerDir = newDir;
    draw();
});

// --- INTEGRACIÓN DISCORD ---
const queryParams = new URLSearchParams(window.location.search);
const isDiscord = queryParams.has("frame_id");

logToScreen("Iniciando XataCraft v9...");
logToScreen("Resolución 14x8 (Ancho x Alto)");

initGame();
