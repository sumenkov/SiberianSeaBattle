import GameLoop from "./src/game/GameLoop";
import drawBoardHook from "./src/game/hooks/drawBoardHook";
import createCanvas from "./src/game/initializeCanvas";

let x = 0;
let y = 0;

const canvas = createCanvas({
    onMouseMove: (e) => {
        x = e.offsetX;
        y = e.offsetY;
    }
});

const loop = new GameLoop(canvas);
document.body.appendChild(canvas);

loop.use((context, canvas) => drawBoardHook(context, canvas, x, y));
loop.start();
