import { CELL_SIZE, COLUMN_AMOUNT, ROW_AMOUNT } from "../GameValues"
import { FullShipPostion } from "../Ship";

interface DrawBoardHookProps {
    displayPositionX: number,
    displayPositionY: number,
    mouseX: number,
    mouseY: number,
    shipDraggingPositions?: FullShipPostion[]
}

const column: number[] = Array(COLUMN_AMOUNT).fill(0, 0);
const board: number[][] = Array(ROW_AMOUNT).fill(column, 0);

const BORDER_WIDTH = 1;
const HALF_CELL = CELL_SIZE / 2;

// const drawBoardHook: GameLoopUpdateHook = (
const drawBoardHook = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    {
        displayPositionX,
        displayPositionY,
        mouseX,
        mouseY,
        shipDraggingPositions
    }: DrawBoardHookProps,

) => {

    for (let i = 0; i < board.length; i++) {
        const row = board[i];

        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            const cellStartY = displayPositionY + (i * CELL_SIZE);
            const cellStartX = displayPositionX + (j * CELL_SIZE);

            context.fillStyle = '#000';
            context.fillRect(cellStartX, cellStartY, CELL_SIZE, CELL_SIZE);

            if (
                mouseX > cellStartX &&
                mouseY > cellStartY &&
                mouseX < cellStartX + CELL_SIZE &&
                mouseY < cellStartY + CELL_SIZE
            ) {
                context.fillStyle = 'magenta';
            }
            else {
                context.fillStyle = 'blue';
            }

            if (Array.isArray(shipDraggingPositions)) {

                const CELL_START_X_PLUS_HALF = cellStartX + HALF_CELL;
                const CELL_START_Y_PLUS_HALF = cellStartY + HALF_CELL;


                for (const dPos of shipDraggingPositions) {
                    if (
                        (
                            (
                                dPos.left > CELL_START_X_PLUS_HALF &&
                                dPos.left < CELL_START_X_PLUS_HALF
                            ) || (
                                dPos.right > CELL_START_X_PLUS_HALF &&
                                dPos.right < CELL_START_X_PLUS_HALF
                            ) ||
                            (
                                dPos.right > CELL_START_X_PLUS_HALF &&
                                dPos.left < CELL_START_X_PLUS_HALF
                            )
                        ) &&
                        (
                            (
                                dPos.top > CELL_START_Y_PLUS_HALF &&
                                dPos.top < CELL_START_Y_PLUS_HALF
                            ) ||
                            (
                                dPos.bottom > CELL_START_Y_PLUS_HALF &&
                                dPos.bottom < CELL_START_Y_PLUS_HALF
                            ) ||
                            (
                                dPos.top < CELL_START_Y_PLUS_HALF &&
                                dPos.bottom > CELL_START_Y_PLUS_HALF
                            )
                        )
                    ) {

                        context.fillStyle = 'red';
                    }
                }
            }

            context.fillRect(
                cellStartX + BORDER_WIDTH,
                cellStartY + BORDER_WIDTH,
                CELL_SIZE - (BORDER_WIDTH * 2),
                CELL_SIZE - (BORDER_WIDTH * 2)
            );

            // Показать координаты ячейки
            context.fillStyle = 'limegreen'
            context.fillText(
                `x: ${cellStartX}, ${cellStartX + CELL_SIZE}`,
                cellStartX + 10,
                cellStartY + HALF_CELL
            )
            context.fillText(
                `y: ${cellStartY}, ${cellStartY + CELL_SIZE}`,
                cellStartX + 10,
                cellStartY + 10 + HALF_CELL
            )
        }

    }
}

export default drawBoardHook;

