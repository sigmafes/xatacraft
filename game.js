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

const GRID_SIZE = 11;
const TREE_COUNT = 30;

const EMOJIS = {
    GRASS: '', 
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
    logToScreen("Iniciando mapa...");
    try {
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

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
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
    logToScreen("Tecla presionada: " + key);

    if (key === 'w') { newY--; newDir = 'up'; }
    else if (key === 's') { newY++; newDir = 'down'; }
    else if (key === 'a') { newX--; newDir = 'left'; }
    else if (key === 'd') { newX++; newDir = 'right'; }
    else { return; } 

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
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

logToScreen("Iniciando script...");
logToScreen("Detección Discord: " + isDiscord);

initGame();

if (isDiscord) {
    // Usar el SDK desde la variable global cargada en el index.html
    const DiscordSDK = window.discordSdk.DiscordSDK;
    const discordSdk = new DiscordSDK("1324706596395352124");
    
    async function setupDiscord() {
        try {
            logToScreen("Esperando SDK...");
            await discordSdk.ready();
            logToScreen("Discord SDK listo!");
            await discordSdk.commands.authorize({
                client_id: "1324706596395352124",
                response_type: "code",
                scope: ["identify"],
                prompt: "none",
            });
            logToScreen("Autorización completada");
        } catch (e) {
            logToScreen("Error SDK: " + e.message);
        }
    }
    setupDiscord();
}
