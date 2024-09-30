import router from "../../router";
import BattleFieldLayout from "./BattleField.layout";
import { GAME_STATES } from "./Game.static";
import GameShipPositioningLayout from "./GameShipPositioning.layout";
import LoadingLayout from "./Loading.layout";
import LoseLayout from "./Lose.layout";
import WaitingForOpponentToFinishShipPlacementLayout from "./WaitingForOpponentToFinishShipPlacement.layout";
import WaitingForOpponentToJoinTheGameLayout from "./WaitingForOpponentToJoinTheGame.layout";
import WinLayout from "./Win.layout";

let currentView: GAME_STATES = GAME_STATES.LOADING;

window.addEventListener('changeGameView', ((e: CustomEvent) => {

    if (typeof e.detail.type === "number") {
        currentView = e.detail.type;
        router.applyRoute();
    }

}) as EventListener);

export default () => {

    switch (currentView) {
        case GAME_STATES.POSITIONING:
            // TODO - исправить то, что тут ниже!!!!!!!
            import('./ShipPositioning').then(module => module.default());
            return GameShipPositioningLayout;
        case GAME_STATES.PLAYING:
            import('./BattleField.sctipt').then(module => module.default());
            return BattleFieldLayout;
        case GAME_STATES.LOADING:
            return LoadingLayout;
        case GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN:
            import('./WaitingForOpponentToJoinTheGame.script').then(module => module.default());
            return WaitingForOpponentToJoinTheGameLayout;
        case GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD:
            return WaitingForOpponentToFinishShipPlacementLayout;
        case GAME_STATES.WIN:
            return WinLayout;
        case GAME_STATES.LOSE:
            return LoseLayout;
        default:
            return LoadingLayout;
    }
}
