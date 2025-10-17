import { NoteBlockEditor } from "./NoteBlockEditor";
import { NoteBlockViewer } from "./NoteBlockViewer";

export class NoteBlock {
    constructor() {
        this.element = this.createElement();

        this.editor = new NoteBlockEditor();
        this.viewer = new NoteBlockViewer();

        this.attachEventListeners();
    }

    mount(container) {
        container.appendChild(this.element);
        this.editor.mount(this.element);
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