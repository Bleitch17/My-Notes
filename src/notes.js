import { marked } from 'marked';

export function loadNotes() {
  const container = document.getElementById('notes-container');
  const div = document.createElement('div');
  div.className = 'note-block';
  div.innerHTML = marked('# Hello from Markdown');
  container.appendChild(div);
}
