import { IMessage } from '@stomp/stompjs';

type status = 'OK' | 'ERROR';
type MatchStatus =
    'WAIT' |
    'IN_PROGRESS' |
    'IN_PROGRESS_WAIT_FLEET_OWNER' |
    'IN_PROGRESS_WAIT_FLEET_OPPONENT' |
    'START_GAME' |
    'COMPLETED';

export interface TypedMessage<T> extends Omit<IMessage, 'body'> {
    body: T
}

export interface ResponseBase {
    status: status;
    errorDescription: string | null;
}

export interface CreateGameResponse extends ResponseBase {
    matchId: string;
    userId: string;
}

export interface UserAuthResponse extends ResponseBase {
    userId: string;
    chanelId: string
}

export interface MatchListResponse extends ResponseBase {
    matches: SingleGame[];
}

export interface JoinGameResponse extends ResponseBase {
    userId: string;
    isStartGame: boolean;
}

export interface GetGameStatusResponse extends ResponseBase {
    matchStatus: MatchStatus;
}

export interface SubmitBoardResponse extends ResponseBase {
    errorGrids: number[][];
    isStartGame: boolean;
}

export interface SingleGame {
    id: string;
    sizeGrid: number;
    ownerName: string;
    opponentName: string | null;
    winnerName: string | null;
}

