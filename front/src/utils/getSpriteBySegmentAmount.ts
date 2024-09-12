import oneSegmentedShip from '../assets/ships/1-segment-ship.png.b64';
import twoSegmentedShip from '../assets/ships/2-segment-ship.png.b64';

function getSpriteBySegmentAmount(segmentAmount: number) {
    switch (segmentAmount) {
        case 1: return oneSegmentedShip;
        case 2: return twoSegmentedShip;
        default: return oneSegmentedShip;
    }
}

export default getSpriteBySegmentAmount;

