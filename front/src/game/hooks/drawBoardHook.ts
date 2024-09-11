import { GameLoopUpdateHook } from "../GameLoop";

const board = [
    ['a1', 'a2', 'a3', 'a4', 'a5'],
    ['b1', 'b2', 'b3', 'b4', 'b5'],
    ['c1', 'c2', 'c3', 'c4', 'c5'],
    ['d1', 'd2', 'd3', 'd4', 'd5'],
    ['e1', 'e2', 'e3', 'e4', 'e5'],
    ['f1', 'f2', 'f3', 'f4', 'f5'],
]

const drawBoardHook: GameLoopUpdateHook = (
    context,
    canvas,
    activeX: number,
    activeY: number
) => {
    const { width, height } = canvas;
    const cellHeight = height / 5;
    const cellWidth = width / 5;

    //     context.strokeStyle = 'red';
    context.fillStyle = 'darkblue';

    for (let i = 0; i < board.length; i++) {
        const row = board[i];

        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            const cellStartY = i * cellHeight;
            const cellStartX = j * cellWidth;

            if (
                activeX > cellStartX &&
                activeY > cellStartY &&
                activeX < cellStartX + cellWidth &&
                activeY < cellStartY + cellHeight
            ) {
                context.fillStyle = 'magenta';
            } else {
                context.fillStyle = 'darkblue';
            }

            context.fillRect(cellStartX, cellStartY, cellWidth, cellHeight);
            context.stroke();
        }

    }
}

export default drawBoardHook;

