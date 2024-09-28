import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import Ship from "../../game/Ship";
import { socket } from "../../StompSocket/websocket";

export default () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#ship-postioning-scene');
    const submitBtn = document.querySelector<HTMLButtonElement>('#submit');

    if (!canvas) {
        throw new Error('No #ship-postioning-scene')
    }

    if (!submitBtn) {
        throw new Error('No #submit')
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
            console.log(submitResponse);
        }
        else {
            alert(submitResponse.body?.errorDescription || 'Не удалось отправить');
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
