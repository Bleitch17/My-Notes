export class NoteBlockEditor {
    constructor() {
        this.content = '# My Note\n\nStart typing in **markdown**!\n\nPress **Esc** to preview.';
        
        this.element = this.createElement();
        
        this.attachEventListeners();
    }

    mount(container) {
        this.unmount();
        container.appendChild(this.element);

        this.adjustHeightAndScroll();
    }

    unmount() {
        this.element.remove();
    }

    createElement() {
        const textarea = document.createElement('textarea');
        textarea.className = 'note-block-editor';

        textarea.value = this.content;
        textarea.placeholder = 'Write your note in Markdown...';

        return textarea;
    }

    attachEventListeners() {
        this.element.addEventListener('input', () => {
            this.content = this.element.value;
            this.adjustHeightAndScroll();
        });

        this.element.addEventListener('keydown', (keydownEvent) => {
            if (keydownEvent.key === 'Escape') {
                const editCompleteEvent = new CustomEvent('editComplete', {
                    detail: { content: this.content },
                    bubbles: true
                });
                this.element.dispatchEvent(editCompleteEvent);
            }

            else if (keydownEvent.key === 'Tab') {
                keydownEvent.preventDefault();

                const start = this.element.selectionStart;
                const end = this.element.selectionEnd;

                // 1. Insert four space characters at cursor position.
                // 2. Move cursor after the four spaces.
                // 3. Update content and height.
                this.element.value = this.element.value.substring(0, start) + '    ' + this.element.value.substring(end);
                this.element.selectionStart = this.element.selectionEnd + 4;
                this.content = this.element.value;
            }

            this.adjustHeightAndScroll();
        });
    }

    adjustHeightAndScroll() {
        const scrollBefore = window.scrollY;
        this.element.style.height = 'auto';
        this.element.style.height = this.element.scrollHeight + 'px';
        
        // TODO - Once Canvas is 2D, need to have the X coordinate here as well...?
        window.scrollTo(0, scrollBefore);
    }

    updateContent(newContent) {
        this.content = newContent;
        this.element.value = newContent;

        this.adjustHeightAndScroll();
    }

    getSize() {
        return {
            width: parseInt(this.element.style.width),
            height: parseInt(this.element.style.height)
        }
    }
}