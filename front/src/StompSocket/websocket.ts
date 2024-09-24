import { Client, IMessage } from '@stomp/stompjs'
import { CreateGameResponse, TypedMessage, UserAuthResponse } from './websocket.types';
import credentials from '../utils/credentials';
import { GAME_TYPE } from '../views/Hub/Hub.elements';

const REPONSE_TIMEOUT = 10000;

class StompSocketClient {

    public instance: Client | null = null;
    public clientID: string = window.crypto.randomUUID();

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

            this.subscribe<CreateGameResponse | null>(
                '/user/#chanelId/see-battle/create-game/response',
                (message) => {
                    resolve(message);
                }
            );

            this.send('/see-battle/create-game/request', {
                sizeGrid: 5,
            }, { userId: true });

        })
    }

    registerUser(username: string, password: string): Promise<TypedMessage<UserAuthResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            this.instance.subscribe(
                `/user/${this.clientID}/see-battle/create-user/response`,
                (message) => {
                    resolve(this.parseCallbackData(message));
                }
            )

            this.instance.publish({
                destination: '/see-battle/create-user/request',
                body: this.prepareJSON({
                    username,
                    password,
                    chanelId: this.clientID
                })
            });
        });
    }

    login(username: string, password: string): Promise<TypedMessage<UserAuthResponse | null>> {
        return new Promise((resolve, reject) => {

            if (!this.instance) {
                return reject(new Error('No instance'))
            }

            this.instance.subscribe(
                `/user/${this.clientID}/see-battle/get-user/response`,
                (message) => {
                    resolve(this.parseCallbackData(message));
                }
            )

            this.instance.publish({
                destination: '/see-battle/get-user/request',
                body: this.prepareJSON({
                    username,
                    password,
                    chanelId: this.clientID
                })
            });
        });
    }

    getGameList(type: GAME_TYPE) {
        const { chanelId } = credentials.current;
        this.send('/see-battle/matches/request', {
            matchStatus: type,
            chanelId
        });
    }

    send(
        request: string,
        data: Record<string, any>,
        config?: {
            userId?: boolean;
            chanelId?: boolean;
            username?: boolean;
        }
    ) {

        if (!this.instance) {
            throw new Error('No instance');
        }

        if (config?.chanelId || config?.userId || config?.username) {
            const { chanelId, userId, username } = credentials.current;
            data = {
                ...data,
                ...chanelId && { chanelId },
                ...userId && { userId },
                ...username && { username }
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

    subscribe<T>(request: string, callback: (data: TypedMessage<T | null>) => void) {

        if (!this.instance) {
            throw new Error('No instance');
        }

        const { chanelId, userId } = credentials.current;

        if (!chanelId || !userId) {
            throw new Error('No credentials');
        }

        request = request.replace('#chanelId', chanelId).replace('#userId', userId);

        if (this.activeSubscriptions.includes(request)) {
            return;
        }

        this.activeSubscriptions = this.activeSubscriptions.concat(request);

        const subFn = () => {
            this.instance?.subscribe(
                request,
                (message) => {
                    callback(this.parseCallbackData(message));
                }
            )
        }

        if (!this.isConnected) {
            this.queue = this.queue.concat(subFn);
        }
        else {
            subFn();
        }
    }

}

export const socket = new StompSocketClient();
export default StompSocketClient;

