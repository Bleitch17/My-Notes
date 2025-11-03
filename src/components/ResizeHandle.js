export class ResizeHandle {
    constructor(placement) {
        // TODO - Extend this component to more directions when needed.
        this.placement = placement;

        this.resizeLastX = 0;

        // Controls how far away the mouse needs to be before the resize action stops.
        // This is helpful for preventing resizes from continuing if the component containing
        // the ResizeHandle has reached a maximum or minimum width, and the mouse is still
        // held down and / or moving.
        this.resizeHandleActionWidthPx = 25;

        this.mousemoveListener = this.doResize.bind(this);
        this.mouseupListener = this.stopResize.bind(this);

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
        handle.className = `resize-handle ${this.placement}`;

        return handle;
    }

    attachEventListeners() {
        this.element.addEventListener('mousedown', this.initResize.bind(this));
    }

    initResize(mousedownEvent) {
        mousedownEvent.preventDefault();
        mousedownEvent.stopPropagation();

        this.resizeLastX = mousedownEvent.clientX;

        document.addEventListener('mousemove', this.mousemoveListener);
        document.addEventListener('mouseup', this.mouseupListener);
    }

    doResize(mousemoveEvent) {        
        // If the mouse is too far from the ResizeHandle, don't want to move it (that looks weird).
        const elementRect = this.element.getBoundingClientRect();
        const mouseX = mousemoveEvent.clientX;
        const mouseY = mousemoveEvent.clientY;

        if (mouseY < elementRect.top || mouseY > elementRect.bottom) {
            return;
        }

        if (mouseX < elementRect.left - this.resizeHandleActionWidthPx || mouseX > elementRect.right + this.resizeHandleActionWidthPx) {
            return;
        }

        const dx = mousemoveEvent.clientX - this.resizeLastX;

        this.resizeLastX = mousemoveEvent.clientX;

        const resizeEvent = new CustomEvent('resize', {
            detail: {
                dx: dx,
                handlePlacement: this.placement
            },
            bubbles: true
        });

        this.element.dispatchEvent(resizeEvent);
    }

    stopResize() {
        document.removeEventListener('mousemove', this.mousemoveListener);
        document.removeEventListener('mouseup', this.mouseupListener);
    }
}
