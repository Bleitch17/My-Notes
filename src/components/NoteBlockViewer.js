import { marked } from 'marked';

export class NoteBlockViewer {
    constructor() {
        this.content = '';
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
        const div = document.createElement('div');
        div.className = 'note-block-viewer';
        div.innerHTML = marked.parse(this.content);

        return div;
    }

    attachEventListeners() {
        this.element.addEventListener('dblclick', () => {
            // TODO - Send event to parent component with content?
        })
    }
}