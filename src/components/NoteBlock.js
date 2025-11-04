import { NoteBlockEditor } from "./NoteBlockEditor";
import { NoteBlockViewer } from "./NoteBlockViewer";
import { ResizeHandle } from "./ResizeHandle";

export class NoteBlock {
    constructor() {
        this.minWidthPx = 50;
        this.initialWidthPx = 400;

        this.element = this.createElement();

        this.editor = new NoteBlockEditor();
        this.viewer = new NoteBlockViewer();

        this.resizeHandles = [ new ResizeHandle("right"), new ResizeHandle("left") ];

        this.x = 200;
        this.y = 100;

        this.isDragging = false;
        this.dragStartTimeoutId = undefined;
        this.dragStartTimeoutMs = 1000;
        this.dragLastX = 0;
        this.dragLastY = 0;

        this.mousemoveListener = this.doDrag.bind(this);
        this.mouseupListener = this.stopDrag.bind(this);

        this.attachEventListeners();
    }

    mount(container) {
        container.appendChild(this.element);
        this.editor.mount(this.element);

        for (const handle of this.resizeHandles) {
            handle.mount(this.element);
        }

        this.updatePosition();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'note-block';
        div.style.minWidth = this.minWidthPx + 'px';
        div.style.width = this.initialWidthPx + 'px';

        return div;
    }

    attachEventListeners() {
        this.element.addEventListener('editComplete', (editCompleteEvent) => {
            this.switchToViewMode(editCompleteEvent.detail.content);
        });

        this.element.addEventListener('mousedown', (mousedownEvent) => {
            // Note - can't use preventDefault() here because the editor wouldn't change the text selection.
            mousedownEvent.stopPropagation();

            this.dragLastX = mousedownEvent.clientX;
            this.dragLastY = mousedownEvent.clientY;

            document.addEventListener('mousemove', this.mousemoveListener);
            document.addEventListener('mouseup', this.mouseupListener);

            this.dragStartTimeoutId = setTimeout(() => {
                this.isDragging = true;
            }, this.dragStartTimeoutMs);
        });
        
        this.element.addEventListener('viewComplete', () => {
            this.switchToEditMode();
        });

        this.element.addEventListener('resize', (resizeEvent) => {
            const currentWidth = parseInt(this.element.style.width);

            // Note - resizeEvent.dx with respect to what the mouse is doing in the container firing the mousemove event.
            switch (resizeEvent.detail.handlePlacement) {
                case "right": {
                    this.element.style.width = Math.max(this.minWidthPx, currentWidth + resizeEvent.detail.dx) + 'px';
                    break;
                }
                case "left": {
                    // Resizing with the left handle is a little more complicated than resizing with the right handle.
                    // Need to update the NoteBlock's position, and also decrease the width by the same amount.
                    // However, if the NoteBlock would become smaller than the minimum width, must not do the resize.
                    const newX = this.x + resizeEvent.detail.dx;
                    const newWidth = currentWidth - resizeEvent.detail.dx;

                    if (newWidth < this.minWidthPx || newX < 0) {
                        return;
                    }

                    this.x = newX;
                    this.element.style.width = newWidth + 'px';
                    this.updatePosition();
                    break;
                }
                default: {
                    console.log(`ResizeHandle placement ${resizeEvent.detail.handlePlacement} not supported.`)
                }
            }

            // The editor needs to know to update its height, since its width will have changed.
            this.editor.adjustHeightAndScroll();
        });
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    switchToViewMode(content) {
        this.editor.unmount();
        
        this.viewer.updateContent(content);
        this.viewer.mount(this.element);
    }

    switchToEditMode() {
        this.viewer.unmount();
        this.editor.mount(this.element);
    }

    doDrag(mousemoveEvent) {
        if (!this.isDragging) {
            document.removeEventListener('mousemove', this.mousemoveListener);
            document.removeEventListener('mouseup', this.mouseupListener);

            clearTimeout(this.dragStartTimeoutId);
            return;
        }

        const mouseX = mousemoveEvent.clientX;
        const mouseY = mousemoveEvent.clientY;

        // TODO: Find a way to ensure that the NoteBlock can't be dragged out of its container.
        // Use getClientBoundingRect() together with visible window dimensions?
        const dx = mouseX - this.dragLastX;
        const dy = mouseY - this.dragLastY;

        this.dragLastX = mouseX;
        this.dragLastY = mouseY;

        this.x = this.x + dx;
        this.y = this.y + dy;

        this.updatePosition();
    }

    stopDrag() {
        document.removeEventListener('mousemove', this.mousemoveListener);
        document.removeEventListener('mouseup', this.mouseupListener);

        this.isDragging = false;
    }
}