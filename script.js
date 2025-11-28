const form = document.getElementById("bookmarkForm");
const search = document.getElementById("search");
const list = document.getElementById("list");

const templateSrc = document.getElementById("bookmark-template").innerHTML;
const template = Handlebars.compile(templateSrc);

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function render(items = bookmarks) {
  list.innerHTML = template(items);
}

function save() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = form.elements.title.value.trim();
  const url = form.elements.url.value.trim();

  const id = nanoid.nanoid();

  bookmarks.push({ id, title, url });
  save();
  render();

  form.reset();
});


list.addEventListener("click", e => {
  if (!e.target.classList.contains("delete")) return;

  const id = e.target.closest("li").dataset.id;

  bookmarks = bookmarks.filter(item => item.id !== id);
  save();
  render();
});


search.addEventListener("input", _.debounce(() => {
  const q = search.value.toLowerCase();

  const filtered = bookmarks.filter(item =>
    item.title.toLowerCase().includes(q)
  );

  render(filtered);
}, 300));

render();
