
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

class Ship {

    public positionX: number;
    public positionY: number;

    public gridPositionX: number | null = null;
    public gridPositionY: number | null = null;

    public numberOfSegments: PossibeSegmentAmount;
    public sprite: HTMLImageElement = document.createElement('img');

    public canvas: HTMLCanvasElement;

    public segmentWidth = 100;
    public isDragging = false;

    constructor({
        initialX,
        initialY,
        numberOfSegments,
        canvas,
    }: ShipConstructorProps) {

        this.positionX = initialX;
        this.positionY = initialY;

        this.numberOfSegments = numberOfSegments;
        this.canvas = canvas;
        this.sprite.src = getSpriteBySegmentAmount(numberOfSegments);

        canvas.addEventListener('mousedown', (e) => {

            const eventX = e.offsetX;
            const eventY = e.offsetY;

            if (
                eventX > this.positionX &&
                eventY > this.positionY &&
                eventX < this.positionX + (100 * numberOfSegments) &&
                eventY < this.positionY + (100 * numberOfSegments)
            ) {
                this.isDragging = true;
            }

        });

        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.positionX = e.offsetX - 50;
                this.positionY = e.offsetY - 50;
            }
        })

    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(
            this.sprite,
            this.positionX,
            this.positionY,
            100,
            100 * this.numberOfSegments
        );
    }
}

export default Ship;

