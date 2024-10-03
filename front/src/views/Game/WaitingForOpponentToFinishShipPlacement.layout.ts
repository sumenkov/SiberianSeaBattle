import crab from '../../assets/crab.png.b64';
import pattern from '../../assets/pattern.png.b64'

export default (
    '<div class="bg">' +
    `    <img src="${pattern}" alt="">` +
    '</div>' +
    '<div class="wrapper" style="height: 100%;">' +
    '    <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 10px;">' +
    '        <div class="panel waiting-room">' +
    `            <img class="preloader-spinner" src="${crab}" alt="">` +
    '            <h1 style="text-align:center;">Оппонент еще не закончил расстановку флота. Пожалуйста, подождите.</h1>' +
    '        </div>' +
    '    </div>' +
    '</div>'
);
