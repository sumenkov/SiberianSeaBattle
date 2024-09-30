export default (
    '<nav class="status-panel flex">' +
    `   <button onclick="window.location.pathname='/hub';">Прекратить просмотр</button>` +
    '</nav>' +
    '<div class="game-view">' +
    '   <div class="game-info">' +
    '       <span id="p1">Игрок 1</span>' +
    '       <span>vs</span>' +
    '       <span id="p2">Игрок 2</span>' +
    '   </div>' +
    '   <div class="double-canvas">' +
    '       <canvas width="500" height="500" id="first_p"></canvas>' +
    '       <canvas width="500" height="500" id="second_p"></canvas>' +
    '   </div>' +
    '</div>'
)
