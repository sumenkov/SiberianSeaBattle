import credentials from "../../utils/credentials"

export default () => {
    const { currentCreatedGameId } = credentials.current;
    console.log(currentCreatedGameId)
    return (
        '<nav class="status-panel flex">' +
        '   <button id="create-game">Создать игру</button>' +
        '   <button id="logout">Выйти</button>' +
        '</nav>' +
        '<div class="flex hub-content">' +
        '   <div id="waiting-for-second-layer" class="panel game-list">' +
        '       <div></div>' +
        '   </div>' +
        '   <div id="ongoing-games" class="panel game-list">' +
        '       <div></div>' +
        '   </div>' +
        '   <div id="game-history" class="panel game-list">' +
        '       <div></div>' +
        '   </div>' +
        '</div>'
    )
}
