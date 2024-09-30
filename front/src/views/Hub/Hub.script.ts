import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import { MatchListResponse } from "../../StompSocket/websocket.types";
import credentials from "../../utils/credentials";
import { GAME_STATES } from "../Game/Game.static";
import { game, GAME_TYPE } from "./Hub.elements";

declare global {
    interface Window {
        joinTheGame: (e: MouseEvent) => void;
        timeoutIds: ReturnType<typeof setTimeout>[];
        intervalIds:ReturnType<typeof setInterval>[];
    }
}

window.joinTheGame = (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.dataset.type && target.dataset.match) {
        if (target.dataset.type === GAME_TYPE.WAITING_FOR_OPPONENT) {
            router.followURL('/game?id=' + target.dataset.match);
        }
        else {
            router.followURL('/watch?id=' + target.dataset.match);
        }
    }
}

export default () => {

    for (const interval of window.intervalIds) {
        clearInterval(interval);
    }

    for (const timeout of window.timeoutIds) {
        clearTimeout(timeout);
    }

    credentials.clearGameStatus();

    socket.subscribe<MatchListResponse>('/user/#chanelId/see-battle/matches/response', (message) => {

        if (message.body?.status === 'OK') {

            let waitingHtml = '';
            let ongoingHtml = '';
            let finishedHtml = '';

            //             console.log(message.body.matches)
            for (const match of message.body.matches) {

                if (match.matchStatus === GAME_TYPE.FINISHED) {
                    finishedHtml += game({ ...match, type: GAME_TYPE.FINISHED });
                }
                else if (match.matchStatus === GAME_TYPE.ONGOING) {
                    ongoingHtml += game({ ...match, type: GAME_TYPE.ONGOING });
                }
                else {
                    waitingHtml += game({ ...match, type: GAME_TYPE.WAITING_FOR_OPPONENT });
                }

            }

            // Чтобы не терять ссылки на контейнеры при смене роута 
            const waitingForSecondPlayerContainer = document.querySelector('#waiting-for-second-layer');
            const ongoingGamesContainer = document.querySelector('#ongoing-games');
            const finishedGamesContainer = document.querySelector('#game-history');

            if (!waitingForSecondPlayerContainer) {
                throw new Error('No #waiting-for-second-layer');
            }

            if (!ongoingGamesContainer) {
                throw new Error('No #ongoing-games');
            }

            if (!finishedGamesContainer) {
                throw new Error('No #game-history');
            }

            waitingForSecondPlayerContainer.innerHTML = waitingHtml;
            ongoingGamesContainer.innerHTML = ongoingHtml;
            finishedGamesContainer.innerHTML = finishedHtml;

        }
        else {
            alert(message.body?.errorDescription || 'Не по плану пошло (временный вариант)')
        }
    });

    const createNewGameBtn = document.querySelector<HTMLButtonElement>('#create-game');
    const createNewGame = async () => {
        const response = await socket.createGame();

        if (response.body?.status === 'OK' && response.body.matchId) {
            credentials.setGame({ createdGameId: response.body.matchId });
            router.followURL('/game?id=' + response.body.matchId);
        }
        else {
            alert(response.body?.errorDescription || 'Не получилось создать игру');
        }

    }

    const logOutBtn = document.querySelector<HTMLButtonElement>('#logout');

    if (logOutBtn) {
        logOutBtn.addEventListener('click', () => {
            credentials.clear();
            router.followURL('/login');
        });
    }
    else {
        throw new Error('No Logout button');
    }

    if (createNewGameBtn) {
        createNewGameBtn.addEventListener('click', createNewGame);
    }
    else {
        throw new Error('No New Game button');
    }

    socket.getGameList();
}
