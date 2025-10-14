import { Component } from './Component.js';
import { NoteBlock } from './NoteBlock.js';

export class AppComponent extends Component {
    constructor() {
        super();
        this.element = document.getElementById("app");
        this.noteBlock = new NoteBlock();
        this.noteBlock.mount(this.element);
    }

    mount(container) {
        // Not implemented.
    }

    unmount() {
        // Not implemented.
    }
}
