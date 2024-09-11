interface InitCanvasConfig {
    onMouseMove?: (e: MouseEvent) => void;
    onClick?: (e: MouseEvent) => void;
}

function createCanvas(config: InitCanvasConfig) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (typeof config.onMouseMove === 'function') {
        canvas.addEventListener('mousemove', config.onMouseMove);
    }

    if (typeof config.onClick === 'function') {
        canvas.addEventListener('click', config.onClick);
    }

    return canvas;
}

export default createCanvas;

