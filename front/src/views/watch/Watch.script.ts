import Board from "../../game/Board";
import GameLoop from "../../game/GameLoop";
import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import credentials from "../../utils/credentials";
import { hitSprite } from "../Game/Game.static";

export default () => {
    const firstPlayer = document.querySelector<HTMLCanvasElement>('#first_p');
    const secondPlayer = document.querySelector<HTMLCanvasElement>('#second_p');

    const fpName = document.querySelector<HTMLSpanElement>('#p1');
    const spName = document.querySelector<HTMLSpanElement>('#p2');

    if (!firstPlayer) {
        throw new Error('No #first_p');
    }

    if (!secondPlayer) {
        throw new Error('No #second_p');
    }

    if (!fpName) {
        throw new Error('No #p1');
    }

    if (!spName) {
        throw new Error('No #p2');
    }

    const sp = new URLSearchParams(window.location.search);
    const matchId = sp.get('id');

    if (!matchId) {
        alert('No game id');
        router.followURL('/hub');
        return;
    }

    credentials.setGame({ id: matchId });


    let mapOne = [
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400]
    ];

    let mapTwo = [
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400],
        [-400, -400, -400, -400, -400]
    ];

    const playerOneBoard = new Board({
        canvas: firstPlayer,
        position: {
            x: 0,
            y: 0
        }
    });

    const playerTwoBoard = new Board({
        canvas: secondPlayer,
        position: {
            x: 0,
            y: 0
        }
    });

    playerOneBoard.registerCellDrawHook((props) => {

        const { x, y, width, heigth } = props.fillRectArrtibutes;

        switch (mapOne[props.rowNum][props.colNum]) {
            case -400:
                props.context.fillStyle = 'gray';
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

    playerTwoBoard.registerCellDrawHook((props) => {

        const { x, y, width, heigth } = props.fillRectArrtibutes;

        switch (mapTwo[props.rowNum][props.colNum]) {
            case -400:
                props.context.fillStyle = 'gray';
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

    const firsPlayerLoop = new GameLoop(firstPlayer);
    const secondPlayerLoop = new GameLoop(secondPlayer);

    firsPlayerLoop.use(playerOneBoard.draw.bind(playerOneBoard));
    secondPlayerLoop.use(playerTwoBoard.draw.bind(playerTwoBoard));

    firsPlayerLoop.start();
    secondPlayerLoop.start();

    const interValId = setInterval(async () => {

        const observeResponse = await socket.observeGame();

        if (observeResponse.body?.status === 'OK') {
            if (observeResponse.body.playerOneGrids) {
                mapOne = observeResponse.body.playerOneGrids;
            }
            else if (observeResponse.body.playerTwoGrids) {
                mapTwo = observeResponse.body.playerTwoGrids
            }

            if (fpName.innerText !== observeResponse.body.playerOneName) {
                fpName.innerText = observeResponse.body.playerOneName;
            }

            if (spName.innerText !== observeResponse.body.playerTwoName) {
                spName.innerText = observeResponse.body.playerTwoName;
            }
        }

    }, 1000);

    //@ts-expect-error
    window.intervalIds.push(interValId);
}

