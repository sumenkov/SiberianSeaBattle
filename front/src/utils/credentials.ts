enum KEYS {
    USER_ID = '0',
    CNANEL_ID = '1',
    USERNAME = '2',
}

const credentials = {

    chanelId: null as string | null,
    userId: null as string | null,
    username: null as string | null,

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
        localStorage.setItem(KEYS.CNANEL_ID, chanelId);
        localStorage.setItem(KEYS.USER_ID, userId);
        localStorage.setItem(KEYS.USERNAME, username);

        this.userId = userId;
        this.chanelId = chanelId;
        this.username = username;
    },

    get current() {

        if (!this.userId) {
            this.userId = localStorage.getItem(KEYS.USER_ID);
        }

        if (!this.chanelId) {
            this.chanelId = localStorage.getItem(KEYS.CNANEL_ID);
        }

        if (!this.username) {
            this.username = localStorage.getItem(KEYS.USERNAME);
        }

        return {
            userId: this.userId,
            chanelId: this.chanelId,
            username: this.username
        }
    },

    clear() {
        this.username = null;
        this.userId = null;
        this.chanelId = null;
        localStorage.clear();
    }

}

export default credentials;

