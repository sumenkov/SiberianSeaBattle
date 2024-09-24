
// TODO:
// 1. Заменить чисорвые константы. Вынести их в отдельный файл.
// 2. Хранить направление кораблей.
// 3. Определять на какие клетки они смотрят когда их туда сюда таскаешь.
//

import getSpriteBySegmentAmount from "../utils/getSpriteBySegmentAmount";

type PossibeSegmentAmount = 1 | 2 | 3;

interface ShipConstructorProps {
    initialX: number;
    initialY: number;
    numberOfSegments: PossibeSegmentAmount;
    canvas: HTMLCanvasElement;
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


    constructor({
        initialX,
        initialY,
        numberOfSegments,
        canvas,
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

        canvas.addEventListener('mousedown', (e) => {
            const eventX = e.offsetX;
            const eventY = e.offsetY;
            if (this.isPointWithinTheShip(eventX, eventY)) {
                this.isDragging = true;
            }
        });

        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            if (this.positionOnBoard.length < numberOfSegments) {
                this.positionOnBoard = [];
                this.positionX = this.initialX;
                this.positionY = this.initialY;
            }
            else if (this.positionOnBoard.length > 0) {
                const { cellOffeset } = this.positionOnBoard[0];
                this.positionY = cellOffeset.top;
                this.positionX = cellOffeset.left;
            }
            this.applyDimensions();
        });

        canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const { shipLengthY, shipLengthX } = this.getShipLehgthXY();
                this.positionX = e.offsetX - shipLengthX / 2;
                this.positionY = e.offsetY - shipLengthY / 2;
                this.applyDimensions();
            }
        });

        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const eventX = e.offsetX;
            const eventY = e.offsetY;
            if (this.isPointWithinTheShip(eventX, eventY)) {
                this.flipTheShip();
            }
        });
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
        //  console.log(this.gridPositionX, this.gridPositionY);
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

