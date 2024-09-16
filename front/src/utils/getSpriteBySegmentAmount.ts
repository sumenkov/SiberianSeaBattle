import oneSegmentedShip from '../assets/ships/1-segment-ship.png.b64';
import oneSegmentedShipVert from '../assets/ships/1-segment-ship-v.png.b64';

import twoSegmentedShip from '../assets/ships/2-segment-ship.png.b64';
import twoSegmentedShipVert from '../assets/ships/2-segment-ship-v.png.b64';

import { DIRECTIONS } from '../game/Ship';

function getSpriteBySegmentAmount(segmentAmount: number, direction: DIRECTIONS) {

    if (direction === DIRECTIONS.HORIZONTAL) {

        switch (segmentAmount) {
            case 1: return oneSegmentedShipVert;
            case 2: return twoSegmentedShipVert;
            default: return oneSegmentedShipVert;
        }
    }

    switch (segmentAmount) {
        case 1: return oneSegmentedShip;
        case 2: return twoSegmentedShip;
        default: return oneSegmentedShip;
    }
}

export default getSpriteBySegmentAmount;

