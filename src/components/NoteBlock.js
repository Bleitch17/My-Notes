import { marked } from 'marked';

export class NoteBlock {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.content = '# My Note\n\nStart typing in **markdown**!\n\nPress **Esc** to preview.';
        this.isEditMode = true;
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
        
        if (this.isEditMode) {
            const textarea = document.createElement('textarea');
            textarea.className = 'note-block-textarea';
            textarea.value = this.content;
            div.appendChild(textarea);

            // TODO - Why did Claude wrap this in a timeout?
            textarea.focus();
            textarea.setSelectionRange(this.content.length, this.content.length);
        } else {
            const preview = document.createElement('div');
            preview.className = 'note-block-preview';
            preview.innerHTML = marked.parse(this.content);
            div.appendChild(preview);
        }
        return div;
    }

    attachEventListeners() {
        if (this.isEditMode) {
            const textarea = this.element.querySelector('.note-block-textarea');

            textarea.addEventListener('input', (e) => {
                this.content = e.target.value;
                this.adjustTextareaHeight(textarea);
            });

            this.adjustTextareaHeight(textarea);

            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.isEditMode = false;
                    this.render();
                    this.attachEventListeners();
                }
            });
        } else {
            const preview = this.element.querySelector('.note-block-preview');

            preview.addEventListener('dblclick', () => {
                this.isEditMode = true;
                this.render();
                this.attachEventListeners();
            });
        }
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}