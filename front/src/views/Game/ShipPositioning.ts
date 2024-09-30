import { subscribe } from "diagnostics_channel";
import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import Ship, { DIRECTIONS } from "../../game/Ship";
import { socket } from "../../StompSocket/websocket";
import getShipBoardPositionsByGrid from "../../utils/getShipBoardPositionsByGrid";
import router from "../../router";
import { reallyRandomGrids } from "./Game.static";

export default () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#ship-postioning-scene');
    const submitBtn = document.querySelector<HTMLButtonElement>('#submit');
    const generateBth = document.querySelector<HTMLButtonElement>('#random');

    if (!canvas) {
        throw new Error('No #ship-postioning-scene');
    }

    if (!submitBtn) {
        throw new Error('No #submit');
    }

    if (!generateBth) {
        throw new Error('No #random');
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

    submitBtn.addEventListener('click', async () => {

        const submitResponse = await socket.submitBoard(board.shipPositionMap);

        if (submitResponse.body?.status == 'OK') {
            router.applyRoute();
        }
        else {
            alert(submitResponse.body?.errorDescription || 'Не удалось отправить');
        }

    });

    generateBth.addEventListener('click', async () => {
        //         const g = reallyRandomGrids[Math.floor(Math.random() * reallyRandomGrids.length)];
        //         console.log(g);
        // 
        //         const positions = getShipBoardPositionsByGrid(
        //             g
        //         );
        // 
        //         oneSegmentShip.positionOnBoard = positions.oneSegmented;
        //         secondOneSegmentedShip.positionOnBoard = positions.secondOneSegmenteed;
        //         twoSegmentShip.positionOnBoard = positions.twoSegmented;
        //         threeSegmentShip.positionOnBoard = positions.threeSegmented;
        // 
        //         console.log(threeSegmentShip.direction === DIRECTIONS.HORIZONTAL, positions.isTwoSegmentHorizontal)
        // 
        //         if (positions.isTwoSegmentHorizontal && twoSegmentShip.direction !== DIRECTIONS.HORIZONTAL) {
        //             twoSegmentShip.flipTheShip();
        //         }
        // 
        //         if (positions.isThreeSegmentHorizontal && threeSegmentShip.direction !== DIRECTIONS.HORIZONTAL) {
        //             threeSegmentShip.flipTheShip();
        //         }
        // 
        //         oneSegmentShip.snapShipToBoardPostion({ boardOffset: { x: 100, y: 100 } });
        //         secondOneSegmentedShip.snapShipToBoardPostion({ boardOffset: { x: 100, y: 100 } });
        //         twoSegmentShip.snapShipToBoardPostion({ boardOffset: { x: 100, y: 100 } });
        //         threeSegmentShip.snapShipToBoardPostion({ boardOffset: { x: 100, y: 100 } });
        // 

        const generateResponse = await socket.randomBoard();

        if (generateResponse.body?.status == 'OK') {
            //             const positions = getShipBoardPositionsByGrid(generateResponse.body.grids);
            // 
            //             oneSegmentShip.positionOnBoard = positions.oneSegmented;
            //             secondOneSegmentedShip.positionOnBoard = positions.secondOneSegmenteed;
            //             twoSegmentShip.positionOnBoard = positions.twoSegmented;
            //             threeSegmentShip.positionOnBoard = positions.threeSegmented;
            // 
            //             if (positions.isTwoSegmentHorizontal) {
            //                 twoSegmentShip.flipTheShip();
            //             }
            // 
            //             if (positions.isThreeSegmentHorizontal) {
            //                 threeSegmentShip.flipTheShip();
            //             }
            // 
            //             oneSegmentShip.snapShipToBoardPostion();
            //             secondOneSegmentedShip.snapShipToBoardPostion();
            //             twoSegmentShip.snapShipToBoardPostion();
            //             threeSegmentShip.snapShipToBoardPostion();

            router.applyRoute();

        }
        else {
            alert(generateResponse.body?.errorDescription || 'Не удалось отправить');
        }
    });

    loop.use((() => {

        const shipAmount: Record<string, number> = {
            1: 0,
            2: 0,
            3: 0
        }

        for (const row of board.shipPositionMap) {
            for (const cell of row) {
                if (typeof shipAmount[cell] === 'number') {
                    shipAmount[cell] += 1;
                }
            }
        }

        if (
            shipAmount['1'] == 2 &&
            shipAmount['2'] == 2 &&
            shipAmount['3'] == 3
        ) {
            if (submitBtn.hasAttribute('disabled')) {
                submitBtn.removeAttribute('disabled');
            }
        }
        else if (!submitBtn.hasAttribute('disabled')) {
            submitBtn.setAttribute('disabled', 'true');
        }

    }));


    loop.use((() => {




    }));

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
