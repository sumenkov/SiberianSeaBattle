import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import { CELL_SIZE } from "../../game/GameValues";
import Ship, { DIRECTIONS } from "../../game/Ship";

export default () => {

    const myCanvas = document.querySelector<HTMLCanvasElement>('#me');
    const opponentCancvas = document.querySelector<HTMLCanvasElement>('#opponent');

    if (!myCanvas) {
        throw new Error('No #me');
    }

    if (!opponentCancvas) {
        throw new Error('No #opponenet');
    }

    const myBoard = new Board({
        canvas: myCanvas,
        position: {
            x: 0,
            y: 0
        }
    })

    const shipAmount: Record<string, { i: number; j: number }[]> = {
        'one-one': [],
        'one-two': [],
        2: [],
        3: []
    }


    const arr = [
        [0, 1, 0, 0, 2],
        [0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0],
        [3, 3, 3, 0, 1],
        [0, 0, 0, 0, 0]
    ]
    for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            if (cell === 1) {
                if (!shipAmount['one-one'].length) shipAmount['one-one'].push({ i, j })
                else shipAmount['one-two'].push({ i, j })
            }
            else if (shipAmount[cell]) {
                shipAmount[cell].push({ i, j })
            }

        }
    }

    const oneSegmentShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: myCanvas,
        numberOfSegments: 1
    });

    oneSegmentShip.applyBoardPosition({
        x: shipAmount['one-one'][0].i,
        y: shipAmount['one-one'][0].j,
        cellOffeset: {
            left: shipAmount['one-one'][0].j * CELL_SIZE,
            right: (shipAmount['one-one'][0].j * CELL_SIZE) + CELL_SIZE,
            top: shipAmount['one-one'][0].i * CELL_SIZE,
            bottom: (shipAmount['one-one'][0].i * CELL_SIZE) + CELL_SIZE,
        }
    });

    oneSegmentShip.snapShipToBoardPostion();

    const secondOneSegmentShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: myCanvas,
        numberOfSegments: 1
    });

    secondOneSegmentShip.applyBoardPosition({
        x: shipAmount['one-two'][0].i,
        y: shipAmount['one-two'][0].j,
        cellOffeset: {
            left: shipAmount['one-two'][0].j * CELL_SIZE,
            right: (shipAmount['one-two'][0].j * CELL_SIZE) + CELL_SIZE,
            top: shipAmount['one-two'][0].i * CELL_SIZE,
            bottom: (shipAmount['one-two'][0].i * CELL_SIZE) + CELL_SIZE,
        }
    });

    secondOneSegmentShip.snapShipToBoardPostion();


    const twoSegmetShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: myCanvas,
        numberOfSegments: 2
    });

    const twoSegmetShipDirection =
        shipAmount['2'].every((el) =>
            el.i === shipAmount['2'][0].i) ? DIRECTIONS.VERTICAL : DIRECTIONS.HORIZONTAL

    twoSegmetShip.positionOnBoard = [
        {
            x: shipAmount['2'][0].i,
            y: shipAmount['2'][0].j,
            cellOffeset: {
                left: shipAmount['2'][0].j * CELL_SIZE,
                right: (shipAmount['2'][0].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['2'][0].i * CELL_SIZE,
                bottom: (shipAmount['2'][0].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['2'][1].i,
            y: shipAmount['2'][1].j,
            cellOffeset: {
                left: shipAmount['2'][1].j * CELL_SIZE,
                right: (shipAmount['2'][1].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['2'][1].i * CELL_SIZE,
                bottom: (shipAmount['2'][1].i * CELL_SIZE) + CELL_SIZE,
            }
        }
    ];

    twoSegmetShip.direction = twoSegmetShipDirection;
    twoSegmetShip.flipTheShip();

    twoSegmetShip.snapShipToBoardPostion();

    const threeSegmetShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: myCanvas,
        numberOfSegments: 3
    });

    const threeSegmetShipDirection =
        shipAmount['3'].every((el) =>
            el.i === shipAmount['3'][0].i) ? DIRECTIONS.VERTICAL : DIRECTIONS.HORIZONTAL

    threeSegmetShip.positionOnBoard = [
        {
            x: shipAmount['3'][0].i,
            y: shipAmount['3'][0].j,
            cellOffeset: {
                left: shipAmount['3'][0].j * CELL_SIZE,
                right: (shipAmount['3'][0].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][0].i * CELL_SIZE,
                bottom: (shipAmount['3'][0].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['3'][1].i,
            y: shipAmount['3'][1].j,
            cellOffeset: {
                left: shipAmount['3'][1].j * CELL_SIZE,
                right: (shipAmount['3'][1].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][1].i * CELL_SIZE,
                bottom: (shipAmount['3'][1].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['3'][2].i,
            y: shipAmount['3'][2].j,
            cellOffeset: {
                left: shipAmount['3'][2].j * CELL_SIZE,
                right: (shipAmount['3'][2].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][2].i * CELL_SIZE,
                bottom: (shipAmount['3'][2].i * CELL_SIZE) + CELL_SIZE,
            }
        }
    ];

    threeSegmetShip.direction = threeSegmetShipDirection;
    threeSegmetShip.flipTheShip();

    threeSegmetShip.snapShipToBoardPostion();

    const loop = new GameLoop(myCanvas);

    myBoard.addShip(oneSegmentShip)
    loop.use(myBoard.draw);
    loop.use(oneSegmentShip.draw.bind(oneSegmentShip));
    loop.use(secondOneSegmentShip.draw.bind(secondOneSegmentShip));
    loop.use(twoSegmetShip.draw.bind(twoSegmetShip));
    loop.use(threeSegmetShip.draw.bind(threeSegmetShip));

    loop.start();


}
