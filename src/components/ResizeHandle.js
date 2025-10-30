export class ResizeHandle {
    constructor(placement) {
        // TODO - validate that placement is one of the following:
        // left, right, up, down, topleft, topright, bottomleft, bottomright.
        this.placement = placement;

        this.resizeLastX = 0;
        this.resizeLastY = 0;

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

        // TODO - Set based on placement, e.g.: Not concerned about y coord when resize handles are moving left <-> right, etc.
        this.resizeLastX = mousedownEvent.clientX;
        this.resizeLastY = mousedownEvent.clientY;

        document.addEventListener('mousemove', this.mousemoveListener);
        document.addEventListener('mouseup', this.mouseupListener);
    }

    doResize(mousemoveEvent) {        
        // If the mouse is too far from the ResizeHandle, don't want to move it (that looks weird).
        const elementRect = this.element.getBoundingClientRect();
        const mouseX = mousemoveEvent.clientX;
        const mouseY = mousemoveEvent.clientY;

        // TODO - Relax assumption that ResizeHandle is horizontal.
        if (mouseY < elementRect.top || mouseY > elementRect.bottom) {
            return;
        }

        if (mouseX < elementRect.left - 25 || mouseX > elementRect.right + 25) {
            return;
        }

        // TODO - Set based on placement, e.g.: Not concerned about y coord when resize handles are moving left <-> right, etc.
        const dx = mousemoveEvent.clientX - this.resizeLastX;
        const dy = mousemoveEvent.clientY - this.resizeLastY;

        this.resizeLastX = mousemoveEvent.clientX;
        this.resizeLastY = mousemoveEvent.clientY;

        const resizeEvent = new CustomEvent('resize', {
            detail: {
                dx: dx,
                dy: dy,
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
