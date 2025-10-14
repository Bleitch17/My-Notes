import { marked } from 'marked';
import { Component } from './Component.js';

export class NoteBlock extends Component {
    constructor() {
        super();
        this.content = '# My Note\n\nStart typing in **markdown**!\n\nPress **Esc** to preview.';
        this.isEditMode = true;
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

            editor.addEventListener('input', () => {
                this.content = editor.value;
                this.adjustHeightAndScroll(editor);
            });

            editor.addEventListener('keydown', (keydownEvent) => {
                if (keydownEvent.key === 'Escape') {
                    keydownEvent.preventDefault();
                    this.isEditMode = false;
                    this.render();
                    this.attachEventListeners();
                }

                if (keydownEvent.key === 'Tab') {
                    keydownEvent.preventDefault();

                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;

                    // Claude:
                    // 1. Insert tab character at cursor position.
                    // 2. Move cursor after the tab.
                    // 3. Update content and height.
                    editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 4;
                    this.content = editor.value;

                    this.adjustHeightAndScroll(editor);
                }
            });
            
            this.adjustHeightAndScroll(editor);
        } else {
            const preview = this.element.querySelector('.note-block__preview');

            // TODO - Adjust scroll such that going into edit mode keeps a "similar" scroll value
            // instead of scrolling the window to the top of the page...
            preview.addEventListener('dblclick', () => {
                this.isEditMode = true;
                this.render();
                this.attachEventListeners();
            });
        }
    }

    adjustHeightAndScroll(editor) {
        const scrollBefore = window.scrollY;
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
        window.scrollTo(0, scrollBefore);
    }
}