import { s } from "vite/dist/node/types.d-aGj9QkWt";
import { CELL_SIZE, COLUMN_AMOUNT, ROW_AMOUNT } from "./GameValues";
import Ship, { FullShipPostion } from "./Ship";

interface DrawBoardHookProps {
    shipDraggingPositions?: FullShipPostion[]
}

interface BoardConstructor {
    position: {
        x: number
        y: number
    }
    canvas: HTMLCanvasElement
}

const column: number[] = Array(COLUMN_AMOUNT).fill(0, 0);
const board: number[][] = Array(ROW_AMOUNT).fill(column, 0);

const BORDER_WIDTH = 1;
const HALF_CELL = CELL_SIZE / 2;

class Board {

    public displayPositionX: number;
    public displayPositionY: number;

    public mouseX: number = 0;
    public mouseY: number = 0;

    public canvas: HTMLCanvasElement;

    public shipList: Ship[] = [];

    public shipPositionMap: number[][] = JSON.parse(JSON.stringify(board));

    constructor(props: BoardConstructor) {
        this.displayPositionX = props.position.x
        this.displayPositionY = props.position.y

        this.canvas = props.canvas;

        this.canvas.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e;
            this.mouseX = offsetX;
            this.mouseY = offsetY;
        })

    }


    addShip(ship: Ship) {
        this.shipList = this.shipList.concat(ship);
    }

    draw = (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
    ) => {

        for (let i = 0; i < board.length; i++) {
            const row = board[i];

            for (let j = 0; j < row.length; j++) {
                const cell = row[j];

                const cellStartY = this.displayPositionY + (i * CELL_SIZE);
                const cellStartX = this.displayPositionX + (j * CELL_SIZE);

                context.fillStyle = '#000';
                context.fillRect(cellStartX, cellStartY, CELL_SIZE, CELL_SIZE);

                if (
                    this.mouseX > cellStartX &&
                    this.mouseY > cellStartY &&
                    this.mouseX < cellStartX + CELL_SIZE &&
                    this.mouseY < cellStartY + CELL_SIZE
                ) {
                    context.fillStyle = 'magenta';
                }
                else {
                    context.fillStyle = 'blue';
                }

                const CELL_START_X_PLUS_HALF = cellStartX + HALF_CELL; const CELL_START_Y_PLUS_HALF = cellStartY + HALF_CELL;
                let cellMapReference = 0;

                for (const ship of this.shipList) {
                    const dPos = ship.sidesPosition;
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
                        ship.applyBoardPosition({
                            x: i,
                            y: j,
                            cellOffeset: {
                                left: cellStartX,
                                right: cellStartX + CELL_SIZE,
                                top: cellStartY,
                                bottom: cellStartY + CELL_SIZE
                            }
                        });

                        cellMapReference = ship.numberOfSegments;

                        context.fillStyle = 'red';
                    }
                }

                this.shipPositionMap[i][j] = cellMapReference;

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
}

export default Board;

