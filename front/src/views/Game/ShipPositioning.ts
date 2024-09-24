import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import Ship from "../../game/Ship";

export default () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#ship-postioning-scene');

    if (!canvas) {
        throw new Error('No #ship-postioning-scene')
    }

    const board = new Board({
        canvas,
        position: {
            x: 100,
            y: 100
        }
    });

    const oneSegmentShip = new Ship({
        initialX: 700,
        initialY: 100,
        canvas,
        numberOfSegments: 1
    });

    const secondOneSegmentedShip = new Ship({
        initialX: 850,
        initialY: 100,
        canvas,
        numberOfSegments: 1
    });

    const twoSegmentShip = new Ship({
        initialX: 850,
        initialY: 250,
        canvas,
        numberOfSegments: 2
    });

    const threeSegmentShip = new Ship({
        initialX: 700,
        initialY: 250,
        canvas,
        numberOfSegments: 3
    });

    const loop = new GameLoop(canvas);

    board.addShip(oneSegmentShip);
    board.addShip(twoSegmentShip);
    board.addShip(threeSegmentShip);
    board.addShip(secondOneSegmentedShip);

    loop.use(board.draw);
    loop.use(oneSegmentShip.draw.bind(oneSegmentShip));
    loop.use(twoSegmentShip.draw.bind(twoSegmentShip));
    loop.use(threeSegmentShip.draw.bind(threeSegmentShip));
    loop.use(secondOneSegmentedShip.draw.bind(secondOneSegmentedShip));

    loop.start();
}
