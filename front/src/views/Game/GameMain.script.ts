import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import credentials from "../../utils/credentials";
import {
    GAME_STATES,
    SetViewPlayingEvent,
    SetViewPositioningEvent,
    SetViewWaitingForOpponentToJoinEvent,
    SetViewWaitingForOpponentToSubmitTheirBoard
} from "./Game.static";

export default () => {

    const sp = new URLSearchParams(window.location.search);
    const matchId = sp.get('id');

    if (!matchId) {
        alert('No game id');
        router.followURL('/hub');
        return;
    }

    (async () => {

        const {
            currentGameStatus,
            currentGameId,
            currentCreatedGameId,
        } = credentials.current;

        if (!currentGameId && !currentCreatedGameId) {

            const joinTheGameRespone = await socket.joinTheGame(matchId);

            if (joinTheGameRespone.body?.status === 'OK') {
                credentials.setGame({
                    status: GAME_STATES.POSITIONING,
                    id: matchId,
                });
                window.dispatchEvent(SetViewPositioningEvent);
                return;
            }
        }

        const gameStatusResponse = await socket.getCurrnetGameStatus();

        if (gameStatusResponse.body?.status === 'OK') {
            if (gameStatusResponse.body.matchStatus !== 'START_GAME') {
                localStorage.removeItem('cs');
            }
            switch (gameStatusResponse.body.matchStatus) {
                case "WAIT":
                    if (
                        currentGameStatus !== GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN &&
                        matchId === currentCreatedGameId
                    ) {
                        credentials.setGame({
                            status: GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN,
                            id: matchId
                        });
                        window.dispatchEvent(SetViewWaitingForOpponentToJoinEvent);
                    }
                    break;
                case "IN_PROGRESS":
                    if (
                        currentGameStatus !== GAME_STATES.POSITIONING &&
                        matchId === currentGameId
                    ) {
                        credentials.setGame({
                            status: GAME_STATES.POSITIONING,
                            id: matchId,
                        });
                        window.dispatchEvent(SetViewPositioningEvent);
                    }
                    break;
                case "IN_PROGRESS_WAIT_FLEET_OWNER":
                    if (
                        currentGameStatus !== GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD &&
                        matchId === currentGameId
                        //                         currentGameId !== currentCreatedGameId
                    ) {

                        if (currentCreatedGameId === currentGameId) {
                            if (currentGameStatus !== GAME_STATES.POSITIONING) {
                                credentials.setGame({
                                    status: GAME_STATES.POSITIONING,
                                    id: matchId,
                                });
                                window.dispatchEvent(SetViewPositioningEvent);
                            }
                            return;
                        }

                        if (currentGameId !== currentCreatedGameId) {
                            credentials.setGame({
                                status: GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD,
                                id: matchId,
                            });
                            window.dispatchEvent(SetViewWaitingForOpponentToSubmitTheirBoard);

                        }
                        else {
                            credentials.setGame({
                                status: GAME_STATES.POSITIONING,
                                id: matchId,
                            });
                            window.dispatchEvent(SetViewPositioningEvent);
                        }
                    }
                    break;
                case "IN_PROGRESS_WAIT_FLEET_OPPONENT":
                    if (
                        currentGameStatus !== GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD &&
                        matchId === currentGameId
                        //                         currentGameId === currentCreatedGameId
                    ) {
                        if (currentCreatedGameId !== currentGameId) {
                            if (currentGameStatus !== GAME_STATES.POSITIONING) {
                                credentials.setGame({
                                    status: GAME_STATES.POSITIONING,
                                    id: matchId,
                                });
                                window.dispatchEvent(SetViewPositioningEvent);
                            }
                            return;
                        }

                        if (currentGameId === currentCreatedGameId) {
                            credentials.setGame({
                                status: GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD,
                                id: matchId,
                            });
                            window.dispatchEvent(SetViewWaitingForOpponentToSubmitTheirBoard);
                        }
                    }
                    break;
                case "START_GAME":
                    if (
                        matchId === currentGameId &&
                        currentGameStatus !== GAME_STATES.PLAYING
                    ) {
                        credentials.setGame({
                            status: GAME_STATES.PLAYING,
                            id: matchId,
                        });
                        window.dispatchEvent(SetViewPlayingEvent);
                    }
                    break;
                case "COMPLETED":
                    alert('Игра завершилась');
                    window.location.pathname = '/hub';
                    break;
            }
        }
        else {
            alert(gameStatusResponse.body?.errorDescription);
            window.location.pathname = '/hub';
        }

    })();
}
