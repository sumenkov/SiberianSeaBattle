import { DIRECTIONS } from '../game/Ship';

import one_segmented from '../assets/ships/1-segment-ship.png.b64';
import two_segmented from '../assets/ships/2-segment-ship.png.b64';
import three_segmented from '../assets/ships/3-segment-ship.png.b64';

import v_two_segmented from '../assets/ships/2-segment-ship-v.png.b64';
import v_three_segmented from '../assets/ships/3-segment-ship-v.png.b64';

function getSpriteBySegmentAmount(segmentAmount: number, direction: DIRECTIONS) {

    if (direction === DIRECTIONS.VERTICAL) {

        switch (segmentAmount) {
            case 1: return one_segmented;
            case 2: return v_two_segmented;
            case 3: return v_three_segmented;
            default: return one_segmented;
        }
    }

    switch (segmentAmount) {
        case 1: return one_segmented;
        case 2: return two_segmented;
        case 3: return three_segmented;
        default: return one_segmented;
    }
}

export default getSpriteBySegmentAmount;

