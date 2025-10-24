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
        console.log(this.editor.getSize());
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

            const currentWidth = parseInt(this.element.style.width);
            const currentHeight = parseInt(this.element.style.height);

            console.log(`width=${this.element.style.width}, height=${this.element.style.height}`);
            console.log(`currentWidth=${currentWidth}, currentHeight=${currentHeight}`);

            this.element.style.width = Math.max(25, currentWidth + resizeEvent.detail.dx) + 'px';
            this.element.style.height = Math.max(25, currentHeight + resizeEvent.detail.dy) + 'px';
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

    switchToEditMode(content) {
        this.viewer.unmount();

        this.editor.updateContent(content);
        this.editor.mount(this.element);
    }
}