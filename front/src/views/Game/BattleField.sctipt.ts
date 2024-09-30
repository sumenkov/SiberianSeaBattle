import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import Ship from "../../game/Ship";
import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import { ShotNotifacation } from "../../StompSocket/websocket.types";
import credentials from "../../utils/credentials";
import getShipBoardPositionsByGrid from "../../utils/getShipBoardPositionsByGrid";
import { GAME_STATES, hitSprite } from "./Game.static";

const CAN_SHOOT_LS_KEY = 'cs';

const canShoot = () => {
    if (!localStorage.getItem(CAN_SHOOT_LS_KEY)) {
        const { currentGameId, currentCreatedGameId } = credentials.current;
        localStorage.setItem(CAN_SHOOT_LS_KEY, String(currentCreatedGameId === currentGameId));
    }
    return localStorage.getItem(CAN_SHOOT_LS_KEY) === 'true';
}

const setCanShoot = (can: string) => {
    localStorage.setItem(CAN_SHOOT_LS_KEY, String(can));
}

const initializeMyBoard = (
    grid: number[][],
    canvas: HTMLCanvasElement
) => {

    const turnStatus = document.querySelector<HTMLSpanElement>('#turn');

    const positions = getShipBoardPositionsByGrid(grid);
    let map = [
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400]
    ];

    if (!canvas) {
        throw new Error('No #me');
    }

    const myBoard = new Board({
        canvas: canvas,
        position: {
            x: 0,
            y: 0
        }
    });

    const oneSegmentShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: canvas,
        isStatic: true,
        numberOfSegments: 1
    });

    const secondOneSegmentShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: canvas,
        isStatic: true,
        numberOfSegments: 1
    });

    const twoSegmetShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: canvas,
        isStatic: true,
        numberOfSegments: 2
    });

    const threeSegmetShip = new Ship({
        initialX: -300,
        initialY: -300,
        canvas: canvas,
        isStatic: true,
        numberOfSegments: 3
    });

    oneSegmentShip.positionOnBoard = positions.oneSegmented;
    secondOneSegmentShip.positionOnBoard = positions.secondOneSegmenteed;
    twoSegmetShip.positionOnBoard = positions.twoSegmented;
    threeSegmetShip.positionOnBoard = positions.threeSegmented;

    if (positions.isTwoSegmentHorizontal) {
        twoSegmetShip.flipTheShip();
    }

    if (positions.isThreeSegmentHorizontal) {
        threeSegmetShip.flipTheShip();
    }

    myBoard.addShip(oneSegmentShip);
    myBoard.addShip(secondOneSegmentShip);
    myBoard.addShip(twoSegmetShip);
    myBoard.addShip(threeSegmetShip);

    oneSegmentShip.snapShipToBoardPostion();
    secondOneSegmentShip.snapShipToBoardPostion();
    twoSegmetShip.snapShipToBoardPostion();
    threeSegmetShip.snapShipToBoardPostion();

    myBoard.registerCellDrawHook(({ rowNum, colNum, context, fillRectArrtibutes }) => {
        switch (map[rowNum][colNum]) {
            case 1:
            case 2:
            case 3:
                context.fillStyle = 'orange';
                context.fillRect(
                    fillRectArrtibutes.x,
                    fillRectArrtibutes.y,
                    fillRectArrtibutes.width,
                    fillRectArrtibutes.heigth
                );
                break;
            default:
                break;
        }
    });

    socket.subscribe<ShotNotifacation>(
        '/user/#chanelId/see-battle/shot-game-owner/response',
        (message) => {
            if (message.body?.status === 'OK') {
                map = message.body.grids;
                if (message.body.opponentWin) {
                    localStorage.removeItem(CAN_SHOOT_LS_KEY);
                    credentials.setGame({ status: GAME_STATES.LOSE });
                    router.applyRoute();
                }
                setCanShoot(!!message.body.hit + '');
                if (!!message.body.hit && turnStatus) {
                    turnStatus.innerText = 'Ваш ход';
                }
                else if (turnStatus) {
                    turnStatus.innerText = 'Ход противника';
                }
            }
        }
    );

    socket.subscribe<ShotNotifacation>(
        '/user/#chanelId/see-battle/shot-game-opponent/response',
        (message) => {
            if (message.body?.status === 'OK') {
                map = message.body.grids;
                if (message.body.opponentWin) {
                    localStorage.removeItem(CAN_SHOOT_LS_KEY);
                    credentials.setGame({ status: GAME_STATES.LOSE });
                    router.applyRoute();
                }
                setCanShoot(!!message.body.hit + '');
            }
        }
    );

    const loop = new GameLoop(canvas);

    myBoard.addShip(oneSegmentShip)
    loop.use(myBoard.draw);
    loop.use(oneSegmentShip.draw.bind(oneSegmentShip));
    loop.use(secondOneSegmentShip.draw.bind(secondOneSegmentShip));
    loop.use(twoSegmetShip.draw.bind(twoSegmetShip));
    loop.use(threeSegmetShip.draw.bind(threeSegmetShip));

    loop.start();
}

const initializeOpponentsBoard = (grid: number[][], canvas: HTMLCanvasElement) => {

    const turnStatus = document.querySelector<HTMLSpanElement>('#turn');
    if (canShoot()) {
        turnStatus!.innerText = 'Ваш ход';
    }
    else {
        turnStatus!.innerText = 'Ход противника';
    }

    const loop = new GameLoop(canvas);
    let map = grid;

    const { currentGameId, currentCreatedGameId } = credentials.current;

    const canShootLocalStorage = localStorage.getItem(CAN_SHOOT_LS_KEY);

    if (canShootLocalStorage === null) {
        localStorage.setItem(CAN_SHOOT_LS_KEY, String(currentCreatedGameId === currentGameId));
    }

    const board = new Board({
        canvas: canvas,
        position: {
            x: 0,
            y: 0
        }
    });

    board.registerCellDrawHook((props) => {
        const { x, y, width, heigth } = props.fillRectArrtibutes;

        switch (map[props.rowNum][props.colNum]) {
            case -400:
                props.context.fillStyle = '#adb2bb';
                props.context.fillRect(x, y, width, heigth);
                break;
            case 0:
                break;
            case 1:
            case 2:
            case 3: {
                props.context.fillRect(
                    props.fillRectArrtibutes.x,
                    props.fillRectArrtibutes.y,
                    props.fillRectArrtibutes.width,
                    props.fillRectArrtibutes.heigth
                )
                props.context.drawImage(
                    hitSprite,
                    props.fillRectArrtibutes.x,
                    props.fillRectArrtibutes.y,
                    props.fillRectArrtibutes.width,
                    props.fillRectArrtibutes.heigth
                )
                break;
            }

            default:
                break;
        }

    });

    board.registerCellDrawHook((props) => {
        if (props.isMouseOver && map[props.rowNum][props.colNum] === -400) {
            props.context.fillStyle = '#fadacc';
            const { x, y, width, heigth } = props.fillRectArrtibutes;
            props.context.fillRect(x, y, width, heigth);
        }
    });

    board.registerCellClick(async (props) => {

        if (!canShoot()) {
            return;
        }

        if (map[props.rowNum][props.colNum] === -400) {

            const shootResponse = await socket.shoot(props.rowNum, props.colNum);

            if (shootResponse.body?.status === 'OK') {

                if (shootResponse.body.isWin) {
                    credentials.setGame({ status: GAME_STATES.WIN });
                    router.applyRoute();
                }

                setCanShoot(!shootResponse.body.isHit + '');
                localStorage.setItem(CAN_SHOOT_LS_KEY, String(canShoot));
                if (!!shootResponse.body.isHit && turnStatus) {
                    turnStatus.innerText = 'Ваш ход';
                }
                else if (turnStatus) {
                    turnStatus.innerText = 'Ход противника';
                }

                map = shootResponse.body.opponentGrids;
            }
        }
    });

    loop.use(board.draw.bind(board));
    loop.start();
}

export default () => {

    const opponentCancvas = document.querySelector<HTMLCanvasElement>('#opponent');
    const myCanvas = document.querySelector<HTMLCanvasElement>('#me');

    if (!opponentCancvas) {
        throw new Error('No #opponenet');
    }

    if (!myCanvas) {
        throw new Error('No #me');
    }

    (async () => {
        const initGameResponse = await socket.getCurrnetGameStatus();

        if (initGameResponse.body?.status === 'OK') {
            if (initGameResponse.body.grids && initGameResponse.body.opponentGrids) {

                initializeMyBoard(
                    initGameResponse.body.grids,
                    myCanvas
                );

                initializeOpponentsBoard(
                    initGameResponse.body.opponentGrids,
                    opponentCancvas
                );
            }
        }
    })();


}
