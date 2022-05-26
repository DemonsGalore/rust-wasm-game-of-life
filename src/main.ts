import init, { Cell, Universe } from '../game-of-life/pkg/game_of_life';
import './style.scss';

const CELL_SIZE = 10;
const GRID_COLOR = '#DDDDDD';
const ALIVE_COLOR = 'rgba(0, 0, 0, 0.5)';
const DEAD_COLOR = '#FFFFFF';

const SPEED = 8;
let lastRenderTime = 0;
let fps = 0;

const canvas = document.querySelector<HTMLCanvasElement>('#game-of-life-canvas')!;
const fpsCounter = document.querySelector<HTMLTitleElement>('#fps')!;
let ctx: CanvasRenderingContext2D | null = null;

let universe: Universe;
let width: number;
let height: number;

let memory: WebAssembly.Memory;

// Wasm functionality is only available after initialization
init().then((init) => {
    memory = init.memory;

    universe = Universe.random();
    width = universe.width();
    height = universe.height();

    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.width = (CELL_SIZE + 1) * width + 1;
    ctx = canvas.getContext('2d');

    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
});

const renderLoop = (currentTime: number): void => {
    requestAnimationFrame(renderLoop);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

    if (secondsSinceLastRender < 1 / SPEED) return;

    fps = 1 / secondsSinceLastRender;
    fpsCounter.innerText = `FPS: ${fps.toFixed(2)}`;

    lastRenderTime = currentTime;

    universe.tick();

    drawGrid();
    drawCells();
};

const drawGrid = (): void => {
    if (ctx === null) return;

    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row: number, column: number): number => {
    return row * width + column;
};

const drawCells = (): void => {
    if (ctx === null) return;

    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const index = getIndex(row, col);

            ctx.fillStyle = cells[index] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};
