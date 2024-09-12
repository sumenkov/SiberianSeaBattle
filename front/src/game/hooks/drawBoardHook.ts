
interface DrawBoardHookProps {
    displayPositionX: number,
    displayPositionY: number,
    activeX: number,
    activeY: number
    width: number,
    height: number
}

const board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
]

const BORDER_WIDTH = 1;

// const drawBoardHook: GameLoopUpdateHook = (
const drawBoardHook = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    {
        displayPositionX,
        displayPositionY,
        activeX,
        activeY,
        width,
        height
    }: DrawBoardHookProps,

) => {

    const cellHeight = height / 5;
    const cellWidth = width / 5;

    for (let i = 0; i < board.length; i++) {
        const row = board[i];

        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            const cellStartY = displayPositionY + (i * cellHeight);
            const cellStartX = displayPositionX + (j * cellWidth);

            context.fillStyle = '#000';
            context.fillRect(cellStartX, cellStartY, cellWidth, cellHeight);

            if (
                activeX > cellStartX &&
                activeY > cellStartY &&
                activeX < cellStartX + cellWidth &&
                activeY < cellStartY + cellHeight
            ) {
                context.fillStyle = 'magenta';
            } else {
                context.fillStyle = 'blue';
            }

            context.fillRect(
                cellStartX + BORDER_WIDTH,
                cellStartY + BORDER_WIDTH,
                cellWidth - (BORDER_WIDTH * 2),
                cellHeight - (BORDER_WIDTH * 2)
            );
        }

    }
}

export default drawBoardHook;

