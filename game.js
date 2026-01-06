const GRID_SIZE = 11;
const TREE_COUNT = 30;

const EMOJIS = {
    GRASS: '🟩',
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

// Integración con Discord Embedded App SDK
const discordSdk = new window.discordSdk.DiscordSDK("1324706596395352124"); // Reemplaza con tu Application ID si es diferente

async function setupDiscord() {
    try {
        await discordSdk.ready();
        console.log("Discord SDK is ready");
        
        // Autenticación básica
        const { code } = await discordSdk.commands.authorize({
            client_id: "1324706596395352124",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });
        
        console.log("Authenticated with code:", code);
    } catch (e) {
        console.warn("No se pudo conectar con Discord (es normal si estás fuera de Discord):", e);
    }
    
    // Iniciar el juego de todas formas
    initGame();
}

setupDiscord();
