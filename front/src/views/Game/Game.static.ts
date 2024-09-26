export enum VIEWS {
    POSITIONING,
    PLAYING,
    LOADING
}

export const SetViewPositioningEvent = new CustomEvent('changeGameView', { detail: { type: VIEWS.POSITIONING } });
export const SetViewPlayingEvent = new CustomEvent('changeGameView', { detail: { type: VIEWS.PLAYING } });
export const SetViewLoadingEvent = new CustomEvent('changeGameView', { detail: { type: VIEWS.LOADING } });
