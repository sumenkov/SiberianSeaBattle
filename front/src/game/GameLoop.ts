interface GameCostructor {
    canvas: HTMLCanvasElement;
}

export type GameLoopUpdateHook = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ...rest: any[]) => void;

class GameLoop {

    public FPS = 30;
    public REFRESH_INTERVAL = 1000 / 30;
    public context: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;
    public updateLoopHooks: GameLoopUpdateHook[];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.updateLoopHooks = [];

        const ctx = this.canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Cannot get 2d context of provided canvas');
        }

        this.context = ctx;
    }

    use(hook: GameLoopUpdateHook) {
        this.updateLoopHooks = this.updateLoopHooks.concat(hook);
    }

    start() {

        let pastUpdateTime = Date.now();

        const loop = () => {

            window.requestAnimationFrame(loop);

            const now = Date.now();
            const timePast = now - pastUpdateTime;

            if (timePast <= this.REFRESH_INTERVAL) {
                return;
            }

            pastUpdateTime = now;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const hook of this.updateLoopHooks) {
                hook(this.context, this.canvas);
            }

        }

        loop();
    }
}

export default GameLoop;

