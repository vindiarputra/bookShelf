let books = [];
if (localStorage.getItem("books")) {
  books = JSON.parse(localStorage.getItem("books"));
  renderBooks();
}

let currentEdit = null;

document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (currentEdit) {
    updateBook(currentEdit);
  } else {
    addBook();
  }
});

document.getElementById("searchInput").addEventListener("input", function (e) {
  renderBooks(e.target.value);
});

function editBook(id) {
  currentEdit = id;
  const book = books.find((book) => book.id === id);
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("year").value = book.year;
  document.getElementById("isComplete").checked = book.isComplete;
  document.getElementById("editMessage").style.display = "block"; // Show the message
}

function updateBook(id) {
  const book = books.find((book) => book.id === id);
  book.title = document.getElementById("title").value;
  book.author = document.getElementById("author").value;
  book.year = document.getElementById("year").value;
  book.isComplete = document.getElementById("isComplete").checked;
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
  clearForm();
  currentEdit = null;
  document.getElementById("editMessage").style.display = "none"; // Hide the message
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = Number(document.getElementById("year").value);

  // Tambahkan validasi untuk memastikan bahwa semua field telah diisi
  if (!title || !author || !year) {
    return;
  }

  const isComplete = document.getElementById("isComplete").checked;
  const book = { id: Date.now(), title, author, year, isComplete };
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
  clearForm();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isComplete").checked = false;
}

function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

function moveBook(id) {
  const book = books.find((book) => book.id === id);
  book.isComplete = !book.isComplete;
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

function renderBooks(search = "") {
  const incompleteBookshelf = document.getElementById("incompleteBookshelf");
  const completeBookshelf = document.getElementById("completeBookshelf");
  incompleteBookshelf.innerHTML = "<h2>Belum selesai dibaca</h2>";
  completeBookshelf.innerHTML = "<h2>Selesai dibaca</h2>";
  books
    .filter((book) => book.title.includes(search))
    .forEach((book) => {
      if (book.title && book.author && book.year) {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-card");
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}, ${book.year}</p>
            <button id="deleteBook" onclick="deleteBook(${book.id})">Hapus</button>
            <button id="moveBook" onclick="moveBook(${book.id})">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
            <button id="editBook"  onclick="editBook(${book.id})">Edit</button> 
            `;
        if (book.isComplete) {
          completeBookshelf.appendChild(bookElement);
        } else {
          incompleteBookshelf.appendChild(bookElement);
        }
      }
    });
}
