import { NoteBlockEditor } from "./NoteBlockEditor";
import { NoteBlockViewer } from "./NoteBlockViewer";
import { ResizeHandle } from "./ResizeHandle";

export class NoteBlock {
    constructor() {
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

        return div;
    }

    attachEventListeners() {
        this.element.addEventListener('editComplete', (editCompleteEvent) => {
            this.switchToViewMode(editCompleteEvent.detail.content);
        });

        this.element.addEventListener('viewRequest', (viewRequestEvent) => {
            this.switchToEditMode(viewRequestEvent.detail.content);
        });

        this.element.addEventListener('resize', (resizeEvent) => {
            console.log(`dx=${resizeEvent.detail.dx}, dy=${resizeEvent.detail.dy}`);
            this.element.style.width = Math.max(25, this.element.style.width + resizeEvent.detail.dx);
            this.element.style.height = Math.max(25, this.element.style.height + resizeEvent.detail.dx);
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

    switchToEditMode(content) {
        this.viewer.unmount();

        this.editor.updateContent(content);
        this.editor.mount(this.element);
    }
}