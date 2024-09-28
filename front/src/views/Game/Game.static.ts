export enum GAME_STATES {
    POSITIONING,
    PLAYING,
    LOADING,
    WAITING_FOR_OPPONENT_TO_JOIN,
    WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD,
}

export const SetViewPositioningEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.POSITIONING } });
export const SetViewPlayingEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.PLAYING } });
export const SetViewLoadingEvent = new CustomEvent('changeGameView', { detail: { type: GAME_STATES.LOADING } });
export const SetViewWaitingForOpponentToJoinEvent = new CustomEvent(
    'changeGameView',
    { detail: { type: GAME_STATES.WAITING_FOR_OPPONENT_TO_JOIN } }
);
export const SetViewWaitingForOpponentToSubmitTheirBoard = new CustomEvent(
    'changeGameView',
    { detail: { type: GAME_STATES.WAITING_FOR_OPPONENT_TO_SUBMIT_TEIR_BOARD } }
);
