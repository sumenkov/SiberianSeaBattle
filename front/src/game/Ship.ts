
import getSpriteBySegmentAmount from "../utils/getSpriteBySegmentAmount";

type PossibeSegmentAmount = 1 | 2 | 3;

interface ShipConstructorProps {
    initialX: number;
    initialY: number;
    numberOfSegments: PossibeSegmentAmount;
    canvas: HTMLCanvasElement;
    isStatic?: boolean;
}

export interface FullShipPostion {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ShipPositionOnBoard {
    x: number,
    y: number,
    cellOffeset: FullShipPostion
}

export enum DIRECTIONS {
    VERTICAL,
    HORIZONTAL
}

class Ship {

    public direction: DIRECTIONS = DIRECTIONS.VERTICAL

    public positionX: number;
    public positionY: number;

    public initialX: number;
    public initialY: number;

    public sidesPosition: FullShipPostion;

    public positionOnBoard: ShipPositionOnBoard[] = [];

    public numberOfSegments: PossibeSegmentAmount;
    public sprite: HTMLImageElement = document.createElement('img');

    public canvas: HTMLCanvasElement;

    public segmentSize = 100;
    public isDragging = false;

    public isStatic = false;

    public blockedCellsAround: { i: number; j: number }[] = [];

    constructor({
        initialX,
        initialY,
        numberOfSegments,
        canvas,
        isStatic
    }: ShipConstructorProps) {

        this.positionX = initialX;
        this.positionY = initialY;

        this.initialX = initialX;
        this.initialY = initialY;

        // Избежать тс-жалобу на инициализацию
        this.sidesPosition = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        }

        this.applyDimensions();

        this.numberOfSegments = numberOfSegments;
        this.canvas = canvas;
        this.sprite.src = getSpriteBySegmentAmount(numberOfSegments, this.direction);

        if (!isStatic) {
            canvas.addEventListener('mousedown', (e) => {
                const eventX = e.offsetX;
                const eventY = e.offsetY;
                if (this.isPointWithinTheShip(eventX, eventY)) {
                    this.isDragging = true;
                }
            });

            canvas.addEventListener('mouseup', () => {
                this.snapShipToBoardPostion();
                this.isDragging = false;
            });

            canvas.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    const { shipLengthY, shipLengthX } = this.getShipLehgthXY();
                    this.positionX = e.offsetX - shipLengthX / 2;
                    this.positionY = e.offsetY - shipLengthY / 2;
                    this.applyDimensions();
                    this.blockedCellsAround = [];
                }
            });

            canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const eventX = e.offsetX;
                const eventY = e.offsetY;
                if (this.isPointWithinTheShip(eventX, eventY)) {
                    //                     this.snapShipToBoardPostion();
                    this.blockedCellsAround = [];
                    this.positionOnBoard = [];
                    this.positionX = this.initialX;
                    this.positionY = this.initialY;
                    this.flipTheShip();
                }
            });
        }

    }

    snapShipToBoardPostion(props?: { boardOffset?: { x: number, y: number } }) {
        if (this.positionOnBoard.length < this.numberOfSegments) {
            this.positionOnBoard = [];
            this.positionX = this.initialX;
            this.positionY = this.initialY;
        }
        else if (this.positionOnBoard.length > 0) {
            const shiftX = props?.boardOffset?.x || 0;
            const shiftY = props?.boardOffset?.y || 0;
            const { cellOffeset } = this.positionOnBoard[0];
            this.positionY = shiftY + cellOffeset.top;
            this.positionX = shiftX + cellOffeset.left;

            const start = this.positionOnBoard[0];
            const finish = this.positionOnBoard[this.positionOnBoard.length - 1];

            const startArray = [
                {
                    i: start.x - 1,
                    j: start.y - 1
                },
                {
                    i: start.x - 1,
                    j: start.y - 0
                },
                {
                    i: start.x - 1,
                    j: start.y + 1
                },

                {
                    i: start.x,
                    j: start.y - 1
                },
                {
                    i: start.x,
                    j: start.y - 0
                },
                {
                    i: start.x,
                    j: start.y + 1
                },

                {
                    i: start.x + 1,
                    j: start.y - 1
                },
                {
                    i: start.x + 1,
                    j: start.y - 0
                },
                {
                    i: start.x + 1,
                    j: start.y + 1
                },
            ]

            const finishArray = [
                {
                    i: finish.x - 1,
                    j: finish.y - 1
                },
                {
                    i: finish.x - 1,
                    j: finish.y - 0
                },
                {
                    i: finish.x - 1,
                    j: finish.y + 1
                },

                {
                    i: finish.x,
                    j: finish.y - 1
                },
                {
                    i: finish.x,
                    j: finish.y - 0
                },
                {
                    i: finish.x,
                    j: finish.y + 1
                },

                {
                    i: finish.x + 1,
                    j: finish.y - 1
                },
                {
                    i: finish.x + 1,
                    j: finish.y - 0
                },
                {
                    i: finish.x + 1,
                    j: finish.y + 1
                },
            ]

            this.blockedCellsAround = [...startArray, ...finishArray];
        }

        this.applyDimensions();
    }

    applyBoardPosition(position: ShipPositionOnBoard) {
        if (this.positionOnBoard.length >= this.numberOfSegments) {
            this.positionOnBoard = [];
        }
        this.positionOnBoard = this.positionOnBoard.concat(position);
    }

    flipTheShip() {
        if (this.direction === DIRECTIONS.VERTICAL) {
            this.direction = DIRECTIONS.HORIZONTAL;
        }
        else {
            this.direction = DIRECTIONS.VERTICAL
        }
        this.sprite.src = getSpriteBySegmentAmount(this.numberOfSegments, this.direction);
        this.applyDimensions();
    }

    isPointWithinTheShip(x: number, y: number) {
        const { shipLengthY, shipLengthX } = this.getShipLehgthXY();
        return (
            x > this.positionX &&
            y > this.positionY &&
            x < this.positionX + shipLengthX &&
            y < this.positionY + shipLengthY
        )
    }

    getShipLehgthXY() {
        const shipLengthY = this.direction === DIRECTIONS.VERTICAL ? this.segmentSize * this.numberOfSegments : this.segmentSize;
        const shipLengthX = this.direction === DIRECTIONS.HORIZONTAL ? this.segmentSize * this.numberOfSegments : this.segmentSize;
        return {
            shipLengthX,
            shipLengthY
        }
    }

    applyDimensions() {
        const { shipLengthY, shipLengthX } = this.getShipLehgthXY();
        this.sidesPosition = {
            left: this.positionX,
            right: this.positionX + shipLengthX,
            top: this.positionY,
            bottom: this.positionY + shipLengthY
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const { shipLengthY, shipLengthX } = this.getShipLehgthXY();
        context.drawImage(
            this.sprite,
            this.positionX,
            this.positionY,
            shipLengthX,
            shipLengthY
        );
    }
}

export default Ship;

