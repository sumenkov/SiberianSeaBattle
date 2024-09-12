import GameLoop from "./src/game/GameLoop";
import drawBoardHook from "./src/game/hooks/drawBoardHook";
import createCanvas from "./src/game/initializeCanvas";
import Ship from "./src/game/Ship";

let x = 0;
let y = 0;

const canvas = createCanvas({
    onMouseMove: (e) => {
        x = e.offsetX;
        y = e.offsetY;
    }
});

const oneSegmentShip = new Ship({
    initialX: 700,
    initialY: 100,
    canvas,
    numberOfSegments: 1
});

const twoSegmentShip = new Ship({
    initialX: 800,
    initialY: 100,
    canvas,
    numberOfSegments: 2
});

const loop = new GameLoop(canvas);
document.body.appendChild(canvas);

loop.use((context, canvas) => {
    drawBoardHook(context, canvas, {
        width: 500,
        height: 500,
        displayPositionY: 100,
        displayPositionX: 100,
        activeY: y,
        activeX: x
    })
});

loop.use(oneSegmentShip.draw.bind(oneSegmentShip));
loop.use(twoSegmentShip.draw.bind(twoSegmentShip));

loop.start();
