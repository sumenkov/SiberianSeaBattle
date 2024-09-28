import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import credentials from "../../utils/credentials";
import { GAME_STATES, SetViewPositioningEvent, SetViewWaitingForOpponentToJoinEvent } from "./Game.static";

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

        console.log({
            currentGameId,
            currentCreatedGameId
        })

        if (!currentGameId && !currentCreatedGameId) {

            const joinTheGameRespone = await socket.joinTheGame(matchId);

            console.log({ joinTheGameRespone })

            if (joinTheGameRespone.body?.status === 'OK') {
                credentials.setGame({
                    status: GAME_STATES.POSITIONING,
                    id: matchId,
                });
                window.dispatchEvent(SetViewPositioningEvent);
                return;
            }
            else {
                // 
                //                 alert(joinTheGameRespone.body?.errorDescription || 'Игрок уже есть');
                //                 return;
            }
        }


        const gameStatusResponse = await socket.getCurrnetGameStatus();

        if (gameStatusResponse.body?.status === 'OK') {
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
                    console.log('СЕЙЧАС БУДЕТ НУЖНЫЙ ЛОГ')
                    console.log(currentGameStatus !== GAME_STATES.POSITIONING, currentGameStatus, GAME_STATES.POSITIONING)
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
                    break;
                case "IN_PROGRESS_WAIT_FLEET_OPPONENT":
                    break;
                case "START_GAME":
                    break;
                case "COMPLETED":
                    break;
            }
        }
        else {

            //             alert(gameStatusResponse.body?.errorDescription);
        }


        return;
        if (!currentGameStatus) {

            const joinTheGameRespone = await socket.joinTheGame(matchId);
            console.log(joinTheGameRespone);


        }
        else if (currentGameId) {
            const doRedirect = confirm(`Вы уже находитесь в другой игре. Нажмите "Ок" чтобы перейти к ней.`);
            if (doRedirect) {
                window.location.href =
                    window.location.protocol + '//' +
                    window.location.host +
                    '/game/?id=' + currentGameId;
            }
        }
    })();

}
