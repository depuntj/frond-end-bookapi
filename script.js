const books = JSON.parse(localStorage.getItem('books')) || [];
const unfinishedBookshelf = document.getElementById('unfinished-bookshelf');
const finishedBookshelf = document.getElementById('finished-bookshelf');
const addBookForm = document.getElementById('add-book-form');
const overlay = document.getElementById('overlay');
const dialog = document.getElementById('dialog');
const dialogMessage = document.getElementById('dialog-message');
const dialogConfirm = document.getElementById('dialog-confirm');

function saveBooksToStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks() {
    unfinishedBookshelf.innerHTML = '';
    finishedBookshelf.innerHTML = '';

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>Status: ${book.isComplete ? 'Sudah Selesai Dibaca' : 'Belum Selesai Dibaca'}</p>
            <button class="move-button">${book.isComplete ? 'Pindah ke Rak Belum Selesai' : 'Pindah ke Rak Sudah Selesai'}</button>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Hapus</button>
        `;
        
        bookElement.querySelector('.move-button').addEventListener('click', () => moveBook(book));
        bookElement.querySelector('.edit-button').addEventListener('click', () => editBook(book.id));
        bookElement.querySelector('.delete-button').addEventListener('click', () => deleteBook(book.id));

        if (book.isComplete) {
            finishedBookshelf.appendChild(bookElement);
        } else {
            unfinishedBookshelf.appendChild(bookElement);
        }
    });
}

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isComplete = document.getElementById('isComplete').checked;

    const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        isComplete
    };

    books.push(newBook);
    saveBooksToStorage();
    renderBooks();
    closeDialog();
    showMessage('Buku berhasil ditambahkan!');
}

function deleteBook(id) {
    const bookIndex = books.findIndex(book => book.id == id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooksToStorage();
        renderBooks();
        showMessage('Buku berhasil dihapus!');
    }
}

function moveBook(book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
    showMessage(`Buku berhasil dipindahkan ke rak ${book.isComplete ? 'Sudah Selesai Dibaca' : 'Belum Selesai Dibaca'}!`);
}

function editBook(id) {
    const bookIndex = books.findIndex(book => book.id == id);
    if (bookIndex !== -1) {
        const book = books[bookIndex];
        const title = prompt('Masukkan judul buku:', book.title);
        const author = prompt('Masukkan penulis buku:', book.author);
        let year = parseInt(prompt('Masukkan tahun terbit buku:', book.year));
        
        // Validasi tahun harus berupa angka
        while (isNaN(year)) {
            year = parseInt(prompt('Tahun harus berupa angka. Masukkan tahun terbit buku:', book.year));
        }
        
        // Update informasi buku
        books[bookIndex] = {
            ...book,
            title,
            author,
            year
        };
        
        saveBooksToStorage();
        renderBooks();
        showMessage('Buku berhasil diedit!');
    }
}

function showMessage(message) {
    dialogMessage.textContent = message;
    overlay.style.display = 'block';
    dialog.style.display = 'block';
}

function closeDialog() {
    overlay.style.display = 'none';
    dialog.style.display = 'none';
}

addBookForm.addEventListener('submit', addBook);
dialogConfirm.addEventListener('click', closeDialog);

renderBooks();
