import { CELL_SIZE, COLUMN_AMOUNT, ROW_AMOUNT } from "./GameValues";
import Ship, { FullShipPostion } from "./Ship";

interface CellProps {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    size: number;
    borderWidth: number;
    isMouseOver: boolean;
    rowNum: number;
    colNum: number;
    cellDimensions: {
        top: number,
        bottom: number,
        left: number,
        right: number
    };
    fillRectArrtibutes: {
        x: number,
        y: number,
        width: number,
        heigth: number
    };
}

type CellHook = (props: CellProps) => void;

interface BoardConstructor {
    position: {
        x: number;
        y: number;
    };
    canvas: HTMLCanvasElement;
    higlightMouseOver?: boolean;
}

const column: number[] = Array(COLUMN_AMOUNT).fill(0, 0);
const board: number[][] = Array(ROW_AMOUNT).fill(column, 0);

const BORDER_WIDTH = 1;
const HALF_CELL = CELL_SIZE / 2;
const waterImage = new Image(CELL_SIZE, CELL_SIZE);
waterImage.src = '/src/assets/cellBG.png';

class Board {

    public displayPositionX: number;
    public displayPositionY: number;

    public mouseX: number = -1;
    public mouseY: number = -1;

    public canvas: HTMLCanvasElement;

    public shipList: Ship[] = [];

    public shipPositionMap: number[][] = JSON.parse(JSON.stringify(board));

    public higlightMouseOver: boolean = false;

    public cellDrawHookList: CellHook[] = [];
    public cellClickCallbackList: CellHook[] = [];

    public hoveredCell: CellProps | null = null;

    constructor(props: BoardConstructor) {
        this.displayPositionX = props.position.x
        this.displayPositionY = props.position.y

        this.canvas = props.canvas;

        this.canvas.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e;
            this.mouseX = offsetX;
            this.mouseY = offsetY;
        });

        this.canvas.addEventListener('click', () => {
            if (this.hoveredCell) {
                for (const callback of this.cellClickCallbackList) {
                    callback(this.hoveredCell);
                }
            }
        });

        this.canvas.addEventListener('mouseout', () => {
            this.mouseX = -1;
            this.mouseY = -1;
        });

        this.higlightMouseOver = !!props.higlightMouseOver;
    }

    registerCellDrawHook(hook: CellHook) {
        this.cellDrawHookList = this.cellDrawHookList.concat(hook);
    }

    registerCellClick(hook: CellHook) {
        this.cellClickCallbackList = this.cellClickCallbackList.concat(hook);
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

                let isMouseOver = false;
                let isWaterSprite = true;
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
                    isMouseOver = true;
                }

                context.fillStyle = '#0065ff';
                const CELL_START_X_PLUS_HALF = cellStartX + HALF_CELL;
                const CELL_START_Y_PLUS_HALF = cellStartY + HALF_CELL;
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

                        context.fillStyle = '#b0cfff';
                        if (this.shipList.find((s => s.blockedCellsAround.find((el) => el.j === j && el.i === i)))) {
                            if (!ship.positionOnBoard.find(p => p.y === j && p.x === i)) {
                                context.fillStyle = '#ff0334';
                            }
                            else {

                                cellMapReference = ship.numberOfSegments;
                            }
                        }
                        else {
                            ship.applyBoardPosition(
                                {
                                    x: i,
                                    y: j,
                                    cellOffeset: {
                                        left: cellStartX,
                                        right: cellStartX + CELL_SIZE,
                                        top: cellStartY,
                                        bottom: cellStartY + CELL_SIZE
                                    }
                                },
                            );

                            cellMapReference = ship.numberOfSegments;
                        }
                        isWaterSprite = false;
                    }
                }

                this.shipPositionMap[i][j] = cellMapReference;

                context.fillRect(
                    cellStartX + BORDER_WIDTH,
                    cellStartY + BORDER_WIDTH,
                    CELL_SIZE - (BORDER_WIDTH * 2),
                    CELL_SIZE - (BORDER_WIDTH * 2)
                );

                if (isWaterSprite) {
                    context.drawImage(
                        waterImage,
                        cellStartX + BORDER_WIDTH + 5,
                        cellStartY + BORDER_WIDTH + 5,
                        CELL_SIZE - (BORDER_WIDTH * 2) - 10,
                        CELL_SIZE - (BORDER_WIDTH * 2) - 10,
                    );
                }

                const hookData: CellProps = {
                    canvas,
                    context,
                    colNum: j,
                    rowNum: i,
                    isMouseOver,
                    x: cellStartX,
                    y: cellStartY,
                    size: CELL_SIZE,
                    borderWidth: BORDER_WIDTH,
                    cellDimensions: {
                        top: cellStartY,
                        bottom: cellStartY + CELL_SIZE,
                        left: cellStartX,
                        right: cellStartX,
                    },
                    fillRectArrtibutes: {
                        x: cellStartX + BORDER_WIDTH,
                        y: cellStartY + BORDER_WIDTH,
                        width: CELL_SIZE - (BORDER_WIDTH * 2),
                        heigth: CELL_SIZE - (BORDER_WIDTH * 2)
                    }
                }

                for (const hook of this.cellDrawHookList) {
                    hook(hookData);
                }

                if (isMouseOver) {
                    this.hoveredCell = hookData;
                }
            }

        }
    }
}

export default Board;

