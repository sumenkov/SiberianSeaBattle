import { socket } from "../../StompSocket/websocket"
import { ResponseBase } from "../../StompSocket/websocket.types"
import { SetViewPositioningEvent } from "./Game.static";

export default () => {

    document.querySelector('#copy')?.addEventListener('click', () => {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {}
        document.body.removeChild(textArea);
    })

    const opponentHasConnectedSubscription = socket.subscribe<ResponseBase>(
        '/user/#chanelId/see-battle/join-game-owner/response',
        (message) => {
            if (message.body?.status === 'OK') {
                opponentHasConnectedSubscription?.unsubscribe();
                window.dispatchEvent(SetViewPositioningEvent);
            }
        }
    );

}
