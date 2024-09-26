import router from "../../router";
import { VIEWS } from "./Game.static";
import GameShipPositioningLayout from "./GameShipPositioning.layout";
import LoadingLayout from "./Loading.layout";

let currentView: VIEWS = VIEWS.LOADING;

window.addEventListener('changeGameView', ((e: CustomEvent) => {
    console.log(e.detail);

    if (typeof e.detail.type === "number") {
        currentView = e.detail.type;
        router.applyRoute();
    }
}) as EventListener);

export default () => {

    console.log('applied route');
    console.log(currentView, VIEWS);

    switch (currentView) {
        case VIEWS.POSITIONING:
            // TODO - исправить то, что тут ниже!!!!!!!
            import('./ShipPositioning').then(module => module.default())
            return GameShipPositioningLayout;
        case VIEWS.PLAYING:
            return ':(';
        default:
            return LoadingLayout;
    }
}
