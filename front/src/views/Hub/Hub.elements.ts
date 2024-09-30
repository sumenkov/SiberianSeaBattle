import { SingleGame } from "../../StompSocket/websocket.types";

export enum GAME_TYPE {
    WAITING_FOR_OPPONENT = 'WAIT',
    ONGOING = 'IN_PROGRESS',
    FINISHED = 'COMPLETED'
}

interface GameElementProps extends SingleGame {
    type: GAME_TYPE
}

export const game = ({
    ownerName,
    opponentName,
    id,
    type,
    winnerName
}: GameElementProps) => {

    if (type === GAME_TYPE.FINISHED) {
        return (
            '<div class="game">' +
            '   <span style="border-right: 2px solid black;padding-right: 10px;">' +
            `       ${ownerName} vs ${opponentName}` +
            '   </span>' +
            '   <span>' +
            `       Победил ${winnerName}` +
            '   </span>' +
            '</div> '
        )
    }

    if (type === GAME_TYPE.WAITING_FOR_OPPONENT) {
        return (
            '<div class="game">' +
            `   <span class="game-title">${ownerName}</span>` +
            `   <button data-match="${id}" data-type="${type}" class="smaller" onclick="window.joinTheGame(event)">играть</button>` +
            '</div> '
        )
    }

    if (type === GAME_TYPE.ONGOING) {
        return (
            '<div class="game">' +
            '   <span>' +
            `       ${ownerName} vs ${opponentName}` +
            '   </span>' +
            `   <button data-match="${id}" data-type="${type}" onclick="window.joinTheGame(event)" class="smaller">смотреть</button>` +
            '</div> '
        )
    }

}
