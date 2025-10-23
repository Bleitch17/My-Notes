export class ResizeHandle {
    constructor(direction) {
        // TODO - Validate direction is one of "n", "ne", "e", "se", "s", "sw", "w", "nw"
        this.direction = direction;

        this.resizeStartX = 0;
        this.resizeStartY = 0;

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
        this.element.addEventListener('mousedown', this.initResize);
    }

    initResize = (mousedownEvent) => {
        mousedownEvent.preventDefault();
        mousedownEvent.stopPropagation();

        this.resizeStartX = mousedownEvent.clientX;
        this.resizeStartY = mousedownEvent.clientY;

        document.addEventListener('mousemove', this.doResize);
        document.addEventListener('mouseup', this.stopResize);
    }

    doResize = (mousemoveEvent) => {
        const dx = mousemoveEvent.clientX - this.resizeStartX;
        const dy = mousemoveEvent.clientY - this.resizeStartY;

        // TODO - Send to container.
        console.log(`dx=${dx}, dy=${dy}`);
    }

    stopResize = () => {
        document.removeEventListener('mousemove', this.doResize);
        document.removeEventListener('mouseup', this.stopResize);
    }
}
