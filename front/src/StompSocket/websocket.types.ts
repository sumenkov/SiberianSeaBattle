import { IMessage } from '@stomp/stompjs';

type status = 'OK' | 'ERROR';

export interface TypedMessage<T> extends Omit<IMessage, 'body'> {
    body: T
}

interface ResponseBase {
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

export interface MatchListReponse extends ResponseBase {
    matches: SingleGame[];
}

export interface JoinGameResponse extends ResponseBase {
    userId: string;
    isStartGame: boolean;
}

export interface SingleGame {
    id: string;
    sizeGrid: number;
    ownerName: string;
    opponentName: string | null;
    winnerName: string | null;
}

