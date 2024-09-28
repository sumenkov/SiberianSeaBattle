import { socket } from "../../StompSocket/websocket"
import { ResponseBase } from "../../StompSocket/websocket.types"
import { SetViewPositioningEvent } from "./Game.static";

export default () => {

    const opponentHasConnectedSubscription = socket.subscribe<ResponseBase>(
        '/user/#chanelId/see-battle/join-game-owner/response',
        (message) => {
            if (message.body?.status === 'OK') {
                console.log(message);
                opponentHasConnectedSubscription?.unsubscribe();
                window.dispatchEvent(SetViewPositioningEvent);
            }
        }
    );

}
