import router from "../../router";
import { GAME_STATES } from "./Game.static";
import GameShipPositioningLayout from "./GameShipPositioning.layout";
import LoadingLayout from "./Loading.layout";
import WaitingForOpponentToJoinTheGameLayout from "./WaitingForOpponentToJoinTheGame.layout";

let currentView: GAME_STATES = GAME_STATES.LOADING;

window.addEventListener('changeGameView', ((e: CustomEvent) => {

    if (typeof e.detail.type === "number") {
        currentView = e.detail.type;
        router.applyRoute();
    }

}) as EventListener);

export default () => {

    console.log('applied route',);
    //     console.log(currentView, GAME_STATES);

    switch (currentView) {
        case GAME_STATES.POSITIONING:
            // TODO - исправить то, что тут ниже!!!!!!!
            import('./ShipPositioning').then(module => module.default());
            return GameShipPositioningLayout;
        case GAME_STATES.PLAYING:
            return ':(';
        case GAME_STATES.LOADING:
            return 'ZAGRUZKA'
        case GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN:
            import('./WaitingForOpponentToJoinTheGame.script').then(module => module.default());
            return WaitingForOpponentToJoinTheGameLayout;
        default:
            return LoadingLayout;
    }
}
