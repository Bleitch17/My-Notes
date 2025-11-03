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

        // TODO - Make this a constructor parameter, so NoteBlocks can be added at arbitrary locations?
        this.position = { x: 200, y: 100 };

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
                    const newX = this.position.x + resizeEvent.detail.dx;
                    const newWidth = currentWidth - resizeEvent.detail.dx;

                    if (newWidth < this.minWidthPx || newX < 0) {
                        return;
                    }

                    this.position.x = newX;
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
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
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
}