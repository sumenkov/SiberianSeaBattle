import { Client, IMessage } from '@stomp/stompjs'
import { CreateGameResponse, GetGameStatusResponse, JoinGameResponse, SubmitBoardResponse, TypedMessage, UserAuthResponse } from './websocket.types';
import credentials from '../utils/credentials';
import { GAME_TYPE } from '../views/Hub/Hub.elements';
import { subscribe } from 'diagnostics_channel';

const REPONSE_TIMEOUT = 10000;

class StompSocketClient {

    public instance: Client | null = null;

    public isConnected = false;
    public queue: (() => void)[] = [];

    public activeSubscriptions: string[] = [];

    createInstance(url: string) {
        this.instance = new Client({
            brokerURL: url,
            onConnect: () => {
                this.isConnected = true;

                for (const queueCallback of this.queue) {
                    queueCallback();
                }

                this.queue = [];

                console.log('{ WS CONNECTED }')
            }
        });

        this.instance.activate();
    }

    parseCallbackData<T>(message: IMessage): TypedMessage<T | null> {
        let body: T | null = null
        try {
            body = JSON.parse(message.body)
        }
        catch { }

        return {
            ...message,
            body
        }
    }

    prepareJSON(data: Record<string, any>) {
        try {
            return JSON.stringify(data)
        }
        catch {
            return String(data);
        }
    }

    createGame(): Promise<TypedMessage<CreateGameResponse | null>> {
        return new Promise((resolve) => {

            const subscription = this.subscribe<CreateGameResponse | null>(
                '/user/#chanelId/see-battle/create-game/response',
                (message) => {
                    resolve(message);
                    subscription?.unsubscribe();
                }
            );

            this.send('/see-battle/create-game/request', {
                sizeGrid: 5,
            }, { userId: true });

        })
    }

    registerUser(
        username: string,
        password: string,
        chanelId: string
    ): Promise<TypedMessage<UserAuthResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            const subscription = this.instance.subscribe(
                `/user/${chanelId}/see-battle/create-user/response`,
                (message) => {
                    resolve(this.parseCallbackData(message));
                    subscription.unsubscribe();
                }
            )

            this.instance.publish({
                destination: '/see-battle/create-user/request',
                body: this.prepareJSON({
                    username,
                    password,
                    chanelId
                })
            });

        });
    }

    login(
        username: string,
        password: string,
        chanelId: string
    ): Promise<TypedMessage<UserAuthResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            const subscription = this.instance.subscribe(
                `/user/${chanelId}/see-battle/get-user/response`,
                (message) => {
                    resolve(this.parseCallbackData(message));
                    subscription.unsubscribe();
                }
            )

            this.instance.publish({
                destination: '/see-battle/get-user/request',
                body: this.prepareJSON({
                    username,
                    password,
                    chanelId
                })
            });

        });
    }

    getCurrnetGameStatus(): Promise<TypedMessage<GetGameStatusResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'));
            }

            const subscription = this.subscribe<GetGameStatusResponse | null>(
                '/user/#chanelId/see-battle/match/response',
                (message) => {
                    resolve(message);
                    subscription?.unsubscribe()
                }
            );

            this.send('/see-battle/match/request', {}, {
                userId: true
            });
            //             const subscription = this.subscribe<GetGameStatusResponse | null>(
            //                 '/user/#chanelId/see-battle/grids/response',
            //                 (message) => {
            //                     resolve(message);
            //                     subscription?.unsubscribe()
            //                 }
            //             );
            // 
            //             this.send('/see-battle/grids/request', {}, {
            //                 chanelId: true,
            //                 matchId: true
            //             });

            //             if (!this.instance) {
            //                 return reject(new Error('No instance'));
            //             }
            // 
            //             const subscription = this.subscribe<UserAuthResponse | null>(
            //                 '/user/#chanelId/see-battle/match/response',
            //                 (message) => {
            //                     resolve(message);
            //                     subscription?.unsubscribe();
            //                 }
            //             );
            // 
            //             this.send('/see-battle/match/request', {}, { userId: true });
            // 
        });
    }


    joinTheGame(matchId: string): Promise<TypedMessage<JoinGameResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            const subscription = this.subscribe<JoinGameResponse | null>(
                '/user/#chanelId/see-battle/join-game/response',
                (message) => {
                    resolve(message)
                    subscription?.unsubscribe();
                }
            );

            this.send('/see-battle/join-game/request', { matchId }, { userId: true });

        });
    }

    getGameList(type: GAME_TYPE) {
        const { chanelId } = credentials.current;
        this.send('/see-battle/matches/request', {
            matchStatus: type,
            chanelId
        });
    }

    submitBoard(board: number[][]): Promise<TypedMessage<SubmitBoardResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            const subscription = this.subscribe<SubmitBoardResponse | null>(
                '/user/#chanelId/see-battle/create-fleet/response',
                (message) => {
                    resolve(message)
                    subscription?.unsubscribe();
                }
            );

            this.send(
                '/see-battle/create-fleet/request',
                { grids: board },
                { userId: true, matchId: true }
            );

        });
    }

    send(
        request: string,
        data: Record<string, any>,
        config?: {
            userId?: boolean;
            chanelId?: boolean;
            username?: boolean;
            matchId?: boolean;
        }
    ) {

        if (!this.instance) {
            throw new Error('No instance');
        }

        if (
            config?.chanelId ||
            config?.userId ||
            config?.username ||
            config?.matchId
        ) {
            const { chanelId, userId, username, currentGameId } = credentials.current;
            data = {
                ...data,
                ...config.chanelId && { chanelId },
                ...config.userId && { userId },
                ...config.username && { username },
                ...config.matchId && { matchId: currentGameId },
            }
        }

        const subFn = () => {
            this.instance?.publish({
                destination: request,
                body: this.prepareJSON(data)
            });
        }

        if (!this.isConnected) {
            this.queue = this.queue.concat(subFn);
        }
        else {
            subFn();
        }

    }

    subscribe<T>(
        request: string,
        callback: (data: TypedMessage<T | null>) => void
    ) {

        if (!this.instance) {
            throw new Error('No instance');
        }

        const { chanelId, userId } = credentials.current;

        if (!chanelId || !userId) {
            throw new Error('No credentials');
        }

        request = request.replace('#chanelId', chanelId).replace('#userId', userId);

        //         if (this.activeSubscriptions.includes(request)) {
        //             return;
        //         }

        //         this.activeSubscriptions = this.activeSubscriptions.concat(request);

        const subFn = () => {
            return this.instance?.subscribe(
                request,
                (message) => {
                    callback(this.parseCallbackData(message));
                    //                     subscibtion?.unsubscribe();
                }
            )
        }

        if (!this.isConnected) {
            this.queue = this.queue.concat(subFn);
        }
        else {
            return subFn();
        }
    }

}

export const socket = new StompSocketClient();
export default StompSocketClient;

