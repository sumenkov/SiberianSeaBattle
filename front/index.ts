import Board from "./src/game/Board";
import GameLoop from "./src/game/GameLoop";
import createCanvas from "./src/game/initializeCanvas";
import Ship from "./src/game/Ship";

const canvas = createCanvas({});

const board = new Board({
    canvas,
    position: {
        x: 100,
        y: 100
    }
})

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


board.addShip(oneSegmentShip);
board.addShip(twoSegmentShip);

loop.use(board.draw);
loop.use(oneSegmentShip.draw.bind(oneSegmentShip));
loop.use(twoSegmentShip.draw.bind(twoSegmentShip));

loop.start();
