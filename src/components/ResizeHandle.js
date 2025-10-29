export class ResizeHandle {
    constructor(direction) {
        // TODO - Validate direction is one of "n", "ne", "e", "se", "s", "sw", "w", "nw"
        this.direction = direction;

        this.resizeLastX = 0;
        this.resizeLastY = 0;
        this.boundMousemoveListener = undefined;
        this.boundMouseupListener = undefined;

        this.element = this.createElement();
        
        this.attachEventListeners();
    }

    mount(container) {
        this.unmount();
        container.appendChild(this.element);
    }

    unmount() {
        this.element.remove();
    }

    createElement() {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${this.direction}`;

        return handle;
    }

    attachEventListeners() {
        this.element.addEventListener('mousedown', this.initResize.bind(this));
    }

    initResize(mousedownEvent) {
        mousedownEvent.preventDefault();
        mousedownEvent.stopPropagation();

        this.resizeLastX = mousedownEvent.clientX;
        this.resizeLastY = mousedownEvent.clientY;

        this.boundMousemoveListener = this.doResize.bind(this);
        this.boundMouseupListener = this.stopResize.bind(this);

        // TODO - replace with the container element of the NoteBlock, so that resizes don't happen when the mouse is dragged
        // over other elements off the canvas like the tool bar, navigation list, etc.
        document.addEventListener('mousemove', this.boundMousemoveListener);
        document.addEventListener('mouseup', this.boundMouseupListener);
    }

    doResize(mousemoveEvent) {
        const dx = mousemoveEvent.clientX - this.resizeLastX;
        const dy = mousemoveEvent.clientY - this.resizeLastY;

        this.resizeLastX = mousemoveEvent.clientX;
        this.resizeLastY = mousemoveEvent.clientY;

        const resizeEvent = new CustomEvent('resize', {
            detail: {
                dx: dx,
                dy: dy
            },
            bubbles: true
        });

        this.element.dispatchEvent(resizeEvent);
    }

    stopResize() {
        document.removeEventListener('mousemove', this.boundMousemoveListener);
        document.removeEventListener('mouseup', this.boundMouseupListener);

        this.boundMousemoveListener = undefined;
        this.boundMouseupListener = undefined;
    }
}
