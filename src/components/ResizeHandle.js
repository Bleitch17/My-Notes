export class ResizeHandle {
    constructor(placement) {
        // TODO - validate that placement is one of the following:
        // left, right, up, down
        // topleft, topright, bottomleft, bottomright.
        this.placement = placement;

        this.resizeLastX = 0;
        this.resizeLastY = 0;

        // Tells the resize handle to stop moving past a certain point.
        this.xLowerBound = -1;
        this.xUpperBound = -1;

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
        handle.className = `resize-handle ${this.placement}`;

        return handle;
    }

    attachEventListeners() {
        this.element.addEventListener('mousedown', this.initResize.bind(this));
    }

    initResize(mousedownEvent) {
        mousedownEvent.preventDefault();
        mousedownEvent.stopPropagation();

        // TODO - Set based on placement?
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
        if ( mousemoveEvent.clientX < this.xLowerBound )
        {
            return;
        }

        // TODO - set based on placement?
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
        document.removeEventListener('mousemove', this.boundMousemoveListener);
        document.removeEventListener('mouseup', this.boundMouseupListener);

        this.boundMousemoveListener = undefined;
        this.boundMouseupListener = undefined;
    }

    setLowerBound() {
        this.xLowerBound = this.resizeLastX;
    }
}
