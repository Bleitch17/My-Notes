import { NoteBlockEditor } from "./NoteBlockEditor";
import { NoteBlockViewer } from "./NoteBlockViewer";

export class NoteBlock {
    constructor() {
        this.isEditMode = true;
        this.element = this.createElement();

        this.editor = new NoteBlockEditor();
        this.viewer = new NoteBlockViewer();

        this.attachEventListeners();
    }

    mount(container) {
        container.appendChild(this.element);

        if (this.isEditMode) {
            this.editor.mount(this.element);
        }
        else {
            this.viewer.mount(this.element);
        }
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'note-block';

        return div;
    }

    attachEventListeners() {
        // TODO - listeners for events from child components here...?
    }
}