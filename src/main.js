import { NoteBlock } from './components/NoteBlock.js';

class App {
    constructor() {
        this.noteblock = new NoteBlock(document.getElementById('app'));
    }
}

new App();
