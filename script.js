// Initial Data
const defaultBooks = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        status: "finished"
    },
    {
        id: 3,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
        status: "want"
    },
    {
        id: 4,
        title: "THAT ONE DAY",
        author: "Personal Collection",
        cover: "ChatGPT Image May 6, 2026, 10_49_19 PM.png",
        status: "reading"
    }
];

// State
let books = JSON.parse(localStorage.getItem('myBookshelf')) || defaultBooks;

// Ensure the new book is added if it's missing (for existing users)
const existingBook = books.find(b => b.id === 4);
if (!existingBook) {
    books.push(defaultBooks.find(b => b.id === 4));
} else {
    existingBook.title = "THAT ONE DAY"; // Update title if it already exists
}
localStorage.setItem('myBookshelf', JSON.stringify(books));

let currentFilter = 'all';

// Selectors
const bookGrid = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');

// Functions
function renderBooks() {
    bookGrid.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => {
        return book.title.toLowerCase().includes(searchTerm) || 
               book.author.toLowerCase().includes(searchTerm);
    });

    if (filteredBooks.length === 0) {
        bookGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <p>No books found. Add some to your shelf!</p>
            </div>
        `;
        return;
    }

    filteredBooks.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="book-cover-container">
                <img src="${book.cover || 'https://via.placeholder.com/220x320?text=No+Cover'}" alt="${book.title}" class="book-cover">
            </div>
            <div class="book-details">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="card-actions" style="margin-top: 0.5rem;">
                    <button class="btn-secondary" onclick="openReader('${book.title}', '${book.author}')">Read Now</button>
                    <button class="btn-primary" onclick="openCheckout('${book.title}', '${book.author}')">Buy Now</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

function saveBooks() {
    localStorage.setItem('myBookshelf', JSON.stringify(books));
    renderBooks();
}

function deleteBook(id) {
    if (confirm('Are you sure you want to remove this book?')) {
        books = books.filter(b => b.id !== id);
        saveBooks();
    }
}

searchInput.addEventListener('input', renderBooks);

function openReader(title, author) {
    const url = `reader.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
    window.location.href = url;
}

function openCheckout(title, author) {
    const url = `checkout.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
    window.location.href = url;
}

// Initial Render
renderBooks();
