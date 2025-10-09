export class NoteBlock {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.render();
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
        div.innerHTML = `
            <h2>Testing the Noteblock component.</h2>
        `;

        return div;
    }
}