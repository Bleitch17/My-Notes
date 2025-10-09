import { marked } from 'marked';

export class NoteBlock {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.content = '# My Note\n\nStart typing in **markdown**!';
        this.render();
        this.attachEventListeners();
    }

    render() {
        if (this.element) {
            this.element.remove();
        }

        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'note-block';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'note-input';
        textarea.value = this.content;
        textarea.placeholder = 'Write your note in markdown...';

        const preview = document.createElement('div');
        preview.className = 'note-preview';
        preview.innerHTML = marked.parse(this.content);

        div.appendChild(textarea);
        div.appendChild(preview);

        return div;
    }

    attachEventListeners() {
        const textarea = this.element.querySelector('.note-input');
        const preview = this.element.querySelector('.note-preview');

        textarea.addEventListener('input', (inputEvent) => {
            console.log(inputEvent.target.value);
            this.content = inputEvent.target.value;
            preview.innerHTML = marked.parse(this.content);
        });
    }
}