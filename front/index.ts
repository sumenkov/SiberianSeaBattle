import './reset.css';
import './style.css';

import LoginLayout from './src/views/Login/Login.layout';
import HubLayout from './src/views/Hub/Hub.layout';
import router from './src/router';
import credentials from './src/utils/credentials';
import { socket } from './src/StompSocket/websocket';
import GameMainLayout from './src/views/Game/GameMain.layout';
import BattleFieldLayout from './src/views/Game/BattleField.layout';

if (!window.crypto.randomUUID) {
    //@ts-ignore
    window.crypto.randomUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}

window.addEventListener('beforeunload', () => {
    credentials.clearGameStatus();
});

socket.createInstance('ws://cloud.novaris.ru:8080/ws');

router.init('#app');
router.registerRoute('/', '<h1>Privet route <a href="/board">link</a></h1>');
router.registerRoute('/login', LoginLayout, () => import('./src/views/Login/Login.script'));
router.registerRoute('/game', GameMainLayout, () => import('./src/views/Game/GameMain.script'));
router.registerRoute('/hub', HubLayout, () => import('./src/views/Hub/Hub.script'));
router.registerRoute('/battleTest', BattleFieldLayout, () => import('./src/views/Game/BattleField.sctipt'));

const knownPaths = ['/login', '/game', '/hub', '/battleTest'];

router.registerMiddleware((_path) => {

    const { userId, chanelId, username } = credentials.current;
    const isLoggedIn = userId && chanelId && username;

    console.log('middlewaere running');

    if (window.location.pathname !== '/login' && !isLoggedIn) {
        window.location.pathname = '/login';
        return;
    }

    if (isLoggedIn && !knownPaths.includes(_path)) {
        window.location.pathname = '/hub';
    }
});

const { userId, chanelId, username } = credentials.current;

router.applyRoute();

window.addEventListener('popstate', function () {
    //     router.followURL(window.location.href);
    router.applyRoute();
});

if (userId && chanelId) {
}
else {
}


