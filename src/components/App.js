import { NoteBlock } from './NoteBlock.js';

export class App {
    constructor() {
        this.element = document.getElementById("app");
        this.noteBlock = new NoteBlock();
        this.noteBlock.mount(this.element);
    }
}
