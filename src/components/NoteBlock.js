import { NoteBlockEditor } from "./NoteBlockEditor";
import { NoteBlockViewer } from "./NoteBlockViewer";

export class NoteBlock {
    constructor() {
        this.element = this.createElement();
        this.dragHandle = this.createDragHandle();

        this.editor = new NoteBlockEditor();
        this.viewer = new NoteBlockViewer();

        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        // TODO - Make this a constructor parameter, so NoteBlocks can be added at arbitrary locations?
        this.position = { x: 20, y: 20 };

        this.attachEventListeners();
    }

    mount(container) {
        container.appendChild(this.element);
        this.editor.mount(this.element);

        this.updatePosition();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'note-block';

        return div;
    }

    createDragHandle() {
        const handle = document.createElement('div');
        handle.className = 'note-block-drag-handle';
        handle.innerHTML = '::';
        handle.title = 'Drag to move';
        
        this.element.appendChild(handle);
        return handle;
    }

    attachEventListeners() {
        this.element.addEventListener('editComplete', (editCompleteEvent) => {
            this.switchToViewMode(editCompleteEvent.detail.content);
        });

        this.element.addEventListener('viewRequest', (viewRequestEvent) => {
            this.switchToEditMode(viewRequestEvent.detail.content);
        });

        // TODO - Figure out what this code from Claude is doing, and why these event listeners look different.
        // Is there a cleaner way to do this?
        this.dragHandle.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    }

    handleDragStart(mousedownEvent) {
        mousedownEvent.preventDefault();
        this.isDragging = true;
        this.element.classList.add('dragging');

        // TODO - What is a bounding client rectangle?
        const rect = this.element.getBoundingClientRect();
        this.dragOffset.x = mousedownEvent.clientX - rect.left;
        this.dragOffset.y = mousedownEvent.clientY - rect.top;
    }

    handleDragMove(mousemoveEvent) {
        if (!this.isDragging) return;
        
        mousemoveEvent.preventDefault();

        this.position.x = mousemoveEvent.clientX - this.dragOffset.x;
        this.position.y = mousemoveEvent.clientY - this.dragOffset.y;
        this.updatePosition();
    }

    handleDragEnd() {
        this.isDragging = false;
        this.element.classList.remove('dragging');
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    switchToViewMode(content) {
        this.editor.unmount();
        
        this.viewer.updateContent(content);
        this.viewer.mount(this.element);
    }

    switchToEditMode(content) {
        this.viewer.unmount();

        this.editor.updateContent(content);
        this.editor.mount(this.element);
    }
}