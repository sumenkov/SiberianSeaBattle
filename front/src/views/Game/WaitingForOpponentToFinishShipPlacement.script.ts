import { socket } from "../../StompSocket/websocket";
import { GetGameStatusResponse } from "../../StompSocket/websocket.types";
import credentials from "../../utils/credentials";
import { GAME_STATES, SetViewPlayingEvent } from "./Game.static";

export default () => {
    const subscription = socket.subscribe<GetGameStatusResponse | null>(
        '/user/#chanelId/see-battle/match/response',
        (message) => {
            if (message.body?.status === 'OK' && message.body.matchStatus === 'START_GAME') {
                credentials.setGame({ status: GAME_STATES.PLAYING });
                window.dispatchEvent(SetViewPlayingEvent);
            }
            subscription?.unsubscribe();
        }
    );
}
