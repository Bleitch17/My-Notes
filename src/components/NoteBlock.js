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

        this.resizeHandles = [ new ResizeHandle("e") ];

        // TODO - Make this a constructor parameter, so NoteBlocks can be added at arbitrary locations?
        this.position = { x: 100, y: 100 };
        this.updatePosition();

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

        this.element.addEventListener('viewComplete', (viewRequestEvent) => {
            this.switchToEditMode();
        });

        this.element.addEventListener('resize', (resizeEvent) => {
            const currentWidth = parseInt(this.element.style.width);
            this.element.style.width = Math.max(this.minWidthPx, currentWidth + resizeEvent.detail.dx) + 'px';

            // The editor needs to know to update its height, since its width will have changed.
            this.editor.adjustHeightAndScroll();
        });
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    updateSize(width, height) {
        this.element.style.width = width + 'px';
        this.element.style.height = height + 'px';
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