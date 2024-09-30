import { GAME_STATES } from "../views/Game/Game.static";

export enum CREDENTIAL_KEYS {
    USER_ID = 'usr',
    CNANEL_ID = 'chan',
    USERNAME = 'un',
    CURRENT_GAME_ID = 'curGId',
    CURRENT_GAME_STATUS = 'curGS',
    CURRENT_CREATED_GAME_ID = 'creGId',
    CURRENR_GAME_VIEW = 'curGView'
}

const credentials = {

    chanelId: null as string | null,
    userId: null as string | null,
    username: null as string | null,
    currentGameId: null as string | null,
    currentCreatedGameId: null as string | null,
    currentGameStatus: null as GAME_STATES | null,

    save(
        {
            chanelId,
            userId,
            username
        }: {
            chanelId: string;
            userId: string;
            username: string;
        }
    ) {
        localStorage.setItem(CREDENTIAL_KEYS.CNANEL_ID, chanelId);
        localStorage.setItem(CREDENTIAL_KEYS.USER_ID, userId);
        localStorage.setItem(CREDENTIAL_KEYS.USERNAME, username);

        this.userId = userId;
        this.chanelId = chanelId;
        this.username = username;
    },

    get current() {

        if (!this.userId) {
            this.userId = localStorage.getItem(CREDENTIAL_KEYS.USER_ID);
        }

        if (!this.chanelId) {
            this.chanelId = localStorage.getItem(CREDENTIAL_KEYS.CNANEL_ID);
        }

        if (!this.username) {
            this.username = localStorage.getItem(CREDENTIAL_KEYS.USERNAME);
        }

        if (!this.currentGameId) {
            this.currentGameId = localStorage.getItem(CREDENTIAL_KEYS.CURRENT_GAME_ID);
        }

        if (typeof this.currentGameStatus !== 'number') {
            this.currentGameStatus = (
                parseInt(localStorage.getItem(CREDENTIAL_KEYS.CURRENT_GAME_STATUS) || '') || null
            ) as GAME_STATES | null;
        }

        if (!this.currentCreatedGameId) {
            this.currentCreatedGameId = localStorage.getItem(CREDENTIAL_KEYS.CURRENT_CREATED_GAME_ID);
        }

        return {
            userId: this.userId,
            chanelId: this.chanelId,
            username: this.username,
            currentGameId: this.currentGameId,
            currentGameStatus: this.currentGameStatus,
            currentCreatedGameId: this.currentCreatedGameId,
        }
    },

    setGame(
        {
            id,
            status,
            createdGameId
        }: {
            id?: string,
            status?: GAME_STATES,
            createdGameId?: string,
        }) {

        if (id) {
            this.currentGameId = id;
            localStorage.setItem(CREDENTIAL_KEYS.CURRENT_GAME_ID, id);
        }

        if (typeof status === 'number') {
            this.currentGameStatus = status;
            localStorage.setItem(CREDENTIAL_KEYS.CURRENT_GAME_STATUS, String(status));
        }

        if (createdGameId) {
            this.currentGameId = createdGameId;
            localStorage.setItem(CREDENTIAL_KEYS.CURRENT_CREATED_GAME_ID, createdGameId);
        }
    },

    clearGameStatus() {
        this.current.currentGameStatus = null;
        localStorage.removeItem(CREDENTIAL_KEYS.CURRENT_GAME_STATUS);
    },

    clearAllTmpGameData() {
        this.currentGameStatus = null;
        //         this.currentGameId = null;
        localStorage.removeItem(CREDENTIAL_KEYS.CURRENT_GAME_STATUS);
        //         localStorage.removeItem(CREDENTIAL_KEYS.CURRENT_CREATED_GAME_ID);
    },

    clear() {
        this.username = null;
        this.userId = null;
        this.chanelId = null;
        this.currentGameId = null;
        this.currentCreatedGameId = null;
        this.currentGameStatus = null;
        this.currentGameStatus = null;
        localStorage.clear();
    }

}

export default credentials;

