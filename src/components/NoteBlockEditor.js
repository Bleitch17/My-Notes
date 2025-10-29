export class NoteBlockEditor {
    constructor() {
        this.content = '# My Note\n\nStart typing in **markdown**!\n\nPress **Esc** to preview.';
        
        this.element = this.createElement();
        
        this.attachEventListeners();
    }

    mount(container) {
        this.unmount();
        container.appendChild(this.element);

        // Force a reflow so the scrollHeight will have the correct value and the height will be updated properly.
        void this.element.offsetHeight;

        this.adjustHeightAndScroll();
        
        // When the textarea is added to the DOM, want to grab keyboard focus.
        this.element.focus();
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
                // Note - the Tab key doesn't generate an input event.
                keydownEvent.preventDefault();

                // Deciding here that the desired behavior when pressing tab with a text selection is:
                // 1. Remove all selected text. Effectively, only keep the text before and after the selection.
                // 2. Insert 4 (or however many) spaces at the start of the text selection.
                // 3. Move the cursor to the end of the four spaces.
                // This should be similar to what happens when you select text and press a normal key, like 'a'.
                const start = this.element.selectionStart;
                const end = this.element.selectionEnd;

                this.element.value = this.element.value.substring(0, start) + '    ' + this.element.value.substring(end);

                this.element.selectionStart = start + 4;
                this.element.selectionEnd = start + 4;
                
                this.content = this.element.value;

                this.adjustHeightAndScroll();
            }
        });
    }

    adjustHeightAndScroll() {
        const scrollBefore = window.scrollY;
        this.element.style.height = 'auto';
        this.element.style.height = this.element.scrollHeight + 'px';
        
        // TODO - Once Canvas is 2D, need to have the X coordinate here as well...?
        window.scrollTo(0, scrollBefore);
    }
}
