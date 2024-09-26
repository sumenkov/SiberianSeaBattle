import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import { SetViewPositioningEvent } from "./Game.static";

export default () => {

    const sp = new URLSearchParams(window.location.search);
    const matchId = sp.get('id');

    if (!matchId) {
        alert('No game id');
        router.followURL('/hub');
        return;
    }

    (async () => {
        const joinTheGameRespone = await socket.joinTheGame(matchId);
        console.log(joinTheGameRespone);

        if (joinTheGameRespone.body?.status === 'OK') {
            window.dispatchEvent(SetViewPositioningEvent);
        }
        else {
            // Уже есть соперник - подключаемся как зритель
            alert(joinTheGameRespone.body?.errorDescription);
        }

    })();

}
