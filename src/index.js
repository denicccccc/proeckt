import { nanoid } from 'nanoid';
import debounce from 'lodash.debounce';
import './styles.scss';

import bookmarkItem from './templates/bookmark-item.hbs';
import { save, load } from './utils/storage';

const form = document.querySelector('.bookmark-form');
const list = document.querySelector('.bookmark-list');
const searchInput = document.querySelector('.search-input');

const STORAGE_KEY = 'bookmarks';
let bookmarks = load(STORAGE_KEY);

renderList(bookmarks);


form.addEventListener('submit', event => {
  event.preventDefault();

  const { title, url } = event.target.elements;

  const newBookmark = {
    id: nanoid(),
    title: title.value.trim(),
    url: url.value.trim(),
  };

  bookmarks.push(newBookmark);
  save(STORAGE_KEY, bookmarks);

  renderList(bookmarks);
  form.reset();
});


list.addEventListener('click', event => {
  if (!event.target.classList.contains('delete-btn')) return;

  const li = event.target.closest('li');
  const id = li.dataset.id;

  bookmarks = bookmarks.filter(item => item.id !== id);
  save(STORAGE_KEY, bookmarks);

  renderList(bookmarks);
});


searchInput.addEventListener(
  'input',
  debounce(() => {
    const query = searchInput.value.toLowerCase();

    const filtered = bookmarks.filter(item =>
      item.title.toLowerCase().includes(query)
    );

    renderList(filtered);
  }, 300)
);


function renderList(items) {
  list.innerHTML = items.map(bookmarkItem).join('');
}