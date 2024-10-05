import hit from '../../assets/hit.png.b64';

export enum GAME_STATES {
    POSITIONING,
    PLAYING,
    LOADING,
    WAITING_FOR_OPPONENT_TO_JOIN,
    WAITING_FOR_OPPONENT_TO_SUBMIT_THEIR_BOARD,
    WIN,
    LOSE
}

export const SetViewWinEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.WIN } });
export const SetViewLoseEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.LOSE } });
export const SetViewPositioningEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.POSITIONING } });
export const SetViewPlayingEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.PLAYING } });
export const SetViewLoadingEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.LOADING } });
export const SetViewWaitingForOpponentToJoinEvent = new CustomEvent(
    'changeGameView',
    { detail: { type: GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN } }
);
export const SetViewWaitingForOpponentToSubmitTheirBoard = new CustomEvent(
    'changeGameView',
    { detail: { type: GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_THEIR_BOARD } }
);

export const hitSprite = new Image(100, 100);
hitSprite.src = hit;

export const reallyRandomGrids = [
    [
        [1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 3, 0, 2, 0],
        [0, 3, 0, 2, 0],
        [0, 3, 0, 0, 0],
    ],
    [
        [3, 3, 3, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 2, 2, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    [
        [2, 2, 0, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3],
        [0, 0, 0, 0, 3],
        [1, 0, 0, 0, 3],
    ],
    [
        [3, 0, 0, 0, 0],
        [3, 0, 0, 1, 0],
        [3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [2, 2, 0, 1, 0],
    ],
    [
        [2, 2, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 3, 3, 3, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
    ],
    [
        [2, 0, 0, 0, 0],
        [2, 0, 1, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 3, 3, 3],
        [0, 0, 0, 0, 0],
    ],
    [
        [1, 0, 1, 0, 3],
        [0, 0, 0, 0, 3],
        [0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0],
        [2, 2, 0, 0, 0],
    ],
    [
        [0, 3, 0, 0, 0],
        [0, 3, 0, 2, 0],
        [0, 3, 0, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
    ],
    [
        [0, 3, 3, 3, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 2, 2, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
]
