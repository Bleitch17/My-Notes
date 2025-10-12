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
        const noteBlock = document.createElement('div');
        noteBlock.className = 'note-block';

        if (this.isEditMode) {
            const editor = document.createElement('textarea');
            editor.className = 'note-block__editor';
            editor.value = this.content;
            editor.placeholder = 'Write your note in Markdown...';

            noteBlock.appendChild(editor);

            // Claude: Delay execution until after the current call stack completes, allowing the browser to fully render
            // before the cursor is manipulated. 
            setTimeout(() => {
                editor.focus();
                editor.setSelectionRange(this.content.length, this.content.length);
            }, 0);
        } else {
            const preview = document.createElement('div');
            preview.className = 'note-block__preview';
            preview.innerHTML = marked.parse(this.content);
            noteBlock.appendChild(preview);
        }

        return noteBlock;
    }

    attachEventListeners() {
        if (this.isEditMode) {
            const editor = this.element.querySelector('.note-block__editor');

            editor.addEventListener('input', (inputEvent) => {
                this.content = editor.value;
                this.adjustTextareaHeight(editor);
            });

            editor.addEventListener('keydown', (keydownEvent) => {
                if (keydownEvent.key === 'Escape') {
                    keydownEvent.preventDefault();
                    this.isEditMode = false;
                    this.render();
                    this.attachEventListeners();
                }
            });

            // Claude: setting initial height... TODO - figure out what this actually does.
            this.adjustTextareaHeight(editor);
        } else {
            const preview = this.element.querySelector('.note-block__preview');

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