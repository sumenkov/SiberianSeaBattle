import router from "../../router";
import { socket } from "../../StompSocket/websocket";
import { UserAuthResponse, TypedMessage } from "../../StompSocket/websocket.types";
import credentials from "../../utils/credentials";

enum ACTIONS {
    SIGN_UP = '0',
    SIGN_IN = '1'
}

export default () => {
    const usernameInput = document.querySelector<HTMLInputElement>('#username');
    const passwordInput = document.querySelector<HTMLInputElement>('#password');
    const form = document.querySelector<HTMLInputElement>('#login-form');
    const changeFormActionBtn = document.querySelector<HTMLButtonElement>('#change-form-action');
    const heading = document.querySelector<HTMLHeadingElement>('#title');
    const submitBtn = document.querySelector<HTMLButtonElement>('#submit');
    const errorSpan = document.querySelector<HTMLSpanElement>('#error-description');

    if (
        !usernameInput ||
        !passwordInput ||
        !changeFormActionBtn ||
        !heading ||
        !submitBtn ||
        !errorSpan ||
        !form
    ) {
        throw new Error('Not all required element avaliable');
    }

    const chanelId = window.crypto.randomUUID();
    let formAction: ACTIONS = ACTIONS.SIGN_IN;

    const applyFormAction = () => {
        if (formAction === ACTIONS.SIGN_IN) {
            heading.innerText = 'Вход';
            changeFormActionBtn.innerText = 'Я тут в первый раз!';
            submitBtn.innerText = 'Войти';
        }
        else if (formAction === ACTIONS.SIGN_UP) {
            heading.innerText = 'Придумайте имя и пароль';
            changeFormActionBtn.innerText = 'Хочу войти!';
            submitBtn.innerText = 'Создать морского бойца';
        }
        errorSpan.innerText = '';
    }

    changeFormActionBtn.addEventListener('click', () => {
        if (formAction === ACTIONS.SIGN_IN) {
            formAction = ACTIONS.SIGN_UP;
        }
        else if (formAction === ACTIONS.SIGN_UP) {
            formAction = ACTIONS.SIGN_IN;
        }
        applyFormAction();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        let response: TypedMessage<UserAuthResponse | null> | null = null;

        errorSpan.innerText = '';

        if (formAction === ACTIONS.SIGN_UP) {
            response = await socket.registerUser(username, password, chanelId);
        }
        else if (formAction === ACTIONS.SIGN_IN) {
            response = await socket.login(username, password, chanelId);
        }

        if (!response) {
            alert('Empty response');
            return;
        }

        if (response.body?.status === 'OK') {
            const { chanelId, userId } = response.body;

            if (chanelId && userId) {
                credentials.save({ chanelId, userId, username });
                router.followURL('/hub');
            }
        }
        else {
            errorSpan.innerText =
                response.body?.errorDescription ||
                'При запросе что-то пошло не по плану... Попробуйте еще раз позже.';
        }

    });
}

